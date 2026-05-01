const canvas = document.getElementById("barsCanvas");
const ctx = canvas.getContext("2d");

// CONFIG
const backgroundColor = "#000000ff";
const lineColor = "#5e5d59ff";
const barColor = "#5e5d59ff";
const lineWidth = 1;
const animationSpeed = 0.005;

// STATE
let time = 0;
let animationFrameId;
let dpr = 1;

let transitionBursts = [];

// NOISE
function noise(x, y, t) {
  const n =
    Math.sin(x * 0.02 + t) * Math.cos(y * 0.02 + t) +
    Math.sin(x * 0.03 - t) * Math.cos(y * 0.01 + t);
  return (n + 1) / 2;
}

// BURST INFLUENCE
function getBurstInfluence(x, y, currentTime) {
  let total = 0;

  transitionBursts.forEach(burst => {
    const age = currentTime - burst.time;
    const maxAge = 2500;

    if (age < maxAge) {
      const dx = x - burst.x;
      const dy = y - burst.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const radius = (age / maxAge) * 300;
      const width = 60;

      if (Math.abs(dist - radius) < width) {
        const strength = (1 - age / maxAge) * burst.intensity;
        const proximity = 1 - Math.abs(dist - radius) / width;
        total += strength * proximity;
      }
    }
  });

  return Math.min(total, 1.5);
}

// PATTERN
function generatePattern(seed, width, height, numLines) {
  const pattern = [];
  const spacing = width / numLines;

  for (let i = 0; i < numLines; i++) {
    const bars = [];
    let y = 0;

    while (y < height) {
      const n = noise(i * spacing, y, seed);

      if (n > 0.5) {
        const len = 10 + n * 30;
        const w = 2 + n * 3;

        bars.push({
          y: y + len / 2,
          height: len,
          width: w
        });

        y += len + 15;
      } else {
        y += 15;
      }
    }

    pattern.push(bars);
  }

  return pattern;
}

// RESIZE
function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;

  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width = w * dpr;
  canvas.height = h * dpr;

  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

// CLICK HANDLING (GLOBAL — WORKS THROUGH DIVS)
window.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  transitionBursts.push({
    x,
    y,
    time: Date.now(),
    intensity: 2
  });

  const now = Date.now();
  transitionBursts = transitionBursts.filter(b => now - b.time < 2500);
});

window.addEventListener("resize", resizeCanvas);

// ANIMATION
function animate() {
  const currentTime = Date.now();
  time += animationSpeed;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const numLines = Math.floor(width / 15);
  const spacing = width / numLines;

  const pattern1 = generatePattern(0, width, height, numLines);
  const pattern2 = generatePattern(5, width, height, numLines);

  const cycle = time % (Math.PI * 2);
  const t = cycle;

  let easing;
  if (t < Math.PI * 0.1) easing = 0;
  else if (t < Math.PI * 0.9) easing = (t - Math.PI * 0.1) / (Math.PI * 0.8);
  else if (t < Math.PI * 1.1) easing = 1;
  else if (t < Math.PI * 1.9) easing = 1 - (t - Math.PI * 1.1) / (Math.PI * 0.8);
  else easing = 0;

  const smooth =
    easing < 0.5
      ? 4 * easing * easing * easing
      : 1 - Math.pow(-2 * easing + 2, 3) / 2;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < numLines; i++) {
    const x = i * spacing + spacing / 2;

    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    const bars1 = pattern1[i] || [];
    const bars2 = pattern2[i] || [];
    const maxBars = Math.max(bars1.length, bars2.length);

    for (let j = 0; j < maxBars; j++) {
      let b1 = bars1[j];
      let b2 = bars2[j];

      if (!b1) b1 = { y: b2.y - 100, height: 0, width: 0 };
      if (!b2) b2 = { y: b1.y + 100, height: 0, width: 0 };

      const burstInf = getBurstInfluence(x, b1.y, currentTime);

      const wave =
        Math.sin(i * 0.3 + j * 0.5 + time * 2) * 10 * (smooth * (1 - smooth) * 4) +
        burstInf * Math.sin(time * 4 + j * 0.3) * 20;

      const y = b1.y + (b2.y - b1.y) * smooth + wave;

      const h =
        b1.height +
        (b2.height - b1.height) * smooth +
        burstInf * 8;

      const w =
        b1.width +
        (b2.width - b1.width) * smooth +
        burstInf * 3;

      if (h > 0.1 && w > 0.1) {
        const intensity = Math.min(1, 0.8 + burstInf * 0.3);

        const r = parseInt(barColor.slice(1, 3), 16);
        const g = parseInt(barColor.slice(3, 5), 16);
        const b = parseInt(barColor.slice(5, 7), 16);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;
        ctx.fillRect(x - w / 2, y - h / 2, w, h);
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

// START
resizeCanvas();
animate();