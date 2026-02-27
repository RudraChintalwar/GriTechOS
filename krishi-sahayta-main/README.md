<div align="center">

# 🌾 GriTech OS

### *Intelligent Scheme Discovery Platform for India's Farmers*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.9-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<br/>

> **"Government schemes exist. But they don't reach the farmer. Until now."**

GriTech OS bridges the gap between India's 2,000+ government agricultural schemes and the 150 million+ farmers who struggle to discover, understand, and apply for them. By combining intelligent rule-based matching, multilingual support, and AI-powered assistance, GriTech OS transforms static PDFs into a living digital experience.

<br/>

</div>

---

## 👨‍💻 About Us

This project was built by students of **Pune Institute of Computer Technology (PICT), Pune** from the **Artificial Intelligence & Data Science** branch.

**Team Members:**
1. Rudra Chintalwar
2. Atharva Ghongade
3. Atharv Raut
4. Shweta Rupnawar

We developed GriTech OS for a **TechFest organized by Cybage Company**, with the vision of leveraging technology to empower India's farming community.

---

## 🌟 Key Features

### 🔍 Smart Scheme Matching
- **Rule-based matching engine** that analyzes farmer profile (district, farmer type, land ownership, crops) against 2,000+ schemes
- **Confidence scoring** — each scheme gets a match percentage based on eligibility criteria
- **Real-time filtering** — results update dynamically as farmers change their search criteria

### 🌐 Multilingual Support (3 Languages)
- **English**, **Hindi** (हिंदी), and **Marathi** (मराठी)
- Full UI translation including landing page, dashboard, scheme details, and navigation
- **36 Maharashtra district names** translated across all languages
- Language selector always visible for quick switching

### 🤖 AI-Powered Chat Assistant (Krishi Saathi)
- Powered by **Groq AI** for instant responses
- Context-aware — knows the farmer's profile and matched schemes
- Answers questions about scheme eligibility, application process, and benefits
- Available in all 3 supported languages

### 📄 Smart Scheme Details
- **Web scraping** (Python FastAPI backend) fetches live scheme details from government websites
- PDF download of matched schemes in the farmer's preferred language
- Direct application links to official portals

### 🔐 Authentication & Admin Panel
- **Dual authentication**: Phone (OTP) and Email/Password
- **Farmer accounts** with saved profiles synced to Firebase Firestore
- **Admin panel** with special access code for:
  - User management (view, edit, delete)
  - Scheme management (add, view, delete schemes in Firestore)
  - Platform statistics and analytics

### 🎨 Cinematic Landing Page
- **Three.js** 3D background with particle effects
- Smooth **Framer Motion** animations and scroll reveals
- Responsive, dark-themed UI with glassmorphism design
- Impact statistics and platform overview

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with hooks and context |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **Three.js** + React Three Fiber | 3D background visuals |
| **shadcn/ui** + Radix UI | Accessible component primitives |
| **Lucide React** | Modern icon library |
| **Recharts** | Data visualization |
| **jsPDF** | Client-side PDF generation |
| **Sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Firebase Auth** | Phone OTP + Email/Password authentication |
| **Cloud Firestore** | NoSQL database for users, schemes, profiles |
| **Express.js** | Node.js API server (Groq AI proxy) |
| **FastAPI (Python)** | Web scraping microservice for scheme details |
| **Groq SDK** | AI chat assistant (LLM integration) |
| **BeautifulSoup** | HTML parsing for scheme data extraction |

### Dev Tools
| Technology | Purpose |
|-----------|---------|
| **ESLint** | Code linting |
| **Vitest** | Unit testing |
| **PostCSS + Autoprefixer** | CSS processing |

---

## 📁 Project Structure

```
krishi-sahayta-main/
├── public/                    # Static assets
├── server/                    # Express.js API server
│   └── index.js               # Groq AI chat proxy
├── python-api/                # Python microservice
│   ├── main.py                # FastAPI web scraper
│   └── requirements.txt       # Python dependencies
├── src/
│   ├── components/
│   │   ├── sections/          # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── SolutionSection.tsx
│   │   │   ├── VoiceSection.tsx
│   │   │   ├── ImpactSection.tsx
│   │   │   ├── FutureSection.tsx
│   │   │   └── CTASection.tsx
│   │   ├── app/               # Dashboard components
│   │   │   ├── ProfileStep.tsx    # Farmer profile / search criteria
│   │   │   ├── MatchingStep.tsx   # Scheme matching animation
│   │   │   ├── SchemesStep.tsx    # Results + scheme details
│   │   │   └── ChatAssistant.tsx  # AI chatbot
│   │   └── ui/                # shadcn/ui primitives
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Firebase auth state
│   │   └── LanguageContext.tsx # i18n translation provider
│   ├── i18n/
│   │   ├── translations.ts    # EN/HI/MR translation keys
│   │   └── districtTranslations.ts # 36 district name translations
│   ├── lib/
│   │   ├── firebase.ts        # Firebase config
│   │   ├── schemeEngine.ts    # Rule-based matching engine
│   │   └── pdfGenerator.ts    # PDF export logic
│   ├── pages/
│   │   ├── Index.tsx          # Landing page
│   │   ├── Dashboard.tsx      # Main app (3-step wizard)
│   │   ├── AuthPage.tsx       # Login/Signup (farmer + admin)
│   │   └── admin/             # Admin panel pages
│   └── App.tsx                # Router + providers
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+ (for the web scraping service)
- **Firebase project** with Authentication and Firestore enabled

### 1. Clone the Repository

```bash
git clone https://github.com/RudraChintalwar/GriTechOS.git
cd GriTechOS/krishi-sahayta-main
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd python-api
pip install -r requirements.txt
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Groq AI (for chat assistant)
GROQ_API_KEY=your_groq_api_key
```

### 4. Start the Development Servers

You need to run **3 servers** simultaneously:

```bash
# Terminal 1 — Frontend (Vite dev server)
npm run dev

# Terminal 2 — Express API server (AI chat proxy)
npm run server

# Terminal 3 — Python API (web scraper)
npm run python-api
```

The app will be available at `http://localhost:5173`

---

## 🔑 Admin Access

To access the admin panel:
1. Go to the Login page
2. Select **"Admin"** role
3. Sign up with the special admin code: `AgroDBT7898`
4. After login, you'll see the admin dashboard with user management and scheme management

---

## 🌾 How It Works

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Farmer     │───▶│  Profile     │───▶│  Rule-Based     │
│   Signs Up   │    │  Creation    │    │  Matching Engine │
└─────────────┘    └──────────────┘    └────────┬────────┘
                                                │
                   ┌──────────────┐    ┌────────▼────────┐
                   │  AI Chat     │◀───│  Matched Schemes │
                   │  Assistant   │    │  (Ranked)        │
                   └──────────────┘    └─────────────────┘
```

1. **Sign Up** — Farmer creates an account (phone OTP or email/password)
2. **Build Profile** — District, farmer type, land ownership, crops, requirements
3. **Smart Matching** — Engine scans 2,000+ schemes and ranks by eligibility
4. **Explore Results** — View matched schemes with confidence scores and details
5. **Get Help** — AI assistant (Krishi Saathi) answers questions in farmer's language
6. **Apply** — Direct links to official application portals

---

## 📸 Screenshots

| Landing Page | Scheme Matching | Results |
|:---:|:---:|:---:|
| Cinematic hero with 3D effects | Profile-based wizard | Ranked scheme cards |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for India's Farmers**

🌾 *Pune Institute of Computer Technology | AI & DS | Cybage TechFest 2026* 🌾

</div>
