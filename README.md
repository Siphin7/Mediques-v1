# MediQues — Production Patient Healthcare Application

> **Tagline:** *Your Health, Connected*  
> **Target Audience:** Patients managing hospital visits, appointments, live clinic queues, medical records, medication reminders, and consent-based sharing across healthcare facilities in Kerala, India (Lisle Hospital, Amala Hospital, Jubilee Mission Hospital).

---

## 1. Overview & Reference Fidelity

MediQues is built based on the 24-screen mobile reference specification. Every screen has been implemented with pixel-level alignment to the reference design:

1. **Splash Screen**: Deep navy background with subtle curved gradient, MediQues heart-cross logo, version indicator, and loading transition.
2. **Onboarding**: "Better Healthcare For a Brighter Tomorrow", connected healthcare illustration, feature bullets, pagination dots, and Get Started CTA.
3. **Login**: Phone number / Email input (`+91 98765 43210`), password visibility toggle, forgot password flow, and social sign-in.
4. **Sign Up**: Account creation with validation, full name, phone number, email, password, and Terms & Privacy Policy agreement.
5. **Home**: Personalized greeting ("Good Morning, Siphin"), hospital/doctor search, 6 quick actions grid (Book Appointment, My Records, Prescriptions, Lab Reports, Medications, Find Hospitals), upcoming appointment card with "View", and nearby hospitals with rating and booking actions.
6. **Book Appointment**: Search doctors and specialties, department selector (General Medicine, Cardiology, Dermatology, Pediatrics, etc.), and nearby hospital finder.
7. **Doctor Selection**: Department doctor listing (Dr. Arun Menon, Dr. Sneha Raj, Dr. Roopak S) with ratings, reviews, qualification titles, and available time slots (09:00 AM, 10:30 AM, 12:00 PM).
8. **Confirm Appointment**: Summary of selected doctor, hospital, date, time, consultation type (In-person vs. Teleconsultation), and optional reason for visit.
9. **Pre-Consultation Symptom Input (Voice & Text)**: "What brings you here today?", voice vs. text mode, animated audio waveform visualizer, recording timer ("Listening... 00:12"), red stop button, with support for Malayalam and English.
10. **Review Symptoms**: Transcribed text editor, English translation toggle, extracted clinical observation tags (`Chest discomfort`, `Fatigue`, `Duration: 2 days`), and expandable "+ Add more details" accordion with severity slider.
11. **Appointment Confirmed / Token Status**: Large token badge (**G-12**), verified progress timeline (Checked In: 09:45 AM, Waiting in Queue: 3 patients ahead ~30 mins, Consultation: Est. 10:30 AM), with "Live Queue" and "Cancel" actions.
12. **Live Queue Tracking**: Real-time queue list with colored tokens (G-09 in progress, G-10 completed, G-11 in consultation, G-12 highlighted as "Your Token"), and live WebSocket sync status.
13. **My Medical Records**: Filter tabs (All, Prescriptions, Lab Reports, Scans), list items (Blood Test Report, Chest X-Ray, Prescription, Ultrasound, Consultation Note) with hospital and date tags.
14. **Record Details**: Diagnostic lab report viewer displaying blood hematology parameters (Hemoglobin, RBC, WBC, Platelets, Fasting Blood Sugar, Total Cholesterol) with reference ranges and verified pathologist signature.
15. **AI Summary**: Key Findings card with bullet points, "View Detailed Analysis", and clinical regulatory disclaimer emphasizing that AI summaries are assistive and do not substitute physician consultation.
16. **My Prescriptions**: Active and Past prescription lists with prescribing clinicians and hospital sources.
17. **Prescription Detail**: Medication items (Tab. Amlodipine 5mg, Tab. Metformin 500mg, Tab. Pantoprazole 40mg) with dosages, timing, food instructions, and duration.
18. **Medication Reminder**: Daily and weekly reminder schedule with interactive checkboxes, dosage timing, and calendar notification sync.
19. **Lab Reports**: Filter chips (All, Blood Test, X-Ray, CT Scan) and direct diagnostic access.
20. **Upload Document**: Upload drop zone with Camera, Gallery, File Chooser, and Document Scan options, plus upload progress feedback and instant vault ingestion.
21. **Share Medical Records**: Hospital selector (Amala Hospital), record category checkboxes, access duration dropdown (30 days), explicit patient consent notice, and access revocation controls.
22. **Notifications**: Filter chips, read/unread states, and click-through navigation to confirmed appointments, lab reports, prescriptions, and share requests.
23. **My Profile**: Patient identity card (Siphin Samson, `siphin@example.com`, `+91 98765 43210`), editable personal information, emergency contact, medical history, allergies, and current medications.
24. **Settings**: Language selector (English / Malayalam), notification preferences, privacy consent logs, biometric security, hospital helpdesk info, and logout with confirmation.

---

## 2. Technology Stack & Architecture

- **Framework**: React 19 with Vite 8 and TypeScript
- **Styling**: Tailwind CSS v4 with custom Plus Jakarta Sans typographic system
- **Icons**: Lucide React
- **Animation**: Motion & CSS hardware-accelerated transitions
- **API Client**: `MediQuesApiClient` with structured error envelopes and bearer token authentication
- **Repository Layer**: `MediQuesRepository` providing seamless local development persistence and remote backend integration when `VITE_API_URL` is configured
- **API Contracts Documentation**: Formal REST specifications in `BACKEND_API_CONTRACTS.md`

---

## 3. Interactive Features & Device Switcher

The top application bar provides:
- **Screen Picker Dropdown**: Immediate 1-click jump to any of the 24 patient screens.
- **Mobile Device Frame Toggle**: Switch between the iPhone 15 Pro mobile frame simulator (with status bar and dynamic island) and the expanded fluid responsive view.
- **Language Switcher**: Toggle between English and Malayalam.

---

## 4. How to Run Locally

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Automated Tests
```bash
npm test
```
Executes the comprehensive patient journey test suite (`src/tests/runTests.ts`) covering authentication, booking, tokens, queue, records, reminders, and sharing.

### Build for Production
```bash
npm run build
```
Generates production-optimized assets in `dist/`.
