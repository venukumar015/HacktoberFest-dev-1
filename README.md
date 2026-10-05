# ⚡ StudyBuddy — All-in-One SaaS Study Companion

> A modern, minimal, responsive SaaS-style learning and productivity web app built with **React**, **Vite**, **Vanilla CSS**, **React Router**, and **localStorage**.

---

## 📖 Overview

**StudyBuddy** is a zero-backend, client-side study assistant designed with a sleek SaaS aesthetic, micro-animations, full dark/light theme support, and persistent state management. Everything runs entirely in your browser with zero external APIs or database dependencies.

---

## ✨ Features

### 1. 📊 Interactive Dashboard
- **Metric Overview Cards**: Tracks today's focus minutes, daily goal completion rate (with visual progress bar), active flashcard count, and average quiz scores.
- **Streak Tracker**: Maintains your continuous daily study streak.
- **Active Goal Feeds**: Quick check-off list directly from the home view.
- **Timetable Preview**: Displays upcoming scheduled study blocks for today.
- **Quick Launch Widgets**: Instant access to Pomodoro, 3D Flashcards, Quizzes, and Notes.

### 2. ⏱️ Pomodoro Focus Timer
- **3 Timing Modes**: Deep Focus (25m), Short Break (5m), and Long Break (15m).
- **Circular Animated SVG Dial**: Smooth countdown visualization.
- **Customizable Durations**: Configure focus time, break intervals, and cycles via the settings modal.
- **Web Audio API Chimes**: Built-in pleasant notification bells upon session completion without needing external audio files.
- **Automatic Stat Sync**: Logs completed study minutes and pomodoro cycles directly into daily analytics.

### 3. 🃏 3D Flashcards & Active Recall
- **Deck Management**: Create, edit, and organize flashcard decks by category and custom color accents.
- **Interactive 3D Flip Card Practice**: Click to flip with smooth CSS 3D transforms (`rotateY`).
- **Spaced Recall Ratings**: Grade yourself with *Again*, *Hard*, *Good*, or *Easy (Mastered)* to track retention.
- **Card Controls**: Shuffle cards, toggle hints, add new cards, and restart review sessions.

### 4. 📝 Timed MCQ Quiz Arena
- **Preloaded & Custom Quizzes**: High-yield tests for CS, Algorithms, Web Development, and custom subject builders.
- **Live Question Timer**: Configurable countdown limit per question.
- **Instant Option Selection**: Visual feedback with interactive options (A, B, C, D).
- **Comprehensive Review & Explanations**: Review detailed explanations and correct answers at the end of each test.
- **Score Logging**: Automatically logs accuracy percentage and test history.

### 5. 🎯 Daily Goals & Task Tracker
- **Smart Filters**: Filter by status (*All*, *Active*, *Completed*) and priority (*High*, *Medium*, *Low*).
- **Time Target Estimator**: Set estimated study minutes per goal.
- **Celebratory Feedback**: Smooth completion transitions, streak incrementing, and progress bar updates.

### 6. 📓 High-Yield Study Notes
- **Live Search & Filter**: Real-time keyword search and subject tag filters.
- **Markdown-Ready Preview**: Renders headings (`#`, `##`, `###`), bullet points, blockquotes, and code snippets.
- **Pinning & Quick Actions**: Pin essential cheatsheets to the top and copy note text to clipboard in one click.
- **Rich Editor Modal**: Markdown shortcut buttons (H3, Bold, List, Quote, Code).

### 7. 📈 Analytics & Progress Charts
- **Weekly Study Time SVG Bar Chart**: Visual distribution of daily study minutes over the past 7 days with dynamic scaling.
- **Performance Metrics**: Total study hours, average daily minutes, goal completion rate, and quiz mastery average.
- **Quiz Benchmark Table**: Complete historical log of all quiz attempts with timestamps and score badges.
- **Template Reset**: Option to restore initial study templates.

### 8. 🧘 Distraction-Free Focus Zen Mode
- **Fullscreen Zen UI**: Minimalist view with large timer digits and clean controls.
- **Synthesized Ambient Audio Generator**: Offline soundscapes synthesized directly via Web Audio API:
  - 🌧️ *Gentle Rain*
  - 📻 *White Noise*
  - 🧠 *Alpha 10Hz Binaural Waves*
  - 🌊 *Forest Stream*
- **Distraction Scratchpad**: Auto-saved temporary notepad to jot down distracting thoughts without losing workflow.

### 9. 📅 Study Planner & Timetable
- **Weekly Schedule**: Filter sessions by day (*Mon–Sun*) or view the full week at a glance.
- **One-Click Status Cycler**: Toggle between `Scheduled` ➔ `In Progress` ➔ `Completed`.
- **Session Creator**: Set topic, subject, start/end time, day, and priority.

### 10. 🌓 SaaS UI & Dark/Light Mode
- **Design System**: Curated color tokens, glassmorphic card borders, subtle drop shadows, and responsive layout.
- **Theme Toggle**: One-click switch between dark and light modes with localStorage persistence.
- **Responsive Navigation**: Collapsible sidebar navigation drawer for tablets and mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Routing** | [React Router 7](https://reactrouter.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Audio** | Native **Web Audio API** (Oscillators, Noise Generators, Biquad Filters) |
| **Styling** | **Vanilla CSS** with CSS Custom Properties & Design Tokens |
| **Persistence** | **localStorage** (Zero backend / No external DB required) |

---

## 📂 Project Structure

```text
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                     # Application root mount
    ├── App.jsx                      # Router & Context provider setup
    ├── index.css                    # Design tokens, typography & base utility classes
    ├── context/
    │   ├── ThemeContext.jsx         # Dark / Light theme provider & state
    │   └── StudyBuddyContext.jsx    # Master state & localStorage synchronization
    ├── styles/
    │   └── components.css           # Component styles (3D cards, timer, sidebar, modals)
    ├── utils/
    │   ├── audio.js                 # Web Audio API chime & ambient sound synthesis
    │   └── initialData.js           # Default starter mock data (decks, quizzes, notes)
    ├── components/
    │   ├── common/
    │   │   ├── Modal.jsx            # Accessible reusable modal dialog
    │   │   └── Toast.jsx            # Notification toast system
    │   └── layout/
    │       ├── Header.jsx           # Top header with streak pill & theme switch
    │       ├── Sidebar.jsx          # Collapsible SaaS navigation sidebar
    │       └── Layout.jsx           # App layout shell with responsive drawer
    └── views/
        ├── DashboardView.jsx        # Overview metrics & quick jump widgets
        ├── PomodoroView.jsx         # Pomodoro focus timer with cycle controls
        ├── FlashcardsView.jsx       # 3D Flipcard recall practice & deck builder
        ├── QuizView.jsx             # Timed MCQ quizzes with answer review
        ├── GoalsView.jsx            # Daily goals & priority tracker
        ├── NotesView.jsx            # Markdown study notes & cheatsheet search
        ├── StatsView.jsx            # Visual charts & study performance logs
        ├── FocusModeView.jsx        # Fullscreen distraction-free zen mode
        └── PlannerView.jsx          # Weekly study schedule & timetable
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone or navigate to the repository:**
   ```bash
   cd dev-1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5173/
   ```

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 💾 Local Storage Schema

All state updates automatically sync to the following `localStorage` keys:

- `study_buddy_theme` — Active UI theme (`dark` or `light`)
- `study_buddy_goals` — List of daily study goals and completion statuses
- `study_buddy_decks` — Flashcard decks and their respective cards
- `study_buddy_quizzes` — MCQ quizzes, questions, options, and explanations
- `study_buddy_notes` — Study notes with tags, markdown content, and pinned status
- `study_buddy_planner` — Weekly timetable study events and progress states
- `study_buddy_settings` — Pomodoro durations and audio alert preferences
- `study_buddy_stats` — Daily study history, streak count, and quiz score logs
- `study_buddy_scratchpad` — Distraction scratchpad text

---

## 📄 License

MIT License — Feel free to use and customize this project for your own study workflows!
