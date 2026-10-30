import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side with required headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ==========================================
// 1. Audio Transcription using gemini-3.5-transcribe
// ==========================================
app.post('/api/gemini/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType, prompt } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Missing audioData (base64 string required)' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioData,
      },
    };

    const textPrompt =
      prompt ||
      'Transcribe this patient audio recording verbatim. It may contain English, Malayalam, or medical terms. Provide clean and accurate clinical transcription.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [audioPart, { text: textPrompt }],
      },
    });

    const transcription = response.text || '';
    return res.json({
      transcription,
      modelUsed: 'gemini-3.5-transcribe',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/transcribe:', error);
    return res.status(500).json({
      error: error.message || 'Failed to transcribe audio with gemini-3.5-transcribe',
    });
  }
});

// ==========================================
// 2. Google Maps Grounding using gemini-3.5-flash with googleMaps tool
// ==========================================
app.post('/api/gemini/maps-search', async (req, res) => {
  try {
    const { query, latitude, longitude } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required for Maps Grounding search' });
    }

    const promptText = `Find hospitals, clinics, or healthcare facilities matching: "${query}". Provide details including addresses, specialties, hours if available, and clinical relevance.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude,
            longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract maps places and URLs for the frontend
    const mapPlaces: Array<{ title: string; uri: string; address?: string }> = [];

    for (const chunk of groundingChunks as any[]) {
      if (chunk.maps) {
        mapPlaces.push({
          title: chunk.maps.title || 'Healthcare Facility',
          uri: chunk.maps.uri || '',
          address: chunk.maps.address || '',
        });
      }
    }

    return res.json({
      summary: text,
      places: mapPlaces,
      groundingChunks,
      modelUsed: 'gemini-3.5-flash (with googleMaps tool)',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/maps-search:', error);
    return res.status(500).json({
      error: error.message || 'Failed to search Google Maps data with gemini-3.5-flash',
    });
  }
});

// ==========================================
// 3. Voice Conversations using gemini-3.8-live (Live API)
// ==========================================
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Gemini 3.8 Live API WebSocket');

  let liveSession: any = null;

  try {
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Aoede' },
          },
        },
        systemInstruction:
          'You are a doctor at the MediKiosk Patient Health Desk. Speak in a warm, compassionate tone exactly like a caring doctor speaking with a patient in a consultation room. Listen attentively to their symptoms, ask gentle clarifying questions, offer reassuring clinical guidance, and advise on relevant hospital departments and seeing a doctor in person when appropriate.',
      },
      callbacks: {
        onmessage: (message: any) => {
          // Handle audio from model turn
          const parts = message.serverContent?.modelTurn?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              clientWs.send(
                JSON.stringify({
                  type: 'audio',
                  audio: part.inlineData.data,
                })
              );
            }
            if (part.text) {
              clientWs.send(
                JSON.stringify({
                  type: 'text',
                  text: part.text,
                })
              );
            }
          }

          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }
        },
        onclose: () => {
          console.log('Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'status', status: 'closed' }));
          }
        },
        onerror: (err: any) => {
          console.error('Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: err.message || 'Live session error' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'status', status: 'ready', model: 'gemini-3.8-live' }));
  } catch (err: any) {
    console.error('Failed to connect to gemini-3.8-live:', err);
    clientWs.send(
      JSON.stringify({
        type: 'error',
        error: err.message || 'Could not connect to gemini-3.8-live Live API',
      })
    );
    clientWs.close();
    return;
  }

  clientWs.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'audio' && msg.audio) {
        liveSession?.sendRealtimeInput({
          audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
        });
      } else if (msg.type === 'text' && msg.text) {
        liveSession?.sendRealtimeInput({
          text: msg.text,
        });
      }
    } catch (e) {
      console.error('Error handling WebSocket client message:', e);
    }
  });

  clientWs.on('close', () => {
    try {
      liveSession?.close();
    } catch {}
  });
});

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;

  if (pathname === '/api/live' || pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`MediKiosk full-stack server running on http://localhost:${port}`);
  });
}

startServer();
