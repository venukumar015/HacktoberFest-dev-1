import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Flame,
  Filter,
  CheckCheck
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';
import { Modal } from '../components/common/Modal';
import { audioService } from '../utils/audio';

export const GoalsView = () => {
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoal, stats } = useStudyBuddy();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    category: 'Computer Science',
    priority: 'medium',
    estimatedMinutes: 30
  });

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setGoalForm({
        title: goal.title,
        category: goal.category || 'General',
        priority: goal.priority || 'medium',
        estimatedMinutes: goal.estimatedMinutes || 30
      });
    } else {
      setEditingGoal(null);
      setGoalForm({
        title: '',
        category: 'Computer Science',
        priority: 'medium',
        estimatedMinutes: 30
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, goalForm);
    } else {
      addGoal(goalForm);
    }
    setIsModalOpen(false);
  };

  const handleToggle = (id) => {
    audioService.playPop();
    toggleGoal(id);
  };

  // Filtered Goals
  const filteredGoals = goals.filter(g => {
    if (statusFilter === 'active' && g.completed) return false;
    if (statusFilter === 'completed' && !g.completed) return false;
    if (priorityFilter !== 'all' && g.priority !== priorityFilter) return false;
    return true;
  });

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const totalTargetMinutes = goals.reduce((acc, g) => acc + (g.estimatedMinutes || 0), 0);
  const completedMinutes = goals.filter(g => g.completed).reduce((acc, g) => acc + (g.estimatedMinutes || 0), 0);

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Analytics Summary Banner */}
      <div
        className="card"
        style={{
          background: 'var(--accent-gradient-subtle)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '1.75rem 2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Daily Targets & Productivity</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Completed <strong>{completedGoals}</strong> of <strong>{totalGoals}</strong> daily goals ({completionRate}%)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {completedMinutes}/{totalTargetMinutes} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>mins</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Time Target</div>
            </div>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={16} />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${completionRate}%`,
              height: '100%',
              background: 'var(--color-success)',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Filter Tabs and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', background: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'all', label: `All (${goals.length})` },
            { id: 'active', label: `Active (${goals.filter(g => !g.completed).length})` },
            { id: 'completed', label: `Completed (${completedGoals})` }
          ].map(tab => (
            <button
              key={tab.id}
              className="btn btn-sm"
              style={{
                background: statusFilter === tab.id ? 'var(--bg-card)' : 'transparent',
                color: statusFilter === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: statusFilter === tab.id ? 'var(--shadow-sm)' : 'none',
                fontWeight: statusFilter === tab.id ? 700 : 500
              }}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: '0.35rem 0.75rem', width: 'auto', fontSize: '0.8rem' }}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Goal Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredGoals.map(goal => (
          <div
            key={goal.id}
            className="card card-hoverable"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              opacity: goal.completed ? 0.75 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
              <button
                onClick={() => handleToggle(goal.id)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: goal.completed ? 'none' : '2px solid var(--border-color)',
                  background: goal.completed ? 'var(--color-success)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {goal.completed && <CheckCircle2 size={18} />}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    color: goal.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: goal.completed ? 'line-through' : 'none'
                  }}
                >
                  {goal.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>{goal.category}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} /> {goal.estimatedMinutes} mins
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                className={`badge ${
                  goal.priority === 'high'
                    ? 'badge-danger'
                    : goal.priority === 'medium'
                    ? 'badge-warning'
                    : 'badge-primary'
                }`}
              >
                {goal.priority}
              </span>

              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button className="btn-icon" onClick={() => handleOpenModal(goal)} title="Edit Goal">
                  <Edit2 size={15} />
                </button>
                <button className="btn-icon" onClick={() => deleteGoal(goal.id)} title="Delete Goal">
                  <Trash2 size={15} color="var(--color-danger)" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredGoals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            No goals found for this filter.
          </div>
        )}
      </div>

      {/* Goal Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Create Daily Goal'}
      >
        <form onSubmit={handleSaveGoal}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Goal Title</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Master React Custom Hooks"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Web Development"
                value={goalForm.category}
                onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={goalForm.priority}
                  onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value })}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Time (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  step="5"
                  className="form-input"
                  value={goalForm.estimatedMinutes}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, estimatedMinutes: parseInt(e.target.value) || 30 })
                  }
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
