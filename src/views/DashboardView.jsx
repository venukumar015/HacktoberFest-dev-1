import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  Layers,
  HelpCircle,
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  Flame,
  Plus,
  Target
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';

export const DashboardView = () => {
  const {
    goals,
    toggleGoal,
    flashcardDecks,
    quizzes,
    plannerEvents,
    stats
  } = useStudyBuddy();

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const goalsPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const totalCards = flashcardDecks.reduce((acc, d) => acc + (d.cards?.length || 0), 0);
  
  // Calculate quiz average
  const quizScores = stats.quizScores || [];
  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((acc, q) => acc + q.percentage, 0) / quizScores.length)
    : 100;

  // Today's day string
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayEvents = plannerEvents.filter(e => e.day === todayDay || e.day === 'Monday');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome & Motivational Banner */}
      <div
        className="card"
        style={{
          background: 'var(--accent-gradient-subtle)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1.75rem 2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👋</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Welcome back to StudyBuddy
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            You're on a <strong style={{ color: 'var(--color-warning)' }}>{stats.streakDays || 1}-day streak</strong>! Keep the momentum going today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/pomodoro" className="btn btn-secondary">
            <Play size={16} fill="currentColor" />
            <span>Start Timer</span>
          </Link>
          <Link to="/focus" className="btn btn-primary">
            <Sparkles size={16} />
            <span>Zen Focus Mode</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Overview Cards */}
      <div className="grid-4">
        {/* Today's Study Time */}
        <div className="card card-hoverable">
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Today's Focus
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats.todayStudyMinutes || 0} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>mins</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {stats.completedPomodoros || 0} pomodoro cycles logged
          </div>
        </div>

        {/* Daily Goals Progress */}
        <div className="card card-hoverable">
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Daily Goals
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {completedGoals}/{totalGoals}{' '}
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-success)' }}>
              ({goalsPercent}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', marginTop: '0.6rem', overflow: 'hidden' }}>
            <div
              style={{
                width: `${goalsPercent}%`,
                height: '100%',
                background: 'var(--color-success)',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Flashcards Deck Count */}
        <div className="card card-hoverable">
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Flashcards Deck
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalCards} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>cards</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Across {flashcardDecks.length} study decks
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="card card-hoverable">
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Quiz Accuracy
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HelpCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {avgQuizScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {quizScores.length} tests completed
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Active Goals & Study Timetable */}
      <div className="grid-2">
        {/* Today's Goals Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Target size={19} color="var(--accent-primary)" />
                Active Daily Goals
              </h3>
              <p className="card-subtitle">Mark tasks complete to maintain your streak</p>
            </div>
            <Link to="/goals" className="btn btn-outline btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {goals.slice(0, 4).map(goal => (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: goal.completed ? 'none' : '2px solid var(--border-color)',
                    background: goal.completed ? 'var(--color-success)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                >
                  {goal.completed && <CheckCircle2 size={15} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: goal.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: goal.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {goal.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {goal.category} • {goal.estimatedMinutes}m target
                  </div>
                </div>

                <span
                  className={`badge ${
                    goal.priority === 'high'
                      ? 'badge-danger'
                      : goal.priority === 'medium'
                      ? 'badge-warning'
                      : 'badge-primary'
                  }`}
                  style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                >
                  {goal.priority}
                </span>
              </div>
            ))}

            {goals.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                No goals added yet. Add one to boost your focus!
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Study Schedule */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Calendar size={19} color="var(--accent-primary)" />
                Planner Schedule
              </h3>
              <p className="card-subtitle">Upcoming targeted study sessions</p>
            </div>
            <Link to="/planner" className="btn btn-outline btn-sm">
              <span>Planner</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {todayEvents.slice(0, 4).map(event => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {event.topic}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {event.day} • {event.startTime} - {event.endTime} • {event.subject}
                  </div>
                </div>

                <span
                  className={`badge ${
                    event.status === 'completed'
                      ? 'badge-success'
                      : event.status === 'in-progress'
                      ? 'badge-warning'
                      : 'badge-primary'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {event.status}
                </span>
              </div>
            ))}

            {todayEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                No scheduled sessions today. Plan ahead in the Study Planner!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid-3">
        {/* Flashcard Quick Study */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Layers size={20} color="#6366f1" />
              <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Active Flashcard Decks</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Strengthen neural pathways through 3D active recall and self-assessment.
            </p>
          </div>
          <Link to="/flashcards" className="btn btn-primary" style={{ width: '100%' }}>
            <span>Review Flashcards</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* MCQ Quiz Arena */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <HelpCircle size={20} color="#10b981" />
              <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>MCQ Knowledge Quizzes</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Test your speed, benchmark mastery with timed quizzes and in-depth explanations.
            </p>
          </div>
          <Link to="/quiz" className="btn btn-secondary" style={{ width: '100%' }}>
            <span>Take a Quiz</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Study Notes */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={20} color="#f59e0b" />
              <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>High-Yield Notes</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Access summarized key takeaways, syntax cheatsheets, and concepts.
            </p>
          </div>
          <Link to="/notes" className="btn btn-secondary" style={{ width: '100%' }}>
            <span>Browse Notes</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
