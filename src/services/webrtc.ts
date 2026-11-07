/**
 * ARRAI SuperApp WebRTC & Audio VoIP Calling Engine
 * Real WebRTC MediaStream audio, AudioContext analysis, and VoIP tone generation
 */

export interface CallAudioState {
  isCalling: boolean;
  isMuted: boolean;
  audioLevel: number;
}

class WebRtcVoiceService {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private ringToneOsc: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;
  private animationFrameId: number | null = null;
  private onLevelCallback: ((level: number) => void) | null = null;

  /**
   * Start outgoing call: play ringback tone and request real microphone stream
   */
  async startCall(onAudioLevel?: (level: number) => void): Promise<{ success: boolean; hasMic: boolean }> {
    this.onLevelCallback = onAudioLevel || null;
    let hasMic = false;

    // 1. Play ringing tone
    this.playRingTone();

    // 2. Request user microphone via WebRTC getUserMedia
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true, 
            noiseSuppression: true, 
            autoGainControl: true 
          } 
        });
        hasMic = true;

        // Initialize AudioContext to visualize real microphone levels
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
          }

          const source = this.audioContext.createMediaStreamSource(this.mediaStream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 64;
          source.connect(this.analyser);

          // Stop ringing after 2 seconds to simulate call answered
          setTimeout(() => {
            this.stopRingTone();
          }, 2000);

          this.startLevelMeter();
        }
      }
    } catch (err) {
      console.warn('Microphone access note (call proceeds in virtual VoIP mode):', err);
      // Auto stop ringing after 2.5 seconds
      setTimeout(() => {
        this.stopRingTone();
      }, 2500);
    }

    return { success: true, hasMic };
  }

  /**
   * Continuous level monitor for real-time waveform visualization
   */
  private startLevelMeter() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const checkLevel = () => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalizedLevel = Math.min(100, Math.round((avg / 128) * 100));

      if (this.onLevelCallback) {
        this.onLevelCallback(normalizedLevel);
      }

      this.animationFrameId = requestAnimationFrame(checkLevel);
    };

    this.animationFrameId = requestAnimationFrame(checkLevel);
  }

  /**
   * Synthesize classic Indian telecom ringback tone (400Hz + 450Hz cadence)
   */
  private playRingTone() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(400, ctx.currentTime);
      osc2.frequency.setValueAtTime(450, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ringToneOsc = { osc1, osc2, gain };
    } catch (e) {
      console.warn('Audio ringtone note:', e);
    }
  }

  /**
   * Stop ringback tone
   */
  private stopRingTone() {
    if (this.ringToneOsc) {
      try {
        this.ringToneOsc.osc1.stop();
        this.ringToneOsc.osc2.stop();
      } catch (e) {
        // Ignored
      }
      this.ringToneOsc = null;
    }
  }

  /**
   * Toggle mute microphone track
   */
  setMuted(muted: boolean): boolean {
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
      return muted;
    }
    return muted;
  }

  /**
   * End call: release microphone, cancel animation frames, close audio contexts
   */
  endCall() {
    this.stopRingTone();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {
        // Ignored
      }
      this.audioContext = null;
    }

    this.analyser = null;
    this.onLevelCallback = null;
  }
}

export const webrtcService = new WebRtcVoiceService();
