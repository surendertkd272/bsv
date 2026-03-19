/* ===== Particles & Floating Elements ===== */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.25 + 0.05,
      hue: Math.random() > 0.6 ? 20 : (Math.random() > 0.5 ? 240 : 30), /* orange, indigo, or saffron */
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.opacity})`;
    ctx.fill();
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 107, 53, ${0.04 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      drawParticle(p);
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();

/* ===== Countdown Timer ===== */
(function () {
  /* Launch date: 101 days from now */
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 101);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('mins');
  const secsEl = document.getElementById('secs');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date();
    const diff = launchDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    /* Animate number change */
    animateNumber(daysEl, pad(days));
    animateNumber(hoursEl, pad(hours));
    animateNumber(minsEl, pad(mins));
    animateNumber(secsEl, pad(secs));
  }

  function animateNumber(el, newVal) {
    if (el.textContent !== newVal) {
      el.style.transform = 'scale(1.1)';
      el.textContent = newVal;
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 150);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* ===== Email Form — Web3Forms API ===== */
(function () {
  const form = document.getElementById('notify-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  const btnText = form.querySelector('.btn-text');
  const btnLoader = form.querySelector('.btn-loader');
  const submitBtn = document.getElementById('notify-btn');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    /* Show loading state */
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;
    submitBtn.querySelector('svg').style.display = 'none';
    errorMsg.classList.remove('active');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        form.style.display = 'none';
        successMsg.classList.add('active');
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      /* Show error state */
      document.getElementById('error-message').textContent =
        err.message || 'Something went wrong. Please try again.';
      errorMsg.classList.add('active');

      /* Reset button */
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.querySelector('svg').style.display = '';
    }
  });
})();

/* ===== Navbar Scroll Effect ===== */
(function () {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

/* ===== Intersection Observer for Feature Cards ===== */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
    observer.observe(card);
  });
})();
