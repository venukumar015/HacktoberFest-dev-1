import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Flame, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStudyBuddy } from '../../context/StudyBuddyContext';

const ROUTE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your learning journey & active targets' },
  '/pomodoro': { title: 'Pomodoro Timer', subtitle: 'Deep work focus cycles & interval training' },
  '/flashcards': { title: 'Flashcards & Recall', subtitle: 'Master key concepts with active 3D recall cards' },
  '/quiz': { title: 'MCQ Quiz Arena', subtitle: 'Test your knowledge with timed benchmarks & explanations' },
  '/goals': { title: 'Daily Goals & Tasks', subtitle: 'Track your high-yield daily milestones' },
  '/notes': { title: 'Study Notes & Cheatsheets', subtitle: 'Organize high-yield summaries & code snippets' },
  '/statistics': { title: 'Analytics & Insights', subtitle: 'Visual progress, retention rates & time allocation' },
  '/planner': { title: 'Study Planner', subtitle: 'Weekly study timetable & task schedules' },
  '/focus': { title: 'Focus Zen Mode', subtitle: 'Distraction-free environment with ambient audio' }
};

export const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { stats } = useStudyBuddy();

  const currentRoute = ROUTE_TITLES[location.pathname] || {
    title: 'Study Buddy',
    subtitle: 'Your personal learning platform'
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>
        <div className="header-title-wrapper">
          <h1>{currentRoute.title}</h1>
          <p>{currentRoute.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="streak-pill" title="Current Daily Study Streak">
          <Flame size={16} fill="var(--color-warning)" />
          <span>{stats.streakDays || 1} Day Streak</span>
        </div>

        <Link to="/focus" className="btn btn-primary btn-sm" style={{ display: location.pathname === '/focus' ? 'none' : 'inline-flex' }}>
          <Sparkles size={15} />
          <span>Focus</span>
        </Link>

        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle Light / Dark Mode"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};
