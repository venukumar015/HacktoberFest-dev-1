import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Flame,
  Music
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';
import { audioService } from '../utils/audio';
import { Modal } from '../components/common/Modal';

export const PomodoroView = () => {
  const {
    pomodoroSettings,
    updatePomodoroSettings,
    addStudyMinutes,
    incrementPomodoroCount,
    showToast
  } = useStudyBuddy();

  // Mode: 'work' | 'shortBreak' | 'longBreak'
  const [mode, setMode] = useState('work');
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [focusTask, setFocusTask] = useState('');
  const [ambientSound, setAmbientSound] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings form local state
  const [tempSettings, setTempSettings] = useState(pomodoroSettings);

  const getInitialSeconds = (m) => {
    switch (m) {
      case 'shortBreak':
        return pomodoroSettings.shortBreak * 60;
      case 'longBreak':
        return pomodoroSettings.longBreak * 60;
      default:
        return pomodoroSettings.workTime * 60;
    }
  };

  const [timeLeft, setTimeLeft] = useState(() => getInitialSeconds('work'));
  const totalDuration = getInitialSeconds(mode);

  // Sync timeLeft if settings change and timer is idle
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getInitialSeconds(mode));
    }
  }, [pomodoroSettings, mode]);

  // Main countdown timer interval
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Ambient sound handler
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

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      audioService.stopAmbient();
    };
  }, []);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (pomodoroSettings.soundEnabled) {
      audioService.playBell();
    }

    if (mode === 'work') {
      addStudyMinutes(pomodoroSettings.workTime);
      incrementPomodoroCount();
      showToast(`Work cycle #${currentCycle} complete! Take a break 🎉`, 'success');

      if (currentCycle % pomodoroSettings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(pomodoroSettings.longBreak * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(pomodoroSettings.shortBreak * 60);
      }
      setCurrentCycle(prev => prev + 1);
    } else {
      showToast('Break finished! Ready to focus again?', 'info');
      setMode('work');
      setTimeLeft(pomodoroSettings.workTime * 60);
    }
  };

  const toggleTimer = () => {
    audioService.playPop();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    audioService.playPop();
    setIsRunning(false);
    setTimeLeft(getInitialSeconds(mode));
  };

  const switchMode = (newMode) => {
    audioService.playPop();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getInitialSeconds(newMode));
  };

  const skipTimer = () => {
    audioService.playPop();
    handleTimerComplete();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updatePomodoroSettings(tempSettings);
    setIsSettingsOpen(false);
  };

  // Calculate minutes and seconds string
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Circular calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDuration > 0 ? timeLeft / totalDuration : 1;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const getProgressColor = () => {
    if (mode === 'shortBreak') return '#10b981';
    if (mode === 'longBreak') return '#3b82f6';
    return '#6366f1';
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Main Timer Dial Card */}
      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-primary">Pomodoro Technique</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cycle #{currentCycle}
            </span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setTempSettings(pomodoroSettings);
              setIsSettingsOpen(true);
            }}
          >
            <Settings size={15} />
            <span>Customize</span>
          </button>
        </div>

        {/* Task Focus Input */}
        <div style={{ maxWidth: '420px', margin: '0 auto 2rem', textAlign: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🎯 What are you working on right now?"
            value={focusTask}
            onChange={(e) => setFocusTask(e.target.value)}
            style={{ textAlign: 'center', fontWeight: 600 }}
          />
        </div>

        {/* Timer Container */}
        <div className="timer-container">
          {/* Mode Tabs */}
          <div className="timer-mode-tabs">
            <button
              className={`timer-tab ${mode === 'work' ? 'active' : ''}`}
              onClick={() => switchMode('work')}
            >
              Focus Time ({pomodoroSettings.workTime}m)
            </button>
            <button
              className={`timer-tab ${mode === 'shortBreak' ? 'active' : ''}`}
              onClick={() => switchMode('shortBreak')}
            >
              Short Break ({pomodoroSettings.shortBreak}m)
            </button>
            <button
              className={`timer-tab ${mode === 'longBreak' ? 'active' : ''}`}
              onClick={() => switchMode('longBreak')}
            >
              Long Break ({pomodoroSettings.longBreak}m)
            </button>
          </div>

          {/* Dial Graphic */}
          <div className="timer-dial-wrapper">
            <svg className="timer-dial-svg" viewBox="0 0 280 280">
              <circle
                className="timer-dial-bg"
                cx="140"
                cy="140"
                r={radius}
              />
              <circle
                className="timer-dial-progress"
                cx="140"
                cy="140"
                r={radius}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  stroke: getProgressColor()
                }}
              />
            </svg>

            <div className="timer-time-display">
              <div className="timer-digits">{formattedTime}</div>
              <div className="timer-subtext">
                {mode === 'work' ? 'Deep Focus' : mode === 'shortBreak' ? 'Rest & Recharge' : 'Extended Break'}
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="timer-controls">
            <button
              className="btn-icon"
              onClick={resetTimer}
              title="Reset Timer"
              style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-full)', background: 'var(--bg-subtle)' }}
            >
              <RotateCcw size={20} />
            </button>

            <button
              className="btn-timer-primary"
              onClick={toggleTimer}
              title={isRunning ? 'Pause' : 'Start'}
              style={{
                background:
                  mode === 'shortBreak'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : mode === 'longBreak'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    : 'var(--accent-gradient)'
              }}
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
            </button>

            <button
              className="btn-icon"
              onClick={skipTimer}
              title="Skip Session"
              style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-full)', background: 'var(--bg-subtle)' }}
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* 4-dot Cycle indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '2rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SET PROGRESS:</span>
            {[1, 2, 3, 4].map(idx => {
              const activeIndex = ((currentCycle - 1) % 4) + 1;
              const isFilled = idx < activeIndex || (idx === 4 && activeIndex === 4);
              return (
                <div
                  key={idx}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: isFilled ? 'var(--accent-primary)' : 'var(--border-color)',
                    transition: 'background 0.3s ease'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Ambient Audio Controller */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Music size={18} color="var(--accent-primary)" />
              Synthesized Ambient Soundscapes
            </h3>
            <p className="card-subtitle">Soothing background white noise, rain, or binaural waves</p>
          </div>
          {ambientSound !== 'none' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Volume2 size={16} color="var(--accent-primary)" />
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                style={{ width: '90px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { id: 'none', label: 'Off / Mute' },
            { id: 'rain', label: '🌧️ Gentle Rain' },
            { id: 'whitenoise', label: '📻 White Noise' },
            { id: 'binaural', label: '🧠 Binaural 10Hz' },
            { id: 'stream', label: '🌊 Forest Stream' }
          ].map(snd => (
            <button
              key={snd.id}
              className={`ambient-sound-pill ${ambientSound === snd.id ? 'active' : ''}`}
              onClick={() => handleAmbientChange(snd.id)}
            >
              <span>{snd.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Pomodoro Timer Settings"
      >
        <form onSubmit={handleSaveSettings}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Focus Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="120"
                className="form-input"
                value={tempSettings.workTime}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, workTime: parseInt(e.target.value) || 25 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Break Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                className="form-input"
                value={tempSettings.shortBreak}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, shortBreak: parseInt(e.target.value) || 5 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Long Break Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                className="form-input"
                value={tempSettings.longBreak}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, longBreak: parseInt(e.target.value) || 15 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Long Break Interval (Cycles)</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-input"
                value={tempSettings.longBreakInterval}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, longBreakInterval: parseInt(e.target.value) || 4 })
                }
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
              <input
                type="checkbox"
                id="soundEnabled"
                checked={tempSettings.soundEnabled}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, soundEnabled: e.target.checked })
                }
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <label htmlFor="soundEnabled" style={{ fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                Play pleasant chime when timer expires
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsSettingsOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
