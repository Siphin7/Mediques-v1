# MediQues — Project Structure

> A patient-facing healthcare application built with React, TypeScript, Vite, and a modular screen/component architecture.

## 1. Directory Tree

```text
mediques/
├── .gitignore
├── .env.example
├── index.html
├── package.json
├── bun.lock
├── tsconfig.json
├── vite.config.ts
├── server.ts
├── README.md
├── BACKEND_API_CONTRACTS.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    │
    ├── types/
    │   └── index.ts
    │
    ├── context/
    │   └── AppContext.tsx
    │
    ├── services/
    │   ├── fixtures.ts
    │   ├── api/
    │   │   ├── client.ts
    │   │   └── repository.ts
    │   └── ai/
    │       └── geminiClient.ts
    │
    ├── components/
    │   ├── common/
    │   │   ├── Logo.tsx
    │   │   ├── Header.tsx
    │   │   ├── BottomNav.tsx
    │   │   ├── DeviceFrame.tsx
    │   │   └── Skeleton.tsx
    │   ├── live/
    │   │   ├── LiveVoiceConsultant.tsx
    │   │   └── ClinicalIntakeModal.tsx
    │   ├── maps/
    │   │   └── HospitalMapsLocator.tsx
    │   ├── appointments/
    │   │   └── PastAppointments.tsx
    │   └── timeline/
    │       └── MedicalTimeline.tsx
    │
    ├── screens/
    │   ├── SplashScreen.tsx
    │   ├── OnboardingScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── SignUpScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── BookAppointmentScreen.tsx
    │   ├── DoctorSelectionScreen.tsx
    │   ├── ConfirmAppointmentScreen.tsx
    │   ├── SymptomInputScreen.tsx
    │   ├── SymptomReviewScreen.tsx
    │   ├── AppointmentConfirmedScreen.tsx
    │   ├── LiveQueueScreen.tsx
    │   ├── MedicalRecordsScreen.tsx
    │   ├── RecordDetailsScreen.tsx
    │   ├── AISummaryScreen.tsx
    │   ├── PrescriptionsScreen.tsx
    │   ├── PrescriptionDetailScreen.tsx
    │   ├── MedicationReminderScreen.tsx
    │   ├── LabReportsScreen.tsx
    │   ├── UploadDocumentScreen.tsx
    │   ├── ShareMedicalRecordsScreen.tsx
    │   ├── NotificationsScreen.tsx
    │   ├── MyProfileScreen.tsx
    │   └── SettingsScreen.tsx
    │
    └── tests/
        └── runTests.ts
```

## 2. Root-Level Files

| File | Responsibility |
|---|---|
| `index.html` | HTML entry document used by Vite. |
| `package.json` | Project metadata, dependencies, and development/build/test scripts. |
| `bun.lock` | Locked dependency versions for Bun installs. |
| `tsconfig.json` | TypeScript compiler configuration. |
| `vite.config.ts` | Vite and React build/dev-server configuration. |
| `server.ts` | Node/Express development server entry point. |
| `.env.example` | Example environment variables; copy to `.env` and provide real values locally. |
| `.gitignore` | Files and folders excluded from Git. |
| `README.md` | Project overview, setup instructions, and feature summary. |
| `BACKEND_API_CONTRACTS.md` | REST and WebSocket API integration contracts. |

## 3. Source Code Organization

### `src/App.tsx` and `src/main.tsx`
- `main.tsx` bootstraps the React application.
- `App.tsx` composes the application, global context, screen selection, shared components, and global modals.

### `src/screens/`
Contains the 24 patient-facing application screens. Each screen represents a major user journey or feature, including authentication, appointment booking, pre-consultation intake, queue tracking, records, prescriptions, reminders, sharing, notifications, profile, and settings.

### `src/components/`
Reusable UI and feature components shared by screens.

| Folder | Responsibility |
|---|---|
| `common/` | Shared branding, navigation, layout/device frame, and loading components. |
| `live/` | Voice consultation and structured clinical intake interfaces. |
| `maps/` | Hospital location and selection interface. |
| `appointments/` | Appointment-related reusable UI, including past appointments. |
| `timeline/` | Medical history timeline component. |

### `src/context/`
- `AppContext.tsx` centralizes shared application state and actions used across screens.

### `src/types/`
- `index.ts` defines shared TypeScript models and types for users, appointments, queue tokens, clinical intake reports, records, prescriptions, reminders, sharing requests, and notifications.

### `src/services/`
Business logic and integrations are separated from presentation components.

| Path | Responsibility |
|---|---|
| `services/fixtures.ts` | Local fixture/sample data used during development. |
| `services/api/client.ts` | HTTP API client, request handling, authentication headers, and response/error handling. |
| `services/api/repository.ts` | Data access layer that connects screens to local fixtures or the remote API. |
| `services/ai/geminiClient.ts` | Gemini AI integration used by supported AI features. |

### `src/tests/`
- `runTests.ts` contains the automated patient-journey test runner.

## 4. High-Level Application Flow

```text
Application Entry
      │
      ▼
src/main.tsx
      │
      ▼
src/App.tsx
      │
      ├── AppContext (shared state and actions)
      │
      ├── Common Components
      │
      ├── Patient Screens
      │     ├── Authentication and onboarding
      │     ├── Appointment booking
      │     ├── Symptom intake and review
      │     ├── Appointment confirmation and live queue
      │     ├── Medical records and AI summaries
      │     ├── Prescriptions and reminders
      │     ├── Record sharing
      │     └── Profile, notifications, and settings
      │
      └── Global Feature Components
            ├── Live voice consultant
            └── Hospital maps locator

Screens / Components
      │
      ▼
Services / Repository
      │
      ├── Local fixtures (development/demo)
      └── API client (remote backend)
                │
                ▼
          Backend API
```

## 5. Data and Integration Boundaries

- **UI layer:** `screens/` and `components/` render the user experience.
- **State layer:** `context/AppContext.tsx` shares application state and navigation/actions.
- **Domain model layer:** `types/index.ts` defines the data contracts used by the frontend.
- **Data access layer:** `services/api/repository.ts` abstracts where application data comes from.
- **Transport layer:** `services/api/client.ts` handles communication with the backend.
- **AI integration:** `services/ai/geminiClient.ts` provides the Gemini integration.
- **Backend specification:** `BACKEND_API_CONTRACTS.md` documents expected API endpoints and payloads.

## 6. Important Environment Configuration

The repository includes `.env.example`. Configure the actual values in a local `.env` file and do not commit secrets.

Common configuration expected by this architecture may include:

```env
VITE_API_URL=http://localhost:8000/v1
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact variable names referenced by the implementation. The examples above are not a substitute for checking the source code and should be adjusted if the code expects different names.

## 7. Development Commands

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Run the test suite
npm test

# Type-check the project
npm run lint

# Create a production build
npm run build

# Preview the production build
npm run preview
```

## 8. Architecture Notes

1. Keep screen-specific UI inside `screens/` and move reusable UI into `components/`.
2. Keep API calls out of presentation components where practical; route data access through the repository layer.
3. Define shared request/response models in `types/`.
4. Keep credentials and private configuration in `.env`, never in committed source files.
5. Treat fixture data as demo/development data, not real patient information.
6. Healthcare data, consent, authentication, and AI-generated summaries require appropriate backend authorization, audit logging, validation, and clinical safety controls before production deployment.

---

*This document describes the folder and file structure found in the supplied MediQues project archive. It is an architectural map, not a claim that every listed integration is already connected to a production backend.*
