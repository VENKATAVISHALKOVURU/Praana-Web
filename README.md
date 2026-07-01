# Praana - Saathi Chatbot Application

Praana is a mindfulness and mental well-being platform designed to help users return to their center. This repository contains both the frontend interface and the AI-driven companion chatbot, "Saathi".

## 🏗️ Architecture

The application is split into two primary components:

1. **Frontend (`/CSP WEBSITE`)**
   - Built with React, Vite, and React Router.
   - Handles the user interface, Google Authentication (via Firebase Auth), and the chat interface for Saathi.
   - Hosted on Firebase Hosting.

2. **Backend (`/chat bot/CHAT BOT`)**
   - Built with Node.js and Express.
   - Integrates with the **Groq API** (running Qwen 3.6) for blazing-fast, empathetic AI responses.
   - Uses Firebase Admin SDK to verify user sessions securely.

---

## 🚀 Getting Started Locally

### 1. Frontend Setup
```bash
cd "CSP WEBSITE"
npm install
npm run dev
```
The website will be available at `http://localhost:5173`.

### 2. Backend Setup
```bash
cd "chat bot/CHAT BOT"
npm install
```
You will need to create a `.env` file in the backend directory with your secret keys:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```
Then, start the server:
```bash
node server.js
```

---

## 🔒 Security & Secrets

To ensure the repository remains secure, the following files are strictly ignored via `.gitignore`:
- `.env` files containing API keys (like Groq).
- `firebase-service-account.json` containing backend database admin privileges.
- `node_modules` and local cache directories.

> **Note:** The Firebase configuration inside `src/firebase.js` is considered public by Google's design and is safe to be committed, as it only identifies your app to Firebase's servers and relies on security rules for actual data protection.

---

## 🌐 Deployment

**Frontend:**
The frontend is deployed to Firebase Hosting.
```bash
npm run build
npx firebase deploy
```

**Backend:**
The backend is designed to be hosted on a cloud provider like Render, Heroku, or Google Cloud Run. Once deployed, the `API_BASE` in the frontend `Saathi.jsx` file must be updated to point to the live backend URL instead of `localhost:3000`.
