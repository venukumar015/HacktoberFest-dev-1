import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle,
  Clock,
  Edit3
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';
import { audioService } from '../utils/audio';

export const FocusModeView = () => {
  const navigate = useNavigate();
  const { pomodoroSettings, addStudyMinutes, incrementPomodoroCount, goals, showToast } = useStudyBuddy();

  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState('rain');
  const [ambientVolume, setAmbientVolume] = useState(0.25);
  const [focusTask, setFocusTask] = useState('Deep Work & Learning Session');
  const [scratchpad, setScratchpad] = useState(() => localStorage.getItem('study_buddy_scratchpad') || '');

  // Auto-start ambient sound on mount if requested
  useEffect(() => {
    audioService.startAmbient(ambientSound, ambientVolume);
    return () => {
      audioService.stopAmbient();
    };
  }, []);

  // Save scratchpad
  useEffect(() => {
    localStorage.setItem('study_buddy_scratchpad', scratchpad);
  }, [scratchpad]);

  // Pomodoro countdown
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      audioService.playBell();
      addStudyMinutes(pomodoroSettings.workTime);
      incrementPomodoroCount();
      showToast('Focus session complete! 🎉', 'success');
      setTimeLeft(pomodoroSettings.workTime * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    audioService.playPop();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    audioService.playPop();
    setIsRunning(false);
    setTimeLeft(pomodoroSettings.workTime * 60);
  };

  const handleAmbientChange = (type) => {
    setAmbientSound(type);
    if (type === 'none') {
      audioService.stopAmbient();
    } else {
      audioService.startAmbient(type, ambientVolume);
    }
  };

  const handleVolumeChange = (vol) => {
    setAmbientVolume(vol);
    audioService.setAmbientVolume(vol);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const uncompletedGoals = goals.filter(g => !g.completed);

  return (
    <div className="focus-fullscreen-overlay">
      {/* Top Header */}
      <div className="focus-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="brand-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>StudyBuddy Zen</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distraction-Free Focus</span>
          </div>
        </div>

        {/* Ambient Selector Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[
              { id: 'none', label: 'Mute' },
              { id: 'rain', label: '🌧️ Rain' },
              { id: 'whitenoise', label: '📻 Noise' },
              { id: 'binaural', label: '🧠 Alpha 10Hz' },
              { id: 'stream', label: '🌊 Stream' }
            ].map(snd => (
              <button
                key={snd.id}
                className={`ambient-sound-pill ${ambientSound === snd.id ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => handleAmbientChange(snd.id)}
              >
                {snd.label}
              </button>
            ))}
          </div>

          {ambientSound !== 'none' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Volume2 size={16} color="var(--accent-primary)" />
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                style={{ width: '70px', accentColor: 'var(--accent-primary)' }}
              />
            </div>
          )}

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              audioService.stopAmbient();
              navigate('/');
            }}
          >
            <X size={16} />
            <span>Exit Focus</span>
          </button>
        </div>
      </div>

      {/* Center Focus Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '640px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '2rem 0' }}>
        {/* Active Target Selector */}
        <div style={{ marginBottom: '2rem', width: '100%' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>
            CURRENT FOCUS OBJECTIVE
          </div>
          <input
            type="text"
            className="form-input"
            value={focusTask}
            onChange={(e) => setFocusTask(e.target.value)}
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              textAlign: 'center',
              background: 'transparent',
              borderColor: 'transparent',
              borderBottom: '2px solid var(--border-color)',
              borderRadius: 0,
              padding: '0.5rem'
            }}
          />

          {uncompletedGoals.length > 0 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Pick:</span>
              {uncompletedGoals.slice(0, 3).map(g => (
                <button
                  key={g.id}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => setFocusTask(g.title)}
                >
                  {g.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Big Minimalist Timer Digits */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '6.5rem',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            color: 'var(--text-primary)',
            lineHeight: 1,
            margin: '1.5rem 0'
          }}
        >
          {formattedTime}
        </div>

        {/* Minimal Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem' }}>
          <button
            className="btn-icon"
            onClick={resetTimer}
            title="Reset"
            style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-subtle)' }}
          >
            <RotateCcw size={22} />
          </button>

          <button
            className="btn btn-primary"
            onClick={toggleTimer}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(99, 102, 241, 0.45)'
            }}
          >
            {isRunning ? <Pause size={30} /> : <Play size={30} style={{ marginLeft: '4px' }} />}
          </button>
        </div>

        {/* Quick Scratchpad Note to capture distracting thoughts */}
        <div className="card" style={{ width: '100%', marginTop: '3rem', textAlign: 'left', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Edit3 size={15} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              DISTRACTION SCRATCHPAD (Auto-Saved)
            </span>
          </div>
          <textarea
            className="form-textarea"
            placeholder="Write down any sudden distracting thought to process later without breaking flow..."
            value={scratchpad}
            onChange={(e) => setScratchpad(e.target.value)}
            style={{ minHeight: '80px', fontSize: '0.85rem' }}
          />
        </div>
      </div>
    </div>
  );
};
