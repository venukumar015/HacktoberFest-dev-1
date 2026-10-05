import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Timer,
  Layers,
  HelpCircle,
  CheckSquare,
  FileText,
  BarChart3,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import { useStudyBuddy } from '../../context/StudyBuddyContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { goals, flashcardDecks } = useStudyBuddy();

  const pendingGoalsCount = goals.filter(g => !g.completed).length;
  const totalCardsCount = flashcardDecks.reduce((acc, d) => acc + (d.cards?.length || 0), 0);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/pomodoro', label: 'Pomodoro Timer', icon: Timer },
    { to: '/flashcards', label: 'Flashcards', icon: Layers, badge: totalCardsCount },
    { to: '/quiz', label: 'MCQ Quiz', icon: HelpCircle },
    { to: '/goals', label: 'Daily Goals', icon: CheckSquare, badge: pendingGoalsCount },
    { to: '/notes', label: 'Notes', icon: FileText },
    { to: '/statistics', label: 'Statistics', icon: BarChart3 },
    { to: '/planner', label: 'Study Planner', icon: Calendar },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth <= 900 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Zap size={22} />
          </div>
          <div>
            <div className="brand-title">StudyBuddy</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              SaaS Study Suite
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Core Modules</div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/focus"
            className="focus-banner-btn"
            onClick={handleLinkClick}
          >
            <Sparkles size={18} />
            <span>Enter Focus Mode</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
