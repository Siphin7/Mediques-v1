# MediQues — Backend API Contracts & Integration Guide

This document defines the formal REST/WebSocket contracts for the MediQues Patient Mobile & Web Application.

---

## 1. Global Specifications

- **Base URL**: `https://api.mediques.health/v1` (or local development: `http://localhost:8000/v1`)
- **Format**: All payloads are `application/json; charset=utf-8`
- **Authentication**: Bearer Token in `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Time Format**: ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Locale / Localization**: `Accept-Language: en, ml;q=0.9`

### Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_84f901a",
    "timestamp": "2026-10-24T10:30:00Z"
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Selected slot is no longer available.",
    "fieldErrors": {
      "time": "Slot 10:30 AM is fully booked."
    },
    "timestamp": "2026-10-24T10:30:00Z"
  }
}
```

---

## 2. Authentication & Account Endpoints

### `POST /api/v1/auth/login`
- **Description**: Authenticates patient via phone number / email and password.
- **Request Body**:
  ```json
  {
    "identifier": "+91 98765 43210",
    "password": "StrongPassword123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "pat-001",
      "fullName": "Siphin Samson",
      "phone": "+91 98765 43210",
      "email": "siphin@example.com"
    }
  }
  ```

### `POST /api/v1/auth/signup`
- **Request Body**:
  ```json
  {
    "fullName": "Siphin Samson",
    "phone": "+91 98765 43210",
    "email": "siphin@example.com",
    "password": "StrongPassword123!",
    "agreedToTerms": true
  }
  ```

---

## 3. Hospitals & Doctors Endpoints

### `GET /api/v1/hospitals`
- **Query Params**: `q` (string, optional), `lat` (float, optional), `lng` (float, optional)
- **Response `200 OK`**: List of hospitals including `Lisle Hospital`, `Amala Hospital`, and `Jubilee Mission Hospital`.

### `GET /api/v1/doctors`
- **Query Params**: `departmentId` (string, optional), `hospitalId` (string, optional), `date` (string, optional)
- **Response `200 OK`**: List of doctors, specialties, qualification titles, ratings, review counts, and available slot times.

---

## 4. Appointment & Live Queue Endpoints

### `POST /api/v1/appointments`
- **Description**: Books an appointment slot, validates clinical availability, and assigns token.
- **Request Body**:
  ```json
  {
    "doctorId": "doc-001",
    "hospitalId": "hosp-001",
    "date": "24 Oct 2026",
    "time": "10:30 AM",
    "consultationType": "In-person Visit",
    "reasonForVisit": "Chest discomfort and body fatigue"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "apt-2026-1024",
    "tokenNumber": "G-12",
    "status": "confirmed",
    "patientsAhead": 3,
    "estimatedWaitMinutes": 30
  }
  ```

### `GET /api/v1/queue/live`
- **Description**: Real-time live queue progression for department and token.
- **Response `200 OK`**:
  ```json
  [
    { "token": "G-09", "statusText": "Consultation in progress", "statusCode": "consultation_in_progress", "colorVariant": "red" },
    { "token": "G-10", "statusText": "Completed", "statusCode": "completed", "colorVariant": "green" },
    { "token": "G-11", "statusText": "In consultation", "statusCode": "in_consultation", "colorVariant": "amber" },
    { "token": "G-12", "statusText": "Your Token · 3 patients ahead ~ 30 mins", "statusCode": "your_token", "colorVariant": "blue", "isCurrentPatient": true },
    { "token": "G-13", "statusText": "Waiting", "statusCode": "waiting", "colorVariant": "gray" },
    { "token": "G-14", "statusText": "Waiting", "statusCode": "waiting", "colorVariant": "gray" }
  ]
  ```

---

## 5. Medical Records, AI Summary & Sharing

### `GET /api/v1/records`
- **Query Params**: `category` (`All` | `Prescriptions` | `Lab Reports` | `Scans` | `Consultation Notes`), `q`
- **Response `200 OK`**: Array of records with metadata, hospital source, preview URI, and lab report values.

### `POST /api/v1/records/upload`
- **Content-Type**: `multipart/form-data`
- **Payload**: `file` (PDF/JPEG/PNG, max 10MB), `title`, `category`, `hospitalName`

### `POST /api/v1/records/:id/ai-summary`
- **Description**: Secure, clinician-calibrated AI summary of the specified diagnostic document.
- **Safety**: Mandatory disclaimer returned; never diagnoses or suggests medication changes autonomously.

### `POST /api/v1/sharing/requests`
- **Description**: Grants time-limited, role-restricted read access to authorized hospitals with explicit patient consent.

---

## 6. Prescriptions & Medication Reminders

### `GET /api/v1/prescriptions`
- **Response**: List of prescriptions partitioned by `Active` and `Past`.

### `POST /api/v1/reminders`
- **Description**: Configures schedule alerts for prescribed medications.
