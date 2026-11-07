// ARRAI Pay Soundbox and Haptic Audio Engine
// Generates authentic ARRAI dual-tone melodic chimes via Web Audio API
// + Natural Human Speech synthesis announcements in Hindi & English

class SoundEngine {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Melodic ARRAI UPI success chime: G4 -> C5 -> E5 -> G5 with soft reverb
  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { freq: 392.0, time: 0.00, dur: 0.12 }, // G4
        { freq: 523.25, time: 0.10, dur: 0.12 }, // C5
        { freq: 659.25, time: 0.20, dur: 0.14 }, // E5
        { freq: 783.99, time: 0.32, dur: 0.42 }, // G5
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        // Warm sine + subtle harmonic
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.28, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // ARRAI Smart Soundbox Dual-Bell Ding (1046 Hz -> 1318 Hz)
  playHardwareSoundboxDing() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Tone 1: C6 (1046.5 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Tone 2: E6 (1318.5 Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.5, now + 0.12);
      gain2.gain.setValueAtTime(0.001, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.3, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.warn('Soundbox ding error:', e);
    }
  }

  // Keypad click tone for tactile UPI PIN
  playKeypadClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // ignore
    }
  }

  playClick() {
    this.playKeypadClick();
  }

  playPop() {
    this.playHardwareSoundboxDing();
  }

  playChime() {
    this.playSuccessChime();
  }

  // Natural Human Soundbox Voice Announcement (Hindi / English)
  announceSoundbox(amount: number, language: 'hi' | 'en' = 'hi') {
    try {
      // 1. Play realistic hardware ding
      this.playHardwareSoundboxDing();

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      // Cancel any stuck speech
      window.speechSynthesis.cancel();

      setTimeout(() => {
        // Natural Indian Hindi & English phrasing
        const text = language === 'hi' 
          ? `अराई पे पर, ${amount} रुपये प्राप्त हुए! धन्यवाद!`
          : `Received rupees ${amount} on ARRAI Pay. Thank you!`;

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Natural human speech parameters
        utterance.rate = 0.94; // Calm, clear, deliberate cadence
        utterance.pitch = 1.02; // Warm, natural vocal pitch
        utterance.volume = 1.0;

        if (this.voices.length === 0) {
          this.voices = window.speechSynthesis.getVoices();
        }

        if (language === 'hi') {
          utterance.lang = 'hi-IN';
          // Find natural Hindi voice
          const naturalHindiVoice = this.voices.find(v => 
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.includes('Hindi') ||
            v.name.includes('Swara') ||
            v.name.includes('Lekha') ||
            v.name.includes('Kalpana') ||
            v.name.includes('Google हिन्दी')
          );
          if (naturalHindiVoice) {
            utterance.voice = naturalHindiVoice;
          }
        } else {
          utterance.lang = 'en-IN';
          // Find Indian English or smooth natural voice
          const naturalIndianVoice = this.voices.find(v => 
            v.lang === 'en-IN' ||
            v.name.includes('India') ||
            v.name.includes('Neerja') ||
            v.name.includes('Heera') ||
            v.name.includes('Kavya') ||
            v.name.includes('Prabhat')
          ) || this.voices.find(v => v.lang.startsWith('en'));
          if (naturalIndianVoice) {
            utterance.voice = naturalIndianVoice;
          }
        }

        window.speechSynthesis.speak(utterance);
      }, 480);
    } catch (e) {
      console.warn('Soundbox speech synthesis error:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
