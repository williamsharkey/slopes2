/* Slopes2 Audio Engine — Raga / Cosmic Modal / Aleatoric Synthesis World
 *
 * Combines:
 *  - Original 2018 pi-shift microtonal terrain oscillator & Paul Kellet pink noise
 *  - ghosts.garden MONO·B / 24dB dual-biquad resonant ladder bass with
 *    continuous PeriodicWave morphing (saw -> square -> narrowing pulse),
 *    sub-octave square, tanh soft-clipping drive, accent, and raga meend glide
 *  - Classical ascending/descending ragas with analog percussion & Bessel-mode pitched tabla
 *  - Cosmic modal chord progressions, 3-voice ensemble string pads, and space-delay arpeggiators
 *  - Aleatoric micro-harp cascades, wandering parameter LFOs,
 *    and organic 8-bar / 16-bar build-and-breakdown arrangement arcs.
 */
(function () {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const nz = () => Math.random() * 2 - 1;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // Perceptual equal-loudness attenuation so higher pitches never sound piercing
  function pitchAtten(freq) {
    if (freq <= 210) return 1.0;
    const roll = Math.pow(210 / freq, 0.88);
    const earNotch = freq > 650 ? Math.pow(650 / freq, 0.5) : 1.0;
    return Math.max(0.05, roll * earNotch);
  }

  // ============================================================================
  // RAGA & COSMIC MODAL WORLDS
  // Each world defines:
  //  - name: displayed in HUD / TE-307 OLED
  //  - intervals: terrain-contour microtonal/modal intervals for original pi-shift voice
  //  - midiRoot: base tonic MIDI note (around D3..G3)
  //  - arohana: ascending raga scale intervals (semitones from tonic)
  //  - avarohana: descending raga scale intervals
  //  - vadi / samvadi: primary & secondary gravitational scale degrees (index in arohana)
  //  - progressions: array of 4-chord harmonic movements (each chord is { rootOffset, tones, vowel, bassMode })
  // ============================================================================
  const RAGA_WORLDS = [
    {
      name: "RAGA YAMAN // COSMIC",
      intervals: [-12, -10, -8, -5, -3, -1, 0, 2, 4, 6, 7],
      midiRoot: 58, // Bb3 / Bb1 bass
      arohana: [0, 2, 4, 6, 7, 9, 11, 12],   // Kalyan/Lydian: Ni Re Ga Ma# Dha Ni Sa
      avarohana: [12, 11, 9, 7, 6, 4, 2, 0],
      vadi: 2,    // Ga (major 3rd)
      samvadi: 6, // Ni (major 7th)
      chord: [0, 4, 7, 11, 14, 18],
      progressions: [
        // I(maj9#11) -> II7/I (Lydian lift) -> vim9 -> V7sus4 (Cosmic horizon)
        [
          { root: 0,  tones: [0, 4, 7, 11, 14, 18], vowel: "a" },
          { root: 2,  tones: [2, 6, 9, 12, 16, 19], vowel: "o" },
          { root: -3, tones: [-3, 0, 4, 7, 11, 14], vowel: "u" },
          { root: -5, tones: [-5, 0, 2, 7, 9, 14],  vowel: "a" },
        ],
        // Imaj7 -> VII/I -> IVmaj7#11 -> V6/9 (Floating modal arc)
        [
          { root: 0,  tones: [0, 4, 7, 11, 14],     vowel: "o" },
          { root: -1, tones: [-1, 2, 7, 11, 14],    vowel: "a" },
          { root: 6,  tones: [6, 9, 13, 16, 18],    vowel: "u" },
          { root: 7,  tones: [7, 11, 14, 16, 21],   vowel: "a" },
        ],
      ],
    },
    {
      name: "RAGA BHAIRAV // DAWN",
      intervals: [-12, -11, -8, -7, -5, -4, -1, 0, 1, 4, 7],
      midiRoot: 60, // C
      arohana: [0, 1, 4, 5, 7, 8, 11, 12],   // Double harmonic: Sa re Ga Ma Pa dha Ni Sa
      avarohana: [12, 11, 8, 7, 5, 4, 1, 0],
      vadi: 5,    // dha (flat 6th)
      samvadi: 1, // re (flat 2nd)
      chord: [0, 4, 7, 11, 13, 17],
      progressions: [
        // Raga Bhairav pulse: I -> bII(maj7) -> fm6/I -> V7(b9)
        [
          { root: 0,  tones: [0, 4, 7, 11, 13],     vowel: "a" },
          { root: 1,  tones: [1, 5, 8, 12, 16],     vowel: "o" },
          { root: 5,  tones: [5, 8, 12, 14, 17],    vowel: "u" },
          { root: 7,  tones: [7, 11, 14, 17, 20],   vowel: "a" },
        ],
        // Chromatic mediant trance: I -> bVImaj7 -> iv -> Vsus4 -> V
        [
          { root: 0,  tones: [0, 4, 7, 12, 16],     vowel: "o" },
          { root: -4, tones: [-4, 0, 3, 7, 12],     vowel: "u" },
          { root: 5,  tones: [5, 8, 12, 17],        vowel: "a" },
          { root: 7,  tones: [7, 11, 13, 17, 19],   vowel: "o" },
        ],
      ],
    },
    {
      name: "RAGA BAGESHRI // NIGHT",
      intervals: [-12, -10, -9, -7, -5, -3, -2, 0, 2, 3, 7],
      midiRoot: 57, // A
      arohana: [0, 2, 3, 5, 9, 10, 12],      // Dorian hexatonic/heptatonic night raga
      avarohana: [12, 10, 9, 7, 5, 3, 2, 0],
      vadi: 3,    // Ma (4th)
      samvadi: 0, // Sa (root)
      chord: [0, 3, 7, 10, 14, 17],
      progressions: [
        // Cosmic Dorian progression: i9 -> IV9 -> bVIImaj9 -> III6/9
        [
          { root: 0,  tones: [0, 3, 7, 10, 14, 17], vowel: "o" },
          { root: 5,  tones: [5, 9, 12, 15, 19],    vowel: "a" },
          { root: -2, tones: [-2, 2, 5, 9, 12],     vowel: "u" },
          { root: 3,  tones: [3, 7, 10, 14, 17],    vowel: "a" },
        ],
        // Deep hypnotic cycle: i7 -> v9 -> bVI6/9 -> bVII9sus4
        [
          { root: 0,  tones: [0, 3, 7, 10, 14],     vowel: "u" },
          { root: 7,  tones: [7, 10, 14, 17, 21],   vowel: "o" },
          { root: -4, tones: [-4, 0, 3, 7, 10],     vowel: "a" },
          { root: -2, tones: [-2, 3, 5, 10, 14],    vowel: "o" },
        ],
      ],
    },
    {
      name: "RAGA MALKAUNS // DEEP",
      intervals: [-12, -9, -7, -4, -2, 0, 3, 5, 8, 10],
      midiRoot: 55, // G
      arohana: [0, 3, 5, 8, 10, 12],         // Ancient midnight pentatonic: Sa ga Ma dha ni Sa
      avarohana: [12, 10, 8, 5, 3, 0],
      vadi: 2,    // Ma (4th)
      samvadi: 0, // Sa (root)
      chord: [0, 3, 5, 8, 10, 15],
      progressions: [
        // Midnight suspended modal shift: i(add4) -> bVImaj9 -> iv7 -> bVII11
        [
          { root: 0,  tones: [0, 3, 5, 10, 15],     vowel: "u" },
          { root: -4, tones: [-4, 0, 3, 7, 10],     vowel: "o" },
          { root: 5,  tones: [5, 8, 12, 15, 17],    vowel: "a" },
          { root: -2, tones: [-2, 3, 5, 8, 12],     vowel: "u" },
        ],
        // Subterranean ascent: i -> bIII(add9) -> iv9 -> bVImaj7
        [
          { root: 0,  tones: [0, 5, 8, 10, 15],     vowel: "o" },
          { root: 3,  tones: [3, 8, 10, 15, 17],    vowel: "a" },
          { root: 5,  tones: [5, 8, 12, 15],        vowel: "u" },
          { root: 8,  tones: [8, 12, 15, 19],       vowel: "o" },
        ],
      ],
    },
    {
      name: "RAGA CHARUKESHI // SEA",
      intervals: [-12, -10, -8, -7, -5, -4, -2, 0, 2, 4, 5, 7],
      midiRoot: 58, // Bb
      arohana: [0, 2, 4, 5, 7, 8, 10, 12],   // Major lower tetrachord + minor upper tetrachord (Mixolydian b6)
      avarohana: [12, 10, 8, 7, 5, 4, 2, 0],
      vadi: 4,    // Pa (5th)
      samvadi: 0, // Sa (root)
      chord: [0, 4, 7, 10, 14, 17],
      progressions: [
        // Bittersweet coastal sunset: I9 -> iv(maj7)/I -> bVImaj7#11 -> bVII9
        [
          { root: 0,  tones: [0, 4, 7, 10, 14],     vowel: "a" },
          { root: 5,  tones: [5, 8, 12, 16, 19],    vowel: "u" },
          { root: -4, tones: [-4, 0, 4, 7, 10],     vowel: "o" },
          { root: -2, tones: [-2, 2, 5, 8, 12],     vowel: "a" },
        ],
        // Cinematic major/minor interplay: I -> Vm9 -> bVI6/9 -> iv6
        [
          { root: 0,  tones: [0, 4, 7, 12, 16],     vowel: "o" },
          { root: 7,  tones: [7, 10, 14, 17, 21],   vowel: "u" },
          { root: 8,  tones: [8, 12, 15, 19],       vowel: "a" },
          { root: 5,  tones: [5, 8, 12, 14, 17],    vowel: "o" },
        ],
      ],
    },
    {
      name: "PI-SHIFT // HORIZON",
      intervals: [-12, -8.5, -18.5, -22, -5, 0, 3.5],
      midiRoot: 56, // Ab
      arohana: [0, 2, 4, 7, 9, 11, 12],      // Luminous major/pentatonic suspension
      avarohana: [12, 11, 9, 7, 4, 2, 0],
      vadi: 4,    // 5th
      samvadi: 1, // 2nd (9th)
      chord: [0, 4, 7, 11, 14, 19],
      progressions: [
        // Suspended cascade: Imaj9 -> IVmaj7/I -> vi11 -> V6/4
        [
          { root: 0,  tones: [0, 2, 7, 11, 14, 19], vowel: "a" },
          { root: 5,  tones: [5, 9, 12, 16, 19],    vowel: "o" },
          { root: -3, tones: [-3, 2, 4, 7, 11, 14], vowel: "u" },
          { root: 7,  tones: [7, 11, 14, 16, 21],   vowel: "a" },
        ],
        // Endless horizon: Imaj9 -> bVIImaj9 (Mixolydian shift) -> IVadd9 -> Vsus4
        [
          { root: 0,  tones: [0, 4, 7, 11, 14],     vowel: "o" },
          { root: -2, tones: [-2, 2, 5, 9, 12],     vowel: "a" },
          { root: 5,  tones: [5, 7, 12, 16, 19],    vowel: "u" },
          { root: 7,  tones: [7, 12, 14, 19],       vowel: "a" },
        ],
      ],
    },
  ];

  let scaleIdx = 0;
  let ctx = null;
  let master = null;
  let warmFilterNode = null;
  let soloBus = null;
  let soloFilterNode = null;
  let soloReverbSend = null;
  let closedEyeActive = false;
  let closedEyeSoloStep = 0;
  let delay = null;
  let delayFeedbackNode = null;
  let delayFilterNode = null;
  let reverb = null;
  let reverbOutNode = null;
  let pinkBuffer = null;
  let noiseBuffer = null;
  let volume = 0.8;
  let muted = false;
  const bufCache = new Map();

  // ============================================================================
  // GHOSTS.GARDEN PERIODIC WAVE & TANH LADDER BASS TABLES
  // Ported from ghosts-garden/src/audio.js & garden-panel-bass.js
  // ============================================================================
  const NH = 64;
  let _waveCtx = null;
  let _sqWave = null;
  let _bassWaves = null;
  let _tanhCurve = null;

  function makeWave(c, fn) {
    const real = new Float32Array(NH + 1);
    const imag = new Float32Array(NH + 1);
    for (let k = 1; k <= NH; k++) {
      const r = fn(k);
      if (typeof r === "number") imag[k] = r;
      else {
        real[k] = r[0];
        imag[k] = r[1];
      }
    }
    return c.createPeriodicWave(real, imag, { disableNormalization: false });
  }

  function sqWave(c) {
    if (_waveCtx !== c) {
      _waveCtx = c;
      _sqWave = null;
      _bassWaves = null;
    }
    return (_sqWave ||= makeWave(c, (k) => (k & 1 ? 1 / k : 0)));
  }

  // Morphs continuously from Sawtooth (q=0) -> Square (q=0.5) -> Narrow Pulse (q=1.0)
  function morphDuty(q) {
    return q <= 0.5 ? 0.5 : 0.5 - (q - 0.5) * 0.84;
  }

  function bassWaveOf(c, q) {
    if (_waveCtx !== c) {
      _waveCtx = c;
      _sqWave = null;
      _bassWaves = null;
    }
    if (!_bassWaves) {
      _bassWaves = Array.from({ length: 33 }, (_, i) => {
        const m = i / 32;
        const evenMix = Math.max(0, 1 - m * 2);
        const d = morphDuty(m);
        return makeWave(c, (k) => {
          if (m <= 0.5) return (k & 1 ? 1 : evenMix) / k;
          return (Math.sin(k * Math.PI * d) / k) * (k & 1 ? 1 : 1 - (m - 0.5) * 0.4);
        });
      });
    }
    return _bassWaves[Math.round(clamp(q, 0, 1) * 32)];
  }

  function tanhCurve(c) {
    if (_tanhCurve) return _tanhCurve;
    const N = 1024;
    _tanhCurve = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = (i * 2) / (N - 1) - 1;
      _tanhCurve[i] = Math.tanh(x * 3.2);
    }
    return _tanhCurve;
  }

  // Filter resonance & drive helpers from garden-panel-bass.js
  const resQ = (r) => 0.7 + Math.pow(r, 2.1) * 11.5;
  const resComp = (r) => 1 + Math.pow(r, 1.6) * 1.1;
  const drvGain = (d) => 0.45 + d * 3.2;

  let iosUnlocked = false;

  // ============================================================================
  // AUDIO CONTEXT & EFFECTS BUS SETUP
  // ============================================================================
  function ensureCtx() {
    if (ctx) return ctx;
    if (!iosUnlocked) return null;
    if (typeof AudioContext === "undefined") return null;
    try {
      ctx = new AudioContext({ latencyHint: "interactive" });
    } catch (e) {
      ctx = new AudioContext();
    }
    master = ctx.createGain();
    master.gain.value = muted ? 0 : volume;

    // Warm master lowpass / high-shelf rolloff + soft limiter
    const warmFilter = ctx.createBiquadFilter();
    warmFilter.type = "lowpass";
    warmFilter.frequency.value = 2550;
    warmFilter.Q.value = 0.68;
    warmFilterNode = warmFilter;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -13;
    comp.knee.value = 10;
    comp.ratio.value = 3.8;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;

    master.connect(warmFilter);
    warmFilter.connect(comp);
    comp.connect(ctx.destination);

    // Dedicated Closed-Eye Soul Solo Bus: bypasses the muffled world lowpass filter
    // (`warmFilter`) when eyes are closed so the quiet, luminous solo melody shines
    // clearly above the filtered-down song with intimate velvet warmth!
    soloBus = ctx.createGain();
    soloBus.gain.value = muted ? 0 : volume;
    soloFilterNode = ctx.createBiquadFilter();
    soloFilterNode.type = "lowpass";
    soloFilterNode.frequency.value = 3100;
    soloFilterNode.Q.value = 0.62;
    soloBus.connect(soloFilterNode);
    soloFilterNode.connect(comp);

    // Stereo dotted-eighth cosmic feedback delay (Lindstrøm space echo)
    delay = ctx.createDelay(2.0);
    delay.delayTime.value = 0.375; // Dotted 8th at ~120 BPM
    const fb = ctx.createGain();
    fb.gain.value = 0.41;
    delayFeedbackNode = fb;
    const dlp = ctx.createBiquadFilter();
    dlp.type = "lowpass";
    dlp.frequency.value = 2100;
    delayFilterNode = dlp;
    const dhp = ctx.createBiquadFilter();
    dhp.type = "highpass";
    dhp.frequency.value = 180;
    const dOut = ctx.createGain();
    dOut.gain.value = 0.28;
    delay.connect(dlp);
    dlp.connect(dhp);
    dhp.connect(fb);
    fb.connect(delay);
    dhp.connect(dOut);
    dOut.connect(master);

    // Lush 2.5s stereo shimmer convolver reverb (from ghosts.garden/src/audio.js)
    const sr = ctx.sampleRate;
    const len = Math.floor(sr * 2.5);
    const ir = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.0) * 0.44;
      }
    }
    reverb = ctx.createConvolver();
    reverb.buffer = ir;
    const rOut = ctx.createGain();
    rOut.gain.value = 0.35;
    reverbOutNode = rOut;
    reverb.connect(rOut);
    rOut.connect(master);

    // Dedicated cathedral/starlight reverb return for the Closed-Eye Soul Solo Bus
    const soloRevOut = ctx.createGain();
    soloRevOut.gain.value = 0.48;
    soloReverbSend = ctx.createConvolver();
    soloReverbSend.buffer = ir;
    soloReverbSend.connect(soloRevOut);
    if (soloFilterNode) soloRevOut.connect(soloFilterNode);

    // Pre-generate 2s of Paul Kellet pink noise
    const pLen = sr * 2;
    pinkBuffer = ctx.createBuffer(1, pLen, sr);
    const pd = pinkBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < pLen; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      pd[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    noiseBuffer = ctx.createBuffer(1, sr, sr);
    const nd = noiseBuffer.getChannelData(0);
    for (let i = 0; i < sr; i++) nd[i] = Math.random() * 2 - 1;

    return ctx;
  }

  function unlock() {
    if (!iosUnlocked) {
      iosUnlocked = true;
      try {
        if (typeof navigator !== "undefined" && "audioSession" in navigator) {
          navigator.audioSession.type = "playback";
        }
      } catch (_) {}
      try {
        if (typeof Audio !== "undefined") {
          const sil = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
          sil.loop = true;
          sil.volume = 0.001;
          sil.play().catch(() => {});
        }
      } catch (_) {}
    }
    const c = ensureCtx();
    if (!c) return;
    if (c.state === "suspended") {
      c.resume().catch(() => {});
    }
  }

  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    const gestureUnlock = () => {
      unlock();
    };
    window.addEventListener("pointerdown", gestureUnlock, { capture: true, passive: true });
    window.addEventListener("keydown", gestureUnlock, { capture: true, passive: true });
    window.addEventListener("touchstart", gestureUnlock, { capture: true, passive: true });
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (master && ctx) {
      const mVol = muted ? 0 : (closedEyeActive ? volume * 0.46 : volume);
      master.gain.setTargetAtTime(mVol, ctx.currentTime, 0.08);
    }
    if (soloBus && ctx) {
      soloBus.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.08);
    }
  }

  function setMuted(m) {
    muted = !!m;
    if (master && ctx) {
      const mVol = muted ? 0 : (closedEyeActive ? volume * 0.46 : volume);
      master.gain.setTargetAtTime(mVol, ctx.currentTime, 0.05);
    }
    if (soloBus && ctx) {
      soloBus.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.05);
    }
  }

  // Smoothly transition into or out of the Closed-Eye Sylvia Plath state:
  //  - Filters the main song (`warmFilterNode`) down to a warm, muffled 295 Hz nocturnal cushion
  //  - Awakens the quiet, soul-guiding solo melody in the exact key & chord of the current song
  function setClosedEyeState(isClosed) {
    const next = !!isClosed;
    const changed = next !== closedEyeActive;
    closedEyeActive = next;
    if (ctx && ctx.state === "running") {
      updateMasterBusContinuously();
      if (changed && closedEyeActive && !muted) {
        // Trigger an immediate gentle welcoming grace-note chord & solo phrase as eyes close
        const sc = getLiveSonicContext();
        triggerClosedEyeSoulSoloStep(0, sc.raga, sc.chordObj, ctx.currentTime + 0.02);
      }
    }
  }

  // ============================================================================
  // PHYSICAL MODELLING DSP KIT (Ported from ghosts.garden & midigarden Bele)
  //  - garden-gnome-voices.js: pulse(), modes() complex rotators with glide (g0->g1),
  //    late bloom (att), vibrato (vib), pair() beating modes, Bessel membrane(),
  //    free-bar bending modes BAR, PhISEM stochastic particle collisions (events + grains),
  //    rbj biquad bq(), dcblock, and soft tanh knee.
  //  - midigarden BeleMarimba.h: 4-mode Chladni tuned rosewood bar (1 : 3.99 : 9.2 : 16.1)
  //  - midigarden BeleElectricPiano.h + archive/beautiful_bell.pd: 6-mode cantilever
  //    tine/reed/bell with explicit pickup harmonics & stereo tremolo
  // ============================================================================
  function makeRng(seed) {
    let a = (seed >>> 0) || 1;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Raised-cosine contact excitation of T seconds, normalized to area 1
  function contactPulse(sr, T, skew = false) {
    const n = Math.max(1, Math.round(T * sr));
    const e = new Float32Array(n + 1);
    let s = 0;
    for (let i = 0; i <= n; i++) {
      const x = (i + 0.5) / (n + 1);
      const v = skew
        ? Math.pow(Math.sin( Math.PI * Math.pow(x, 0.6)), 2)
        : 0.5 - 0.5 * Math.cos(TAU * x);
      e[i] = v;
      s += v;
    }
    for (let i = 0; i <= n; i++) e[i] /= s || 1;
    return e;
  }

  // Complex rotator modal bank (from ghosts-garden/src/garden-gnome-voices.js)
  // Each mode: { f, a, t (T60 s), g0?, g1?, gt? (pitch glide), att? (bloom), vib?, vr?, d? (delay s) }
  function runComplexModes(dst, exc, list, sr, off0 = 0) {
    const N = dst.length;
    const E = exc.length;
    const expanded = [];
    for (const m of list) {
      if (m.att && !m.g0 && !m.vib) {
        const k = 6.907755 / Math.max(0.003, m.t);
        expanded.push(
          { f: m.f, a: m.a, t: m.t, d: m.d },
          { f: m.f, a: -m.a, t: 6.907755 / (k + 1 / m.att), d: m.d }
        );
      } else {
        expanded.push(m);
      }
    }
    for (const m of expanded) {
      const f = m.f;
      const a = m.a;
      if (!(f > 8) || !a || f > sr * 0.45) continue;
      const t60 = Math.max(0.003, m.t);
      const r = Math.exp(-6.907755 / (t60 * sr));
      const off = off0 + Math.round((m.d || 0) * sr);
      const len = Math.min(N - off, Math.ceil(t60 * sr * 1.35) + E);
      if (len <= 0) continue;
      let zr = 0;
      let zi = 0;
      if (!m.g0 && !m.att && !m.vib) {
        const w = (TAU * f) / sr;
        const c = r * Math.cos(w);
        const s = r * Math.sin(w);
        for (let n = 0; n < len; n++) {
          const x = n < E ? exc[n] : 0;
          const nr = zr * c - zi * s + x;
          zi = zr * s + zi * c;
          zr = nr;
          dst[off + n] += a * zi;
        }
      } else {
        const g0 = m.g0 || 1;
        const g1 = m.g1 || 1;
        const gk = m.gt ? Math.exp(-1 / (m.gt * sr)) : 0;
        const ak = m.att ? Math.exp(-1 / (m.att * sr)) : 0;
        let gd = g0 - g1;
        let ae = 1;
        let c = 0;
        let s = 0;
        const vib = m.vib || 0;
        const vr = (TAU * (m.vr || 5.2)) / sr;
        for (let n = 0; n < len; n++) {
          if ((n & 31) === 0) {
            const ff = f * (g1 + gd) * (vib ? 1 + vib * Math.sin(vr * n) : 1);
            const w = (TAU * Math.min(ff, sr * 0.45)) / sr;
            c = r * Math.cos(w);
            s = r * Math.sin(w);
          }
          gd *= gk || 0;
          if (gk === 0) gd = 0;
          const x = n < E ? exc[n] : 0;
          const nr = zr * c - zi * s + x;
          zi = zr * s + zi * c;
          zr = nr;
          let v = a * zi;
          if (ak) {
            ae *= ak;
            v *= 1 - ae;
          }
          dst[off + n] += v;
        }
      }
    }
    return dst;
  }

  // Split mode pair for organic beating (ombak / singing bowl / bell)
  function modePair(f, a, t, df, bal = 0.5) {
    return [
      { f: f - df / 2, a: a * (1 - bal), t },
      { f: f + df / 2, a: a * bal, t: t * 0.97 },
    ];
  }

  // In-place RBJ Biquad filter on Float32Array
  function applyBiquad(x, type, f, q, sr, db = 0) {
    const w = (TAU * clamp(f, 12, sr * 0.46)) / sr;
    const cs = Math.cos(w);
    const sn = Math.sin(w);
    const al = sn / (2 * (q || 0.707));
    const Aa = Math.pow(10, db / 40);
    let b0, b1, b2, a0, a1, a2;
    if (type === "lp") {
      b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0;
      a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
    } else if (type === "hp") {
      b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0;
      a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
    } else if (type === "bp") {
      b0 = al; b1 = 0; b2 = -al;
      a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
    } else {
      b0 = 1 + al * Aa; b1 = -2 * cs; b2 = 1 - al * Aa;
      a0 = 1 + al / Aa; a1 = -2 * cs; a2 = 1 - al / Aa;
    }
    b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) {
      const x0 = x[i];
      const y = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = x0; y2 = y1; y1 = y;
      x[i] = y;
    }
    return x;
  }

  // PhISEM stochastic particle collisions (from ghosts-garden/src/garden-gnome-voices.js)
  function phisemGrains(sr, sec, rateFn, groups, clickT = 0.0005, seed = 101) {
    const R = makeRng(seed);
    const len = Math.max(1, Math.round(sec * sr));
    const out = new Float32Array(len);
    const ex = groups.map(() => new Float32Array(len));
    const cl = Math.max(2, Math.round(clickT * sr));
    const dt = 1 / 2000;
    for (let t = 0; t < sec; t += dt) {
      if (R() < rateFn(t) * dt) {
        const evT = t + R() * dt;
        const a = 0.35 + 0.65 * R();
        const gi = Math.floor(R() * groups.length);
        const e = ex[gi];
        const i0 = Math.round(evT * sr);
        for (let i = 0; i < cl && i0 + i < e.length; i++) {
          e[i0 + i] += (R() * 2 - 1) * a * (1 - i / cl);
        }
      }
    }
    groups.forEach((gr, gi) => runComplexModes(out, ex[gi], gr, sr));
    return out;
  }

  // Circular Bessel membrane modes (from ghosts-garden/src/garden-gnome-voices.js)
  const BESSEL_MODES = [
    [0, 2.405], [1, 3.832], [2, 5.136], [0, 5.520], [3, 6.380],
    [1, 7.016], [4, 7.588], [2, 8.417], [0, 8.654], [5, 8.771],
  ];
  function besselJ(m, x) {
    let s = 0;
    const Q = 28;
    for (let i = 0; i < Q; i++) {
      const t = ((i + 0.5) * Math.PI) / Q;
      s += Math.cos(m * t - x * Math.sin(t));
    }
    return s / Q;
  }
  function besselMembrane(f01, strikePos, o = {}) {
    const out = [];
    const st = o.st || 1;
    const dk = o.dk === undefined ? 1 : o.dk;
    const rad = o.rad || [1, 0.62, 0.45, 0.35];
    for (const [m, j] of BESSEL_MODES.slice(0, o.max || 8)) {
      const ratio = Math.pow(j / 2.405, st);
      const f = f01 * ratio;
      const a = besselJ(m, j * clamp(strikePos, 0, 0.98)) * rad[Math.min(m, rad.length - 1)];
      if (Math.abs(a) < 0.005) continue;
      const t = (o.t || 0.4) * Math.pow(ratio, -dk);
      const md = { f, a, t };
      if (o.glide) {
        md.g0 = o.glide.g0;
        md.g1 = 1;
        md.gt = o.glide.gt;
      }
      out.push(md);
      if (m > 0 && o.sp) out.push({ ...md, f: f * (1 + o.sp), a: a * 0.22 });
    }
    return out;
  }

  // Free-free bar bending modes (lithophone / log drum / xylophone)
  const BAR_RATIOS = [1, 2.756, 5.404, 8.933, 13.344];
  function barModeShape(n, x) {
    const k = [4.730, 7.853, 10.996, 14.137, 17.279][n] || (n + 1.5) * Math.PI;
    const kx = k * clamp(x, 0, 1);
    const s = (Math.cosh(k) - Math.cos(k)) / (Math.sinh(k) - Math.sin(k));
    return (Math.cosh(kx) + Math.cos(kx) - s * (Math.sinh(kx) + Math.sin(kx))) / 2;
  }

  function finishTake(d, sr, peak = 0.35, fadeInSamples = 24) {
    // One-pole 18 Hz DC blocker
    const R = Math.exp((-TAU * 18) / sr);
    let px = 0, py = 0;
    let maxAbs = 1e-9;
    for (let i = 0; i < d.length; i++) {
      const y = d[i] - px + R * py;
      px = d[i];
      py = y;
      d[i] = y;
      const a = Math.abs(y);
      if (a > maxAbs) maxAbs = a;
    }
    const g = peak / maxAbs;
    const knee = peak * 0.68;
    const room = Math.max(1e-5, peak - knee);
    const fl = Math.min(Math.round(sr * 0.025), Math.floor(d.length * 0.25));
    for (let i = 0; i < d.length; i++) {
      let v = d[i] * g;
      if (i < fadeInSamples) v *= i / fadeInSamples;
      if (i >= d.length - fl) {
        const u = (d.length - 1 - i) / fl;
        v *= 0.5 - 0.5 * Math.cos(Math.PI * u);
      }
      const a = Math.abs(v);
      if (a > knee) v = Math.sign(v) * (knee + room * Math.tanh((a - knee) / room));
      d[i] = v;
    }
    return d;
  }

  function playRendered(d, sendReverb, sendDelay, when, panVal = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const b = c.createBuffer(1, d.length, c.sampleRate);
    b.getChannelData(0).set(d);
    const src = c.createBufferSource();
    src.buffer = b;
    let outNode = src;
    if (c.createStereoPanner && Math.abs(panVal) > 0.01) {
      const pan = c.createStereoPanner();
      pan.pan.value = clamp(panVal, -1, 1);
      src.connect(pan);
      outNode = pan;
    }
    outNode.connect(master);
    if (sendReverb) outNode.connect(reverb);
    if (sendDelay) outNode.connect(delay);
    src.start(when || c.currentTime);
  }

  function playBufferCached(key, makeFn, gainVal, sendReverb, sendDelay, when, panVal = 0, rateVal = 1) {
    const c = ensureCtx();
    if (!c || muted) return;
    const fullKey = `${key}@${c.sampleRate}`;
    let buf = bufCache.get(fullKey);
    if (!buf) {
      const data = makeFn(c.sampleRate);
      if (Array.isArray(data)) {
        buf = c.createBuffer(2, data[0].length, c.sampleRate);
        buf.getChannelData(0).set(data[0]);
        buf.getChannelData(1).set(data[1]);
      } else {
        buf = c.createBuffer(1, data.length, c.sampleRate);
        buf.getChannelData(0).set(data);
      }
      if (bufCache.size > 160) bufCache.delete(bufCache.keys().next().value);
      bufCache.set(fullKey, buf);
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    if (rateVal !== 1 && src.playbackRate) {
      src.playbackRate.value = rateVal;
    }
    const g = c.createGain();
    g.gain.value = gainVal;
    src.connect(g);
    let outNode = g;
    if (c.createStereoPanner && Math.abs(panVal) > 0.01) {
      const pan = c.createStereoPanner();
      pan.pan.value = clamp(panVal, -1, 1);
      g.connect(pan);
      outNode = pan;
    }
    outNode.connect(master);
    if (sendReverb) outNode.connect(reverb);
    if (sendDelay) outNode.connect(delay);
    src.start(when || c.currentTime);
  }

  // ---- Live Harmonic, Style & Filter Context for Continuous SFX Adaptation ----
  // Every sound effect in the game queries `getLiveSonicContext()` so that every
  // footstep, dig, rock roll, build, tamp, crow call, portal shift, and switch click
  // is locked to the exact key, active chord, musical modality (Mode I..V),
  // continuous filter sweep, and swing timing currently playing!
  let lastStepSoundMs = 0;
  let stepVoiceToggle = 0;

  function getLiveSonicContext() {
    const raga = RAGA_WORLDS[scaleIdx] || RAGA_WORLDS[0];
    const prog = raga.progressions[progFamilyIdx % raga.progressions.length];
    const chordObj = prog[chordIdx % prog.length] || { root: 0, tones: [0, 4, 7, 11], vowel: "a" };
    const chordRootMidi = raga.midiRoot + (chordObj.root || 0);
    const tones = chordObj.tones && chordObj.tones.length ? chordObj.tones : raga.chord;
    const scale = ragaAscending ? raga.arohana : raga.avarohana;

    // Continuous normalized filter brightness (0..1) from the active modality's live sweep
    let filterNorm = 0.5 + 0.5 * Math.sin(lfoPhase * 0.53 + 1.4);
    if (modalityIdx === 2) {
      filterNorm = 0.5 - 0.5 * Math.cos((TAU * ((barCount % 16) + (step16 % 16) / 16)) / 16);
    } else if (modalityIdx === 4) {
      filterNorm = 0.5 + 0.5 * Math.sin(airdrawnPhase * 0.45);
    }
    const liveCutoffHz = clamp(520 + filterNorm * 2850, 480, 3600);
    const mov = BT_MOVEMENTS[btMovementIdx % BT_MOVEMENTS.length] || { weep: 0.65 };

    return {
      raga,
      chordObj,
      chordRootMidi,
      tones,
      scale,
      modalityIdx,
      btMovementIdx,
      arcPhaseIdx,
      filterNorm,
      liveCutoffHz,
      weep: mov.weep || 0.65,
      vowel: chordObj.vowel || "a",
    };
  }

  // Quantize any integer step/index to the currently sounding chord & key
  function quantizeToLiveHarmony(stepVal, preferChordTone = true, octOffset = 0) {
    const sc = getLiveSonicContext();
    const n = Math.round(stepVal || 0);
    if (preferChordTone && sc.tones && sc.tones.length > 0) {
      const idx = ((n % sc.tones.length) + sc.tones.length) % sc.tones.length;
      const oct = clamp(Math.floor(n / sc.tones.length) + octOffset, -1, 2);
      return clamp(sc.raga.midiRoot + sc.tones[idx] + oct * 12, 42, 80);
    }
    const arr = sc.scale || sc.raga.arohana;
    const idx = ((n % arr.length) + arr.length) % arr.length;
    const oct = clamp(Math.floor(n / arr.length) + octOffset, -1, 2);
    return clamp(sc.chordRootMidi + arr[idx] + oct * 12, 42, 80);
  }

  // Continuously adapt the master filter, stereo delay time/feedback, and reverb depth
  // to the current musical style (Mode I..V), swing map, and filter sweep!
  function updateMasterBusContinuously() {
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const sc = getLiveSonicContext();

    if (warmFilterNode) {
      if (closedEyeActive) {
        // When eyes are closed ("I shut my eyes and all the world drops dead"),
        // filter the main song down into a deep, velvet 295 Hz sanctuary cushion
        warmFilterNode.frequency.setTargetAtTime(295, now, 0.24);
        warmFilterNode.Q.setTargetAtTime(1.12, now, 0.24);
        if (master && !muted) {
          master.gain.setTargetAtTime(volume * 0.46, now, 0.24);
        }
      } else {
        const targetWarmHz =
          modalityIdx === 2
            ? 1450 + sc.filterNorm * 2200
            : modalityIdx === 4
            ? 1750 + sc.filterNorm * 1850
            : modalityIdx === 1
            ? 2750 + sc.filterNorm * 650
            : 2250 + sc.filterNorm * 650;
        warmFilterNode.frequency.setTargetAtTime(clamp(targetWarmHz, 900, 3800), now, 0.14);
        warmFilterNode.Q.setTargetAtTime(0.68, now, 0.14);
        if (master && !muted) {
          master.gain.setTargetAtTime(volume, now, 0.18);
        }
      }
    }
    if (delay && delayFeedbackNode && delayFilterNode) {
      const targetDelay =
        modalityIdx === 1
          ? clamp(0.24 + swingMapX * 0.16, 0.18, 0.44)
          : modalityIdx === 4
          ? 0.39
          : 0.375;
      delay.delayTime.setTargetAtTime(targetDelay, now, 0.09);
      const targetFb = modalityIdx === 4 ? 0.48 : modalityIdx === 3 ? 0.45 : 0.40;
      delayFeedbackNode.gain.setTargetAtTime(targetFb, now, 0.09);
      delayFilterNode.frequency.setTargetAtTime(clamp(1350 + sc.filterNorm * 1600, 1100, 3200), now, 0.09);
    }
    if (reverbOutNode) {
      const targetRev = modalityIdx === 4 ? 0.46 : modalityIdx === 3 ? 0.43 : modalityIdx === 1 ? 0.31 : 0.36;
      reverbOutNode.gain.setTargetAtTime(targetRev, now, 0.12);
    }
  }

  function createOscillator(note, decay, opts) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const nowMs = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dtMs = nowMs - lastStepSoundMs;
    // Gentle anti-fatigue rate softening when moving/digging rapidly
    const rapidAtten = dtMs < 42 ? 0.38 : dtMs < 85 ? 0.68 : 1.0;
    lastStepSoundMs = nowMs;

    updateMasterBusContinuously();
    const sc = getLiveSonicContext();
    const scaledNote = Math.round((note || 12) * 0.42);
    // Blend active chord root with scale degree so terrain contour always sings in the current chord & key!
    const midi = quantizeToLiveHarmony(scaledNote, (stepVoiceToggle & 1) === 0, 0);
    const freq = mtof(midi);

    const dur = clamp((decay || 680) / 1000, 0.18, 1.4);
    const baseVol = ((opts && opts.vol) || 0.125) * rapidAtten;
    const vol = baseVol * pitchAtten(freq);
    const variant = (stepVoiceToggle++) % 3;

    // Style-responsive harmonic layer: adapts the player's movement/terrain sound to the active Mode I..V!
    if (dtMs > 55) {
      if (sc.modalityIdx === 1) {
        // Mode II (Glitch & Bele Piano): soft Felt/Tine piano resonance in current chord
        playGardenPiano(midi + (variant === 0 ? 12 : 0), dur * 1.2, variant === 2 ? "TINE" : "FELT", baseVol * 0.55);
      } else if (sc.modalityIdx === 2) {
        // Mode III (Filter Phaser): vintage Rhodes/Wurlitzer electric piano + filter-swept shimmer
        playGardenPiano(midi, dur * 1.1, variant === 1 ? "REED" : "TINE", baseVol * 0.52);
      } else if (sc.modalityIdx === 3) {
        // Mode IV (Csound Modal Suite): weeping Csound fmtine / fmbell
        if (variant === 0) {
          playCsoundFmBell(midi + 12, dur * 1.4, sc.weep, baseVol * 0.48);
        } else {
          playCsoundFmTine(midi, dur * 1.2, sc.weep, baseVol * 0.52);
        }
      } else if (sc.modalityIdx === 4) {
        // Mode V (Progressive Breaks): plucked guitar harmonic + tine echo
        playGuitar(midi + (variant === 0 ? 12 : 0), dur * 1.5, baseVol * 0.58);
      } else if (variant === 0) {
        // Mode I (Raga // Cosmic): subtle Cosmic Arp overtone tracking live filterNorm
        playCosmicArp(midi + 12, dur * 0.5, baseVol * 0.42, sc.filterNorm);
      }
    }

    // BeleMarimba.h (1 : 3.99 : 9.2 : 16.1) + ghosts.garden kalimba/felt-piano hybrid
    const filtBucket = Math.round(sc.filterNorm * 4);
    const key = `beleMarimbaStep:${midi}:${variant}:${filtBucket}:${Math.round(dur * 10)}`;
    playBufferCached(
      key,
      (sr) => {
        const len = Math.floor(sr * (dur + 0.08));
        const d = new Float32Array(len);
        // BeleMarimba.h Chladni ratios & yarn/felt mallet parameters modulated by live song filterNorm
        const ratios = [1, 3.99, 9.2, 16.1];
        const baseW = [1.0, 0.48, 0.24, 0.11];
        const edge = 0.10 + sc.filterNorm * 0.22;
        const hard = 0.18 + sc.filterNorm * 0.24; // Brighter mallet as song filter opens
        const body = 0.62;
        const modeList = [];
        for (let k = 0; k < 4; k++) {
          const fk = freq * ratios[k];
          if (fk >= sr * 0.44) continue;
          const seconds = dur * (k === 0 ? 1.0 + body * 0.55 : 1.0 / (1.0 + k * (1.35 - hard * 0.5)));
          const coupling = k === 0 ? 1.0 - edge * 0.35 : (0.20 + edge * 0.75) * (0.22 + hard * 0.65);
          modeList.push({
            f: fk,
            a: baseW[k] * coupling,
            t: Math.max(0.02, seconds),
            g0: opts && opts.slide ? clamp(opts.slide, 0.5, 1.5) : undefined,
            g1: 1,
            gt: opts && opts.slide ? dur * 0.45 : undefined,
          });
        }
        // Subtle ghosts.garden kalimba tine & warm rosewood box body resonance tuned to key root!
        const rootHz = mtof(clamp(sc.chordRootMidi - 12, 38, 60));
        modeList.push(
          { f: freq * 1.0022, a: 0.24, t: dur * 0.72 },
          { f: freq * 2.0, a: 0.09, t: dur * 0.42 },
          { f: rootHz * 2, a: 0.16 * body, t: 0.065 },
          { f: rootHz * 3, a: 0.10 * body, t: 0.045 }
        );
        const exc = contactPulse(sr, 0.0014 + (1 - hard) * 0.0016);
        runComplexModes(d, exc, modeList, sr);
        // Resonator tube warmth tracking live song filter cutoff
        applyBiquad(d, "peak", Math.min(2200, freq * (0.9 + sc.filterNorm * 0.5)), 1.8, sr, 3.5);
        applyBiquad(d, "lp", sc.liveCutoffHz, 0.75, sr);
        return finishTake(d, sr, 0.75, 20);
      },
      vol,
      !!(opts && opts.reverb) || variant === 0 || sc.modalityIdx >= 3,
      !!(opts && opts.delay) || sc.modalityIdx === 4,
      0,
      rnd(-0.18, 0.18),
      rnd(0.997, 1.003)
    );
  }

  // ---- Upgraded noise(vol, decay, filterHz) ----
  // Replaces raw looped pink-noise bursts with ghosts.garden physical models tuned to the
  // live key, active chord root/5th, and continuous filter sweep (`getLiveSonicContext()`):
  //  - Long decay (>= 800ms): coastal surf & Minnaert water-bubble chirps tuned to chord tones
  //  - High vol (>= 0.12): subterranean troll-stomp / packed-earth thud + harmonic rubble grains
  //  - Short/soft: delicate moss/sand brush footstep with PhISEM seed grains in current key
  function noise(vol, decay, filterHz) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    updateMasterBusContinuously();
    const sc = getLiveSonicContext();
    const durMs = decay || 400;
    const v = clamp(vol || 0.08, 0.01, 0.45);
    const rootMidi = clamp(sc.chordRootMidi, 46, 68);
    const rootHz = mtof(rootMidi);
    const subHz = mtof(rootMidi - 12);
    const filtBucket = Math.round(sc.filterNorm * 3);

    if (durMs >= 800) {
      // Coastal tide surf & Minnaert bubble chirps tuned to the active chord!
      const key = `surfWater:${rootMidi}:${filtBucket}`;
      playBufferCached(
        key,
        (sr) => {
          const sec = 0.95;
          const out = new Float32Array(Math.round(sec * sr));
          const R = makeRng(rootMidi * 131 + filtBucket * 17);
          for (let i = 0; i < out.length; i++) {
            const u = i / out.length;
            const env = Math.sin(Math.PI * u) * Math.pow(1 - u * 0.6, 1.4);
            out[i] = (R() * 2 - 1) * env * 0.22;
          }
          applyBiquad(out, "bp", filterHz || clamp(rootHz * 3, 520, 1400), 0.9, sr);
          applyBiquad(out, "lp", clamp(sc.liveCutoffHz * 0.78, 950, 2400), 0.7, sr);
          // Minnaert water bubbles pitched to harmonic chord intervals!
          const exc = contactPulse(sr, 0.00035);
          const bubbles = [];
          for (let b = 0; b < 7; b++) {
            const semi = sc.tones[b % sc.tones.length];
            const bf = clamp(mtof(sc.raga.midiRoot + 12 + semi), 420, 1650);
            const t0 = 0.04 + R() * (sec - 0.18);
            const tt = 0.025 + 0.045 * R();
            bubbles.push({ f: bf, a: 0.085 * (0.5 + R()), t: tt, g0: 0.86, g1: 1.14, gt: tt, d: t0 });
          }
          runComplexModes(out, exc, bubbles, sr);
          return finishTake(out, sr, 0.65, 64);
        },
        v * 0.75,
        true,
        sc.modalityIdx === 4,
        0,
        rnd(-0.25, 0.25)
      );
      return;
    }

    if (v >= 0.12) {
      // Subterranean earth/tar shock thud tuned to the active chord's sub-bass fundamental!
      const key = `earthThud:${rootMidi}:${filtBucket}`;
      playBufferCached(
        key,
        (sr) => {
          const sec = 0.42;
          const out = new Float32Array(Math.round(sec * sr));
          const exc = contactPulse(sr, 0.0085);
          runComplexModes(
            out,
            exc,
            [
              { f: clamp(subHz * 0.5, 38, 72), a: 1.25, t: 0.28, g0: 1.45, g1: 1, gt: 0.035 },
              { f: clamp(subHz, 72, 135), a: 0.55, t: 0.18, g0: 1.30, g1: 1, gt: 0.028 },
              { f: clamp(subHz * 1.5, 110, 210), a: 0.28, t: 0.11 },
            ],
            sr
          );
          const grains = phisemGrains(
            sr,
            sec,
            (t) => 110 * Math.exp(-t / 0.12),
            [
              [{ f: rootHz * 1.5, a: 0.5, t: 0.035 }, { f: rootHz * 3.0, a: 0.25, t: 0.02 }],
              [{ f: rootHz * 2.0, a: 0.4, t: 0.03 }, { f: rootHz * 4.0, a: 0.2, t: 0.018 }],
            ],
            0.0007,
            rootMidi * 43 + filtBucket
          );
          for (let i = 0; i < out.length; i++) out[i] += grains[i] * 0.35;
          applyBiquad(out, "lp", Math.min(1600, (filterHz || 480) * (1.2 + sc.filterNorm * 0.8)), 0.75, sr);
          return finishTake(out, sr, 0.75, 16);
        },
        v * 0.85,
        true,
        false
      );
      return;
    }

    // Soft moss & coastal sand footstep brush pitched to the current key & chord root
    const stepVar = Math.floor(rnd(0, 4));
    const key = `mossStep:${rootMidi}:${stepVar}:${filtBucket}`;
    playBufferCached(
      key,
      (sr) => {
        const sec = 0.11;
        const out = new Float32Array(Math.round(sec * sr));
        runComplexModes(
          out,
          contactPulse(sr, 0.0065),
          [
            { f: clamp(subHz * 0.5, 48, 88), a: 0.65, t: 0.048, g0: 1.25, g1: 1, gt: 0.012 },
            { f: clamp(subHz, 96, 176), a: 0.22, t: 0.028 },
          ],
          sr
        );
        const gr = phisemGrains(
          sr,
          sec,
          (t) => 850 * Math.exp(-t / 0.026),
          [
            [{ f: rootHz * (4 + stepVar * 0.5), a: 0.6, t: 0.007 }],
            [{ f: rootHz * (6 + stepVar * 0.5), a: 0.38, t: 0.005 }],
          ],
          0.0004,
          400 + rootMidi * 19 + stepVar * 37
        );
        applyBiquad(gr, "lp", clamp(sc.liveCutoffHz, 1200, 3200), 0.7, sr);
        for (let i = 0; i < out.length; i++) out[i] += gr[i] * 0.28;
        return finishTake(out, sr, 0.55, 16);
      },
      v * 0.58,
      false,
      false,
      0,
      rnd(-0.15, 0.15),
      rnd(0.97, 1.03)
    );
  }

  // ============================================================================
  // PHYSICAL MODELLING IDIOPHONES, MARIMBA, LITHOPHONE & BESSEL TABLA
  // Responsive to active key, chord, musical style (Mode I..V) & filter sweep
  // ============================================================================

  // Rosewood Marimba / Slit Log Drum / Singing Stone (when Round Rocks roll, terraces form, or building)
  function playWood(pitchStep, vel = 0.26) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    updateMasterBusContinuously();
    const sc = getLiveSonicContext();
    const midi = quantizeToLiveHarmony(pitchStep, true, 0);
    const f0 = mtof(midi);
    const attenVel = vel * pitchAtten(f0);
    const variant = Math.abs(pitchStep) % 3;

    // Style-adaptive harmonic accompaniment on wood/rock/build actions
    if (sc.modalityIdx === 1) {
      playGardenPiano(midi, 1.3, "FELT", vel * 0.42);
    } else if (sc.modalityIdx === 2) {
      playGardenPiano(midi, 1.2, "TINE", vel * 0.40);
    } else if (sc.modalityIdx === 3) {
      playCsoundFmTine(midi, 1.5, sc.weep, vel * 0.38);
    } else if (sc.modalityIdx === 4) {
      playGuitar(midi + 12, 1.7, vel * 0.42);
    }

    const filtBucket = Math.round(sc.filterNorm * 3);
    const key = `beleLogMarimba:${midi}:${variant}:${filtBucket}`;
    playBufferCached(
      key,
      (sr) => {
        const d = new Float32Array(Math.round(sr * 0.42));
        const pos = 0.24 + sc.filterNorm * 0.22;
        const modeList = [1, 2.62, 3.99, 4.9].map((r, n) => ({
          f: f0 * r * (1 + (n === 1 ? 0.002 : 0)),
          a: [1.0, 0.42, 0.26, 0.11][n] * (0.35 + Math.abs(barModeShape(n, 0.5 + pos * 0.45))),
          t: [0.32, 0.16, 0.09, 0.045][n],
        }));
        modeList.push(
          { f: f0 * 0.5, a: 0.28, t: 0.22 },
          { f: f0 * 1.003, a: 0.25, t: 0.26 }
        );
        const exc = contactPulse(sr, 0.0018);
        runComplexModes(d, exc, modeList, sr);
        applyBiquad(d, "peak", Math.min(2000, f0 * (0.95 + sc.filterNorm * 0.35)), 2.0, sr, 4.0);
        applyBiquad(d, "lp", sc.liveCutoffHz, 0.75, sr);
        return finishTake(d, sr, 0.8, 18);
      },
      attenVel,
      true,
      sc.modalityIdx === 4,
      0,
      rnd(-0.22, 0.22),
      rnd(0.996, 1.004)
    );
  }

  // PhISEM Stochastic Pebble / Lithophone Crystal Cascade & Spore Pop (digging, crumbling sod, feeding caves)
  function playPebble(kind = 0, vel = 0.18) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    updateMasterBusContinuously();
    const sc = getLiveSonicContext();
    const baseMidi = quantizeToLiveHarmony(Math.abs(Math.round(kind)), true, kind > 600 ? 1 : 0);
    const f0 = mtof(baseMidi);
    const attenVel = vel * pitchAtten(f0);
    const variant = Math.floor(rnd(0, 4));
    const filtBucket = Math.round(sc.filterNorm * 3);

    const key = `phisemPebble:${baseMidi}:${kind === 0 ? 0 : 1}:${variant}:${filtBucket}`;
    playBufferCached(
      key,
      (sr) => {
        const sec = 0.22;
        const out = new Float32Array(Math.round(sec * sr));
        const stoneModes = [
          ...modePair(f0, 0.85, 0.11, 2.2, 0.45),
          { f: f0 * 1.62, a: 0.34, t: 0.065 },
          { f: f0 * 2.756, a: 0.22, t: 0.042 },
        ];
        if (kind === 0) {
          stoneModes.push({ f: f0 * 0.5, a: 0.45, t: 0.055, g0: 0.68, g1: 1.12, gt: 0.025 });
        }
        runComplexModes(out, contactPulse(sr, 0.0009), stoneModes, sr);

        // PhISEM tumbling pebble stream tuned to the active chord intervals!
        const groups = [0, 1, 2].map((gIdx) => {
          const chordToneMidi = clamp(sc.raga.midiRoot + sc.tones[gIdx % sc.tones.length] + 12, 54, 82);
          const gf = mtof(chordToneMidi);
          return [
            { f: gf, a: 0.7, t: 0.024 },
            { f: gf * 1.62, a: 0.35, t: 0.014 },
          ];
        });
        const stream = phisemGrains(
          sr,
          sec,
          (t) => 320 * Math.sin(Math.PI * Math.min(1, t / 0.16)) * Math.exp(-t / 0.09),
          groups,
          0.00045,
          700 + baseMidi * 13 + variant * 29
        );
        for (let i = 0; i < out.length; i++) out[i] += stream[i] * 0.55;
        applyBiquad(out, "lp", clamp(sc.liveCutoffHz * 1.1, 1400, 3400), 0.75, sr);
        return finishTake(out, sr, 0.78, 16);
      },
      attenVel,
      true,
      sc.modalityIdx >= 2,
      0,
      rnd(-0.25, 0.25),
      rnd(0.99, 1.01)
    );
  }

  // Pitched Bessel-Mode & Syahi Harmonic Tabla ("tun", "na", and "ge" bayan bass stroke)
  // Ported from ghosts.garden/src/garden-gnome-voices.js (tabla-na, tabla-ge, djembe-tone)
  function playTabla(midiNote, stroke = "tun", vel = 0.16, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const clampedMidi = clamp(Math.round(midiNote), 38, 72);
    const f0 = mtof(clampedMidi);
    const atten = vel * pitchAtten(f0);

    const key = `gnomeTabla:${stroke}:${clampedMidi}`;
    playBufferCached(
      key,
      (sr) => {
        if (stroke === "ge") {
          // Bayan bass goblet drum: heel of the hand bends pitch upward (g0 -> 1)
          const out = new Float32Array(Math.round(sr * 0.52));
          const g0 = 0.76;
          const gt = 0.11;
          const list = [
            [1, 1.0, 0.42],
            [2, 0.45, 0.26],
            [3, 0.20, 0.16],
            [1.51, 0.14, 0.12],
          ].map(([r, a, t]) => ({ f: f0 * r, a, t, g0, g1: 1.0, gt }));
          runComplexModes(out, contactPulse(sr, 0.0036), list, sr);
          return finishTake(out, sr, 0.85, 16);
        }

        // Dayan syahi harmonic overtone series (tabla-na / tabla-tun)
        const out = new Float32Array(Math.round(sr * 0.55));
        const dmp = stroke === "na" ? 0.58 : 0.12;
        const amps = [0.95 * (1 - dmp * 0.75), 1.0, 0.68, 0.38, 0.22];
        const t60s = [0.46 * (1 - dmp * 0.7), 0.52, 0.38, 0.26, 0.16];
        const list = amps.map((a, i) => ({
          f: f0 * (i + 1) * (1 + 0.0012 * i),
          a,
          t: Math.max(0.03, t60s[i]),
          g0: i === 0 ? 1.025 : undefined,
          g1: 1,
          gt: 0.018,
        }));
        // Skin rim modes
        list.push(
          { f: f0 * 1.59, a: 0.14, t: 0.055 },
          { f: f0 * 2.45, a: 0.10, t: 0.042 }
        );
        runComplexModes(out, contactPulse(sr, stroke === "na" ? 0.00075 : 0.0014), list, sr);
        return finishTake(out, sr, 0.82, 16);
      },
      atten,
      true,
      false,
      when,
      stroke === "ge" ? -0.18 : 0.18,
      rnd(0.997, 1.003)
    );
  }

  // ============================================================================
  // ORGANIC COMPU-RHYTHM & WORLD PERCUSSION GROOVE VOICES
  // Upgraded with ghosts.garden/src/garden-gnome-voices.js (djembe-bass, clave, ghungroo/shaker)
  // ============================================================================
  function playCrKick(vel = 0.22, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    playBufferCached(
      "gnomeKickWarm",
      (sr) => {
        const out = new Float32Array(Math.round(sr * 0.38));
        // Djembe / bridged-T warm Helmholtz boom + Bessel head modes
        const modes = [
          { f: 52, a: 1.4, t: 0.28, g0: 1.65, g1: 1.0, gt: 0.032 },
          { f: 108, a: 0.32, t: 0.14, g0: 1.25, g1: 1.0, gt: 0.022 },
          ...besselMembrane(142, 0.18, { t: 0.16, dk: 1.2, max: 5, glide: { g0: 1.08, gt: 0.02 } }).map((m) => ({
            ...m,
            a: m.a * 0.22,
          })),
        ];
        runComplexModes(out, contactPulse(sr, 0.0048), modes, sr);
        return finishTake(out, sr, 0.88, 16);
      },
      vel,
      false,
      false,
      when
    );
  }

  function playCrRim(vel = 0.09, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const v = vel * pitchAtten(1150);
    playBufferCached(
      "gnomeClaveRim",
      (sr) => {
        const out = new Float32Array(Math.round(sr * 0.16));
        // Rosewood clave over a cupped palm + frame-drum rim tek (from garden-gnome-voices.js)
        const f = 1180;
        runComplexModes(
          out,
          contactPulse(sr, 0.00035),
          [
            { f: f, a: 0.9, t: 0.065 },
            { f: f * 2.756, a: 0.18, t: 0.025 },
            { f: f * 0.46, a: 0.45, t: 0.048 }, // cupped hand cavity
            { f: 640, a: 0.32, t: 0.042 },
          ],
          sr
        );
        return finishTake(out, sr, 0.78, 12);
      },
      v,
      true,
      false,
      when,
      0.15,
      rnd(0.99, 1.01)
    );
  }

  function playCrHat(open = false, vel = 0.07, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const v = vel * 0.52;
    const key = open ? "gnomeHatOpen" : "gnomeHatClosed";
    playBufferCached(
      key,
      (sr) => {
        const sec = open ? 0.28 : 0.085;
        // Combines gourd seed shaker (PhISEM) with subtle bronze ghungroo bell shimmer
        const rateFn = (t) =>
          t < 0.008
            ? 2400 * (t / 0.008)
            : 2400 * Math.exp(-(t - 0.008) / (open ? 0.075 : 0.018));
        const groups = [0, 1, 2].map((i) => {
          const f0 = 2400 + i * 620;
          return [
            { f: f0, a: 0.8, t: open ? 0.022 : 0.008 },
            { f: f0 * 1.62, a: 0.35, t: open ? 0.014 : 0.005 },
          ];
        });
        const out = phisemGrains(sr, sec, rateFn, groups, 0.00035, open ? 888 : 444);
        if (open) {
          // Subtle ghungroo bronze ankle-bell pair
          runComplexModes(
            out,
            contactPulse(sr, 0.0002),
            [
              ...modePair(3120, 0.18, 0.14, 9, 0.5),
              { f: 3120 * 1.62, a: 0.07, t: 0.08 },
            ],
            sr,
            Math.round(sr * 0.006)
          );
        }
        applyBiquad(out, "hp", 1350, 0.7, sr);
        applyBiquad(out, "lp", 4200, 0.75, sr);
        return finishTake(out, sr, 0.72, 14);
      },
      v,
      false,
      open,
      when,
      open ? -0.2 : 0.12,
      rnd(0.98, 1.02)
    );
  }

  // ============================================================================
  // GHOSTS.GARDEN MONO·B / TB-303 MORPHING 24dB LADDER BASS SYNTHESIZER
  // Ported from ghosts-garden/src/garden-panel-bass.js
  // ============================================================================
  // Live morphing parameters (continuously modulated by slow LFOs & 8-bar/16-bar ragas)
  const bassParams = {
    wave: 0.22,       // 0 = saw, 0.5 = square, 1.0 = narrow pulse
    cutoff: 310,      // Base filter cutoff (Hz)
    res: 0.42,        // 24dB dual-biquad ladder resonance (0..0.85)
    envMod: 0.52,     // Filter envelope modulation depth (0..1)
    decay: 0.26,      // Filter & amp decay time (s)
    drive: 0.22,      // Tanh waveshaper saturation drive (0..0.75)
    sub: 0.38,        // -1 octave square sub-oscillator level (0..0.8)
    detune: 6.5,      // 2nd oscillator detune in cents
    slideProb: 0.28,  // Probability of legato raga meend / 303 slide
  };

  let lastBassMidi = 46;

  function playMorphingBassNote(midiNote, opts = {}) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t = opts.when || c.currentTime;
    const accent = !!opts.accent;
    const slide = !!opts.slide;
    const prevMidi = opts.prevMidi != null ? opts.prevMidi : lastBassMidi;
    lastBassMidi = midiNote;

    const fTarget = clamp(mtof(midiNote), 36, 520);
    const fStart = slide ? clamp(mtof(prevMidi), 36, 520) : fTarget;
    const glideTime = slide ? 0.068 : 0.004;

    const waveMorph = clamp(opts.wave != null ? opts.wave : bassParams.wave, 0, 1);
    const cutBase = clamp(opts.cutoff != null ? opts.cutoff : bassParams.cutoff, 90, 1150);
    const res = clamp(opts.res != null ? opts.res : bassParams.res, 0.08, 0.76);
    const envDepth = clamp(opts.envMod != null ? opts.envMod : bassParams.envMod, 0.05, 0.95);
    const dec = clamp(opts.decay != null ? opts.decay : bassParams.decay, 0.10, 0.68);
    const drive = clamp(opts.drive != null ? opts.drive : bassParams.drive, 0.02, 0.65);
    const subLvl = clamp(opts.sub != null ? opts.sub : bassParams.sub, 0.05, 0.75);
    const vel = (opts.vel || 0.20) * (accent ? 1.24 : 1.0) * pitchAtten(fTarget);

    const w = bassWaveOf(c, waveMorph);
    const o1 = c.createOscillator();
    const o2 = c.createOscillator();
    const oSub = c.createOscillator();
    o1.setPeriodicWave(w);
    o2.setPeriodicWave(w);
    oSub.setPeriodicWave(sqWave(c));

    o1.frequency.setValueAtTime(fStart, t);
    o2.frequency.setValueAtTime(fStart, t);
    oSub.frequency.setValueAtTime(fStart * 0.5, t);
    if (slide && fStart !== fTarget) {
      o1.frequency.exponentialRampToValueAtTime(fTarget, t + glideTime);
      o2.frequency.exponentialRampToValueAtTime(fTarget, t + glideTime);
      oSub.frequency.exponentialRampToValueAtTime(fTarget * 0.5, t + glideTime);
    }

    const det = bassParams.detune;
    o1.detune.setValueAtTime(-det, t);
    o2.detune.setValueAtTime(det, t);

    const g1 = c.createGain();
    const g2 = c.createGain();
    const gSub = c.createGain();
    g1.gain.value = 0.52;
    g2.gain.value = 0.34;
    gSub.gain.value = subLvl * 0.52;

    // Pre-filter tanh soft clipper (from garden-panel-bass.js)
    const preDrive = c.createGain();
    preDrive.gain.value = drvGain(drive + (accent ? 0.14 : 0));
    const shaper = c.createWaveShaper();
    shaper.curve = tanhCurve(c);

    // Dual cascaded 24 dB/oct resonant lowpass ladder filter (f1 -> f2)
    const f1 = c.createBiquadFilter();
    const f2 = c.createBiquadFilter();
    f1.type = "lowpass";
    f2.type = "lowpass";
    const qVal = resQ(res + (accent ? 0.08 : 0));
    f1.Q.setValueAtTime(qVal, t);
    f2.Q.setValueAtTime(qVal * 0.65, t);

    // Filter envelope contour: fc -> pk -> sustain floor
    const fc = Math.max(95, Math.min(1200, cutBase * (fTarget / 110)));
    const envOctaves = envDepth * (accent ? 3.1 : 2.3);
    const pk = Math.min(1850, fc * Math.pow(2, envOctaves));
    const sf = Math.max(75, fc * 0.72);
    const fDecay = accent ? dec * 0.68 : dec;

    for (const flt of [f1, f2]) {
      flt.frequency.setValueAtTime(slide ? pk * 0.75 : fc, t);
      flt.frequency.exponentialRampToValueAtTime(pk, t + (slide ? 0.018 : 0.005));
      flt.frequency.exponentialRampToValueAtTime(sf, t + 0.01 + fDecay);
    }

    const vca = c.createGain();
    const dur = dec + (slide ? 0.10 : 0.05);
    const peakGain = vel * resComp(res) * (0.62 / Math.sqrt(drvGain(drive)));
    vca.gain.setValueAtTime(0.0001, t);
    vca.gain.linearRampToValueAtTime(peakGain, t + (slide ? 0.012 : 0.004));
    vca.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    o1.connect(g1);
    o2.connect(g2);
    oSub.connect(gSub);
    g1.connect(preDrive);
    g2.connect(preDrive);
    gSub.connect(preDrive);
    preDrive.connect(shaper);
    shaper.connect(f1);
    f1.connect(f2);
    f2.connect(vca);
    vca.connect(master);

    // Subtle send to cosmic delay on high-env accented notes
    if (accent || envDepth > 0.62) {
      const dSend = c.createGain();
      dSend.gain.value = 0.14;
      vca.connect(dSend);
      dSend.connect(delay);
    }

    o1.start(t);
    o2.start(t);
    oSub.start(t);
    const stopTime = t + dur + 0.03;
    o1.stop(stopTime);
    o2.stop(stopTime);
    oSub.stop(stopTime);
  }

  // Keep backwards-compatible playCricketBass wrapper routed through the morphing ladder synth
  function playCricketBass(midiNote, cutoffMult = 2.6, vel = 0.2) {
    playMorphingBassNote(midiNote, {
      cutoff: clamp(140 * cutoffMult, 140, 950),
      vel,
      accent: cutoffMult > 3.0,
    });
  }

  // ============================================================================
  // LINDSTRØM / WELTANSCHAUUNG COSMIC STRING ENSEMBLE, SPACE ARP & BELLS
  // ============================================================================
  // Solina-style 3-voice detuned string-machine ensemble chord swell
  function playCosmicStringVoicing(midiNotes, dur = 3.2, vel = 0.075, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t = when || c.currentTime;
    const atk = Math.min(1.1, dur * 0.35);
    const rel = Math.min(1.8, dur * 0.48);
    const end = t + atk + dur + rel;

    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    // Gentle filter swell across the chord duration (Lindstrøm warm sweep)
    const sweepPeak = 920 + Math.sin(t * 0.17) * 320;
    filter.frequency.setValueAtTime(380, t);
    filter.frequency.exponentialRampToValueAtTime(sweepPeak, t + atk + dur * 0.5);
    filter.frequency.exponentialRampToValueAtTime(320, end);
    filter.Q.value = 1.1;

    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(vel, t + atk);
    env.gain.setValueAtTime(vel * 0.9, t + atk + dur);
    env.gain.exponentialRampToValueAtTime(0.0001, end);

    filter.connect(env);
    env.connect(master);
    env.connect(reverb);
    env.connect(delay);

    midiNotes.slice(0, 4).forEach((note) => {
      const clamped = clamp(note, 48, 76);
      const f = mtof(clamped);
      const noteGain = c.createGain();
      noteGain.gain.value = 0.32 * pitchAtten(f);
      noteGain.connect(filter);

      for (const det of [-11, 0, 11]) {
        const o = c.createOscillator();
        o.type = det === 0 ? "triangle" : "sawtooth";
        o.frequency.setValueAtTime(f, t);
        o.detune.setValueAtTime(det + rnd(-1.5, 1.5), t);
        o.connect(noteGain);
        o.start(t);
        o.stop(end + 0.05);
      }
    });
  }

  // Lindstrøm Cosmic Italo Space Arpeggiator Pluck (warm pulse/triangle + filter envelope + delay)
  function playCosmicArp(midiNote, dur = 0.28, vel = 0.11, morph = 0.5, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t = when || c.currentTime;
    const clamped = clamp(midiNote, 50, 79);
    const f = mtof(clamped);
    const attenVel = vel * pitchAtten(f);

    const o1 = c.createOscillator();
    const o2 = c.createOscillator();
    o1.setPeriodicWave(bassWaveOf(c, morph * 0.7));
    o2.type = "triangle";
    o1.frequency.setValueAtTime(f, t);
    o2.frequency.setValueAtTime(f * 2, t); // Gentle octave harmonic shimmer
    o2.detune.value = 5;

    const g1 = c.createGain();
    const g2 = c.createGain();
    g1.gain.value = 0.7;
    g2.gain.value = 0.18 * (1 - morph * 0.5);

    const flt = c.createBiquadFilter();
    flt.type = "lowpass";
    flt.Q.value = 2.4;
    const pk = Math.min(1750, f * (2.6 + morph * 2.2));
    flt.frequency.setValueAtTime(pk, t);
    flt.frequency.exponentialRampToValueAtTime(Math.max(220, f * 1.15), t + dur * 0.85);

    const vca = c.createGain();
    vca.gain.setValueAtTime(0.0001, t);
    vca.gain.linearRampToValueAtTime(attenVel, t + 0.004);
    vca.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    o1.connect(g1);
    o2.connect(g2);
    g1.connect(flt);
    g2.connect(flt);
    flt.connect(vca);
    vca.connect(master);
    vca.connect(delay);
    vca.connect(reverb);

    o1.start(t);
    o2.start(t);
    o1.stop(t + dur + 0.03);
    o2.stop(t + dur + 0.03);
  }

  // ============================================================================
  // BELE ELECTRIC PIANO CANTILEVER TINE + BEAUTIFUL_BELL.PD + SINGING-BOWL
  // Direct port of midigarden/Performance/BeleElectricPiano.h (6-mode cantilever
  // tine/tonebar with magnetic pickup nonlinearity) blended with archive/beautiful_bell.pd
  // & ghosts.garden/src/garden-gnome-voices.js ("fairy-bell" / "singing-bowl").
  // ============================================================================
  function playTineBell(midiNote, dur = 1.6, vel = 0.2, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const clampedNote = clamp(midiNote, 46, 78);
    const f0 = mtof(clampedNote);
    const d = clamp(dur, 0.6, 2.2);
    const key = `beleTine:${Math.round(clampedNote * 2)}:${Math.round(d * 10)}`;
    playBufferCached(
      key,
      (sr) => {
        const len = Math.floor(sr * d);
        const strikeExc = contactPulse(sr, 0.0014, true);
        const clangExc = contactPulse(sr, 0.00045, false);
        const fundamentalModes = new Float32Array(len);
        runComplexModes(
          fundamentalModes,
          strikeExc,
          [
            ...modePair(f0, 0.56, d * 0.96, 0.38),
            { f: f0 * 2.0, a: 0.22, t: d * 0.52 },
            { f: f0 * 3.0, a: 0.09, t: d * 0.30 },
          ],
          sr
        );
        const tineModes = new Float32Array(len);
        runComplexModes(
          tineModes,
          clangExc,
          [
            ...modePair(f0 * 2.756, 0.13, d * 0.44, 0.95),
            { f: f0 * 6.267, a: 0.075, t: Math.min(0.28, d * 0.24) },
          ],
          sr
        );
        const out = new Float32Array(len);
        for (let i = 0; i < len; i++) {
          const y = fundamentalModes[i];
          const yClip = clamp(y, -1.2, 1.2);
          const pickup = y + 0.14 * (yClip * yClip) - 0.06 * (yClip * yClip * yClip);
          const strike = (i < strikeExc.length ? strikeExc[i] : 0) * 0.08;
          out[i] = pickup * 0.78 + tineModes[i] * 0.34 + strike;
        }
        applyBiquad(out, "lp", Math.min(4800, f0 * 8.5), 0.707, sr);
        return finishTake(out, sr, 0.80, 18);
      },
      vel * pitchAtten(f0),
      true,
      true,
      when
    );
  }

  // Karplus-Strong Nylon Guitar / Koto Pluck (from ghosts.garden/src/audio.js)
  function playGuitar(midiNote, decay = 2.4, vel = 0.28, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const clampedNote = clamp(midiNote, 42, 78);
    const key = `gtr:${Math.round(clampedNote * 2)}:${c.sampleRate}`;
    let buf = bufCache.get(key);
    if (!buf) {
      const sr = c.sampleRate;
      const f = mtof(clampedNote);
      const len = Math.floor(sr * decay);
      buf = c.createBuffer(1, len, sr);
      const y = buf.getChannelData(0);
      const P = sr / f - 0.5;
      const N = Math.max(4, Math.floor(P - 0.1));
      const dl = P - N;
      const ap = (1 - dl) / (1 + dl);
      const g = Math.min(0.9994, Math.pow(0.001, 1 / (f * decay)) / Math.cos((Math.PI * f) / sr));
      const exc = new Float32Array(N);
      const pos = Math.max(1, Math.round(N * 0.18));
      let lp = 0;
      for (let i = 0; i < N; i++) {
        lp += 0.45 * (Math.random() * 2 - 1 - lp);
        exc[i] = lp;
      }
      for (let i = N - 1; i >= pos; i--) exc[i] -= exc[i - pos];
      let apIn = 0, apOut = 0, peak = 0;
      for (let n = 0; n < len; n++) {
        let x = n < N ? exc[n] : 0;
        if (n > N) {
          const avg = 0.5 * (y[n - N] + y[n - N - 1]);
          apOut = ap * avg + apIn - ap * apOut;
          apIn = avg;
          x += g * apOut;
        }
        y[n] = x;
        if (Math.abs(x) > peak) peak = Math.abs(x);
      }
      const k = 0.75 / (peak || 1);
      for (let n = 0; n < len; n++) y[n] *= k;
      if (bufCache.size > 140) bufCache.delete(bufCache.keys().next().value);
      bufCache.set(key, buf);
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.value = vel * pitchAtten(mtof(clampedNote));
    src.connect(g);
    g.connect(master);
    g.connect(reverb);
    src.start(when || c.currentTime);
  }

  // Klatt / Formant Choir Vowel Pad (from ghosts.garden/src/audio.js)
  const VOWELS = {
    a: [[800, 6, 1], [1150, 8, 0.6], [2900, 10, 0.22]],
    o: [[480, 6, 1], [800, 7, 0.7], [2800, 10, 0.10]],
    u: [[340, 5, 1], [720, 7, 0.45], [2500, 10, 0.07]],
  };

  function playChoirPad(midiNote, dur = 2.0, vowel = "a", vel = 0.18, when = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const f = mtof(clamp(midiNote, 45, 74));
    const t = when || c.currentTime;
    const mix = c.createGain();
    const out = c.createGain();
    const atk = 0.35;
    const rel = 1.1;
    const end = t + atk + dur + rel;

    for (const det of [-8, 0, 8]) {
      const o = c.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f, t);
      o.detune.setValueAtTime(det, t);
      o.connect(mix);
      o.start(t);
      o.stop(end + 0.05);
    }

    (VOWELS[vowel] || VOWELS.a).forEach(([ff, q, amp]) => {
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = ff;
      bp.Q.value = q;
      const g = c.createGain();
      g.gain.value = amp;
      mix.connect(bp);
      bp.connect(g);
      g.connect(out);
    });

    const v = vel * pitchAtten(f);
    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(v, t + atk);
    env.gain.setValueAtTime(v, t + atk + dur);
    env.gain.exponentialRampToValueAtTime(0.0001, end);

    out.connect(env);
    env.connect(master);
    env.connect(reverb);
  }

  // BT "Weltanschauung" Aleatoric Micro-Harp / Granular Tine Cascade
  function playMicroHarpCascade(baseMidi, tones, count = 5, spreadMs = 55, vel = 0.10) {
    const c = ensureCtx();
    if (!c || muted) return;
    const now = c.currentTime;
    for (let i = 0; i < count; i++) {
      const dt = (i * spreadMs * rnd(0.82, 1.18)) / 1000;
      const tone = tones[i % tones.length] + (i >= tones.length ? 12 : 0);
      const note = clamp(baseMidi + tone, 52, 76);
      if (i % 2 === 0) {
        playGuitar(note, 2.0, vel * 0.85, now + dt);
      } else {
        playTineBell(note, 1.4, vel * 0.72, now + dt);
      }
    }
  }

  // ============================================================================
  // VERMUNA / SEER CROW ORACLE CALL ("spirit-whistle" Clay Vessel-Flute Syrinx)
  // Direct port of ghosts.garden/src/garden-gnome-voices.js ("spirit-whistle"):
  // Dual Helmholtz clay ocarina / avian syrinx vessel resonators tuned to the
  // active Raga's Vadi & Samvadi degrees with breath-jet edge turbulence and
  // gentle downward meend pitch inflection (zero harsh sawtooth!).
  // ============================================================================
  function playVermunaCall(pitchOffset = 0, velScale = 1.0, when = 0) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const raga = sc.raga;
    const vadiSemi = sc.tones[1 % sc.tones.length] || raga.arohana[raga.vadi % raga.arohana.length] || 7;
    const samvadiSemi = sc.tones[0] || raga.arohana[raga.samvadi % raga.arohana.length] || 0;
    const f1 = mtof(clamp(raga.midiRoot + 12 + vadiSemi + pitchOffset, 60, 79));
    const f2 = mtof(clamp(raga.midiRoot + 12 + samvadiSemi + pitchOffset, 58, 77));
    const key = `spiritWhistle:${Math.round(f1)}:${Math.round(f2)}`;
    playBufferCached(
      key,
      (sr) => {
        const dur = 0.56;
        const len = Math.floor(sr * dur);
        const out = new Float32Array(len);
        const jetNoise = new Float32Array(len);
        const R = makeRng(Math.round(f1 * 10 + f2));
        for (let i = 0; i < len; i++) {
          const t = i / sr;
          const env = Math.sin(Math.PI * Math.pow(t / dur, 0.72)) * Math.exp(-t * 1.9);
          jetNoise[i] = (R() * 2 - 1) * env * 0.16;
        }
        applyBiquad(jetNoise, "bp", (f1 + f2) * 0.5, 4.5, sr);

        let p1 = 0, p2 = 0, pSub = 0;
        for (let i = 0; i < len; i++) {
          const t = i / sr;
          const bend = 1 + 0.028 * Math.sin(TAU * 2.4 * t) - 0.055 * (t / dur);
          const vib = 1 + 0.006 * Math.sin(TAU * 5.8 * t);
          const env1 = Math.sin(Math.PI * Math.min(1, t / 0.36)) * Math.exp(-t * 2.8);
          const env2 = t > 0.12 ? Math.sin(Math.PI * Math.min(1, (t - 0.12) / 0.42)) * Math.exp(-(t - 0.12) * 2.4) : 0;

          p1 += (TAU * f1 * bend * vib) / sr;
          p2 += (TAU * f2 * bend) / sr;
          pSub += (TAU * f1 * 0.5 * bend) / sr;

          const voice1 = (Math.sin(p1) * 0.74 + Math.sin(p1 * 2) * 0.18) * env1;
          const voice2 = (Math.sin(p2) * 0.68 + Math.sin(p2 * 2) * 0.14 + Math.sin(pSub) * 0.22) * env2;
          out[i] = voice1 + voice2 + jetNoise[i];
        }
        applyBiquad(out, "lp", 2400, 0.8, sr);
        return finishTake(out, sr, 0.68, 24);
      },
      0.20 * velScale * pitchAtten(f1),
      true,
      true,
      when,
      rnd(-0.35, 0.35),
      rnd(0.985, 1.015)
    );
  }

  // Loving Crow Swarm Chorus (triggered when the player smiles at the webcam!)
  // Harmonizes a warm flock of Seer Crows singing in the active chord/raga + Csound choir & guitar cascade!
  function playLovingCrowSwarm() {
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const now = c.currentTime;
    const chordTones = sc.tones.slice(0, 5);
    // 5 harmonized loving syrinx calls across the active chord tones
    for (let i = 0; i < 5; i++) {
      const semi = chordTones[i % chordTones.length];
      playVermunaCall(semi - (sc.tones[0] || 0), 0.78, now + i * 0.11);
    }
    // Warm Csound CHANT vocal embrace + Airdrawndagger/Felt Piano love chord
    playCsoundChantChoir(sc.chordRootMidi, 2.8, 0, 3, 2, 0.11, now + 0.05);
    playCsoundChantChoir(sc.chordRootMidi + 12, 2.8, 3, 0, 3, 0.095, now + 0.12);
    playMicroHarpCascade(sc.raga.midiRoot + 12, chordTones, 6, 48, 0.13);
    if (sc.modalityIdx === 4) {
      playAirdrawndaggerPad(chordTones.map((t) => sc.raga.midiRoot + t), 3.0, sc.liveCutoffHz, 0.085, now);
    } else {
      playGardenPiano(sc.chordRootMidi + 12, 2.4, "FELT", 0.14, now + 0.08);
    }
  }

  // Closed-Eye Secret Witness Layer Drone (triggered when the player closes their eyes!)
  function playClosedEyeWitnessDrone() {
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const now = c.currentTime;
    playCsoundSingingBowl(sc.chordRootMidi - 12, 3.6, 0.13, now);
    playCsoundChantChoir(sc.chordRootMidi, 3.2, 4, 3, 0, 0.09, now + 0.04);
    playCsoundFmBell(sc.chordRootMidi + 12 + (sc.tones[2 % sc.tones.length] || 7), 3.0, 0.85, 0.10, now + 0.08);
  }

  // ============================================================================
  // SONIC TAMP SHOCKWAVE ("gong ageng" Ombak Beating + "taiko" Bessel Drum)
  // Direct port of ghosts.garden/src/garden-gnome-voices.js ("gong" & "taiko"):
  // Deep coupled double-headed Taiko drum + Javanese Gong Ageng ombak beating pairs.
  // ============================================================================
  function playSonicTamp(depthHits = 0) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const f0 = mtof(sc.chordRootMidi - 12); // Deep fundamental locked to active chord root
    const key = `gongTaiko:${Math.round(f0)}`;
    playBufferCached(
      key,
      (sr) => {
        const dur = 0.85;
        const len = Math.floor(sr * dur);
        const exc = contactPulse(sr, 0.0085, true);
        const out = new Float32Array(len);
        runComplexModes(
          out,
          exc,
          [
            ...modePair(f0, 0.85, 0.72, 1.35),
            ...modePair(f0 * 1.58, 0.42, 0.48, 1.8),
            ...modePair(f0 * 2.0, 0.28, 0.42, 2.2),
            { f: f0 * 2.98, a: 0.14, t: 0.26 },
            ...besselMembrane(f0 * 0.85, 0.42, { t: 0.48, glide: { g0: 1.07, gt: 0.065 } }),
          ],
          sr
        );
        for (let i = 0; i < len; i++) {
          out[i] = Math.tanh(out[i] * 1.18);
        }
        applyBiquad(out, "lp", clamp(sc.liveCutoffHz * 0.45, 420, 980), 0.75, sr);
        return finishTake(out, sr, 0.82, 24);
      },
      0.28,
      true,
      false,
      0
    );

    if (depthHits > 0) {
      setTimeout(() => {
        const live = getLiveSonicContext();
        const note = live.raga.midiRoot + 12 + live.tones[depthHits % live.tones.length];
        if (live.modalityIdx === 1) {
          playGardenPiano(note, 1.6, "FELT", 0.18);
        } else if (live.modalityIdx === 3 || live.modalityIdx === 4) {
          playCsoundFmBell(note, 2.2, live.weep, 0.16);
        } else {
          playTineBell(note, 1.5, 0.22);
        }
      }, 65);
    }
  }

  // Cave Fed Harmonic Fanfare (Adapts to active Raga, Chord & Modality I..V)
  function playCaveFanfare(chapter = 0) {
    if (suppressSfx) return;
    const sc = getLiveSonicContext();
    const base = sc.raga.midiRoot + (chapter % 2) * 2;
    playMicroHarpCascade(base, sc.tones, 6, 75, 0.18);
    if (sc.modalityIdx === 4) {
      playAirdrawndaggerPad(sc.tones.slice(0, 4).map((t) => base + t), 3.0, sc.liveCutoffHz, 0.095);
    } else if (sc.modalityIdx === 3) {
      playCsoundChantChoir(base + sc.chordObj.root, 2.8, 0, 3, 2, 0.13);
    } else {
      playChoirPad(base + sc.chordObj.root, 2.6, sc.vowel, 0.15);
    }
  }

  // ============================================================================
  // COSMIC / TIME-CRYSTAL / WASM SCIENTIST / PORTAL / ANGELIC SOUND GENERATORS
  // Ported from ghosts.garden/src/garden-gnome-voices.js ("singing-bowl",
  // "fairy-bell", "celesta", "glockenspiel", "tubular-bell")
  // ============================================================================

  // 100x Time-Dilation Crystal Harmonic Warp ("singing-bowl" + "fairy-bell")
  function playTimeCrystalWarp(active = true) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const tones = active ? sc.tones : [...sc.tones].reverse();
    playMicroHarpCascade(sc.raga.midiRoot + (active ? 12 : 0), tones, 5, 42, 0.14);
    if (sc.modalityIdx === 3 || sc.modalityIdx === 4) {
      playCsoundSingingBowl(sc.chordRootMidi + 12, 2.6, 0.16);
    } else {
      playTineBell(sc.chordRootMidi + 12, 1.9, 0.18);
    }
  }

  // WASM Scientist Discovery Fanfare ("glockenspiel" / "celesta" Eureka motif)
  let suppressSfx = false;

  function playWasmDiscovery(civType = 0) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const now = c.currentTime;
    const offsets = civType === 1 ? sc.tones.slice(0, 4) : sc.tones.slice(0, 5);
    offsets.forEach((semi, idx) => {
      const note = sc.raga.midiRoot + 12 + semi;
      if (sc.modalityIdx === 1) {
        playGardenPiano(note, 1.4, "FELT", 0.12, now + idx * 0.055);
      } else if (sc.modalityIdx === 3 || sc.modalityIdx === 4) {
        playCsoundFmTine(note, 1.6, sc.weep, 0.12, now + idx * 0.055);
      } else {
        playTineBell(note, 1.35, 0.13, now + idx * 0.055);
      }
    });
  }

  // Recursive Pocket-World Portal Shift ("gong" + "MicroHarp" dimensional fold)
  function playPortalShift(entering = true) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    playWood(entering ? 5 : 2, 0.18);
    if (sc.modalityIdx === 4) {
      playAirdrawndaggerPad(sc.tones.slice(0, 4).map((t) => sc.raga.midiRoot + t), 2.4, sc.liveCutoffHz, 0.085);
    } else if (sc.modalityIdx === 3) {
      playCsoundFmSwirl(sc.chordRootMidi + (entering ? 12 : 0), 2.2, sc.weep, 0.12);
    } else {
      playTineBell(sc.chordRootMidi + (entering ? 12 : 7), 1.6, 0.18);
    }
  }

  // Transdimensional Angelic / Archon Harmonic Slice ("singing-bowl" + "choirPad")
  function playAngelChord(angelType = 0) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const vowels = ["a", "o", "u"];
    const note = sc.chordRootMidi + (angelType % 2) * 7;
    if (sc.modalityIdx === 3 || sc.modalityIdx === 4) {
      playCsoundChantChoir(note, 2.6, angelType % 5, (angelType + 2) % 5, 2, 0.11);
      playCsoundFmBell(sc.raga.midiRoot + 12 + sc.tones[angelType % sc.tones.length], 2.2, sc.weep, 0.13);
    } else {
      playChoirPad(note, 2.4, vowels[angelType % vowels.length], 0.12);
      playTineBell(sc.raga.midiRoot + 12 + sc.tones[angelType % sc.tones.length], 1.8, 0.14);
    }
  }

  // 5-Fold Non-Euclidean Pentagonal Scene Rotation Sound ("BeleMarimba" + "BeleElectricPiano" 5-step modal fold)
  function playPentagonalRotation(stepDir = 1, facetIdx = 0) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const now = c.currentTime;
    const pentTones = sc.tones.length >= 5 ? sc.tones.slice(0, 5) : sc.raga.arohana.slice(0, 5);
    const ordered = stepDir >= 0 ? pentTones : [...pentTones].reverse();
    ordered.forEach((semi, idx) => {
      const note = sc.raga.midiRoot + semi + (facetIdx === 3 ? 12 : 0);
      if (sc.modalityIdx === 1 || sc.modalityIdx === 2) {
        playGardenPiano(note, 1.4, idx % 2 === 0 ? "FELT" : "TINE", 0.12, now + idx * 0.048);
      } else if (sc.modalityIdx === 3 || sc.modalityIdx === 4) {
        playCsoundFmTine(note, 1.6, sc.weep, 0.11, now + idx * 0.048);
      } else if (idx % 2 === 0) {
        playTineBell(note, 1.3, 0.12, now + idx * 0.048);
      } else {
        playGuitar(note, 1.7, 0.12, now + idx * 0.048);
      }
    });
  }

  // Embodied Tab-Form Lifeform Robotic Actuator Sound ("castanet" / "BeleMarimba" / "spirit-whistle")
  function playTabFormActuator(type = "thruster") {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    if (type === "thruster") {
      noise(0.08, sc.liveCutoffHz * 0.45, 900);
      const fifthNote = sc.chordRootMidi + 7;
      if (sc.modalityIdx === 4) {
        playCsoundFmTine(fifthNote, 1.1, 0.65, 0.09);
      } else {
        playTineBell(fifthNote, 0.9, 0.10);
      }
    } else if (type === "perch") {
      playVermunaCall();
    } else if (type === "bus" || type === "arm") {
      playWood(3, 0.14);
      playClick(true);
    } else if (type === "say") {
      const sayNote = sc.raga.midiRoot + 12 + sc.tones[step16 % sc.tones.length];
      if (sc.modalityIdx === 1 || sc.modalityIdx === 2) {
        playGardenPiano(sayNote, 1.1, "TINE", 0.11);
      } else {
        playTineBell(sayNote, 1.1, 0.13);
      }
    } else {
      playClick(false);
    }
  }

  // ============================================================================
  // GENERATIVE RAGA / COSMIC ITALO / ALEATORIC COMPOSER ENGINE
  //
  // Structure:
  //  - 16 steps per bar (16th-note resolution at ~115 BPM -> ~130ms per step)
  //  - Every 2 bars (32 steps): Chord advances within the active 4-chord progression
  //    (making each 4-chord cycle a lush 8-bar harmonic phrase!)
  //  - Every 8 bars (128 steps): Morphs the harmonic movement (switches progression
  //    family, regenerates the aleatoric bass archetype & cosmic arp pattern, and
  //    transitions the arrangement arc between Build, Peak, Groove, and Breakdown)
  //  - Every 16 bars (256 steps): Morphs to a new Raga World (Charanjit Singh /
  //    Lindstrøm / BT modal modulation) with a pivot chord swell & micro-harp cascade!
  // ============================================================================
  const BASS_ARCHETYPES = [
    // 0: Hypnotic octave-jumping disco-raga bass
    {
      name: "OCTAVE RAGA PULSE",
      gates:   [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      octaves: [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1],
      accents: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      slides:  [0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1],
      degMode: "ragaWalk",
    },
    // 1: Chugging cosmic 16th pulse
    {
      name: "COSMIC HORIZON PULSE",
      gates:   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      octaves: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      accents: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
      slides:  [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
      degMode: "chordFifths",
    },
    // 2: Syncopated broken-beat / aleatoric deep bass
    {
      name: "SYNCOPATED BREAK",
      gates:   [1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
      octaves: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
      accents: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      slides:  [0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
      degMode: "ragaVadi",
    },
    // 3: Winding Raga Meend (melodic ascending Arohana / descending Avarohana ornaments)
    {
      name: "RAGA MEEND WINDING",
      gates:   [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      octaves: [0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
      accents: [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
      slides:  [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
      degMode: "arohanaWave",
    },
    // 4: Minimal spacious subterranean pulse (for atmospheric breakdown / dawn sections)
    {
      name: "SUBTERRANEAN BREATH",
      gates:   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      octaves: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      accents: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      slides:  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      degMode: "rootFifth",
    },
  ];

  // Arrangement Arcs: forever building up and breaking down
  // 0: AMBIENT DAWN (Lush pads, nylon guitar/koto, soft bass breath)
  // 1: RAGA AWAKENING (Winding bass + Bessel tabla + cosmic arp shimmer)
  // 2: CHARANJIT / LINDSTRØM DRIVE (Full dynamic acid-raga bass + CR-78 + cosmic Italo chords)
  // 3: WELTANSCHAUUNG PEAK (Lush string ensemble + cascading arpeggios + expressive resonant bass)
  // 4: COASTAL BREAKDOWN (Drums drop out -> floating choir + micro-harp cascade + deep sub slide)
  const ARC_PHASES = [
    { name: "DAWN",      bassDens: 0.45, arpDens: 0.35, drumDens: 0.15, padDens: 0.85 },
    { name: "AWAKENING", bassDens: 0.78, arpDens: 0.58, drumDens: 0.55, padDens: 0.65 },
    { name: "COSMIC",    bassDens: 0.95, arpDens: 0.82, drumDens: 0.85, padDens: 0.78 },
    { name: "EUPHORIA",  bassDens: 1.00, arpDens: 0.94, drumDens: 0.92, padDens: 0.95 },
    { name: "BREAKDOWN", bassDens: 0.52, arpDens: 0.68, drumDens: 0.22, padDens: 0.92 },
  ];

  let step16 = 0;               // 16th-note counter
  let barCount = 0;             // Bar counter (1 bar = 16 steps)
  let progFamilyIdx = 0;        // Which chord progression in current Raga
  let chordIdx = 0;             // Current chord index (0..3) in 4-chord progression
  let bassArchIdx = 1;          // Current bassline archetype (0..4)
  let arcPhaseIdx = 1;          // Current arrangement build/breakdown phase (0..4)
  let ragaAscending = true;     // Direction of raga scale traversal (Arohana vs Avarohana)
  let ragaScaleCursor = 0;      // Current degree cursor along Arohana/Avarohana
  let arpPattern = [0, 1, 2, 3, 4, 2, 3, 1]; // Permuted on 8-bar boundaries

  // Live game state updated by slopes2.js
  let liveGameState = {
    playerY: 12,
    tarPressure: 0,
    townCount: 0,
    nearSea: true,
  };
  let lastGameHeartbeatMs = 0;
  let nextStepTime = 0;
  let schedulerTimer = null;

  // Irrational-ratio LFO phases for continuous, never-repeating parameter morphing
  let lfoPhase = rnd(0, 100);

  function evolveSynthParameters(stepIndex) {
    lfoPhase += 0.037;
    const arc = ARC_PHASES[arcPhaseIdx];
    const tarBoost = clamp((liveGameState.tarPressure || 0) * 0.12, 0, 0.35);
    const elevNorm = clamp((liveGameState.playerY || 12) / 55, 0, 1);

    // 7 incommensurable sine waves morph the bass synthesizer parameters over time
    const w1 = 0.5 + 0.5 * Math.sin(lfoPhase * 0.31);
    const w2 = 0.5 + 0.5 * Math.sin(lfoPhase * 0.53 + 1.4);
    const w3 = 0.5 + 0.5 * Math.sin(lfoPhase * 0.19 + 2.8);
    const w4 = 0.5 + 0.5 * Math.sin(lfoPhase * 0.71 + 4.1);
    const w5 = 0.5 + 0.5 * Math.sin(lfoPhase * 0.13 + 0.7);

    // Wave morphs smoothly from warm saw (0.05) -> square (0.5) -> acid pulse (0.9)
    bassParams.wave = clamp(0.08 + w1 * 0.78, 0.05, 0.92);

    // Cutoff breathes with arrangement arc, LFOs, and subterranean ember pressure
    bassParams.cutoff = clamp(
      145 + w2 * 380 + arc.bassDens * 180 + tarBoost * 240 - (1 - elevNorm) * 40,
      130,
      820
    );

    // Resonance rises into vocal TB-303 territory during raga meends & cosmic peaks
    bassParams.res = clamp(0.20 + w3 * 0.44 + tarBoost * 0.12, 0.18, 0.72);

    // Filter envelope depth & decay morph inversely at times for tight pluck vs liquid sweep
    bassParams.envMod = clamp(0.24 + w4 * 0.52 + arc.bassDens * 0.12, 0.20, 0.86);
    bassParams.decay = clamp(0.14 + (1 - w4 * 0.65) * 0.34, 0.12, 0.52);

    // Tanh saturation drive & sub-octave balance
    bassParams.drive = clamp(0.10 + w5 * 0.28 + tarBoost * 0.15, 0.08, 0.48);
    bassParams.sub = clamp(0.24 + (1 - w1 * 0.5) * 0.38, 0.20, 0.66);
    bassParams.detune = 3.5 + w3 * 8.5;
    bassParams.slideProb = clamp(0.18 + w2 * 0.38, 0.15, 0.58);
  }

  // Regenerate aleatoric arp contour & harmonic movement every 8 bars
  function morphEightBarSection(bar) {
    const raga = RAGA_WORLDS[scaleIdx];
    progFamilyIdx = (progFamilyIdx + 1) % raga.progressions.length;

    // Advance arrangement arc (Dawn -> Awakening -> Cosmic -> Euphoria -> Breakdown -> Awakening...)
    const nextArcOrder = [1, 2, 3, 4, 0, 1, 2, 4, 3];
    arcPhaseIdx = nextArcOrder[Math.floor(bar / 8) % nextArcOrder.length];

    // Pick a bass archetype suited to the new arc phase
    if (arcPhaseIdx === 0 || arcPhaseIdx === 4) {
      bassArchIdx = Math.random() < 0.5 ? 4 : 2;
    } else {
      bassArchIdx = Math.floor(Math.random() * 4);
    }

    // Generate a fresh cosmic arpeggiator permutation
    const len = 8;
    arpPattern = Array.from({ length: len }, (_, i) => {
      if (i === 0) return 0;
      return Math.floor(Math.random() * 5);
    });
  }

  // Morph into a new Raga / Modal World every 16 bars
  function morphSixteenBarRaga() {
    // Choose a next raga world (preferring adjacent/smooth modal transition)
    const offset = Math.random() < 0.7 ? 1 : 2;
    scaleIdx = (scaleIdx + offset) % RAGA_WORLDS.length;
    const raga = RAGA_WORLDS[scaleIdx];
    const prog = raga.progressions[progFamilyIdx % raga.progressions.length];
    const chordObj = prog[0];

    // Herald the new raga world with a gentle BT micro-harp cascade
    playMicroHarpCascade(raga.midiRoot, chordObj.tones, 5, 70, 0.10);
  }

  // Compute the next bass MIDI note using the active Raga's Arohana/Avarohana & current chord
  function pickBassMidi(raga, chordObj, stepInBar, arch) {
    const baseRoot = raga.midiRoot - 12; // Deep bass register (e.g. G2..C3)
    const chordRoot = baseRoot + chordObj.root;
    const scale = ragaAscending ? raga.arohana : raga.avarohana;

    let semitoneOffset = chordObj.root;

    if (stepInBar === 0 || stepInBar === 8) {
      // Anchor beat 1 & beat 3 on the current chord root or vadi
      semitoneOffset = chordObj.root;
    } else if (arch.degMode === "chordFifths") {
      // Lindstrøm cosmic disco alternating root, 5th, octave, and 7th of current chord
      const cTones = chordObj.tones;
      const pick = cTones[(stepInBar >> 1) % Math.min(4, cTones.length)];
      semitoneOffset = pick;
    } else if (arch.degMode === "ragaVadi") {
      // Emphasize Vadi (king) and Samvadi (queen) degrees of the Raga
      if (stepInBar % 4 === 2) {
        semitoneOffset = raga.arohana[raga.vadi % raga.arohana.length];
      } else if (stepInBar % 4 === 3) {
        semitoneOffset = raga.arohana[raga.samvadi % raga.arohana.length];
      } else {
        semitoneOffset = chordObj.tones[stepInBar % 3];
      }
    } else if (arch.degMode === "arohanaWave") {
      // Walk up Arohana and down Avarohana like Charanjit Singh's TB-303 raga lines
      ragaScaleCursor += ragaAscending ? 1 : -1;
      if (ragaScaleCursor >= scale.length - 1) {
        ragaScaleCursor = scale.length - 1;
        ragaAscending = false;
      } else if (ragaScaleCursor <= 0) {
        ragaScaleCursor = 0;
        ragaAscending = true;
      }
      semitoneOffset = raga.arohana[clamp(ragaScaleCursor, 0, raga.arohana.length - 1)];
    } else if (arch.degMode === "rootFifth") {
      semitoneOffset = stepInBar % 6 === 0 ? chordObj.root : chordObj.tones[Math.min(2, chordObj.tones.length - 1)];
    } else {
      // "ragaWalk": blend current chord tones with adjacent raga scale steps
      if (Math.random() < 0.62) {
        semitoneOffset = chordObj.tones[stepInBar % Math.min(4, chordObj.tones.length)];
      } else {
        const idx = (stepInBar + barCount) % raga.arohana.length;
        semitoneOffset = raga.arohana[idx];
      }
    }

    const octShift = arch.octaves[stepInBar] ? 12 : 0;
    // Occasional high-octave Charanjit 303 leap on offbeats
    const extraOct = (stepInBar % 4 === 3 && Math.random() < 0.16) ? 12 : 0;
    return clamp(baseRoot + semitoneOffset + octShift + extraOct, 36, 64);
  }

  // ============================================================================
  // GHOSTS.GARDEN 2D SWING TIME-WARP MAP (Direct port of ghosts-garden/src/garden-swing.js)
  //  - X axis (0..1): interior timing ratio (short-long <-> even <-> long-short:
  //    suku 22:34:44, manjanin 27:33:40, sumalen 40:33:27, samba, Dilla-late, drunk, triplet 2:1)
  //  - Y axis (0..1): pulse rate & subdivision cardinality (1/4 pairs -> 1/8 pairs ->
  //    1/8T x3 -> 1/16 pairs -> 1/16 x4 -> 1/16T x3 -> 1/32 pairs)
  //  - compile(x, y): returns a monotone, bar-preserving continuous time-warp function b -> warped(b)
  // ============================================================================
  const SWING_T3 = [1 / 3, 2 / 3];
  const SWING_SUKU = [0.22, 0.56]; // Bamana/Malinke suku 22:34:44
  const SWING_LMS = [0.44, 0.78];  // sumalen mirror 44:34:22
  const SWING_Q4 = [0.25, 0.5, 0.75];
  const SWING_SAMBA = [0.7 / 3, 1.4 / 3, 0.7]; // Brazilian 16th-esquina
  const SWING_DRUNK = [0.31, 0.53, 0.82];      // Dilla / drunk 4-cell
  const SWING_LERP = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

  const SWING_ROWS = [
    { cell: 2.0,     n: 2, lbl: "1/4 pairs" },
    { cell: 1.0,     n: 2, lbl: "1/8 pairs" },
    { cell: 1.0,     n: 3, lbl: "1/8T x3" },
    { cell: 0.5,     n: 2, lbl: "1/16 pairs" },
    { cell: 1.0,     n: 4, lbl: "1/16 x4" },
    { cell: 0.5,     n: 3, lbl: "1/16T x3" },
    { cell: 0.25,    n: 2, lbl: "1/32 pairs" },
  ];

  function swingOnsets(n, x) {
    if (n === 2) return [clamp(0.32 + x * 0.43, 0.2, 0.8)];
    if (n === 3) {
      return x < 0.5
        ? SWING_LERP(SWING_SUKU, SWING_T3, x * 2)
        : SWING_LERP(SWING_T3, SWING_LMS, (x - 0.5) * 2);
    }
    return x < 0.5
      ? SWING_LERP(SWING_SAMBA, SWING_Q4, x * 2)
      : SWING_LERP(SWING_Q4, SWING_DRUNK, (x - 0.5) * 2);
  }

  function swingRowWarp(row, x, b) {
    const { cell, n } = row;
    const k = Math.floor(b / cell + 1e-9);
    const u = clamp((b - k * cell) / cell, 0, 1);
    const o = swingOnsets(n, x);
    for (let i = 0; i < n; i++) {
      const u0 = i / n;
      const u1 = (i + 1) / n;
      if (u <= u1 || i === n - 1) {
        const w0 = i === 0 ? 0 : o[i - 1];
        const w1 = i === n - 1 ? 1 : o[i];
        return (k + w0 + ((u - u0) * (w1 - w0)) / (u1 - u0)) * cell;
      }
    }
    return b;
  }

  const SWING_LANDMARKS = [
    { x: 0.42, y: 1 / 6, tag: "even 8ths" },
    { x: 0.65, y: 1 / 6, tag: "quintuplet 3:2" },
    { x: 0.81, y: 1 / 6, tag: "triplet 2:1" },
    { x: 0.96, y: 1 / 6, tag: "hard 3:1" },
    { x: 0.14, y: 1 / 6, tag: "Scotch snap" },
    { x: 0.0,  y: 2 / 6, tag: "suku 22:34:44" },
    { x: 0.22, y: 2 / 6, tag: "manjanin 27:33:40" },
    { x: 0.5,  y: 2 / 6, tag: "even triplet" },
    { x: 0.85, y: 2 / 6, tag: "sumalen 40:33:27" },
    { x: 0.66, y: 3 / 6, tag: "laid-back 16ths" },
    { x: 0.05, y: 4 / 6, tag: "samba" },
    { x: 0.95, y: 4 / 6, tag: "drunk 16ths" },
    { x: 0.72, y: 0,     tag: "limp" },
  ];

  const GhostsGardenSwingMap = {
    ROWS: SWING_ROWS,
    LM: SWING_LANDMARKS,
    compile(x, y) {
      x = clamp(x, 0, 1);
      y = clamp(y, 0, 1);
      if (Math.abs(x - 0.42) < 0.015 && Math.abs(y - 1 / 6) < 0.04) return (b) => b;
      const yf = y * (SWING_ROWS.length - 1);
      const r0 = Math.min(SWING_ROWS.length - 2, Math.floor(yf));
      const ty = yf - r0;
      const R0 = SWING_ROWS[r0];
      const R1 = SWING_ROWS[r0 + 1];
      return (b) => (1 - ty) * swingRowWarp(R0, x, b) + ty * swingRowWarp(R1, x, b);
    },
    describe(x, y) {
      const R = SWING_ROWS[Math.round(clamp(y, 0, 1) * (SWING_ROWS.length - 1))];
      const o = swingOnsets(R.n, clamp(x, 0, 1));
      const pts = [0, ...o, 1];
      const d = pts.slice(1).map((v, i) => Math.round((v - pts[i]) * 100));
      let near = null;
      let bd = 0.018;
      for (const l of SWING_LANDMARKS) {
        const dd = (l.x - x) * (l.x - x) + (l.y - y) * (l.y - y);
        if (dd < bd) {
          bd = dd;
          near = l.tag;
        }
      }
      return `${R.lbl} ${d.join(":")}${near ? " · " + near : ""}`;
    },
  };

  // ============================================================================
  // BELE DANCE / MIDI GARDEN FELT & TINE PIANO (Ported from ghosts-garden/src/garden-panel-keys.js)
  //  - Action 0 ("FELT"): Soft upright felt piano with 3 detuned strings per note,
  //    stretched partials f_k = f_r * k * sqrt(1 + 0.0004*k^2), prompt + after-sound
  //    two-stage decay, and cushioned felt-hammer wooden key-bed thump.
  //  - Action 1 ("TINE"): Fender Rhodes asymmetric cantilever tine + pickup bark + suitcase pan vibrato.
  //  - Action 2 ("REED"): Wurlitzer 200A clamped steel reed with odd-harmonic bite.
  // ============================================================================
  const PNO_ACTIONS = {
    FELT: { B: 0.0004,  index: 1.5, roll: 1.55, odd: 1.0,  tine: 0.16, thump: 0.09, bark: 0.2 },
    TINE: { B: 0.00012, index: 2.3, roll: 1.25, odd: 0.55, tine: 0.55, thump: 0.06, bark: 1.4 },
    REED: { B: 0.00025, index: 2.8, roll: 1.15, odd: 1.55, tine: 0.15, thump: 0.08, bark: 2.1 },
  };

  function playGardenPiano(midi, dur = 1.9, actionName = "FELT", vel = 0.16, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const actKey = PNO_ACTIONS[actionName] ? actionName : "FELT";
    const A = PNO_ACTIONS[actKey];
    const r = Math.max(24, Math.min(88, Math.round(midi)));
    const f = mtof(r);
    const key = `gardenPno:${actKey}:${r}`;

    playBufferCached(
      key,
      (sr) => {
        const reg = clamp((r - 36) / 48, 0, 1);
        const tAfter = (2.6 - reg * 1.45) * 0.92;
        const tPrompt = tAfter * 0.22;
        const len = Math.floor(sr * Math.min(3.4, tAfter + 0.35));
        const d = new Float32Array(len);

        // 1. Stretched-partial 3-unison string / tine / reed modal bank
        const nPartials = Math.min(18, Math.floor((sr * 0.42) / f));
        const modes = [];
        const unisonCents = [-1.8, 0, 1.9];
        for (let k = 1; k <= nPartials; k++) {
          const fk = f * k * Math.sqrt(1 + A.B * k * k);
          if (fk > sr * 0.43) break;
          const roll = Math.pow(k, -A.roll);
          const oddW = k % 2 === 0 ? A.odd : 1;
          const strikeNode = Math.abs(Math.sin((Math.PI * k) / 7.5)) + 0.15;
          const amp = roll * oddW * strikeNode * (k === 1 ? 1.15 : 0.72);
          const tkAfter = Math.max(0.035, tAfter * Math.pow(k, -0.78));
          const tkPrompt = Math.max(0.015, tPrompt * Math.pow(k, -0.9));

          if (k <= 4) {
            for (let u = 0; u < unisonCents.length; u++) {
              const fu = fk * Math.pow(2, unisonCents[u] / 1200);
              modes.push({ f: fu, a: amp * 0.22, t: tkAfter });
              modes.push({ f: fu, a: amp * 0.14, t: tkPrompt });
            }
          } else {
            modes.push({ f: fk, a: amp * 0.55, t: tkPrompt });
          }
        }

        // Rhodes / Wurlitzer clangor tine overtones (7.1x & 11.4x)
        if (A.tine > 0.08 && f * 7.1 < sr * 0.43) {
          modes.push(
            { f: f * 7.1,  a: A.tine * 0.18 * (0.45 + 0.55 * reg), t: 0.16 - reg * 0.06 },
            { f: f * 11.4, a: A.tine * 0.07 * (0.45 + 0.55 * reg), t: 0.07 }
          );
        }

        const exc = contactPulse(sr, 0.0022 - reg * 0.001, true);
        runComplexModes(d, exc, modes, sr);

        // 2. Cushioned felt hammer / key-bed thump
        const thumpLen = Math.min(len, Math.floor(sr * 0.032));
        const thump = new Float32Array(thumpLen);
        const R = makeRng(r * 97 + actKey.charCodeAt(0));
        for (let i = 0; i < thumpLen; i++) {
          thump[i] = (R() * 2 - 1) * Math.exp(-i / (sr * 0.0055)) * A.thump;
        }
        applyBiquad(thump, "bp", 135 + reg * 180, 1.5, sr);
        for (let i = 0; i < thumpLen; i++) d[i] += thump[i];

        // 3. Asymmetric pickup bark saturation for TINE / REED, warm silk for FELT
        const bark = A.bark;
        if (bark > 0.35) {
          for (let i = 0; i < len; i++) {
            const env = Math.exp(-i / (sr * 0.18));
            const g = 1 + bark * 1.6 * env;
            const x = d[i] * g;
            d[i] = (Math.tanh(x + 0.14 * x * x) - Math.tanh(0.14)) / Math.tanh(g);
          }
        }

        applyBiquad(d, "lp", actKey === "FELT" ? 2650 : 3400, 0.72, sr);
        return finishTake(d, sr, 0.78, 32);
      },
      vel * pitchAtten(f),
      true,
      true,
      when,
      rnd(-0.28, 0.28)
    );
  }

  // ============================================================================
  // BELE DANCE / BELE DANCE KIDS DRUM & FORMANT SYNTHESIZER
  // Ported from M5Cardputer app_bele_dance.cpp (Presets: HEX-5, ROSEWD, NANOLP,
  // BEATBX, ZAP, TKO, 80sSAM) + Autechre/Aphex Twin micro-glitch ratchet engine
  // ============================================================================
  function triggerSingleBeleDrumHit(pad = 0, preset = "HEX-5", vel = 0.16, when = null, pitchScale = 1.0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const p = ((pad % 8) + 8) % 8;
    const key = `beleDrum:${preset}:${p}`;

    playBufferCached(
      key,
      (sr) => {
        const dur = p === 0 ? 0.34 : p === 4 ? 0.38 : 0.24;
        const len = Math.floor(sr * dur);
        const out = new Float32Array(len);
        const R = makeRng(p * 313 + preset.charCodeAt(0) * 17);

        if (preset === "ROSEWD") {
          // Tuned Rosewood Marimba / Woodblock percussion kit from Bele Dance
          const baseFreqs = [110, 165, 220, 293.66, 146.83, 329.63, 440, 587.33];
          const f0 = baseFreqs[p];
          const exc = contactPulse(sr, 0.0014, true);
          runComplexModes(
            out,
            exc,
            [
              { f: f0,         a: 1.0,  t: 0.22 },
              { f: f0 * 3.98,  a: 0.42, t: 0.065 },
              { f: f0 * 9.18,  a: 0.16, t: 0.022 },
              { f: f0 * 15.9,  a: 0.06, t: 0.009 },
            ],
            sr
          );
          applyBiquad(out, "lp", 3200, 0.8, sr);
        } else if (preset === "NANOLP" || preset === "ZAP") {
          // Autechre / Aphex Twin / Bele NANOLP FM & pitch-swept micro-glitch kit
          const fStart = [420, 1280, 2400, 860, 190, 3100, 1640, 680][p];
          const fEnd = [48, 220, 620, 140, 52, 890, 310, 2040][p];
          let ph = 0, fmPh = 0;
          for (let i = 0; i < len; i++) {
            const t = i / sr;
            const env = Math.exp(-t * (p === 0 || p === 4 ? 14 : 26));
            const curF = fEnd + (fStart - fEnd) * Math.exp(-t * 38);
            fmPh += (TAU * curF * 2.718) / sr;
            ph += (TAU * curF * (1 + 0.85 * Math.sin(fmPh) * env)) / sr;
            const click = i < sr * 0.003 ? (R() * 2 - 1) * 0.55 : 0;
            out[i] = (Math.sin(ph) * 0.8 + click) * env;
          }
          applyBiquad(out, "lp", 3800, 1.2, sr);
        } else {
          // HEX-5 / TKO / BEATBX classic Bele Dance Kids analog/modal kit:
          // 0: Punchy Simmons/808 Kick, 1: Crisp Snare, 2: Closed Hat, 3: Open Hat,
          // 4: Low Hex Tom, 5: Mid Hex Tom, 6: Analog Clap, 7: Rim / Cowbell
          if (p === 0) {
            const exc = contactPulse(sr, 0.0035, true);
            runComplexModes(
              out,
              exc,
              besselMembrane(54, 0.18, { t: 0.30, glide: { g0: 2.35, gt: 0.028 } }),
              sr
            );
            for (let i = 0; i < len; i++) out[i] = Math.tanh(out[i] * 1.45);
            applyBiquad(out, "lp", 480, 0.8, sr);
          } else if (p === 1) {
            const exc = contactPulse(sr, 0.0018, true);
            runComplexModes(
              out,
              exc,
              besselMembrane(188, 0.45, { t: 0.14, glide: { g0: 1.32, gt: 0.015 } }),
              sr
            );
            const snNoise = new Float32Array(len);
            for (let i = 0; i < len; i++) {
              snNoise[i] = (R() * 2 - 1) * Math.exp(-i / (sr * 0.065)) * 0.52;
            }
            applyBiquad(snNoise, "bp", 1850, 1.1, sr);
            for (let i = 0; i < len; i++) out[i] += snNoise[i];
          } else if (p === 2 || p === 3) {
            const decay = p === 2 ? 0.032 : 0.16;
            const ratios = [1, 1.342, 1.618, 1.927, 2.514, 3.18];
            let phases = [0, 0, 0, 0, 0, 0];
            for (let i = 0; i < len; i++) {
              const t = i / sr;
              const env = Math.exp(-t / decay);
              let s = (R() * 2 - 1) * 0.45;
              for (let rIdx = 0; rIdx < ratios.length; rIdx++) {
                phases[rIdx] += (TAU * 520 * ratios[rIdx]) / sr;
                s += (Math.sin(phases[rIdx]) > 0 ? 0.12 : -0.12);
              }
              out[i] = s * env;
            }
            applyBiquad(out, "hp", 3600, 0.85, sr);
          } else if (p === 4 || p === 5) {
            const fTom = p === 4 ? 98 : 148;
            const exc = contactPulse(sr, 0.0025, true);
            runComplexModes(
              out,
              exc,
              besselMembrane(fTom, 0.35, { t: 0.24, glide: { g0: 1.65, gt: 0.038 } }),
              sr
            );
            applyBiquad(out, "lp", 920, 0.85, sr);
          } else if (p === 6) {
            // Layered 4-burst analog handclap (808 / French House / Bele Dance)
            const offsets = [0, 0.011, 0.022, 0.034];
            for (let i = 0; i < len; i++) {
              const t = i / sr;
              let env = 0;
              for (let b = 0; b < offsets.length; b++) {
                const dt = t - offsets[b];
                if (dt >= 0) {
                  env += Math.exp(-dt / (b === 3 ? 0.085 : 0.007)) * (b === 3 ? 0.55 : 0.8);
                }
              }
              out[i] = (R() * 2 - 1) * env;
            }
            applyBiquad(out, "bp", 1250, 1.65, sr);
          } else {
            // Rimshot / Clave
            const exc = contactPulse(sr, 0.0009, true);
            runComplexModes(
              out,
              exc,
              [
                { f: 495,  a: 0.75, t: 0.028 },
                { f: 1180, a: 0.85, t: 0.018 },
                { f: 2240, a: 0.35, t: 0.010 },
              ],
              sr
            );
          }
        }
        return finishTake(out, sr, 0.78, 12);
      },
      vel,
      p === 1 || p === 6,
      p >= 4,
      when,
      rnd(-0.2, 0.2),
      pitchScale
    );
  }

  // Supports Autechre / Aphex Twin / BT micro-glitch ratchets & pitch-slipped buffer stutters!
  function playBeleDrum(pad = 0, preset = "HEX-5", vel = 0.16, when = null, ratchets = 1, ratchetSpan = 0.11, pitchSlip = 0) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t0 = when != null ? when : c.currentTime;
    const count = Math.max(1, Math.min(8, Math.round(ratchets || 1)));
    if (count === 1) {
      triggerSingleBeleDrumHit(pad, preset, vel, t0, 1.0);
      return;
    }
    const subDur = ratchetSpan / count;
    for (let r = 0; r < count; r++) {
      const frac = r / Math.max(1, count - 1);
      const pScale = clamp(1.0 + pitchSlip * frac, 0.45, 2.2);
      const hitVel = vel * (0.95 - 0.35 * Math.sin(Math.PI * frac));
      triggerSingleBeleDrumHit(pad, preset, hitVel, t0 + r * subDur, pScale);
    }
  }

  // Bele Dance 3-Formant Sung Vocal / Vocoder Phrase Synth (from app_bele_dance.cpp)
  const BELE_VOWEL_FORMANTS = [
    { f1: 730, f2: 1090, f3: 2440 }, // AA ("A", "LA")
    { f1: 530, f2: 1840, f3: 2480 }, // EH ("BE", "LE")
    { f1: 310, f2: 2290, f3: 3010 }, // IY ("DI", "GI")
    { f1: 570, f2: 840,  f3: 2410 }, // OW ("RO", "LO")
    { f1: 300, f2: 870,  f3: 2240 }, // UW ("MU", "NU")
  ];

  function playBeleFormantWord(phraseIdx = 0, midi = 60, dur = 0.48, vel = 0.12, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t = when != null ? when : c.currentTime;
    const f0 = mtof(clamp(midi, 45, 76));
    const vStart = BELE_VOWEL_FORMANTS[phraseIdx % BELE_VOWEL_FORMANTS.length];
    const vEnd = BELE_VOWEL_FORMANTS[(phraseIdx + 2) % BELE_VOWEL_FORMANTS.length];

    const src = c.createOscillator();
    src.type = "sawtooth";
    src.frequency.setValueAtTime(f0, t);
    src.frequency.linearRampToValueAtTime(f0 * 1.006, t + dur);

    const sub = c.createOscillator();
    sub.type = "square";
    sub.frequency.setValueAtTime(f0 * 0.5, t);
    const subGain = c.createGain();
    subGain.gain.value = 0.25;
    sub.connect(subGain);

    const sum = c.createGain();
    const formants = [
      [vStart.f1, vEnd.f1, 7.5, 1.0],
      [vStart.f2, vEnd.f2, 9.5, 0.58],
      [vStart.f3, vEnd.f3, 11.0, 0.26],
    ];
    for (const [fA, fB, q, gVal] of formants) {
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(fA, t);
      bp.frequency.exponentialRampToValueAtTime(Math.max(120, fB), t + dur * 0.85);
      bp.Q.value = q;
      const fg = c.createGain();
      fg.gain.value = gVal;
      src.connect(bp);
      subGain.connect(bp);
      bp.connect(fg);
      fg.connect(sum);
    }

    const env = c.createGain();
    const v = vel * pitchAtten(f0);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(v, t + 0.045);
    env.gain.setValueAtTime(v * 0.85, t + dur * 0.7);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.14);

    sum.connect(env);
    env.connect(master);
    if (delay) env.connect(delay);
    if (reverb) env.connect(reverb);

    src.start(t);
    sub.start(t);
    src.stop(t + dur + 0.18);
    sub.stop(t + dur + 0.18);
  }

  // ============================================================================
  // EMBEDDED CSOUND ORCHESTRA INSTRUMENTS (Direct port of ghosts-garden/src/csound.js)
  //  - Instr 10 (`fmbell`): Chowning 1:1.4 FM bell with stereo weeping modulator
  //    ratios kmL/kmR, pitch sag cent(-4*iw*kease), octave-down hum, and 3.9x/2.76x strike
  //  - Instr 11 (`fmtine`): 1:1 FM Rhodes tine with stereo weep & 7x metallic "tink"
  //  - Instr 12 (`fmpad`): Breathing index 1:1 FM pad with stereo ratio drift
  //  - Instr 13 (`fmswirl`): Orbiting stereo cloud of `fmtine` grains across octaves
  //  - Instr 14 (`bowl`): 4-partial beating-pair singing bowl [1, 2.76, 5.18, 8.3]
  //  - Instr 15/16 (`chant`): IRCAM CHANT 5-formant Dodge & Jerse `VT` table choir
  // ============================================================================
  // Exact 300-entry Dodge & Jerse vocal-tract formant table from ghosts-garden/src/csound.js:
  // 4 voice types (0:bass, 1:tenor, 2:alto, 3:soprano) x 5 vowels (0:a, 1:e, 2:i, 3:o, 4:u)
  // x 15 values (5 formants f1..f5, 5 bandwidths b1..b5, 5 linear amplitudes a1..a5)
  const CSOUND_VT_TABLE = [
    600,1040,2250,2450,2750, 60,70,110,120,130, 1,.447,.112,.112,.01,
    400,1620,2400,2800,3100, 40,80,100,120,120, 1,.251,.355,.251,.05,
    250,1750,2600,3050,3340, 60,90,100,120,120, 1,.032,.158,.079,.016,
    400,750,2400,2600,2900,  40,80,100,120,120, 1,.282,.089,.1,.01,
    350,600,2400,2675,2950,  40,80,100,120,120, 1,.1,.025,.04,.005,
    650,1080,2650,2900,3250, 80,90,120,130,140, 1,.501,.447,.398,.079,
    400,1700,2600,3200,3580, 70,80,100,120,120, 1,.199,.251,.199,.05,
    290,1870,2800,3250,3540, 40,90,100,120,120, 1,.178,.1,.126,.032,
    400,800,2600,2800,3000,  40,80,100,120,120, 1,.316,.251,.251,.05,
    350,600,2700,2900,3300,  40,60,100,120,120, 1,.1,.141,.1,.025,
    700,1150,2800,3000,3350, 80,90,120,130,140, 1,.631,.316,.158,.063,
    420,1800,2700,3300,3700, 60,80,110,130,140, 1,.158,.199,.126,.04,
    300,2100,2900,3400,3700, 50,90,100,120,130, 1,.1,.126,.079,.025,
    430,820,2700,3000,3300,  50,80,100,120,130, 1,.316,.158,.126,.032,
    370,630,2750,3000,3400,  50,60,100,120,130, 1,.1,.071,.05,.016,
    800,1150,2900,3900,4950, 80,90,120,130,140, 1,.501,.032,.1,.003,
    350,2000,2800,3600,4950, 60,100,120,150,200, 1,.1,.178,.01,.001,
    270,2140,2950,3900,4950, 60,90,100,120,120, 1,.251,.05,.05,.006,
    450,800,2830,3800,4950,  70,80,100,130,135, 1,.282,.079,.079,.003,
    325,700,2700,3800,4950,  50,60,170,180,200, 1,.158,.018,.01,.001,
  ];

  // Csound Instr 10 (`fmbell`): Chowning 1:1.4 FM bell with weeping modulator ratio
  function playCsoundFmBell(midi = 65, dur = 3.2, weep = 0.65, vel = 0.14, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const r = Math.max(36, Math.min(84, Math.round(midi)));
    const f = mtof(r);
    const iw = clamp(weep, 0, 1.5);
    const key = `csFmBell:${r}:${Math.round(iw * 10)}`;

    playBufferCached(
      key,
      (sr) => {
        const len = Math.floor(sr * Math.min(3.6, dur));
        const out = new Float32Array(len);
        let pCar = 0, pMod = 0, pHum = 0, pS1 = 0, pS2 = 0;
        const R = makeRng(r * 41 + 7);
        let rndDrift = 0;

        for (let i = 0; i < len; i++) {
          const t = i / sr;
          const kease = Math.pow(1 - Math.exp(-t * 1.15), 2);
          const ksag = Math.pow(2, (-4 * iw * kease) / 1200);
          const kf = f * ksag;
          if ((i & 63) === 0) {
            rndDrift += (R() * 2 - 1 - rndDrift * 0.25) * 0.0005;
          }
          const km = 1.4142 * (1 - iw * 0.011 * kease + rndDrift);
          const kidx = 2.8 * Math.exp(-t * (2.6 / Math.max(1, dur))) + 0.22;
          const kamp = Math.min(1, t / 0.002) * Math.exp(-t * (4.2 / Math.max(1, dur)));
          const kstr = Math.min(1, t / 0.0007) * Math.exp(-t / 0.055);

          pMod += (TAU * kf * km) / sr;
          pCar += (TAU * kf) / sr;
          pHum += (TAU * kf * 0.5) / sr;
          pS1 += (TAU * kf * 3.92) / sr;
          pS2 += (TAU * kf * 2.76) / sr;

          const body = Math.sin(pCar + kidx * Math.sin(pMod)) * kamp;
          const hum = Math.sin(pHum) * kamp * 0.20;
          const strike = Math.sin(pS1 + 1.8 * Math.sin(pS2)) * kstr * 0.26;
          out[i] = body + hum + strike;
        }
        applyBiquad(out, "lp", 3400, 0.72, sr);
        return finishTake(out, sr, 0.78, 24);
      },
      vel * pitchAtten(f),
      true,
      true,
      when,
      rnd(-0.35, 0.35)
    );
  }

  // Csound Instr 11 (`fmtine`): 1:1 FM body with stereo weep & 7x FM strike "tink"
  function playCsoundFmTine(midi = 62, dur = 2.2, weep = 0.6, vel = 0.14, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const r = Math.max(36, Math.min(84, Math.round(midi)));
    const f = mtof(r);
    const iw = clamp(weep, 0, 1.5);
    const key = `csFmTine:${r}:${Math.round(iw * 10)}`;

    playBufferCached(
      key,
      (sr) => {
        const len = Math.floor(sr * Math.min(2.8, dur));
        const out = new Float32Array(len);
        let pCar = 0, pMod = 0, pTk1 = 0, pTk2 = 0;

        for (let i = 0; i < len; i++) {
          const t = i / sr;
          const kease = 1 - Math.exp(-t * 1.4);
          const ksag = Math.pow(2, (-3.5 * iw * kease) / 1200);
          const kf = f * ksag;
          const km = 1.0 - iw * 0.0085 * kease;
          const kidx = 2.1 * Math.exp(-t / 0.22) + 0.35 * Math.exp(-t / Math.max(0.5, dur));
          const kamp = Math.min(1, t / 0.002) * Math.exp(-t * (3.8 / Math.max(0.8, dur)));
          const ktink = Math.min(1, t / 0.0006) * Math.exp(-t / 0.042);

          pMod += (TAU * kf * km) / sr;
          pCar += (TAU * kf) / sr;
          pTk1 += (TAU * kf * 7.02) / sr;
          pTk2 += (TAU * kf * 1.414) / sr;

          const body = Math.sin(pCar + kidx * Math.sin(pMod)) * kamp;
          const tink = Math.sin(pTk1 + 1.4 * Math.sin(pTk2)) * ktink * 0.28;
          out[i] = body + tink;
        }
        applyBiquad(out, "lp", 3200, 0.74, sr);
        return finishTake(out, sr, 0.78, 24);
      },
      vel * pitchAtten(f),
      true,
      true,
      when,
      rnd(-0.35, 0.35)
    );
  }

  // Csound Instr 12 (`fmpad`): Breathing index 1:1 FM pad with independent ratio drift
  function playCsoundFmPad(midi = 58, dur = 4.2, weep = 0.65, vel = 0.10, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t = when != null ? when : c.currentTime;
    const f = mtof(clamp(midi, 36, 76));

    const carL = c.createOscillator();
    const carR = c.createOscillator();
    const modL = c.createOscillator();
    const modR = c.createOscillator();
    const modGainL = c.createGain();
    const modGainR = c.createGain();

    carL.frequency.setValueAtTime(f * 0.9985, t);
    carR.frequency.setValueAtTime(f * 1.0015, t);
    modL.frequency.setValueAtTime(f * (1.0 - 0.004 * weep), t);
    modR.frequency.setValueAtTime(f * (2.0 + 0.005 * weep), t);

    // Breathing FM index envelope
    const idxHz = f * (0.45 + 0.85 * weep);
    modGainL.gain.setValueAtTime(f * 0.2, t);
    modGainL.gain.linearRampToValueAtTime(idxHz, t + dur * 0.45);
    modGainL.gain.exponentialRampToValueAtTime(f * 0.15, t + dur);

    modGainR.gain.setValueAtTime(f * 0.18, t);
    modGainR.gain.linearRampToValueAtTime(idxHz * 0.75, t + dur * 0.55);
    modGainR.gain.exponentialRampToValueAtTime(f * 0.12, t + dur);

    modL.connect(modGainL);
    modR.connect(modGainR);
    modGainL.connect(carL.frequency);
    modGainR.connect(carR.frequency);

    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1450, t);
    lp.Q.value = 0.7;

    const env = c.createGain();
    const v = vel * pitchAtten(f);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(v, t + dur * 0.25);
    env.gain.setValueAtTime(v * 0.9, t + dur * 0.7);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.35);

    carL.connect(lp);
    carR.connect(lp);
    lp.connect(env);
    env.connect(master);
    if (reverb) env.connect(reverb);

    carL.start(t);
    carR.start(t);
    modL.start(t);
    modR.start(t);
    const stopT = t + dur + 0.4;
    carL.stop(stopT);
    carR.stop(stopT);
    modL.stop(stopT);
    modR.stop(stopT);
  }

  // Csound Instr 13 (`fmswirl`): Orbiting stereo cloud of `fmtine` grains across octaves
  function playCsoundFmSwirl(midi = 60, dur = 3.2, weep = 0.75, vel = 0.11, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t0 = when != null ? when : c.currentTime;
    const octs = [0, 12, 0, 12, 24, 0, 12, -12];
    const nGrains = Math.min(10, Math.max(5, Math.round(dur * 3)));
    for (let k = 0; k < nGrains; k++) {
      const dt = (k / nGrains) * dur * 0.68;
      const gDur = dur - dt * 0.65;
      const note = clamp(midi + octs[k % octs.length], 42, 82);
      playCsoundFmTine(note, gDur, weep, vel * 0.42, t0 + dt);
    }
  }

  // Csound Instr 14 (`bowl`): 4-partial beating-pair singing bowl [1, 2.76, 5.18, 8.3]
  function playCsoundSingingBowl(midi = 58, dur = 3.6, vel = 0.15, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const r = Math.max(36, Math.min(78, Math.round(midi)));
    const f = mtof(r);
    const key = `csBowl:${r}`;

    playBufferCached(
      key,
      (sr) => {
        const len = Math.floor(sr * Math.min(4.0, dur));
        const out = new Float32Array(len);
        const exc = contactPulse(sr, 0.0045, true);
        runComplexModes(
          out,
          exc,
          [
            ...modePair(f,        0.55, 3.2, 0.9, 0.52),
            ...modePair(f * 2.76, 0.28, 2.4, 1.9, 0.48),
            ...modePair(f * 5.18, 0.11, 1.5, 3.1, 0.50),
            { f: f * 8.3, a: 0.04, t: 0.75 },
          ],
          sr
        );
        return finishTake(out, sr, 0.78, 32);
      },
      vel * pitchAtten(f),
      true,
      true,
      when,
      rnd(-0.25, 0.25)
    );
  }

  // Csound Instr 15/16 (`chant`): IRCAM CHANT 5-formant Dodge & Jerse `VT` table choir
  // Morphs continuously from vowel `v1` (0:a, 1:e, 2:i, 3:o, 4:u) to `v2` across `voice` (0:bass..3:soprano)
  function playCsoundChantChoir(midi = 58, dur = 3.2, v1 = 0, v2 = 3, voice = 2, vel = 0.12, when = null) {
    const c = ensureCtx();
    if (!c || muted) return;
    const t = when != null ? when : c.currentTime;
    const f = mtof(clamp(midi, 36, 78));
    const vc = clamp(Math.round(voice), 0, 3);
    const vw1 = clamp(Math.round(v1), 0, 4);
    const vw2 = clamp(Math.round(v2), 0, 4);
    const ib1 = (vc * 5 + vw1) * 15;
    const ib2 = (vc * 5 + vw2) * 15;

    // 3 detuned pulse/sawtooth glottal sources with Csound pitch scoop (-35 cents -> 0) & blooming vibrato
    const mix = c.createGain();
    const detunes = [-5.5, 0, 6.2];
    const oscs = [];
    for (let dIdx = 0; dIdx < detunes.length; dIdx++) {
      const o = c.createOscillator();
      o.type = "sawtooth";
      const fStart = f * Math.pow(2, -35 / 1200);
      o.frequency.setValueAtTime(fStart, t);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.22);
      o.detune.setValueAtTime(detunes[dIdx], t);
      o.connect(mix);
      o.start(t);
      o.stop(t + dur + 0.35);
      oscs.push(o);
    }

    // Blooming 5.3 Hz vibrato LFO
    const vibOsc = c.createOscillator();
    const vibGain = c.createGain();
    vibOsc.frequency.value = 5.3;
    vibGain.gain.setValueAtTime(0.01, t);
    vibGain.gain.linearRampToValueAtTime(f * 0.007, t + Math.min(dur * 0.5, 0.8));
    vibOsc.connect(vibGain);
    oscs.forEach((o) => vibGain.connect(o.frequency));
    vibOsc.start(t);
    vibOsc.stop(t + dur + 0.35);

    // 5 parallel Dodge & Jerse vocal-tract formant resonators morphing ib1 -> ib2
    const out = c.createGain();
    for (let k = 0; k < 5; k++) {
      const fStart = CSOUND_VT_TABLE[ib1 + k] || 800;
      const fEnd = CSOUND_VT_TABLE[ib2 + k] || fStart;
      const bw = CSOUND_VT_TABLE[ib1 + 5 + k] || 80;
      const aStart = CSOUND_VT_TABLE[ib1 + 10 + k] || 0.2;
      const aEnd = CSOUND_VT_TABLE[ib2 + 10 + k] || aStart;

      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(fStart, t);
      bp.frequency.exponentialRampToValueAtTime(Math.max(120, fEnd), t + dur * 0.85);
      bp.Q.value = clamp(fStart / Math.max(25, bw), 2.5, 18);

      const fg = c.createGain();
      fg.gain.setValueAtTime(aStart * 0.45, t);
      fg.gain.linearRampToValueAtTime(aEnd * 0.45, t + dur * 0.85);

      mix.connect(bp);
      bp.connect(fg);
      fg.connect(out);
    }

    const env = c.createGain();
    const v = vel * pitchAtten(f);
    const iatt = Math.min(0.42, dur * 0.25);
    const irel = Math.min(0.65, dur * 0.32);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(v, t + iatt);
    env.gain.setValueAtTime(v * 0.92, t + Math.max(iatt + 0.05, dur - irel));
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);

    out.connect(env);
    env.connect(master);
    if (reverb) env.connect(reverb);
  }

  // ============================================================================
  // GRAND FRENCH HOUSE / AIR PROGRESSIVE FILTER-PHASER & SIDECHAIN ENGINE
  // Inspired by Daft Punk ("Discovery" / "Voyager" / "One More Time") & Air ("Moon Safari")
  // ============================================================================
  function playFrenchHouseChordWave(midiNotes, dur = 1.95, filterCutoff = 1200, phaserCenter = 950, pumpDepth = 0.72, vel = 0.085, when = null) {
    const c = ensureCtx();
    if (!c || muted || !Array.isArray(midiNotes) || !midiNotes.length) return;
    const t = when != null ? when : c.currentTime;

    const sum = c.createGain();
    sum.gain.value = 1 / Math.sqrt(midiNotes.length);

    // Rich detuned saw + warm triangle ensemble per chord voice
    const oscs = [];
    for (let i = 0; i < midiNotes.length; i++) {
      const f = mtof(clamp(midiNotes[i], 42, 79));
      const o1 = c.createOscillator();
      const o2 = c.createOscillator();
      o1.type = "sawtooth";
      o2.type = "triangle";
      o1.frequency.setValueAtTime(f * 0.997, t);
      o2.frequency.setValueAtTime(f * 1.003, t);
      o1.connect(sum);
      o2.connect(sum);
      o1.start(t);
      o2.start(t);
      o1.stop(t + dur + 0.15);
      o2.stop(t + dur + 0.15);
      oscs.push(o1, o2);
    }

    // Sweeping French-Touch 24dB dual-biquad resonant lowpass filter
    const lp1 = c.createBiquadFilter();
    const lp2 = c.createBiquadFilter();
    lp1.type = "lowpass";
    lp2.type = "lowpass";
    const cut0 = clamp(filterCutoff, 180, 3600);
    const cut1 = clamp(filterCutoff * 1.32, 220, 4200);
    lp1.frequency.setValueAtTime(cut0, t);
    lp1.frequency.exponentialRampToValueAtTime(cut1, t + dur * 0.65);
    lp1.frequency.exponentialRampToValueAtTime(cut0 * 0.88, t + dur);
    lp2.frequency.setValueAtTime(cut0, t);
    lp2.frequency.exponentialRampToValueAtTime(cut1, t + dur * 0.65);
    lp2.frequency.exponentialRampToValueAtTime(cut0 * 0.88, t + dur);
    lp1.Q.value = 2.4;
    lp2.Q.value = 1.6;

    // 2-stage Small-Stone / Krautrock stereo phaser notch pair
    const allp1 = c.createBiquadFilter();
    const allp2 = c.createBiquadFilter();
    allp1.type = "allpass";
    allp2.type = "allpass";
    allp1.frequency.setValueAtTime(phaserCenter, t);
    allp1.frequency.exponentialRampToValueAtTime(clamp(phaserCenter * 1.85, 300, 3200), t + dur);
    allp2.frequency.setValueAtTime(phaserCenter * 1.4, t);
    allp2.frequency.exponentialRampToValueAtTime(clamp(phaserCenter * 0.65, 240, 2800), t + dur);

    // Sidechain-pumping envelope (ducks on every quarter-note kick beat, then blooms up!)
    const pumpGain = c.createGain();
    const beatDur = dur / 4;
    const peakV = vel;
    const duckV = Math.max(0.008, vel * (1 - clamp(pumpDepth, 0.15, 0.88)));
    pumpGain.gain.setValueAtTime(duckV, t);
    for (let b = 0; b < 4; b++) {
      const bt = t + b * beatDur;
      pumpGain.gain.setValueAtTime(duckV, bt);
      pumpGain.gain.exponentialRampToValueAtTime(peakV, bt + beatDur * 0.72);
      pumpGain.gain.linearRampToValueAtTime(duckV * 1.2, bt + beatDur * 0.98);
    }
    pumpGain.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);

    // Connect dry + allpass phaser wet path
    sum.connect(lp1);
    lp1.connect(lp2);
    lp2.connect(pumpGain);
    lp2.connect(allp1);
    allp1.connect(allp2);
    const phaserWet = c.createGain();
    phaserWet.gain.value = 0.55;
    allp2.connect(phaserWet);
    phaserWet.connect(pumpGain);

    pumpGain.connect(master);
    if (reverb) pumpGain.connect(reverb);
    if (delay) pumpGain.connect(delay);
  }

  // ============================================================================
  // SASHA — "AIRDRAWNDAGGER" (Charlie May / Oberheim Xpander Progressive Pad &
  // "Cloud Cuckoo" / "Wavy Gravy" / "Immortal" / "Fundamental" Breakbeat Engine)
  // ============================================================================
  function playAirdrawndaggerPad(midiNotes, dur = 3.8, cutoff = 1350, vel = 0.088, when = null) {
    const c = ensureCtx();
    if (!c || muted || !Array.isArray(midiNotes) || !midiNotes.length) return;
    const t = when != null ? when : c.currentTime;

    const sum = c.createGain();
    sum.gain.value = 1 / Math.sqrt(midiNotes.length);

    // 3 detuned Oberheim Xpander-style voices per chord note (warm saw + triangle + silk pulse)
    for (let i = 0; i < midiNotes.length; i++) {
      const f = mtof(clamp(midiNotes[i], 40, 81));
      const o1 = c.createOscillator();
      const o2 = c.createOscillator();
      const o3 = c.createOscillator();
      o1.type = "sawtooth";
      o2.type = "triangle";
      o3.type = "sine";
      o1.frequency.setValueAtTime(f * 0.9965, t);
      o2.frequency.setValueAtTime(f * 1.0035, t);
      o3.frequency.setValueAtTime(f * 0.5, t);
      o1.connect(sum);
      o2.connect(sum);
      const subG = c.createGain();
      subG.gain.value = 0.35;
      o3.connect(subG);
      subG.connect(sum);
      o1.start(t);
      o2.start(t);
      o3.start(t);
      const stopT = t + dur + 0.55;
      o1.stop(stopT);
      o2.stop(stopT);
      o3.stop(stopT);
    }

    // Weightless Charlie May / Xpander 24dB dual-biquad filter breathing envelope
    const lp1 = c.createBiquadFilter();
    const lp2 = c.createBiquadFilter();
    lp1.type = "lowpass";
    lp2.type = "lowpass";
    const cLow = clamp(cutoff * 0.52, 220, 2400);
    const cPeak = clamp(cutoff * 1.48, 420, 3800);
    lp1.frequency.setValueAtTime(cLow, t);
    lp1.frequency.exponentialRampToValueAtTime(cPeak, t + dur * 0.54);
    lp1.frequency.exponentialRampToValueAtTime(cLow * 1.15, t + dur + 0.4);
    lp2.frequency.setValueAtTime(cLow, t);
    lp2.frequency.exponentialRampToValueAtTime(cPeak, t + dur * 0.54);
    lp2.frequency.exponentialRampToValueAtTime(cLow * 1.15, t + dur + 0.4);
    lp1.Q.value = 1.85;
    lp2.Q.value = 1.25;

    // Stereo allpass horizon shimmer
    const ap = c.createBiquadFilter();
    ap.type = "allpass";
    ap.frequency.setValueAtTime(780, t);
    ap.frequency.exponentialRampToValueAtTime(1920, t + dur);

    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(vel, t + dur * 0.32);
    env.gain.setValueAtTime(vel * 0.92, t + dur * 0.72);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.50);

    sum.connect(lp1);
    lp1.connect(lp2);
    lp2.connect(env);
    lp2.connect(ap);
    ap.connect(env);

    env.connect(master);
    if (reverb) env.connect(reverb);
    if (delay) env.connect(delay);
  }

  // ============================================================================
  // 5 COHERENT MUSICAL MODALITIES & TEMPLATED SUITE ENGINE
  //  0: RAGA // COSMIC MODAL
  //  1: GLITCH PIANO & BELE KIDS (Polyrhythms + ghosts.garden Swing Map)
  //  2: FILTER PHASER // RHODES ODYSSEY (Long-Form Filter-Phaser & Rhodes)
  //  3: CSOUND // ANTIKYTHERA SUITE (Embedded Csound Orchestra Suite)
  //  4: MODE V: PROGRESSIVE BREAKS // HORIZON (2-Step Breakbeat & Pads)
  // ============================================================================
  const MUSIC_MODALITIES = [
    {
      id: "RAGA_ITALO",
      name: "MODE I: RAGA // COSMIC MODAL",
      shortName: "I: RAGA // COSMIC",
      desc: "Resonant Ladder Ragas + Cosmic Arpeggiator + Bessel Tabla",
    },
    {
      id: "GLITCH_PIANO_SWING",
      name: "MODE II: GLITCH DRUMS & BELE PIANO",
      shortName: "II: GLITCH // PIANO",
      desc: "Bele Dance Felt Piano + Bele-Kids Glitch Drums + Polyrhythmic Swing Map",
    },
    {
      id: "FRENCH_HOUSE_AIR",
      name: "MODE III: FILTER PHASER & RHODES",
      shortName: "III: FILTER // PHASER",
      desc: "Long-Form Filter-Phaser Chord Waves + Sidechain Pump + Rhodes/Wurlitzer & Vocoder",
    },
    {
      id: "BT_BINARY_CSOUND",
      name: "MODE IV: CSOUND // ANTIKYTHERA SUITE",
      shortName: "IV: CSOUND // SUITE",
      desc: "Embedded Csound fmbell/fmtine/fmswirl/bowl/chant Choir + Clockwork Antikythera",
    },
    {
      id: "SASHA_AIRDRAWNDAGGER",
      name: "MODE V: PROGRESSIVE BREAKS // HORIZON",
      shortName: "V: PROG // BREAKS",
      desc: "Weightless 2-Step Progressive Breakbeats, Breathing Pads & Acoustic Guitar/Rhodes",
    },
  ];

  // Polyrhythmic time signatures for Modality 1 & Modality 3
  const POLYRHYTHM_METERS = [
    { label: "5/4 (20-STEP)",   stepsPerBar: 20, stepDurScale: 0.92, accents: [0, 6, 12, 16] },
    { label: "7/8 (14-STEP)",   stepsPerBar: 14, stepDurScale: 0.96, accents: [0, 4, 8, 11] },
    { label: "11/8 (22-STEP)",  stepsPerBar: 22, stepDurScale: 0.86, accents: [0, 6, 12, 16, 19] },
    { label: "13/16 (13-STEP)", stepsPerBar: 13, stepDurScale: 1.02, accents: [0, 5, 9] },
    { label: "4/4 x 5/16 POLY", stepsPerBar: 16, stepDurScale: 1.00, accents: [0, 5, 10, 15] },
  ];

  // 5-Movement Suite Template
  const BT_MOVEMENTS = [
    { name: "I. ANTIKYTHERA MECHANISM",         bars: 4, weep: 0.55 },
    { name: "II. BINARY HARMONIC ORBIT",        bars: 4, weep: 0.85 },
    { name: "III. CHANT FORMANT SANCTUARY",     bars: 4, weep: 0.72 },
    { name: "IV. CELESTIAL OVERTONE EPILOGUE",  bars: 4, weep: 0.95 },
    { name: "V. PROGRESSIVE HORIZON BREAKS",    bars: 4, weep: 0.68 },
  ];

  let modalityIdx = 0;          // Current active macro-modality (0..4)
  let autoCycleModalities = true; // Coherent multi-modal suite progression across bars
  let polyMeterIdx = 0;         // Current polyrhythmic meter index
  let swingMapX = 0.42;         // Current X on ghosts.garden 2D Swing Map
  let swingMapY = 1 / 6;        // Current Y on ghosts.garden 2D Swing Map
  let swingLandmarkIdx = 0;     // Target landmark on ghosts.garden Swing Map
  let btMovementIdx = 0;        // Current movement in 5-movement templated form (0..4)
  let frenchFilterPhase = 0;    // Long-form progressive filter-phaser sweep phase
  let airdrawnPhase = 0;        // Progressive horizon sweep phase

  function getActiveStepsPerBar() {
    if (modalityIdx === 1) {
      return POLYRHYTHM_METERS[polyMeterIdx % POLYRHYTHM_METERS.length].stepsPerBar;
    }
    if (modalityIdx === 3 && btMovementIdx === 0) {
      return 14; // 7/8 Clockwork Antikythera escapement meter
    }
    return 16;
  }

  function getActiveTimeSigLabel() {
    if (modalityIdx === 1) {
      return POLYRHYTHM_METERS[polyMeterIdx % POLYRHYTHM_METERS.length].label;
    }
    if (modalityIdx === 3) {
      return `${BT_MOVEMENTS[btMovementIdx % BT_MOVEMENTS.length].name} (${btMovementIdx === 0 ? "7/8" : "4/4"})`;
    }
    if (modalityIdx === 2) {
      return "4/4 FILTER PHASER SWEEP";
    }
    if (modalityIdx === 4) {
      return "4/4 PROGRESSIVE BREAK";
    }
    return "4/4 RAGA PULSE";
  }

  function advanceSwingTrajectory() {
    // Smoothly orbit toward the next landmark on the ghosts.garden 2D Swing Map!
    const target = SWING_LANDMARKS[swingLandmarkIdx % SWING_LANDMARKS.length];
    swingMapX += (target.x - swingMapX) * 0.28;
    swingMapY += (target.y - swingMapY) * 0.28;
    if (Math.hypot(target.x - swingMapX, target.y - swingMapY) < 0.06) {
      swingLandmarkIdx = (swingLandmarkIdx + 1) % SWING_LANDMARKS.length;
    }
  }

  function setModality(idx, manual = false) {
    const next = ((idx % MUSIC_MODALITIES.length) + MUSIC_MODALITIES.length) % MUSIC_MODALITIES.length;
    modalityIdx = next;
    if (manual) {
      // Pivot transition fanfare so manual mode switches also feel part of a coherent musical whole!
      const raga = RAGA_WORLDS[scaleIdx];
      const prog = raga.progressions[progFamilyIdx % raga.progressions.length];
      const chordObj = prog[chordIdx % prog.length];
      if (modalityIdx === 1) {
        playGardenPiano(raga.midiRoot + 12 + chordObj.root, 2.2, "FELT", 0.16);
        playBeleDrum(0, "ROSEWD", 0.15, null, 3, 0.12, 0.25);
      } else if (modalityIdx === 2) {
        const notes = chordObj.tones.slice(0, 4).map((t) => raga.midiRoot + t);
        playFrenchHouseChordWave(notes, 1.8, 1850, 1100, 0.75, 0.09);
        playGardenPiano(raga.midiRoot + 12 + chordObj.tones[1], 1.5, "TINE", 0.14);
      } else if (modalityIdx === 3) {
        playCsoundFmSwirl(raga.midiRoot + chordObj.root, 2.6, 0.75, 0.12);
        playCsoundSingingBowl(raga.midiRoot + 12, 3.0, 0.14);
      } else if (modalityIdx === 4) {
        const notes = chordObj.tones.slice(0, 5).map((t) => raga.midiRoot + t);
        playAirdrawndaggerPad(notes, 3.2, 1650, 0.092);
        playGuitar(raga.midiRoot + 12 + chordObj.tones[0], 2.4, 0.13);
        playCsoundFmTine(raga.midiRoot + 12 + chordObj.tones[2 % chordObj.tones.length], 2.2, 0.65, 0.12);
      } else {
        playMicroHarpCascade(raga.midiRoot, chordObj.tones, 4, 55, 0.12);
      }
    }
    return MUSIC_MODALITIES[modalityIdx].name;
  }

  function cycleModality() {
    return setModality(modalityIdx + 1, true);
  }

  // ---- MODALITY 1 STEP: AUTECHRE / APHEX GLITCH DRUMS + BELE FELT PIANO + SWING MAP ----
  function triggerGlitchPianoStep(stepInBar, stepsPerBar, raga, chordObj, when) {
    const meter = POLYRHYTHM_METERS[polyMeterIdx % POLYRHYTHM_METERS.length];
    advanceSwingTrajectory();

    // 1. Lyrical Avril 14th / Aisatsana / MIDI Garden Felt Piano & Tine Voicings
    const isAccentStep = meter.accents.includes(stepInBar);
    if (stepInBar === 0) {
      // Left-hand warm felt piano root + 5th + 9th broken chord
      const lhRoot = raga.midiRoot - 12 + chordObj.root;
      playGardenPiano(lhRoot, 2.6, "FELT", 0.165, when);
      playGardenPiano(lhRoot + 7, 2.4, "FELT", 0.125, when + 0.045);
      playGardenPiano(raga.midiRoot + chordObj.tones[Math.min(2, chordObj.tones.length - 1)], 2.2, "FELT", 0.135, when + 0.09);
    } else if (isAccentStep || stepInBar % 3 === 1) {
      // Right-hand delicate modal piano melody (alternating FELT and Rhodes TINE)
      const degIdx = (stepInBar + barCount) % raga.arohana.length;
      const melNote = raga.midiRoot + 12 + raga.arohana[degIdx];
      const action = stepInBar % 5 === 0 ? "TINE" : "FELT";
      playGardenPiano(melNote, 1.85, action, isAccentStep ? 0.145 : 0.105, when);
      // Occasional tender 6th or 3rd harmonic dyad
      if (isAccentStep && Math.random() < 0.55) {
        const harmNote = raga.midiRoot + chordObj.tones[(stepInBar >> 1) % chordObj.tones.length];
        playGardenPiano(harmNote, 1.9, "FELT", 0.10, when + 0.018);
      }
    }

    // 2. Bele Dance Rosewood Marimba polymetric 5-against-N counterpoint
    if (stepInBar % 5 === 0 || stepInBar === stepsPerBar - 2) {
      const roseNotePad = (stepInBar + chordIdx * 2) % 8;
      playBeleDrum(roseNotePad, "ROSEWD", 0.12, when, 1);
    }

    // 3. Bele-Dance-Kids Glitch Drums (Autechre / Aphex Twin micro-ratchets & pitch-slips)
    const presetCycle = ["HEX-5", "NANOLP", "HEX-5", "ZAP"][barCount % 4];
    if (stepInBar === 0 || (stepInBar === meter.accents[2] && Math.random() < 0.8)) {
      // Deep Simmons/808 kick with occasional double-stutter
      const rat = stepInBar > 0 && Math.random() < 0.35 ? 2 : 1;
      playBeleDrum(0, "HEX-5", 0.175, when, rat, 0.09, -0.15);
    }
    if (stepInBar === meter.accents[1] || stepInBar === meter.accents[meter.accents.length - 1]) {
      // Snare / Clap with Aphex-style rapid micro-ratchet roll on turnarounds!
      const isTurnaround = stepInBar === meter.accents[meter.accents.length - 1];
      const ratchets = isTurnaround ? (3 + (barCount % 4)) : 1;
      const slip = isTurnaround ? (barCount % 2 === 0 ? 0.45 : -0.35) : 0;
      playBeleDrum(1, presetCycle, 0.145, when, ratchets, 0.13, slip);
    }
    // Polyrhythmic Bele micro-hats & NANOLP blips warped by the ghosts.garden Swing Map
    if (stepInBar % 2 === 1 || Math.random() < 0.38) {
      const hatPad = stepInBar % 4 === 3 ? 3 : 2;
      const glitchRat = stepInBar % 7 === 6 ? 4 : 1;
      playBeleDrum(hatPad, stepInBar % 6 === 5 ? "NANOLP" : "HEX-5", 0.075, when, glitchRat, 0.08, 0.3);
    }

    // 4. Deep warm sub-bass anchor on beat 1 & polymetric mid-bar pivot
    if (stepInBar === 0 || stepInBar === meter.accents[1]) {
      playMorphingBassNote(raga.midiRoot - 12 + chordObj.root, {
        when,
        accent: stepInBar === 0,
        slide: true,
        cutoff: 290,
        res: 0.32,
        vel: 0.14,
      });
    }
  }

  // ---- MODALITY 2 STEP: GRAND FRENCH HOUSE // DAFT PUNK & AIR PROGRESSIVE ODYSSEY ----
  function triggerFrenchHouseAirStep(stepInBar, raga, chordObj, when) {
    frenchFilterPhase += 0.042;
    // 16-bar long-form progressive resonant filter & stereo phaser sweep (260 Hz -> 3400 Hz -> 380 Hz)
    const sweep01 = 0.5 - 0.5 * Math.cos((TAU * (barCount % 16 + stepInBar / 16)) / 16);
    const filterCut = 260 + Math.pow(sweep01, 1.55) * 3100;
    const phaserFreq = 420 + (0.5 + 0.5 * Math.sin(frenchFilterPhase * 0.37)) * 1650;

    // 1. On bar downbeat: Trigger sweeping, sidechain-pumping French-Touch 9th/11th Chord Wave + Air Solina Pad!
    if (stepInBar === 0) {
      const chordNotes = chordObj.tones.slice(0, 5).map((t) => raga.midiRoot + t);
      playFrenchHouseChordWave(chordNotes, 2.04, filterCut, phaserFreq, 0.76, 0.095, when);
      if (barCount % 2 === 0) {
        playCosmicStringVoicing(chordNotes.slice(0, 4), 3.8, 0.062, when);
      }
    }

    // 2. Four-on-the-Floor Punchy French-House Kick + Crisp Layered Clap on 2 & 4 + Offbeat 909 Open Hat
    if (stepInBar % 4 === 0) {
      playBeleDrum(0, "HEX-5", 0.19, when, 1);
      playCrKick(0.14, when);
    }
    if (stepInBar === 4 || stepInBar === 12) {
      playBeleDrum(6, "HEX-5", 0.145, when, 1);
      playBeleDrum(1, "HEX-5", 0.11, when, 1);
    }
    if (stepInBar % 4 === 2) {
      // Classic French-house sizzling off-beat open hi-hat
      playBeleDrum(3, "HEX-5", 0.09, when, 1);
    } else if (stepInBar % 2 === 1 && sweep01 > 0.3) {
      playBeleDrum(2, "HEX-5", 0.055, when, 1);
    }

    // 3. Syncopated Daft Punk / Air ("La Femme d'Argent") Funky Octave/Fifth Bass Walk
    const fhGates =   [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1];
    const fhOctaves = [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0];
    if (fhGates[stepInBar]) {
      const toneOffset =
        stepInBar % 4 === 0
          ? chordObj.root
          : chordObj.tones[(stepInBar >> 1) % Math.min(4, chordObj.tones.length)];
      const bassNote = clamp(raga.midiRoot - 12 + toneOffset + (fhOctaves[stepInBar] ? 12 : 0), 36, 62);
      playMorphingBassNote(bassNote, {
        when,
        accent: stepInBar % 4 === 2,
        slide: stepInBar % 3 === 0,
        cutoff: clamp(220 + sweep01 * 520, 200, 760),
        res: 0.46,
        vel: 0.165,
      });
    }

    // 4. Air / Daft Punk Vintage Rhodes ("TINE") & Wurlitzer ("REED") Electric Piano Chords & Melodic Fills
    if (stepInBar === 2 || stepInBar === 6 || stepInBar === 11 || stepInBar === 14) {
      const action = barCount % 2 === 0 ? "TINE" : "REED";
      const epNote = raga.midiRoot + 12 + chordObj.tones[(stepInBar + barCount) % chordObj.tones.length];
      playGardenPiano(epNote, 1.35, action, 0.125, when);
    }

    // 5. Melodic Bele Formant-Vocoder Hook ("DIGITAL LOVE" / "AROUND THE WORLD" / "MOON SAFARI")
    if ((stepInBar === 0 || stepInBar === 6 || stepInBar === 10) && barCount % 2 === 1) {
      const vocNote = raga.midiRoot + chordObj.tones[(stepInBar >> 1) % chordObj.tones.length];
      playBeleFormantWord(stepInBar + barCount, vocNote, 0.42, 0.115, when);
    }
  }

  // ---- MODALITY 3 STEP: BT // THIS BINARY UNIVERSE / ANTIKYTHERA / ALL THAT KEEPS US HUMAN (CSOUND) ----
  function triggerBtCsoundSuiteStep(stepInBar, stepsPerBar, raga, chordObj, when) {
    const mov = BT_MOVEMENTS[btMovementIdx % BT_MOVEMENTS.length];
    const rootMidi = raga.midiRoot + chordObj.root;

    // Movement I: THE ANTIKYTHERA MECHANISM (Clockwork poly-gears + Csound fmtine/fmbell + acoustic guitar)
    if (btMovementIdx === 0) {
      // Precision clockwork escapement ticks in 5:7:14 poly-gear ratios
      if (stepInBar % 2 === 0) {
        playClick(stepInBar % 4 === 0);
      }
      if (stepInBar % 3 === 0) {
        playBeleDrum((stepInBar * 3) % 8, "ROSEWD", 0.11, when, 1);
      }
      if (stepInBar === 0 || stepInBar === 7) {
        const bellNote = raga.midiRoot + 12 + chordObj.tones[(stepInBar + barCount) % chordObj.tones.length];
        playCsoundFmBell(bellNote, 3.2, mov.weep, 0.135, when);
        playGuitar(raga.midiRoot + chordObj.root, 2.4, 0.12, when + 0.03);
      }
      if (stepInBar === 4 || stepInBar === 11) {
        const tineNote = raga.midiRoot + 12 + raga.arohana[(stepInBar + barCount) % raga.arohana.length];
        playCsoundFmTine(tineNote, 2.2, mov.weep, 0.13, when);
      }
    }
    // Movement II: THIS BINARY UNIVERSE (Orbiting Csound fmswirl clouds + exponential micro-glitch drums + felt piano)
    else if (btMovementIdx === 1) {
      if (stepInBar === 0) {
        playCsoundFmSwirl(rootMidi, 3.0, mov.weep, 0.115, when);
        playCsoundFmPad(rootMidi, 3.8, mov.weep, 0.095, when);
      }
      if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
        const pnoNote = raga.midiRoot + 12 + chordObj.tones[(stepInBar >> 1) % chordObj.tones.length];
        playGardenPiano(pnoNote, 2.2, "FELT", 0.145, when);
      }
      // Signature BT "This Binary Universe" exponentially accelerating micro-glitch ball-bounce drum fills!
      if (stepInBar === 0 || stepInBar === 8) {
        playBeleDrum(0, "HEX-5", 0.165, when, 1);
      }
      if (stepInBar === 4 || stepInBar === 12) {
        const rat = stepInBar === 12 ? 6 : 2;
        playBeleDrum(1, "NANOLP", 0.135, when, rat, 0.14, 0.55);
      }
      if (stepInBar === 15) {
        playMicroHarpCascade(raga.midiRoot + 12, chordObj.tones, 6, 38, 0.11);
      }
    }
    // Movement III: ALL THAT KEEPS US HUMAN CONTINUES (Csound CHANT 5-Formant Choir + Singing Bowls + Felt Piano Catharsis)
    else if (btMovementIdx === 2) {
      if (stepInBar === 0) {
        // Multi-voice Csound CHANT choir (Bass + Alto + Soprano morphing vowels a -> o -> u)
        const v1 = barCount % 5;
        const v2 = (barCount + 3) % 5;
        playCsoundChantChoir(rootMidi - 12, 3.4, v1, v2, 0, 0.11, when);
        playCsoundChantChoir(rootMidi + chordObj.tones[1], 3.4, v1, v2, 2, 0.105, when + 0.02);
        playCsoundChantChoir(rootMidi + 12 + chordObj.tones[2], 3.4, v2, v1, 3, 0.095, when + 0.04);
        playCsoundSingingBowl(rootMidi + 12, 3.8, 0.14, when);
      }
      if (stepInBar % 4 === 0) {
        const chordTone = chordObj.tones[(stepInBar >> 2) % chordObj.tones.length];
        playGardenPiano(raga.midiRoot + 12 + chordTone, 2.5, "FELT", 0.15, when);
      }
      if (stepInBar === 0 || stepInBar === 10) {
        playMorphingBassNote(rootMidi - 12, {
          when,
          accent: true,
          slide: true,
          cutoff: 260,
          res: 0.28,
          vel: 0.15,
        });
      }
      if (stepInBar === 8) {
        playCsoundFmBell(rootMidi + 12 + chordObj.tones[0], 3.4, mov.weep, 0.13, when);
      }
    }
    // Movement IV: CELESTIAL OVERTONE EPILOGUE (Weeping Csound fmbell + fmtine + singing bowl bridge)
    else if (btMovementIdx === 3) {
      if (stepInBar === 0) {
        playCsoundSingingBowl(rootMidi, 4.0, 0.15, when);
        playCsoundFmSwirl(rootMidi + 12, 3.4, mov.weep, 0.11, when);
      }
      if (stepInBar % 3 === 0) {
        const note = raga.midiRoot + 12 + raga.arohana[(stepInBar + barCount) % raga.arohana.length];
        if (stepInBar % 6 === 0) {
          playCsoundFmBell(note, 3.0, mov.weep, 0.125, when);
        } else {
          playCsoundFmTine(note, 2.4, mov.weep, 0.12, when);
        }
      }
      if (stepInBar === 12) {
        playGardenPiano(rootMidi + 12, 2.8, "FELT", 0.14, when);
      }
    }
    // Movement V: SASHA // AIRDRAWNDAGGER (Homage to Sasha & Charlie May — progressive breakbeat + Xpander pads)
    else {
      triggerSashaAirdrawndaggerStep(stepInBar % 16, raga, chordObj, when);
    }
  }

  // ---- MODALITY 4 / MOVEMENT V STEP: SASHA // AIRDRAWNDAGGER (Progressive Breakbeat & Xpander Horizon) ----
  // Inspired by Sasha's "Airdrawndagger" (2002) — "Cloud Cuckoo", "Wavy Gravy", "Magnetic North", "Immortal":
  //  - Weightless Charlie May Oberheim Xpander 24dB breathing pads
  //  - Rolling 2-step progressive breakbeat (syncopated kicks on 0, 6, 10; warm brushed snare/rim on 4, 12; ghost shakers)
  //  - Acoustic fingerpicked guitar + Rhodes tine + Csound weeping bell arpeggios in dotted-8th echoes
  function triggerSashaAirdrawndaggerStep(stepInBar, raga, chordObj, when) {
    airdrawnPhase += 0.048;
    const sweep = 0.5 + 0.5 * Math.sin(airdrawnPhase * 0.35);
    const padCutoff = 920 + sweep * 1950;
    const rootMidi = raga.midiRoot + chordObj.root;

    // 1. Weightless Oberheim Xpander Pad + Csound Singing Bowl / Choir Breath on 2-bar boundaries
    if (stepInBar === 0) {
      const padVoicing = chordObj.tones.slice(0, 5).map((t) => raga.midiRoot + t);
      playAirdrawndaggerPad(padVoicing, 3.9, padCutoff, 0.092, when);
      if (barCount % 2 === 0) {
        playCsoundChantChoir(rootMidi, 3.4, 3, 0, 2, 0.088, when + 0.03);
        playCsoundSingingBowl(rootMidi + 12, 3.6, 0.115, when);
      }
    }

    // 2. Signature "Wavy Gravy" / "Magnetic North" 2-Step Progressive Breakbeat Groove
    if (stepInBar === 0 || stepInBar === 6 || (stepInBar === 10 && barCount % 2 === 0)) {
      playCrKick(0.175, when);
      playBeleDrum(0, "HEX-5", 0.145, when, 1);
    }
    if (stepInBar === 4 || stepInBar === 12) {
      playCrRim(0.085, when);
      playBeleDrum(1, "HEX-5", 0.115, when, 1);
    }
    // Ghost breakbeat snare & brushed hi-hat shuffle
    if (stepInBar === 7 || stepInBar === 15) {
      playBeleDrum(1, "ROSEWD", 0.068, when, 1);
    }
    if (stepInBar % 2 === 1) {
      playCrHat(stepInBar === 11 || stepInBar === 15, 0.052, when);
    }

    // 3. Deep warm progressive sub-bass glide ("Fundamental" / "Boileroom" warmth)
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
      const bassTone = stepInBar === 0 ? chordObj.root : chordObj.tones[(stepInBar >> 1) % Math.min(3, chordObj.tones.length)];
      playMorphingBassNote(clamp(raga.midiRoot - 12 + bassTone, 36, 58), {
        when,
        accent: stepInBar === 0 || stepInBar === 6,
        slide: true,
        cutoff: clamp(190 + sweep * 310, 180, 520),
        res: 0.34,
        vel: 0.155,
      });
    }

    // 4. "Cloud Cuckoo" / "Immortal" Dotted-8th Acoustic Guitar, Rhodes Tine & Weeping FM Bell Arpeggio
    if (stepInBar % 3 === 0 || stepInBar === 14) {
      const toneIdx = (stepInBar + barCount) % chordObj.tones.length;
      const arpNote = raga.midiRoot + 12 + chordObj.tones[toneIdx];
      if (stepInBar === 0 || stepInBar === 6) {
        playGuitar(arpNote, 2.3, 0.125, when);
      } else if (stepInBar === 3 || stepInBar === 12) {
        playGardenPiano(arpNote, 1.8, "TINE", 0.118, when);
      } else {
        playCsoundFmTine(arpNote, 2.1, 0.68, 0.11, when);
      }
    }
  }

  // ============================================================================
  // CLOSED-EYE SYLVIA PLATH SANCTUARY SOLO ("I shut my eyes and all the world drops dead")
  // When the player closes their eyes, the main music is gently low-pass filtered
  // down (`295 Hz`) while this quiet, luminous, soul-guiding solo melody appears
  // on `soloBus` (unfiltered + cathedral starlight reverb) in the exact key and
  // chord of the currently playing song.
  // ============================================================================
  function playSoulSoloVoice(midiNote, dur = 2.4, vel = 0.135, when = null, voiceKind = "cantabile") {
    const c = ensureCtx();
    if (!c || muted || !soloBus) return;
    const t = when != null ? when : c.currentTime;
    const clampedMidi = clamp(midiNote, 48, 81);
    const f = mtof(clampedMidi);
    const v = vel * pitchAtten(f);

    if (voiceKind === "celloAlto") {
      // Warm, intimate solo cello / alto vocal hum with delayed 5.1 Hz vibrato
      const o1 = c.createOscillator();
      const o2 = c.createOscillator();
      o1.type = "triangle";
      o2.type = "sine";
      // Subtle expressive pitch scoop (-18 cents -> 0)
      o1.frequency.setValueAtTime(f * Math.pow(2, -18 / 1200), t);
      o1.frequency.exponentialRampToValueAtTime(f, t + 0.18);
      o2.frequency.setValueAtTime(f * 2.0, t);

      const vib = c.createOscillator();
      const vibG = c.createGain();
      vib.frequency.value = 5.1;
      vibG.gain.setValueAtTime(0.001, t);
      vibG.gain.linearRampToValueAtTime(f * 0.0065, t + Math.min(0.65, dur * 0.45));
      vib.connect(vibG);
      vibG.connect(o1.frequency);

      const bodyLp = c.createBiquadFilter();
      bodyLp.type = "lowpass";
      bodyLp.frequency.setValueAtTime(1350, t);
      bodyLp.Q.value = 1.15;

      const subG = c.createGain();
      subG.gain.value = 0.22;
      o2.connect(subG);

      const env = c.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(v * 0.88, t + Math.min(0.38, dur * 0.28));
      env.gain.setValueAtTime(v * 0.78, t + dur * 0.68);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.45);

      o1.connect(bodyLp);
      subG.connect(bodyLp);
      bodyLp.connect(env);
      env.connect(soloBus);
      if (soloReverbSend) env.connect(soloReverbSend);

      o1.start(t);
      o2.start(t);
      vib.start(t);
      const stopT = t + dur + 0.5;
      o1.stop(stopT);
      o2.stop(stopT);
      vib.stop(stopT);
      return;
    }

    // "cantabile": Intimate Una-Corda Felt Piano + Weeping Bell/Harp overtone routed to `soloBus`
    const key = `soulSoloCantabile:${Math.round(clampedMidi)}`;
    const fullKey = `${key}@${c.sampleRate}`;
    let buf = bufCache.get(fullKey);
    if (!buf) {
      const sr = c.sampleRate;
      const len = Math.floor(sr * 2.8);
      const out = new Float32Array(len);
      let p1 = 0, p2 = 0, p3 = 0, pMod = 0;
      for (let i = 0; i < len; i++) {
        const sec = i / sr;
        const kease = 1 - Math.exp(-sec * 1.3);
        const ksag = Math.pow(2, (-2.2 * kease) / 1200);
        const kf = f * ksag;
        const vib = 1 + 0.0032 * Math.sin(TAU * 4.8 * sec) * Math.min(1, sec / 0.45);
        p1 += (TAU * kf * vib) / sr;
        p2 += (TAU * kf * 2.0006 * vib) / sr;
        p3 += (TAU * kf * 3.0018) / sr;
        pMod += (TAU * kf * 1.0004) / sr;

        const envMain = Math.min(1, sec / 0.012) * Math.exp(-sec * 1.45);
        const envSing = Math.sin(Math.PI * Math.min(1, sec / 0.28)) * Math.exp(-sec * 0.95);
        const fmIdx = 0.65 * Math.exp(-sec * 2.4) + 0.15;
        // Blended una-corda felt fundamental + singing harmonic overtone
        const felt = (Math.sin(p1 + fmIdx * Math.sin(pMod)) * 0.76 + Math.sin(p2) * 0.18 + Math.sin(p3) * 0.05) * envMain;
        const sing = Math.sin(p1) * 0.34 * envSing;
        out[i] = felt + sing;
      }
      applyBiquad(out, "lp", 2350, 0.72, sr);
      finishTake(out, sr, 0.78, 36);
      buf = c.createBuffer(1, out.length, sr);
      buf.getChannelData(0).set(out);
      if (bufCache.size > 160) bufCache.delete(bufCache.keys().next().value);
      bufCache.set(fullKey, buf);
    }

    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.value = v;
    src.connect(g);
    g.connect(soloBus);
    if (soloReverbSend) g.connect(soloReverbSend);
    src.start(t);
  }

  // Expressive melodic contour templates for the Closed-Eye Soul Solo
  // (Degrees index into the current song's chord tones & raga scale so every note is 100% in key!)
  const SOUL_SOLO_CONTOURS = [
    // Phrase A: Ascending yearning leap (root -> 3rd -> 5th -> 9th -> 7th -> 5th)
    { steps: [0, 3, 6, 9, 12, 14], degs: [0, 1, 2, 4, 3, 2], grace: [0, 1, 0, 1, 0, 0] },
    // Phrase B: Tender descending lullaby (octave/9th -> 7th -> 5th -> 3rd -> 2nd -> root)
    { steps: [0, 4, 7, 10, 13, 15], degs: [4, 3, 2, 1, 0, 2], grace: [1, 0, 0, 1, 0, 0] },
    // Phrase C: Luminous inner sanctuary arch (3rd -> 5th -> octave -> 9th -> 6th -> 3rd)
    { steps: [0, 2, 6, 8, 11, 14], degs: [1, 2, 3, 4, 2, 1], grace: [0, 0, 1, 0, 1, 0] },
    // Phrase D: Quiet contemplative question & answer
    { steps: [0, 5, 8, 11, 14], degs: [2, 4, 3, 1, 0], grace: [1, 0, 1, 0, 0] },
  ];

  function triggerClosedEyeSoulSoloStep(stepInBar, raga, chordObj, when) {
    if (!closedEyeActive || !ctx || muted) return;
    const s = stepInBar % 16;
    const phrase = SOUL_SOLO_CONTOURS[(barCount + progFamilyIdx) % SOUL_SOLO_CONTOURS.length];
    const tones = chordObj.tones && chordObj.tones.length ? chordObj.tones : raga.chord;
    const aro = raga.arohana;

    // 1. Warm Cello / Alto Vocal Harmonic Anchor on Beat 1 & Beat 3
    if (s === 0 || s === 8) {
      const anchorSemi = s === 0 ? chordObj.root : tones[1 % tones.length];
      const anchorMidi = raga.midiRoot + anchorSemi;
      playSoulSoloVoice(anchorMidi, 2.6, 0.115, when + 0.015, "celloAlto");
      // Gentle arpeggiated warm fifth/tenth cradle
      const cradleNote = raga.midiRoot + 12 + tones[0];
      playSoulSoloVoice(cradleNote, 2.2, 0.082, when + 0.08, "cantabile");
    }

    // 2. Quiet, Achingly Beautiful Cantabile Solo Melody in the Active Key & Chord
    const noteIdx = phrase.steps.indexOf(s);
    if (noteIdx !== -1) {
      closedEyeSoloStep++;
      const deg = phrase.degs[noteIdx];
      // Blend chord tones with raga scale degrees (9ths, 6ths, vadi) for emotional depth
      const useScaleColor = (noteIdx + barCount) % 3 === 1;
      const semi = useScaleColor
        ? aro[(deg + 1) % aro.length] + (deg >= 3 ? 12 : 0)
        : tones[deg % tones.length] + (deg >= tones.length ? 12 : 0);
      const melMidi = clamp(raga.midiRoot + 12 + semi, 58, 79);

      // Expressive rubato timing offset (+12ms..+28ms) so the solo breathes like a human player
      const rubatoWhen = when + 0.014 + 0.012 * Math.sin(closedEyeSoloStep * 0.9);

      // Delicate appoggiatura grace note one scale step below/above before the main melody note
      if (phrase.grace[noteIdx]) {
        const graceSemi = aro[Math.max(0, (deg % aro.length) - 1)];
        const graceMidi = clamp(raga.midiRoot + 12 + graceSemi, 56, 77);
        playSoulSoloVoice(graceMidi, 0.9, 0.078, Math.max(ctx.currentTime, rubatoWhen - 0.052), "cantabile");
      }

      // Main luminous solo melody note
      playSoulSoloVoice(melMidi, 2.5, 0.148, rubatoWhen, "cantabile");

      // Tender sixth/octave harmonic shadow on phrase peaks
      if (noteIdx === 2 || noteIdx === 3) {
        const harmSemi = tones[(deg + 2) % tones.length];
        const harmMidi = clamp(raga.midiRoot + harmSemi, 52, 72);
        playSoulSoloVoice(harmMidi, 2.2, 0.085, rubatoWhen + 0.025, "celloAlto");
      }
    }
  }

  function triggerStepAt(stepIndex, when) {
    const stepsPerBar = getActiveStepsPerBar();
    const stepInBar = stepIndex % stepsPerBar;

    if (stepInBar === 0) {
      barCount++;
      // Every 12 bars in auto-suite mode: smoothly transition to the next Musical Modality
      // so Mode I (Raga/Italo) -> Mode II (Glitch Piano/Swing) -> Mode III (French House/Air) ->
      // Mode IV (BT Csound Suite) -> Mode V (Sasha Airdrawndagger) form one coherent whole!
      if (autoCycleModalities && barCount > 0 && barCount % 12 === 0) {
        setModality((modalityIdx + 1) % MUSIC_MODALITIES.length, true);
      }
      // Rotate polyrhythmic time signature every 4 bars during Modality 1 (Autechre/Aphex Glitch Piano)
      if (modalityIdx === 1 && barCount % 4 === 0) {
        polyMeterIdx = (polyMeterIdx + 1) % POLYRHYTHM_METERS.length;
      }
      // Advance BT Csound movement every 4 bars during Modality 3
      if (modalityIdx === 3 && barCount % 4 === 0) {
        btMovementIdx = (btMovementIdx + 1) % BT_MOVEMENTS.length;
      }
      // Every 16 bars: morph to a new Raga world
      if (barCount > 0 && barCount % 16 === 0) {
        morphSixteenBarRaga();
      }
      // Every 8 bars: morph harmonic progression family, arrangement arc, and bass archetype
      if (barCount > 0 && barCount % 8 === 0) {
        morphEightBarSection(barCount);
      }
      // Every 2 bars: advance chord in the 4-chord progression (8-bar full harmonic cycle)
      if (barCount % 2 === 0) {
        chordIdx = (chordIdx + 1) % 4;
      }
    }

    evolveSynthParameters(stepIndex);
    updateMasterBusContinuously();

    const raga = RAGA_WORLDS[scaleIdx];
    const prog = raga.progressions[progFamilyIdx % raga.progressions.length];
    const chordObj = prog[chordIdx % prog.length];

    // If the player's eyes are closed ("I shut my eyes and all the world drops dead"),
    // weave the quiet, soul-guiding solo melody in the exact key & chord of the current song!
    if (closedEyeActive) {
      triggerClosedEyeSoulSoloStep(stepInBar, raga, chordObj, when);
    }

    // Dispatch to the active Musical Modality while sharing the unified Raga/Harmonic progression state!
    if (modalityIdx === 1) {
      triggerGlitchPianoStep(stepInBar, stepsPerBar, raga, chordObj, when);
      return;
    }
    if (modalityIdx === 2) {
      triggerFrenchHouseAirStep(stepInBar % 16, raga, chordObj, when);
      return;
    }
    if (modalityIdx === 3) {
      triggerBtCsoundSuiteStep(stepInBar, stepsPerBar, raga, chordObj, when);
      return;
    }
    if (modalityIdx === 4) {
      triggerSashaAirdrawndaggerStep(stepInBar % 16, raga, chordObj, when);
      return;
    }

    const arc = ARC_PHASES[arcPhaseIdx];
    const arch = BASS_ARCHETYPES[bassArchIdx % BASS_ARCHETYPES.length];

    // ---- 1. LUSH COSMIC STRING PAD & VOWEL CHOIR (on 2-bar chord changes & 4-bar swells) ----
    if (stepInBar === 0 && barCount % 2 === 0) {
      if (Math.random() <= arc.padDens) {
        const padNotes = chordObj.tones.map((t) => raga.midiRoot + t);
        playCosmicStringVoicing(padNotes, 3.6, 0.068 * arc.padDens, when);
      }
      if (barCount % 4 === 0 && Math.random() <= arc.padDens * 0.85) {
        playChoirPad(raga.midiRoot + chordObj.root, 2.8, chordObj.vowel || "o", 0.095, when);
      }
    }

    // ---- 2. DYNAMIC MORPHING ACID-RAGA / COSMIC ITALO BASS ----
    const gateOn = arch.gates[stepInBar] && (stepInBar % 4 === 0 || Math.random() <= arc.bassDens);
    if (gateOn) {
      const bassMidi = pickBassMidi(raga, chordObj, stepInBar, arch);
      const isAccent = !!arch.accents[stepInBar] || (stepInBar === 0 && barCount % 2 === 0);
      const isSlide = !!arch.slides[stepInBar] || Math.random() < bassParams.slideProb;
      playMorphingBassNote(bassMidi, {
        when,
        accent: isAccent,
        slide: isSlide,
        vel: 0.155 * (0.75 + arc.bassDens * 0.25),
      });
    }

    // ---- 3. LINDSTRØM COSMIC ARPEGGIATOR & COASTAL TOWN GUITAR/BELLS ----
    const townBonus = Math.min(0.25, (liveGameState.townCount || 0) * 0.05);
    const effectiveArpDens = clamp(arc.arpDens + townBonus, 0.2, 0.98);
    if (Math.random() <= effectiveArpDens) {
      const patDeg = arpPattern[stepInBar % arpPattern.length];
      const tone = chordObj.tones[patDeg % chordObj.tones.length];
      const elevOct = (liveGameState.playerY > 36 && stepInBar % 4 === 2) ? 12 : 0;
      const arpMidi = raga.midiRoot + tone + elevOct;

      if (arcPhaseIdx === 0 || (stepInBar % 4 === 0 && liveGameState.townCount > 0)) {
        // Acoustic Karplus-Strong nylon guitar / koto pluck
        if (stepInBar % 2 === 0) {
          playGuitar(arpMidi, 2.1, 0.11, when);
        }
      } else if (stepInBar % 2 === 0 || arcPhaseIdx >= 2) {
        // Cosmic Italo space arpeggiator with morphing timbre
        const arpMorph = 0.25 + 0.65 * Math.sin(lfoPhase * 0.41 + stepInBar * 0.3);
        playCosmicArp(arpMidi, stepInBar % 3 === 0 ? 0.34 : 0.19, 0.082, arpMorph, when);
      }
    }

    // ---- 4. BT ALEATORIC MICRO-HARP CASCADES & TINE BELLS (on turnarounds) ----
    if (stepInBar === 12 && barCount % 4 === 3 && Math.random() < 0.75) {
      playMicroHarpCascade(raga.midiRoot, chordObj.tones, 4, 62, 0.085);
    }

    // ---- 5. CR-78 COMPU-RHYTHM & BESSEL TABLA GROOVE ----
    if (arc.drumDens > 0.2) {
      // Four-on-the-floor or syncopated CR-78 soft analog kick
      if ((stepInBar % 4 === 0 || (stepInBar === 14 && Math.random() < 0.35)) && Math.random() <= arc.drumDens) {
        playCrKick(0.16 * arc.drumDens, when);
      }
      // Off-beat open/closed CR-78 brushed hi-hat whisper
      if (stepInBar % 2 === 1 && Math.random() <= arc.drumDens) {
        const isOpen = stepInBar === 6 || stepInBar === 14;
        playCrHat(isOpen, 0.055 * arc.drumDens, when);
      }
      // Syncopated CR-78 rimshot / clave
      if ((stepInBar === 4 || stepInBar === 11 || stepInBar === 12) && Math.random() <= arc.drumDens * 0.65) {
        playCrRim(0.065 * arc.drumDens, when);
      }
      // Pitched Bessel-mode Tabla ("tun" on raga root/fifth, "ge" on low bayan)
      if ((stepInBar === 3 || stepInBar === 7 || stepInBar === 10 || stepInBar === 15) && Math.random() <= arc.drumDens * 0.72) {
        const stroke = stepInBar === 7 ? "ge" : stepInBar === 15 ? "na" : "tun";
        const tablaMidi = stroke === "ge"
          ? raga.midiRoot - 12
          : raga.midiRoot + (stepInBar === 3 ? 0 : 7);
        playTabla(tablaMidi, stroke, 0.11 * arc.drumDens, when);
      }
    }

    // ---- 6. GENTLE SEA TIDE SHIMMER (when near the coastal basin) ----
    if (stepInBar === 0 && barCount % 4 === 0 && liveGameState.nearSea) {
      noise(0.036, 950, 880);
    }
  }

  // High-precision WebAudio lookahead scheduler with ghosts.garden 2D Swing Map time-warping!
  // Never halts when changing simulation speed (`1x`..`10000x`); only pauses if the game is explicitly paused.
  function runLookaheadScheduler() {
    if (!ctx) return;
    if (ctx.state === "suspended" && !muted && iosUnlocked) {
      ctx.resume().catch(() => {});
    }
    if (ctx.state !== "running" || muted) return;
    if (typeof window !== "undefined" && window.SlopesGame && window.SlopesGame.paused) return;

    const now = ctx.currentTime;
    const stepsPerBar = getActiveStepsPerBar();
    const meterScale =
      modalityIdx === 1
        ? POLYRHYTHM_METERS[polyMeterIdx % POLYRHYTHM_METERS.length].stepDurScale
        : 1.0;
    const baseStepDur = (0.130 + Math.sin(lfoPhase * 0.09) * 0.004) * meterScale;

    if (nextStepTime < now - 0.05) {
      nextStepTime = now + 0.01;
    }

    // Compile the active ghosts.garden 2D Swing Map warp function!
    const warpFn =
      modalityIdx === 1
        ? GhostsGardenSwingMap.compile(swingMapX, swingMapY)
        : modalityIdx === 2
        ? GhostsGardenSwingMap.compile(0.58, 3 / 6) // Subtle French-house 16th groove
        : modalityIdx === 4
        ? GhostsGardenSwingMap.compile(0.54, 3 / 6) // Sasha Airdrawndagger progressive breakbeat pocket
        : GhostsGardenSwingMap.compile(0.48, 1 / 6);

    while (nextStepTime < now + 0.14) {
      const stepInBar = step16 % stepsPerBar;
      const straightBeat = stepInBar * 0.25;
      const nextStraightBeat = (stepInBar + 1) * 0.25;
      const warpedBeat = warpFn(straightBeat);
      const warpedNextBeat = warpFn(nextStraightBeat);
      const stepDeltaBeats = Math.max(0.06, warpedNextBeat - warpedBeat);
      const actualStepDur = (stepDeltaBeats / 0.25) * baseStepDur;

      triggerStepAt(step16, nextStepTime);
      nextStepTime += actualStepDur;
      step16++;
    }
  }

  function stepSoundtrack(state) {
    if (state) {
      liveGameState = {
        playerY: state.playerY != null ? state.playerY : liveGameState.playerY,
        tarPressure: state.tarPressure != null ? state.tarPressure : liveGameState.tarPressure,
        townCount: state.townCount != null ? state.townCount : liveGameState.townCount,
        nearSea: state.nearSea != null ? state.nearSea : liveGameState.nearSea,
        worldLayer: state.worldLayer != null ? state.worldLayer : (liveGameState.worldLayer || 0),
      };
    }
    lastGameHeartbeatMs = typeof performance !== "undefined" ? performance.now() : Date.now();

    if (!ctx || muted) return;
    if (ctx.state === "suspended" && iosUnlocked) {
      ctx.resume().catch(() => {});
    }
    if (ctx.state === "running") {
      runLookaheadScheduler();
    }

    if (!schedulerTimer && typeof setInterval !== "undefined") {
      schedulerTimer = setInterval(runLookaheadScheduler, 40);
    }
  }

  function cycleScale() {
    scaleIdx = (scaleIdx + 1) % RAGA_WORLDS.length;
    progFamilyIdx = 0;
    chordIdx = 0;
    const sc = RAGA_WORLDS[scaleIdx];
    const prog = sc.progressions[0][0];
    playMicroHarpCascade(sc.midiRoot, prog.tones, 4, 55, 0.14);
    return sc.name;
  }

  // Aetherium Levitation Crystal Chime (Castle in the Sky shimmering fifths + pad in active Modality)
  function playAetheriumChime() {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    playMicroHarpCascade(sc.raga.midiRoot + 12, sc.tones, 6, 48, 0.14);
    const padNotes = sc.tones.slice(0, 4).map((t) => sc.raga.midiRoot + t);
    if (sc.modalityIdx === 4) {
      playAirdrawndaggerPad(padNotes, 2.8, sc.liveCutoffHz, 0.088);
    } else if (sc.modalityIdx === 2) {
      playFrenchHouseChordWave(padNotes, 2.0, sc.liveCutoffHz, 980, 0.65, 0.082);
    } else {
      playCosmicStringVoicing(padNotes, 2.4, 0.08);
    }
  }

  // Screen/Layer Transition Sound (dir < 0: Drilling deep underground; dir > 0: Ascending into clouds)
  function playLayerTransition(dir = -1) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    if (dir < 0) {
      // Drilling down into subterranean world: deep resonant sub-bass slide + pebble/crystal cascade
      playMorphingBassNote(sc.chordRootMidi - 12, {
        prevMidi: sc.chordRootMidi,
        slide: true,
        accent: true,
        cutoff: clamp(sc.liveCutoffHz * 0.45, 340, 680),
        res: 0.62,
        decay: 0.48,
        vel: 0.22,
      });
      playPebble(0, 0.18);
      setTimeout(() => playMicroHarpCascade(sc.raga.midiRoot, sc.tones, 4, 65, 0.11), 90);
    } else {
      // Ascending into sky/cloud world: soaring upward Aetherium cascade + warm choir/pad swell
      playMicroHarpCascade(sc.raga.midiRoot + 7, sc.tones, 6, 52, 0.13);
      if (sc.modalityIdx === 4) {
        playAirdrawndaggerPad(sc.tones.slice(0, 4).map((t) => sc.raga.midiRoot + t), 2.8, sc.liveCutoffHz, 0.09);
      } else {
        playChoirPad(sc.chordRootMidi, 2.2, sc.vowel, 0.12);
      }
    }
  }

  // ============================================================================
  // TACTILE MECHANICAL HARDWARE SWITCH CLICK ("castanet" / "clave" micro-shell)
  // Tuned to the active key's harmonic overtones so even UI clicks belong to the song!
  // ============================================================================
  function playClick(high = false) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted) return;
    const sc = getLiveSonicContext();
    const rootFreq = mtof(sc.chordRootMidi + (high ? 24 : 12));
    const key = `castanetClick:${Math.round(rootFreq)}`;
    playBufferCached(
      key,
      (sr) => {
        const len = Math.floor(sr * 0.042);
        const exc = contactPulse(sr, 0.00055, true);
        const base = clamp(rootFreq, 520, 1480);
        const shell = new Float32Array(len);
        runComplexModes(
          shell,
          exc,
          [
            { f: base, a: 0.72, t: 0.016 },
            { f: base * 1.498, a: 0.54, t: 0.012 },
            { f: base * 2.0, a: 0.28, t: 0.008 },
            { f: base * 0.5, a: 0.35, t: 0.018 },
          ],
          sr
        );
        return finishTake(shell, sr, 0.76, 8);
      },
      0.15,
      false,
      false,
      0
    );
  }

  // ============================================================================
  // DUMBTERM FM MECHANICAL TERMINAL SONIFICATION & DAT-307 E-INK WHIR
  // Ported directly from williamsharkey/dumbterm (commit 2376ced):
  //   - 10 FM + noise presets (Typewriter, Teletype, Relay, Crystal, Spark,
  //     Needle, Ticker, Disk, Wire, Punch)
  //   - Box-drawing minor pentatonic scale transposed to the active Raga root
  //   - Reverse-morse + electromechanical thunk on character/line deletion
  //   - Ultrasonic 10.8 kHz aliased plink on CRT phosphor cursor blink
  //   - Multi-character output scanline tone burst synced with visual amber sweep
  // ============================================================================
  const DUMBTERM_PRESETS = [
    { name: "Typewriter", carrier: 800,  modRatio: 7.0,  modDepth: 0.8, noise: 0.30, decay: 0.95 },
    { name: "Teletype",   carrier: 1200, modRatio: 5.0,  modDepth: 0.6, noise: 0.20, decay: 0.90 },
    { name: "Relay",      carrier: 600,  modRatio: 9.0,  modDepth: 1.0, noise: 0.50, decay: 0.85 },
    { name: "Crystal",    carrier: 2000, modRatio: 3.0,  modDepth: 0.4, noise: 0.10, decay: 0.97 },
    { name: "Spark",      carrier: 1500, modRatio: 11.0, modDepth: 0.9, noise: 0.60, decay: 0.80 },
    { name: "Needle",     carrier: 3000, modRatio: 2.0,  modDepth: 0.3, noise: 0.05, decay: 0.98 },
    { name: "Ticker",     carrier: 400,  modRatio: 13.0, modDepth: 0.7, noise: 0.40, decay: 0.88 },
    { name: "Disk",       carrier: 900,  modRatio: 6.0,  modDepth: 0.5, noise: 0.35, decay: 0.92 },
    { name: "Wire",       carrier: 1800, modRatio: 8.0,  modDepth: 0.7, noise: 0.15, decay: 0.94 },
    { name: "Punch",      carrier: 500,  modRatio: 15.0, modDepth: 1.0, noise: 0.70, decay: 0.82 },
  ];

  const DUMBTERM_MORSE = [
    ".-","-...","-.-.","-..",".","..-.","--.","....","..",".---",
    "-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-",
    "..-","...-",".--","-..-","-.--","--..",
    "-----",".----","..---","...--","....-",".....","-....","--...","---..","----."
  ];

  let dumbtermRng = 12345;
  function dumbtermRand() {
    dumbtermRng = (Math.imul(dumbtermRng, 1103515245) + 12345) >>> 0;
    return (dumbtermRng >>> 16) / 32768.0 - 1.0;
  }

  function genDumbtermFmTone(out, offset, samples, sr, preset, vol) {
    let phaseC = 0;
    let phaseM = 0;
    let env = 1.0;
    const fc = preset.carrier;
    const fm = fc * preset.modRatio;
    const end = Math.min(out.length, offset + samples);
    for (let i = offset; i < end; i++) {
      const mod = Math.sin(phaseM * 6.2831853) * preset.modDepth * fc;
      let sig = Math.sin((phaseC + mod / sr) * 6.2831853);
      sig = sig * (1.0 - preset.noise) + dumbtermRand() * preset.noise;
      out[i] += sig * env * vol;
      phaseC += fc / sr;
      phaseM += fm / sr;
      env *= preset.decay + (1.0 - preset.decay) * 0.9999;
      if (phaseC > 1.0) phaseC -= 1.0;
      if (phaseM > 1.0) phaseM -= 1.0;
    }
  }

  let lastDumbtermOutMs = 0;

  function playDumbtermTypeClick(chCode = 65) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted || c.state !== "running" || !master) return;
    const sc = getLiveSonicContext();
    const pitchScale = mtof(sc.raga.midiRoot) / 261.63;
    const preset = Object.assign({}, DUMBTERM_PRESETS[1]); // Teletype
    preset.carrier = preset.carrier * clamp(pitchScale, 0.75, 1.35) * (0.96 + ((chCode & 7) * 0.012));
    const sr = c.sampleRate;
    const len = Math.max(32, Math.floor(sr / 260)); // ~3.8ms crisp mechanical strike
    const buf = c.createBuffer(1, len, sr);
    genDumbtermFmTone(buf.getChannelData(0), 0, len, sr, preset, 0.09);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(master);
    src.start();
  }

  function playDumbtermDeleteGhost(deletedText = "") {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted || c.state !== "running" || !master) return;
    const sc = getLiveSonicContext();
    const pitchScale = mtof(sc.raga.midiRoot) / 261.63;
    const sr = c.sampleRate;
    const str = String(deletedText || "X").slice(-16);
    const unitSamples = Math.max(18, Math.floor(sr * 0.0045));
    const thunkLen = Math.floor(sr / 65); // ~15ms electromechanical thunk
    const total = Math.min(Math.floor(sr * 0.32), str.length * unitSamples * 4 + thunkLen);
    const buf = c.createBuffer(1, total, sr);
    const data = buf.getChannelData(0);
    const needle = Object.assign({}, DUMBTERM_PRESETS[5]);
    needle.carrier *= pitchScale;

    let pos = 0;
    for (let i = str.length - 1; i >= 0 && pos < total - thunkLen; i--) {
      const code = str.charCodeAt(i);
      let morse = null;
      if (code >= 65 && code <= 90) morse = DUMBTERM_MORSE[code - 65];
      else if (code >= 97 && code <= 122) morse = DUMBTERM_MORSE[code - 97];
      else if (code >= 48 && code <= 57) morse = DUMBTERM_MORSE[26 + code - 48];
      if (morse) {
        for (let j = 0; j < morse.length && pos < total - thunkLen; j++) {
          const elLen = morse[j] === "." ? unitSamples : unitSamples * 2;
          genDumbtermFmTone(data, pos, elLen, sr, needle, 0.06);
          pos += elLen + Math.floor(unitSamples * 0.5);
        }
      } else {
        genDumbtermFmTone(data, pos, unitSamples, sr, needle, 0.05);
        pos += unitSamples * 2;
      }
    }
    // Append dumbterm's signature 120Hz electromechanical thunk at the end
    const thunk = { carrier: 120 * pitchScale, modRatio: 15.0, modDepth: 2.5, noise: 0.45, decay: 0.75 };
    genDumbtermFmTone(data, Math.max(0, total - thunkLen), thunkLen, sr, thunk, 0.11);

    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(master);
    src.start();
  }

  function playDumbtermCursorPlink() {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted || c.state !== "running" || !master) return;
    const sr = c.sampleRate;
    const len = Math.max(32, Math.floor(sr / 100)); // ~10ms ultrasonic aliased plink
    const buf = c.createBuffer(1, len, sr);
    const plink = { carrier: 10800.0, modRatio: 19.0, modDepth: 2.5, noise: 0.8, decay: 0.65 };
    genDumbtermFmTone(buf.getChannelData(0), 0, len, sr, plink, 0.012);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(master);
    src.start();
  }

  function playDumbtermOutputLine(lineText = "", isFocusedTerminal = false) {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted || c.state !== "running" || !master) return;
    const nowMs = Date.now();
    if (nowMs - lastDumbtermOutMs < (isFocusedTerminal ? 45 : 180)) return;
    lastDumbtermOutMs = nowMs;

    const sc = getLiveSonicContext();
    const rootMidi = sc.raga.midiRoot + 12;
    // Box-drawing minor pentatonic scale transposed to the current song's key!
    const boxScaleHz = [0, 3, 5, 7, 10].map((semi) => mtof(rootMidi + semi));
    const plain = String(lineText || "").replace(/\x1b\[[0-9;]*m/g, "").trim();
    if (!plain) return;

    const sr = c.sampleRate;
    const nChars = Math.min(36, plain.length);
    const charStepSamples = Math.max(28, Math.floor(sr * 0.0032));
    const total = nChars * charStepSamples + Math.floor(sr * 0.012);
    const buf = c.createBuffer(1, total, sr);
    const data = buf.getChannelData(0);
    const diskPreset = DUMBTERM_PRESETS[7]; // Disk (900Hz, modRatio 6.0, noise 0.35)
    const vol = isFocusedTerminal ? 0.055 : 0.024;

    for (let i = 0; i < nChars; i++) {
      const code = plain.charCodeAt(i);
      if (code <= 32) continue;
      const offset = i * charStepSamples;
      if (code >= 0x2500 && code <= 0x259f) {
        const noteHz = boxScaleHz[(code - 0x2500) % boxScaleHz.length];
        const bp = { carrier: noteHz, modRatio: 11.0, modDepth: 0.6, noise: 0.1, decay: 0.88 };
        genDumbtermFmTone(data, offset, charStepSamples, sr, bp, vol * 0.85);
      } else {
        const semitone = sc.tones[i % sc.tones.length] || 0;
        const charFreq = clamp(mtof(rootMidi + semitone) * (0.92 + ((code & 7) * 0.02)), 380, 1850);
        const tp = {
          carrier: charFreq,
          modRatio: diskPreset.modRatio,
          modDepth: diskPreset.modDepth,
          noise: diskPreset.noise,
          decay: diskPreset.decay,
        };
        genDumbtermFmTone(data, offset, charStepSamples, sr, tp, vol);
      }
    }

    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(master);
    src.start();
  }

  // Lunar 10,000-Year DAT-307 Dataputer E-Ink Refresh & Micro-LED Whir
  function playDatPuterWhir(kind = "page") {
    if (suppressSfx) return;
    const c = ensureCtx();
    if (!c || muted || c.state !== "running" || !master) return;
    const sc = getLiveSonicContext();
    const rootMidi = sc.raga.midiRoot + 12;
    const sr = c.sampleRate;
    const dur = kind === "open" ? 0.24 : 0.16;
    const total = Math.floor(sr * dur);
    const buf = c.createBuffer(1, total, sr);
    const data = buf.getChannelData(0);

    // 1. Soft electrophoretic E-Ink paper-grain whisper + micro-stepper relay ticks
    const stepCount = kind === "open" ? 7 : 5;
    const stepSamples = Math.floor(total / stepCount);
    for (let s = 0; s < stepCount; s++) {
      const semi = sc.tones[s % sc.tones.length] || 0;
      const freq = mtof(rootMidi + semi) * (kind === "prev" ? 0.88 : 1.05);
      const wire = { carrier: freq, modRatio: 4.0, modDepth: 0.35, noise: 0.22, decay: 0.94 };
      genDumbtermFmTone(data, s * stepSamples, Math.floor(stepSamples * 0.72), sr, wire, 0.045);
    }

    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(master);
    src.start();
  }

  window.SlopesAudio = {
    unlock,
    setVolume,
    setMuted,
    get volume() { return volume; },
    get muted() { return muted; },
    get suppressSfx() { return suppressSfx; },
    set suppressSfx(v) { suppressSfx = !!v; },
    get closedEyeActive() { return closedEyeActive; },
    setClosedEyeState,
    get scaleName() { return RAGA_WORLDS[scaleIdx].name; },
    get modalityIdx() { return modalityIdx; },
    get modalityName() { return MUSIC_MODALITIES[modalityIdx].name; },
    get modalityShortName() { return MUSIC_MODALITIES[modalityIdx].shortName; },
    get timeSigLabel() { return getActiveTimeSigLabel(); },
    get swingLabel() { return GhostsGardenSwingMap.describe(swingMapX, swingMapY); },
    get bassParams() { return bassParams; },
    getLiveSonicContext,
    MUSIC_MODALITIES,
    BT_MOVEMENTS,
    GhostsGardenSwingMap,
    DUMBTERM_PRESETS,
    cycleScale,
    cycleModality,
    setModality,
    playClick,
    playDumbtermTypeClick,
    playDumbtermDeleteGhost,
    playDumbtermCursorPlink,
    playDumbtermOutputLine,
    playDatPuterWhir,
    createOscillator,
    noise,
    playWood,
    playPebble,
    playTabla,
    playTineBell,
    playGuitar,
    playChoirPad,
    playCosmicStringVoicing,
    playCosmicArp,
    playMicroHarpCascade,
    playGardenPiano,
    playBeleDrum,
    playBeleFormantWord,
    playFrenchHouseChordWave,
    playAirdrawndaggerPad,
    playCsoundFmBell,
    playCsoundFmTine,
    playCsoundFmPad,
    playCsoundFmSwirl,
    playCsoundSingingBowl,
    playCsoundChantChoir,
    playVermunaCall,
    playLovingCrowSwarm,
    playClosedEyeWitnessDrone,
    playSoulSoloVoice,
    playSonicTamp,
    playCricketBass,
    playMorphingBassNote,
    playCaveFanfare,
    playAetheriumChime,
    playLayerTransition,
    playTimeCrystalWarp,
    playWasmDiscovery,
    playPortalShift,
    playAngelChord,
    playPentagonalRotation,
    playTabFormActuator,
    stepSoundtrack,
    evalInScope: function (code) {
      return eval(code);
    },
  };
  window.__audioEvalInScope = function (code) {
    return eval(code);
  };
})();
