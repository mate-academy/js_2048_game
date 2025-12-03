/**
 * Sound class for play the mp3 files, used Web Audio API
 * Singleton
 */
export class Sound {
  /**
   * Instance of Sound class
   * @type {Sound}
   */
  static #instance = null;

  /**
   * Browser audio context
   * @type {AudioContext||webkitAudioContext}
   */
  static #context = null;

  /**
   * Audio buffer source node
   * @type {AudioBufferSourceNode}
   */
  static #currentSourceNode = null;

  /**
   * Array buffer
   * @type {ArrayBuffer}
   */
  static #audioBuffer = null;

  constructor() {
    if (Sound.#instance) {
      return Sound.#instance;
    }

    Sound.#context = new (window.AudioContext || window.webkitAudioContext)();

    Sound.#instance = this;
  }

  /**
   * Get singleton of class
   *
   * @return {null}
   */
  static getInstance() {
    if (!Sound.#instance) {
      Sound.#instance = new Sound();
    }

    return Sound.#instance;
  }

  /**
   * Open audio file and play it
   * @param {string} url - URL of audio file
   * @param {boolean} [loop=false] - loop on/off
   */
  static async play(url, loop = false) {
    // be sure that we intialized the context of singleton
    Sound.getInstance();

    // check context and resume
    if (Sound.#context.state === 'suspended') {
      await Sound.#context.resume();
    }

    // stop previous sound if it is playing
    Sound.stop();

    // load and decode audio
    if (Sound.#audioBuffer === null || url !== Sound.#audioBuffer.url) {
      /**
       * await to get the music file
       * @type {Response}
       */
      const resp = await fetch(url);

      /**
       * await to get it as an array buffer
       * @type {ArrayBuffer}
       */
      const arrayBuffer = await resp.arrayBuffer();

      /**
       * await to decode audio data
       * @type {AudioBuffer}
       */
      const decodedBuffer = await Sound.#context.decodeAudioData(arrayBuffer);

      // initialize class audio buffer
      Sound.#audioBuffer = decodedBuffer;

      // preserve url for reuse data
      Sound.#audioBuffer.url = url;
    }

    // Create audio source from buffer and start playing
    /**
     * audio source
     * @type {AudioBufferSourceNode}
     */
    const source = Sound.#context.createBufferSource();

    source.buffer = Sound.#audioBuffer;
    source.loop = loop;
    source.connect(Sound.#context.destination);

    // keep link to current source node
    Sound.#currentSourceNode = source;

    // start play
    source.start(0);
  }

  /**
   * Stop current play
   */
  static stop() {
    if (Sound.#currentSourceNode) {
      try {
        Sound.#currentSourceNode.stop();
      } catch (e) {
        // just for skip error if audio is already stopped
      }
      Sound.#currentSourceNode = null;
    }
  }

  /**
   * Beep sound
   * @param freq
   * @param duration
   */
  static beep(freq = 600, duration = 0.08) {
    // be sure that we intialized the context of singleton
    Sound.getInstance();

    try {
      const ctx = Sound.#context;
      const o = ctx.createOscillator();
      const g = ctx.createGain();

      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      o.start(now);
      o.stop(now + duration + 0.02);
    } catch {
      // noop
    }
  }
}
