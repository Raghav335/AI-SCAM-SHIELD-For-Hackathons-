# 🛡️ AI Scam Shield

> **Don't trust it. Scan it.**

AI Scam Shield is an AI-powered scam detection and prevention web application designed to help users identify suspicious URLs, messages, QR codes, images, emails, WhatsApp messages, and payment-related content before taking risky actions.

---

## 🚀 Features

* 🔗 **URL Scanner** — Analyze suspicious links and websites.
* 📱 **QR Code Scanner** — Scan QR codes using camera or upload a QR image.
* 🖼️ **Image Scanner** — Analyze uploaded images for suspicious content.
* 🤖 **AI Scam Detection** — AI-powered risk analysis and explanation.
* 📧 **Email Scanner** — Analyze suspicious email content.
* 💬 **WhatsApp Scanner** — Analyze suspicious WhatsApp messages.
* 💳 **Payment Scanner** — Analyze payment screenshots.
* 📊 **Risk Score** — Displays a score from 0–100.
* 🚨 **Risk Level** — Safe, Suspicious, or Dangerous.
* 🔍 **Security Engine Results** — Shows malicious, suspicious, and harmless results when available.
* 📜 **Scan History** — View previous scans.
* 📈 **Dashboard** — View scan statistics.
* 🔐 **Authentication** — Login and signup functionality.
* 🤖 **AI Chatbot** — Security-related assistance.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript
* HTML5

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer

### AI & Security

* Google Gemini API
* VirusTotal API
* OCR / image analysis
* QR Code scanning

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB — Database

---

# 📥 Installation & Setup

## 1. Fork the Repository

Open the original repository:

https://github.com/Raghav335/AI-SCAM-SHIELD-For-Hackathons-


**Fork → Create Fork**

Now you will have your own copy of the project.

---

## 2. Clone Your Fork

After forking, click:

**Code → HTTPS → Copy URL**

Then open VS Code terminal:

```bash
git clone YOUR_FORKED_REPOSITORY_URL
```

Example:

```bash
git clone https://github.com/YOUR_USERNAME/AI-SCAM-SHIELD.git
```

Then:

```bash
cd AI-SCAM-SHIELD
```

---

# 📦 Frontend Setup

Open the frontend folder:

```bash
cd ai-scam-shield-client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open another VS Code terminal.

Go to the server folder:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The backend will normally run at:

```text
http://localhost:5000
```

---

# 🔐 Environment Variables

For security reasons, API keys and database credentials are **not included in GitHub**.

Create a file:

```text
server/.env
```

Add your own credentials:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

VIRUSTOTAL_API_KEY=your_virustotal_api_key
```

### Important

**Never upload `server/.env` to GitHub.**

Do not share:

* Gemini API key
* VirusTotal API key
* MongoDB credentials
* JWT secret

---

# 🗄️ MongoDB Setup

Create a MongoDB database and obtain the connection string.

Add it to:

```text
server/.env
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-scam-shield
```

Make sure your MongoDB network access allows your backend server to connect.

---

# 🤖 Gemini API

Create a Gemini API key and add it to:

```env
GEMINI_API_KEY=your_api_key
```

The AI is used for scam analysis and generating risk explanations/recommendations.

---

# 🛡️ VirusTotal API

Create a VirusTotal API key and add:

```env
VIRUSTOTAL_API_KEY=your_api_key
```

VirusTotal is used for security intelligence and URL analysis where configured.

---

# ▶️ Run the Complete Project

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd server
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd ai-scam-shield-client
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🌐 Project Architecture

```text
                    USER
                      │
                      ▼
              React Frontend
                      │
                      ▼
              Express Backend
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       MongoDB      Gemini     VirusTotal
          │           │           │
          └───────────┼───────────┘
                      ▼
                Scan Result
                      │
                      ▼
              Risk Assessment
```

---

# 🔗 API Routes

## Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

## Scanning

```text
POST /api/scan/text
POST /api/scan/url
POST /api/scan/image
POST /api/scan/email
POST /api/scan/whatsapp
POST /api/scan/payment
```

## History

```text
GET /api/scan/history
```

## Dashboard

```text
GET /api/scan/dashboard
```

## Chatbot

```text
/api/chatbot
```

---

# 📱 QR Code Scanner

The QR scanner supports:

* Camera scanning
* QR image upload
* URL extraction
* URL security analysis
* Risk score
* Risk level
* Scam type
* Explanation
* Recommendation

A QR code containing normal text is handled separately.

---

# 🖼️ Image & Deepfake Assessment

The image scanner can analyze uploaded images and provide an assessment such as:

```text
Detection Assessment

DEEPFAKE
0%

MANIPULATION
0%

AI GENERATED
0%
```

It can also report possible visual indicators such as:

```text
Uniform skin texture rendering
Characteristic synthetic hair blending
```

> These results should be treated as an AI-based assessment, not absolute proof that an image is genuine or fake.

---

# 🚀 Deployment

## Frontend — Vercel

Build the frontend:

```bash
cd ai-scam-shield-client
npm run build
```

Deploy the frontend using Vercel.

Update the frontend API URL to point to the deployed backend.

Example:

```javascript
const API_URL = "https://your-render-backend.onrender.com";
```

---

## Backend — Render

Deploy the `server` folder to Render.

Recommended settings:

### Root Directory

```text
server
```

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

Add environment variables in the Render dashboard:

```text
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY
VIRUSTOTAL_API_KEY
```

Do **not** upload `.env`.

---

# 🔄 After Deployment

The final architecture should look like:

```text
User
 │
 ▼
Vercel
React Frontend
 │
 ▼
Render
Node + Express Backend
 │
 ├──► MongoDB
 ├──► Gemini API
 └──► VirusTotal API
```

---

# ⚠️ Common Problems

### `Unable to connect to server`

Check:

1. Backend is running.
2. Frontend is using the correct backend URL.
3. Render backend is live.
4. CORS allows your frontend domain.
5. API request URL is correct.

---

### `Please login first`

Make sure you have logged in and a JWT token exists in browser `localStorage`.

---

### `MongoDB connection failed`

Check:

```env
MONGODB_URI=...
```

and verify MongoDB network access.

---

### `API key error`

Check that the required API key exists in the backend environment variables.

---

### `npm install` error

Check that Node.js and npm are installed:

```bash
node -v
npm -v
```

Then try:

```bash
npm install
```

---

# 🔒 Security

Never commit sensitive information such as:

```text
.env
API keys
Database passwords
JWT secrets
Access tokens
```

The repository uses `.gitignore` to prevent sensitive files from being committed.

---

# 👥 Fork & Contribute

To contribute:

```bash
git clone YOUR_FORK_URL
cd AI-SCAM-SHIELD
```

Create a new branch:

```bash
git checkout -b feature-name
```

Make your changes and commit:

```bash
git add .
git commit -m "Add new feature"
```

Push:

```bash
git push origin feature-name
```

Then create a Pull Request on GitHub.

---

# 📌 Important Note for Forked Users

Forking the repository gives you the **complete source code**, but the project requires dependencies and environment variables to run locally.

You need:

* Node.js
* npm
* MongoDB
* Gemini API key
* VirusTotal API key
* Required environment variables

The `.env` file is intentionally not included in the repository for security reasons.

---

# 👨‍💻 Project live : https://ai-scam-shield-e6ik.vercel.app/

## AI Scam Shield

**Tagline:**

> Don't trust it. Scan it.

An AI-powered security assistant designed to help users identify suspicious digital content before interacting with it.
