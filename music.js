(() => {
  let ctx = null, timer = null, step = 0, playing = false;

  const chords = [
    [261.63, 329.63, 392.00, 493.88],
    [220.00, 261.63, 329.63, 392.00],
    [174.61, 220.00, 261.63, 329.63],
    [196.00, 246.94, 293.66, 392.00]
  ];

  function tone(freq, start, duration, volume, type='sine') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = type;
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  function playBar() {
    if (!ctx || !playing) return;
    const now = ctx.currentTime + 0.05;
    const chord = chords[step % chords.length];
    chord.forEach((f, i) => tone(f, now + i * 0.18, 1.7, 0.07));
    tone(chord[0] / 2, now, 1.8, 0.045, 'triangle');
    tone(chord[2] * 2, now + 0.72, 0.65, 0.03);
    step++;
  }

  function updateButton() {
    const b = document.getElementById('musicToggle');
    if (b) b.textContent = playing ? '♫ Music on' : '♫ Music';
    if (b) b.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on');
  }

  async function toggleMusic() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') await ctx.resume();
    playing = !playing;
    if (playing) {
      playBar();
      timer = setInterval(playBar, 1900);
    } else {
      clearInterval(timer);
      timer = null;
    }
    updateButton();
  }

  function addButton() {
    if (document.getElementById('musicToggle')) return;
    const b = document.createElement('button');
    b.id = 'musicToggle';
    b.type = 'button';
    b.textContent = '♫ Music';
    b.onclick = toggleMusic;
    document.body.appendChild(b);
  }

  document.addEventListener('DOMContentLoaded', addButton);
})();