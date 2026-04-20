# 🌌 Smart Study Hub — LearnOS

**LearnOS** is a **cyber-themed personal learning resource manager** built as a side project to organize, track, and analyze study materials in one place.
It focuses on **nested resource organization, progress tracking, and learning analytics**, presented through a dark constellation-aesthetic terminal UI.

---

## 🎯 Project Objectives

- Catalog and manage learning resources across multiple types and priorities
- Track progress with status updates, ratings, and pin system
- Visualize learning patterns through interactive analytics
- Deliver a polished, immersive **cyber / dark-terminal UI experience**

---

## 🧩 Features

- 📚 **Resource Library** — Add articles, videos, books, courses, PDFs, GitHub repos, and websites with type, priority, status, tags, notes, and file uploads
- 🗂️ **Nested File Tree** — Organize resources into folders with infinitely nestable links, files, and subfolders
- 📊 **Learning Analytics** — Visual breakdowns by status, type, and topic tags using interactive charts
- 📌 **Pin & Rate** — Star-rate and pin your most important resources for quick access
- 🔍 **Filter & Sort** — Search, filter by type / status / tag, and sort across your entire library
- 💾 **Local-first** — All data stored in `localStorage`, no backend or build server required
- 🌌 **Constellation UI** — Animated particle background with glassmorphism panels and a techy aesthetic

---

## 🗂 Folder Structure

```pgsql
Smart-Study-Hub/
│
├── index.html               # App entry point
│
├── src/
│   ├── App.jsx              # Root component & routing
│   ├── main.jsx             # React DOM entry
│   ├── index.css            # Global styles & theme tokens
│   ├── App.css              # App-level styles
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx    # Command center with stats & summaries
│   │   ├── Library.jsx      # Full resource list with filters
│   │   ├── AddResource.jsx  # Resource creation form
│   │   ├── ResourceDetail.jsx  # Detail view with nested file tree
│   │   ├── Analytics.jsx    # Charts & topic breakdown
│   │   └── not-found.jsx    # 404 page
│   │
│   ├── components/
│   │   ├── Layout.jsx              # Sidebar + page shell
│   │   ├── ResourceCard.jsx        # Card with actions (pin, rate, status, delete)
│   │   ├── ConstellationBackground.jsx  # Animated canvas background
│   │   └── ui/                     # shadcn/ui primitives
│   │
│   ├── lib/
│   │   ├── api-mock.js      # localStorage CRUD + TanStack Query hooks
│   │   └── utils.js         # Utility helpers
│   │
│   └── hooks/
│       ├── use-mobile.jsx   # Mobile breakpoint hook
│       └── use-toast.js     # Toast notification hook
│
├── package.json
└── vite.config.js
```

---

## ⚙️ Technologies Used

- **React 19** — Component architecture & state management
- **Vite** — Lightning-fast dev server and build tool
- **Tailwind CSS v4** — Utility-first styling with custom theme tokens
- **TanStack Query** — Server-state management & cache invalidation
- **Recharts** — Interactive charts for analytics
- **Radix UI / shadcn** — Accessible, unstyled UI primitives
- **Wouter** — Lightweight client-side routing
- **Framer Motion** — Animations & transitions
- **Canvas API** — Constellation particle background

No backend or external API required.

---

## 🚀 How to Run the Project

1. Clone the repository
2. Install dependencies
```bash
   npm install
```
3. Start the development server
```bash
   npm run dev
```
4. Open `http://localhost:5173` in your browser

---

## 🧠 Design Decisions

- **No backend required** — All logic and data runs client-side via `localStorage`
- **Nested resource model** — Resources can contain folders, links, and files at any depth
- **Query invalidation pattern** — TanStack Query used even for local data to keep UI reactive
- **Forced dark theme** — CSS variables locked to dark mode for the intended aesthetic

---

## 📌 Future Enhancements

- Integration with cloud storage and backend infrastructure for persistent, cross-device data management
- User authentication system with support for multi-device access and personalized profiles
- Spaced repetition algorithm to surface neglected resources at optimal review intervals
- Deadline management system for individual resources with native calendar integration
- Browser extension enabling one-click resource capture directly from any webpage
- Collaborative shared libraries allowing teams or study groups to curate and access resources collectively
- Dedicated mobile application for on-the-go access and resource management
- AI-powered summarization engine to generate concise summaries and key takeaways from saved resources
- AI-driven quiz generation from resource content to reinforce active recall and retention
- Daily and weekly learning streak tracking to encourage consistent study habits
- Exportable progress reports in PDF format for personal review or academic submission
- Integrated Pomodoro-style focus timer within the resource detail view to support structured study sessions
- Public learner profiles to showcase curated libraries and completed resources within a community

## 👩‍💻 Author

**Shreya Pal**

Personal Project

---

## 📜 License

This project is for **personal and educational use**.