# 🧠 Resumind

**Resumind** is an **AI-powered resume analyzer** that helps job seekers optimize their resumes for specific roles. Upload your resume, provide job details, and receive **ATS compatibility scores**, **smart feedback**, and **actionable improvement suggestions** powered by advanced AI.

🌐 **Live Demo:**
👉 [https://ai-resume-analyser-jet.vercel.app/](https://ai-resume-analyser-jet.vercel.app/)

---

## 📌 Table of Contents

* ✨ Features
* 🛠️ Tech Stack
* 🌐 Live Demo
* 🚀 Getting Started

  * 📋 Prerequisites
  * 📥 Installation
  * 🔑 Environment Variables
* 🧑‍💻 Usage
* 🧩 Development

  * 📜 Available Scripts
  * 🗂️ Project Structure
* 🚢 Deployment
* 🤝 Contributing

---

## ✨ Features

* 📄 **Resume Upload & Processing**
  Upload PDF resumes with automatic text extraction and image handling

* 🤖 **AI-Powered Resume Analysis**
  Uses **Groq AI** to analyze resumes against real job descriptions

* 📊 **ATS Compatibility Scoring**
  Detailed Applicant Tracking System (ATS) match scores

* 💡 **Smart Feedback & Suggestions**
  Personalized tips to improve content, keywords, and structure

* 🔐 **Secure Authentication**
  User authentication and storage handled securely via **Puter**

* 🎨 **Modern & Responsive UI**
  Built with **React** and **TailwindCSS**

* ⚡ **High Performance**
  Optimized with **Vite** and **React Router v7**

---

## 🛠️ Tech Stack

* 🎨 **Frontend**: React 19, TypeScript, TailwindCSS
* 🧭 **Routing**: React Router v7
* 🤖 **AI**: Groq AI SDK
* 📑 **PDF Processing**: PDF.js
* 💾 **Storage & Auth**: Puter (KV Store, File System)
* ⚙️ **Build Tool**: Vite
* 📦 **Deployment**: Docker-ready / Vercel

---

## 🌐 Live Demo

You can try the application here:

👉 **[https://ai-resume-analyser-jet.vercel.app/](https://ai-resume-analyser-jet.vercel.app/)**

> ⚠️ Note: You must sign in with a **Puter account** to use the app.

---

## 🚀 Getting Started

### 📋 Prerequisites

* Node.js **v18 or higher**
* npm or pnpm

---

### 📥 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Rapid1234-star/ai-resume-analyser.git
cd ai-resume-analyzer
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

🌐 Local app runs at:
`http://localhost:5173`

---

### 🔑 Environment Variables

Resumind requires a **Groq AI API key** to perform AI-based resume analysis.

An example file is provided as **`.env.example`**.

#### 📄 `.env.example`

```env
# Groq AI API Key
# Get your API key from: https://console.groq.com/keys
VITE_GROQ_API_KEY=your_groq_api_key_here
```

#### 🛠️ Setup Instructions

```bash
cp .env.example .env
```

Replace the value with your actual Groq API key.

#### 📌 Important Notes

* ⚠️ Never commit your `.env` file
* ✅ Ensure `.env` is included in `.gitignore`
* 🔄 Restart the dev server after env changes
* 🧪 Vite requires env variables to be prefixed with `VITE_`

---

## 🧑‍💻 Usage

1. 🔐 **Sign In** using your **Puter** account
2. 📄 **Upload Resume** (PDF format)
3. 🏢 **Enter Job Details**
4. 🤖 Click **“Analyse Resume”**
5. 📊 Review ATS score & feedback
6. 📁 Track previous analyses on the home page

---

## 🧩 Development

### 📜 Available Scripts

* `npm run dev` – Start dev server
* `npm run build` – Production build
* `npm run start` – Start production server
* `npm run typecheck` – TypeScript checks

---

### 🗂️ Project Structure

```
app/
├── components/          # Reusable UI components
├── lib/                # Utilities and services
├── routes/             # Route handlers
└── root.tsx            # Application root

public/                 # Static assets
types/                  # TypeScript definitions
constants/              # App constants
```

---

## 🚢 Deployment

### 🐳 Docker Deployment

```bash
docker build -t resumind .
docker run -p 3000:3000 -e VITE_GROQ_API_KEY=your_actual_api_key_here resumind
```

Supported platforms:

* AWS ECS
* Google Cloud Run
* Azure Container Apps
* Any Docker-compatible platform

🔐 Use a **secret manager** in production.

---

### 🛠️ Manual Deployment

```bash
npm run build
```

Deploy the `build/` directory to your Node.js hosting provider.

---

## 🤝 Contributing

Contributions are welcome! 🎉
