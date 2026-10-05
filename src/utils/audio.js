// Web Audio API helper for sound chimes and synthesized ambient noise
class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.currentAmbientType = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play pleasant notification bell chime for Pomodoro completion
  playBell() {
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.7);
      osc2.stop(now + 1.7);
    } catch (e) {
      console.warn('Audio playback not permitted yet', e);
    }
  }

  // Play click / tap feedback
  playPop() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      // ignore
    }
  }

  // Synthesize ambient sounds: 'rain', 'whitenoise', 'binaural', 'stream'
  startAmbient(type = 'rain', volume = 0.3) {
    try {
      this.stopAmbient();
      this.init();
      if (!this.audioCtx) return;

      this.currentAmbientType = type;
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, this.audioCtx.currentTime);

      if (type === 'rain') {
        // Lowpass + bandpass for gentle rain
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);

        const filter2 = this.audioCtx.createBiquadFilter();
        filter2.type = 'peaking';
        filter2.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        filter2.gain.setValueAtTime(6, this.audioCtx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(filter2);
        filter2.connect(gain);
      } else if (type === 'stream') {
        // Filter for trickling stream
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(850, this.audioCtx.currentTime);
        filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
      } else if (type === 'binaural') {
        // Low alpha frequency pulse (10Hz binaural simulation)
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(200, this.audioCtx.currentTime);
        osc2.frequency.setValueAtTime(210, this.audioCtx.currentTime);

        const binGain = this.audioCtx.createGain();
        binGain.gain.setValueAtTime(volume * 0.15, this.audioCtx.currentTime);

        osc1.connect(binGain);
        osc2.connect(binGain);
        binGain.connect(this.audioCtx.destination);

        osc1.start();
        osc2.start();
        this.ambientSource = { stop: () => { osc1.stop(); osc2.stop(); } };
        this.ambientGain = binGain;
        return;
      } else {
        // White noise
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, this.audioCtx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(gain);
      }

      gain.connect(this.audioCtx.destination);
      whiteNoise.start();

      this.ambientSource = whiteNoise;
      this.ambientGain = gain;
    } catch (e) {
      console.warn('Ambient sound error', e);
    }
  }

  setAmbientVolume(volume) {
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(volume * 0.4, this.audioCtx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
      } catch (e) {
        // ignore
      }
      this.ambientSource = null;
    }
    this.currentAmbientType = null;
  }
}

export const audioService = new AudioManager();
