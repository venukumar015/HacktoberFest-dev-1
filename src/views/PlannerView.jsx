import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Play,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';
import { Modal } from '../components/common/Modal';
import { audioService } from '../utils/audio';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const PlannerView = () => {
  const {
    plannerEvents,
    addPlannerEvent,
    updatePlannerEvent,
    deletePlannerEvent,
    toggleEventStatus
  } = useStudyBuddy();

  const [selectedDay, setSelectedDay] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    day: 'Monday',
    subject: 'Computer Science',
    topic: '',
    startTime: '09:00',
    endTime: '10:30',
    priority: 'medium'
  });

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        day: event.day || 'Monday',
        subject: event.subject || 'General',
        topic: event.topic || '',
        startTime: event.startTime || '09:00',
        endTime: event.endTime || '10:30',
        priority: event.priority || 'medium'
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        day: selectedDay === 'All' ? 'Monday' : selectedDay,
        subject: 'Computer Science',
        topic: '',
        startTime: '09:00',
        endTime: '10:30',
        priority: 'medium'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.topic.trim()) return;

    if (editingEvent) {
      updatePlannerEvent(editingEvent.id, eventForm);
    } else {
      addPlannerEvent(eventForm);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    audioService.playPop();
    toggleEventStatus(id);
  };

  // Filtered Events
  const filteredEvents = plannerEvents
    .filter(e => selectedDay === 'All' || e.day === selectedDay)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Weekly Study Planner & Timetable</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Schedule and structure focused learning blocks across the week
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Day Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          className={`btn btn-sm ${selectedDay === 'All' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedDay('All')}
        >
          All Week
        </button>
        {DAYS_OF_WEEK.map(day => (
          <button
            key={day}
            className={`btn btn-sm ${selectedDay === day ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="card card-hoverable"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.1rem 1.35rem',
              borderLeft: `5px solid ${
                event.status === 'completed'
                  ? 'var(--color-success)'
                  : event.status === 'in-progress'
                  ? 'var(--color-warning)'
                  : 'var(--accent-primary)'
              }`
            }}
          >
            {/* Left: Time and Subject */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
              <div style={{ minWidth: '100px', textAlign: 'left' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {event.startTime} - {event.endTime}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{event.day}</div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                    {event.subject}
                  </span>
                  <span
                    className={`badge ${
                      event.priority === 'high'
                        ? 'badge-danger'
                        : event.priority === 'medium'
                        ? 'badge-warning'
                        : 'badge-primary'
                    }`}
                    style={{ fontSize: '0.68rem' }}
                  >
                    {event.priority}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {event.topic}
                </h4>
              </div>
            </div>

            {/* Right: Status Toggle & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className={`btn btn-sm ${
                  event.status === 'completed'
                    ? 'badge-success'
                    : event.status === 'in-progress'
                    ? 'badge-warning'
                    : 'badge-primary'
                }`}
                style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                onClick={() => handleToggleStatus(event.id)}
                title="Click to cycle status (Scheduled -> In Progress -> Completed)"
              >
                {event.status === 'completed' ? (
                  <CheckCircle2 size={14} />
                ) : event.status === 'in-progress' ? (
                  <Play size={14} />
                ) : (
                  <Clock size={14} />
                )}
                <span>{event.status}</span>
              </button>

              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button className="btn-icon" onClick={() => handleOpenModal(event)} title="Edit Session">
                  <Edit2 size={15} />
                </button>
                <button className="btn-icon" onClick={() => deletePlannerEvent(event.id)} title="Delete Session">
                  <Trash2 size={15} color="var(--color-danger)" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            No study sessions scheduled for {selectedDay === 'All' ? 'the week' : selectedDay}. Click "Schedule Session" to plan ahead!
          </div>
        )}
      </div>

      {/* Planner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Study Session' : 'Schedule Study Session'}
      >
        <form onSubmit={handleSaveEvent}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Study Topic / Task</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Graph Algorithms & Dynamic Programming Review"
                value={eventForm.topic}
                onChange={(e) => setEventForm({ ...eventForm, topic: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Day of the Week</label>
                <select
                  className="form-select"
                  value={eventForm.day}
                  onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={eventForm.subject}
                  onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={eventForm.priority}
                  onChange={(e) => setEventForm({ ...eventForm, priority: e.target.value })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEvent ? 'Save Changes' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
