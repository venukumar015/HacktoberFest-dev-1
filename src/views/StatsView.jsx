import React from 'react';
import {
  BarChart3,
  Clock,
  Flame,
  CheckCircle2,
  HelpCircle,
  Layers,
  Award,
  RotateCcw,
  TrendingUp
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';

export const StatsView = () => {
  const { stats, goals, flashcardDecks, quizzes, resetAllData } = useStudyBuddy();

  const history = stats.dailyStudyHistory || [];
  const maxMinutes = Math.max(...history.map(h => h.minutes || 0), 120);

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const goalRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const totalCards = flashcardDecks.reduce((acc, d) => acc + (d.cards?.length || 0), 0);

  const quizScores = stats.quizScores || [];
  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((acc, q) => acc + q.percentage, 0) / quizScores.length)
    : 100;

  const hours = Math.floor((stats.totalStudyMinutes || 0) / 60);
  const minutes = (stats.totalStudyMinutes || 0) % 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 4 Overview Stat Cards */}
      <div className="grid-4">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Focus Time
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {hours}h {minutes}m
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {stats.todayStudyMinutes || 0} mins logged today
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Study Streak
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)' }}>
            {stats.streakDays || 1} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Days</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Active consecutive study days
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Goal Completion Rate
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>
            {goalRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {completedGoals} of {totalGoals} goals finished
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Avg Quiz Score
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {avgQuizScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Across {quizScores.length} challenge tests
          </div>
        </div>
      </div>

      {/* Weekly Visual Activity Chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <TrendingUp size={18} color="var(--accent-primary)" />
              Weekly Study Focus Distribution
            </h3>
            <p className="card-subtitle">Daily minutes recorded through pomodoro & active study sessions</p>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
            Past 7 Days
          </div>
        </div>

        {/* SVG Custom Interactive Bar Chart */}
        <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', padding: '1rem 0.5rem 0' }}>
          {history.map((item, idx) => {
            const barHeightPercent = Math.max(Math.round((item.minutes / maxMinutes) * 100), 8);
            const isToday = idx === history.length - 1;

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isToday ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {item.minutes}m
                </div>

                <div
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: `${barHeightPercent}%`,
                    background: isToday ? 'var(--accent-gradient)' : 'var(--bg-subtle)',
                    border: isToday ? 'none' : '1px solid var(--border-color)',
                    borderRadius: '8px 8px 4px 4px',
                    transition: 'height 0.4s ease',
                    boxShadow: isToday ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
                  }}
                />

                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  {item.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History Logs Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Award size={18} color="var(--accent-primary)" />
              Recent Quiz Benchmark History
            </h3>
            <p className="card-subtitle">Log of timed assessment attempts and performance</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Quiz Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Accuracy</th>
                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {quizScores.map((scoreItem, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{scoreItem.quizTitle}</td>
                  <td style={{ padding: '0.9rem 1rem' }}>{scoreItem.score} / {scoreItem.total}</td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span
                      className={`badge ${scoreItem.percentage >= 75 ? 'badge-success' : 'badge-warning'}`}
                    >
                      {scoreItem.percentage}%
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)' }}>
                    {new Date(scoreItem.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {quizScores.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No quiz history recorded yet. Complete a quiz in the MCQ Quiz arena!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Reset Sample Data
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Restore the initial sample flashcards, quizzes, goals, and schedule templates.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            if (confirm('Are you sure you want to reset all data to default templates?')) {
              resetAllData();
            }
          }}
        >
          <RotateCcw size={15} />
          <span>Reset Template Data</span>
        </button>
      </div>
    </div>
  );
};
