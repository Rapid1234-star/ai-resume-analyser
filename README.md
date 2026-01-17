# 🧠 Resumind

**Resumind** is an **AI-powered resume analyzer** that helps job seekers optimize their resumes for specific roles. Upload your resume, provide job details, and receive **ATS compatibility scores**, **smart feedback**, and **actionable improvement suggestions** powered by advanced AI.

---

## 📌 Table of Contents

* ✨ Features
* 🛠️ Tech Stack
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
* 📦 **Deployment**: Docker-ready

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have the following installed:

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

🌐 The app will be available at:
`http://localhost:5173`

---

### 🔑 Environment Variables

Resumind requires a **Groq AI API key** to perform AI-based resume analysis.

An example environment file is already provided as **`.env.example`**.

#### 📄 `.env.example`

```env
# Groq AI API Key
# Get your API key from: https://console.groq.com/keys
VITE_GROQ_API_KEY=your_groq_api_key_here
```

#### 🛠️ Setup Instructions

1. Copy the example file:

```bash
cp .env.example .env
```

2. Replace `your_groq_api_key_here` with your actual Groq API key

#### 📌 Important Notes

* ⚠️ Never commit your `.env` file
* ✅ Ensure `.env` is included in `.gitignore`
* 🔄 Restart the dev server after changing environment variables
* 🧪 Vite requires all client-side environment variables to be prefixed with `VITE_`

---

## 🧑‍💻 Usage

1. 🔐 **Sign In**
   Log in using your **Puter** account

2. 📄 **Upload Resume**
   Upload your resume in PDF format

3. 🏢 **Enter Job Details**
   Provide the company name, job title, and job description

4. 🤖 **Analyze Resume**
   Click **“Analyse Resume”** to start the AI evaluation

5. 📊 **Review Results**
   View ATS score, detailed feedback, and improvement suggestions

6. 📁 **Track History**
   Access all previously analyzed resumes from the home page

---

## 🧩 Development

### 📜 Available Scripts

* `npm run dev` – Start development server with hot reload
* `npm run build` – Create production build
* `npm run start` – Start production server
* `npm run typecheck` – Run TypeScript type checks

---

### 🗂️ Project Structure

```
app/
├── components/          # Reusable UI components
├── lib/                # Utilities and services
├── routes/             # Route handlers
└── root.tsx            # Application root

public/                 # Static assets
types/                  # TypeScript type definitions
constants/              # App-wide constants
```

---

## 🚢 Deployment

### 🐳 Docker Deployment

Build and run the app using Docker:

```bash
# Build the Docker image
docker build -t resumind .

# Run the container with your API key
docker run -p 3000:3000 -e VITE_GROQ_API_KEY=your_actual_api_key_here resumind
```

**Important:** Always provide the `VITE_GROQ_API_KEY` environment variable when running the container.

Supported platforms:

* AWS ECS (environment variables in task definition)
* Google Cloud Run (service configuration)
* Azure Container Apps (container settings)
* Any Docker-compatible platform

🔐 For production deployments, use a **secret management service** to store your API key securely.

---

### 🛠️ Manual Deployment

1. **Build the app**

```bash
npm run build
```

2. **Deploy** the generated `build/` directory to your Node.js hosting provider

---

## 🤝 Contributing

Contributions are welcome! 🎉