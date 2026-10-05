import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StudyBuddyProvider } from './context/StudyBuddyContext';
import { Layout } from './components/layout/Layout';

import { DashboardView } from './views/DashboardView';
import { PomodoroView } from './views/PomodoroView';
import { FlashcardsView } from './views/FlashcardsView';
import { QuizView } from './views/QuizView';
import { GoalsView } from './views/GoalsView';
import { NotesView } from './views/NotesView';
import { StatsView } from './views/StatsView';
import { FocusModeView } from './views/FocusModeView';
import { PlannerView } from './views/PlannerView';

function App() {
  return (
    <ThemeProvider>
      <StudyBuddyProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardView />} />
              <Route path="/pomodoro" element={<PomodoroView />} />
              <Route path="/flashcards" element={<FlashcardsView />} />
              <Route path="/quiz" element={<QuizView />} />
              <Route path="/goals" element={<GoalsView />} />
              <Route path="/notes" element={<NotesView />} />
              <Route path="/statistics" element={<StatsView />} />
              <Route path="/planner" element={<PlannerView />} />
            </Route>

            {/* Standalone Fullscreen Focus Mode */}
            <Route path="/focus" element={<FocusModeView />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StudyBuddyProvider>
    </ThemeProvider>
  );
}

export default App;
