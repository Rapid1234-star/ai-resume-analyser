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
* 📜 License

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

Resumind requires a **Groq API key** to perform AI-based resume analysis.

Create a `.env` file in the project root and add:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

#### 📌 Important Notes

* ⚠️ Never commit your `.env` file
* ✅ Ensure `.env` is included in `.gitignore`
* 🔄 Restart the dev server after changing environment variables
* 🧪 Vite requires all client-side env variables to start with `VITE_`

#### 🛡️ Example `.gitignore` Entry

```gitignore
.env
```

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
docker build -t resumind .
docker run -p 3000:3000 resumind
```

The container can be deployed on:

* AWS ECS
* Google Cloud Run
* Azure Container Apps
* Any Docker-compatible platform

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
Feel free to open issues or submit a **Pull Request**.

---