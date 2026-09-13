# 🍳 RecipeHub — Smart Recipe & Meal Planner

<p align="center">
  <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80" alt="RecipeHub Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>The calm, intelligent home for everything you cook, plan, and shop.</strong>
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture--project-structure">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-deployment-guide">Deployment</a>
</p>

---

## 🌟 Overview

**RecipeHub** is a modern, full-stack culinary companion designed for home cooks who want to take the stress out of weekly cooking. Instead of scattering bookmarks, screenshots, and grocery lists across different apps, RecipeHub brings your favorite recipes, a drag-and-drop weekly meal planner, an automated shopping list aggregator, and a conversational AI culinary assistant together in one sleek, responsive interface.

---

## ✨ Key Features

### 🤖 Chef Hub AI Assistant
- **Powered by OpenRouter & NVIDIA Nemotron**: Intelligent, conversational culinary AI using `nvidia/nemotron-3.5-lightning:free` with automatic fallback resilience.
- **Draggable & Ambient UI**: Floating, movable AI assistant that follows you across your recipes without getting in the way.
- **Pantry Surprise**: Ask what you can cook based on ingredients currently in your fridge.
- **Instant Substitutions**: Need a dairy-free or gluten-free alternative on the fly? Chef Hub recommends exact ratios.
- **Recipe Generation**: Receive step-by-step culinary instructions complete with timing, portions, and difficulty.

### 🍽️ Recipe Box & Management
- **Rich Recipe Editor**: Capture recipe title, prep/cook times, servings, difficulty level, custom categories, ingredients with quantities, and numbered step-by-step instructions.
- **Image Uploads**: Upload food photography directly to cloud storage backed by Supabase Storage.
- **Instant Search & Filter**: Real-time fuzzy search by dish name, ingredient, or category tag.
- **Favorites**: One-tap bookmarking to keep your go-to meals within immediate reach.

### 📅 Visual 7-Day Meal Planner
- **Weekly Schedule Board**: Assign meals to Breakfast, Lunch, and Dinner slots across all 7 days of the week.
- **One-Click Scheduling**: Add recipes directly to your calendar from the recipe view or planner.

### 🛒 Automated Smart Shopping List
- **Ingredient Consolidation**: Generates a consolidated shopping checklist from all meals currently planned for the week.
- **Interactive Checkbox Mode**: Cross off items as you walk down the supermarket aisles.

### 🎨 Design & Experience
- **Modern Glassmorphism Aesthetic**: Curated color palette, sleek dark and light mode themes with `next-themes`.
- **Fluid Micro-Animations**: Smooth transitions and modal interactions built with Framer Motion.
- **Mobile-First Responsive Design**: Full functionality across smartphones, tablets, and wide desktop displays.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [TanStack Start](https://tanstack.com/start) with [Nitro](https://nitro.unjs.io/) Full-Stack SSR |
| **Frontend Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (Type-safe file-based routing) |
| **State & Data Fetching** | [TanStack Query v5](https://tanstack.com/query) |
| **Styling & Components** | [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI Primitives](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend & DB** | [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security) |
| **Authentication** | Supabase Auth (Email/Password, Email Verification, Session Recovery) |
| **File Storage** | Supabase Storage (Recipe image upload buckets) |
| **AI Engine** | [OpenRouter API](https://openrouter.ai/) (`nvidia/nemotron-3.5-lightning:free`) |
| **Build & Tooling** | [Vite 8](https://vitejs.dev/), ESLint 9, Prettier |

---

## 📁 Architecture & Project Structure

```
RecipeHub/
├── src/
│   ├── components/            # UI components & shared widgets
│   │   ├── layout/            # AppShell, Navigation, Sidebar & Headers
│   │   ├── ui/                # Radix UI + Tailwind design system (Button, Dialog, etc.)
│   │   └── AIChatbot.tsx      # Draggable Chef Hub AI Chatbot component
│   ├── contexts/              # Global React Contexts (AuthProvider, ThemeProvider)
│   ├── integrations/          # External service integrations
│   │   └── supabase/          # Supabase client, types, and auth middlewares
│   ├── lib/                   # Utility helpers & AI client
│   │   ├── openrouter.ts      # OpenRouter API client & Chef Hub prompt handler
│   │   └── utils.ts           # ClassName merging and format helpers
│   ├── routes/                # TanStack Router file-based route tree
│   │   ├── __root.tsx         # Root layout shell with providers & Toaster
│   │   ├── index.tsx          # Public marketing & landing page
│   │   ├── auth.tsx           # Authentication page (Sign in, Sign up, Forgot)
│   │   ├── reset-password.tsx # Password reset handler
│   │   └── _authenticated/    # Protected route layout (requires login)
│   │       ├── dashboard.tsx  # User overview & quick stats
│   │       ├── recipes.tsx    # Recipe list, filter & search
│   │       ├── planner.tsx    # 7-day weekly meal planning board
│   │       ├── shopping.tsx   # Aggregated shopping list
│   │       ├── favorites.tsx  # Starred recipes collection
│   │       ├── categories.tsx # Category tag management
│   │       └── profile.tsx    # User account settings
│   ├── services/              # Supabase data access layer (recipes, planner, stats)
│   ├── router.tsx             # TanStack Router instance configuration
│   └── styles.css             # Tailwind design tokens and CSS variables
├── .env                       # Base environment configuration
├── .env.local                 # Local environment secrets (Git-ignored)
├── package.json               # Dependencies & project scripts
└── vite.config.ts             # Vite + TanStack Start configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `bun`

### 1. Clone the Repository
```bash
git clone https://github.com/Lokesh-5505/RecipeHub.git
cd RecipeHub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory (or copy from `.env`):

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"

# OpenRouter AI Configuration
VITE_OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key"
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key"
VITE_OPENROUTER_MODEL="nvidia/nemotron-3.5-lightning:free"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser to view the application.

### 5. Build for Production
```bash
npm run build
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `VITE_SUPABASE_URL` | **Yes** | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | **Yes** | Supabase publishable / anon client key |
| `SUPABASE_URL` | **Yes** | Server-side Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | **Yes** | Server-side Supabase publishable key |
| `VITE_OPENROUTER_API_KEY` | **Yes** | OpenRouter API Key for Chef Hub AI Assistant |
| `VITE_OPENROUTER_MODEL` | No | Target AI Model (Defaults to `nvidia/nemotron-3.5-lightning:free`) |

> **Security Note**: Never commit your secret API keys to public version control. Keep active keys in `.env.local`, which is ignored by `.gitignore`.

---

## ☁️ Deployment Guide

### Deploying to Vercel

1. Push your code to your GitHub account:
   ```bash
   git push -u origin main
   ```
2. Navigate to [Vercel Dashboard](https://vercel.com/new).
3. Import your **`RecipeHub`** repository.
4. Add all environment variables listed above under **Project Settings > Environment Variables**.
5. Click **Deploy**. Vercel will automatically build and publish your full-stack application.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Lokesh-5505/RecipeHub/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<p align="center">
  Made with ❤️ for home cooks everywhere.
</p>
