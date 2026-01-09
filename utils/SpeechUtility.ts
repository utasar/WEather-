/**
 * SpeechUtility.ts
 * Voice synthesis functionality for Nova AI Life Assistant
 * Uses the Web Speech API to read aloud mantras and greetings
 */

export class SpeechUtility {
  private static synthesis: SpeechSynthesis | null = null;

  /**
   * Initialize speech synthesis
   */
  static init(): void {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
    }
  }

  /**
   * Speak the given text using the Speech Synthesis API
   * @param text - The text to speak
   * @param options - Optional speech options
   */
  static speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voice?: SpeechSynthesisVoice;
    }
  ): void {
    if (!this.synthesis) {
      this.init();
    }

    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    if (options) {
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.voice) utterance.voice = options.voice;
    }

    // Default values for pleasant speech
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;

    this.synthesis.speak(utterance);
  }

  /**
   * Stop any ongoing speech
   */
  static stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Get available voices
   */
  static getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) {
      this.init();
    }
    return this.synthesis?.getVoices() ?? [];
  }

  /**
   * Check if speech synthesis is supported
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}
