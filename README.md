# AgriVision Frontend

Modern, responsive React + Tailwind frontend for an AI-powered agriculture platform with authentication, crop upload workflows, reports, profile management, mapping, and a chatbot-ready interface.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Framer Motion
- Firebase Auth placeholders for Google OAuth / email login
- React Leaflet for crop location mapping
- jsPDF for report download

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open the local Vite URL shown in your terminal.

## Environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-backend-api-url
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Backend integration points

The UI is already structured so you can replace mock logic with real APIs:

- `src/services/authService.js`
  Replace placeholder email login, Google login, password reset, and profile update logic.
- `src/services/firebase.js`
  Add production Firebase config or swap this layer for your own auth provider.
- `src/services/api.js`
  Connect:
  - `fetchClientOverview()` to your client summary / onboarding endpoint
  - `uploadLeafImage(formData)` to your image upload + prediction endpoint
  - `fetchReports()` to your reports listing endpoint
  - `generateReport(payload)` to your report generation endpoint
- `src/pages/UploadPage.jsx`
  Replace the mocked `setTimeout` prediction flow with a call to `uploadLeafImage`.
- `src/pages/ChatbotPage.jsx`
  Replace the mocked assistant response with your LLM backend call.
- `src/pages/ClientOverviewPage.jsx`
  Expects a backend response shaped like:

```json
{
  "sectionLabel": "About the Client",
  "companyName": "Mist Agri Corps Ltd",
  "headline": "India's Premier Agro-Farming Enterprise",
  "stats": [
    { "id": "acres", "value": "3000+", "label": "Acres under management" },
    { "id": "varieties", "value": "3", "label": "Crop varieties cultivated in big scale" },
    { "id": "operations", "value": "Multi", "label": "State operations across India" },
    { "id": "transformation", "value": "AI-First", "label": "Digital transformation in progress" }
  ],
  "description": "Crops include tomato, apple and grape..."
}
```

## Features included

- Animated splash screen and branded landing page
- Email/password login with validation and forgot-password UX
- Google sign-in entry point
- Responsive dashboard with overview cards and quick actions
- Post-login client overview page backed by a dedicated backend fetch
- Drag-and-drop crop image upload flow
- Crop selection and location entry with autocomplete + GPS detection
- Dynamic prediction results panel
- PDF report generation
- Sortable and filterable reports page with modal detail view
- Profile page with editable account details, uploads, and reports
- Floating, collapsible chatbot UI
- Interactive Leaflet map with severity-coded field markers

## Suggested production next steps

- Connect Firebase `signInWithPopup`, `signInWithEmailAndPassword`, and password reset APIs
- Add route-based data fetching with your backend auth token
- Store uploads and reports in a database rather than local component state
- Add image previews and real uploaded file persistence
- Add stronger form validation and toast notifications
- Add test coverage for auth, upload, and report flows

## Project structure

```text
src/
  assets/
  components/
    layout/
    ui/
  context/
  pages/
  services/
  utils/
```
