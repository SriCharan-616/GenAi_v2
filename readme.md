# ArtisanHub

The first artisan-focused digital marketplace integrating AI content generation, AR/3D visualization, multilingual chatbot support, and storytelling — enabling artisans to scale digitally while preserving their craft.

# Project Structure
|-- backend/     # Node.js + Express + Firebase Admin API

|-- frontend/    # React + Vite + Tailwind CSS client

# Tech Stack
Frontend

React 18 + Vite

Tailwind CSS

React Router DOM

# Backend

Node.js + Express

Firebase Admin SDK (Authentication + Firestore/Realtime DB)

Google Generative AI SDK

Cloudinary (via Multer for uploads)

# Prerequisites

Node.js ≥18

npm or yarn

A Firebase project (service account for Admin SDK)

A Cloudinary account (for media uploads)

# Setup Instructions
### Clone the Repository
git clone <your-repo-url>
cd <your-project-folder>

### Backend Setup

Navigate to backend folder:

cd backend


### Create a .env file in backend/ with the following variables:

##### Firebase Admin SDK credentials
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines_escaped"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url

##### Google Cloud API Key (Vision, Translation, TTS/STT, etc.)
GOOGLE_API_KEY=your_google_api_key

##### JWT secret for signing tokens
JWT_SECRET=your_jwt_secret


### Install dependencies:

npm install


### Start the backend server:

npm run start 


Server will run at:

http://localhost:5000

### Frontend Setup

### Navigate to frontend folder:

cd ../frontend


### Install dependencies:

npm install


### Start the development server:

npm run dev


Frontend will run at:

http://localhost:5173

# API Routes (Backend)
Endpoint	Method	Description

/api/auth/*	POST/GET	Login/Register/Auth (Firebase-based)

/api/products/*	CRUD	Manage products

/api/translate	POST	Real-time translation

(Routes defined in routes/ folder)

# Key Files
Frontend

src/pages/Homepage.jsx – Homepage with AR/3D, speech & product grid

src/components/common/Navigation.jsx – Navbar

src/services/translationContext.jsx – Multilingual support

Backend

src/controllers – Auth, Products, Translation logic

src/config/firebaseConfig.js – Firebase Admin SDK setup

src/server.js – Entry point for Express

# Scripts
Backend:
Command	Action
npm start	Start Node/Express server
Frontend:
Command	Action
npm run dev	Start Vite development server
npm run build	Build production bundle
npm run preview	Preview production build
# Features

🔒 Firebase-based Auth (Customer / Artisan roles)

🛍️ AI-enhanced Product Uploads (auto image enhancement)

🌐 Multilingual chatbot support + speech-to-text

🕶️ AR/3D Product View (immersive shopping)

📊 Analytics Dashboard for artisans

🖼️ Cloudinary image storage

📱 Responsive design powered by Tailwind CSS

# Deployment

Frontend + Backend on Render

Add environment variables in Render dashboard

Point both services to their respective build/start commands
