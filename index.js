/* Andrew Okeke — AI Software Engineer portfolio (v2) */
document.documentElement.classList.remove("no-js");
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Neural network background ---------- */
  const canvas = $("#neural");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    const mouse = { x: -9999, y: -9999 };
    let w, h, dpr, nodes = [], pulses = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        vy: (Math.random() - 0.5) * 0.25 * dpr,
        r: (Math.random() * 1.4 + 0.6) * dpr,
      }));
    };
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });

    const LINK = 140;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const link = LINK * dpr;

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 160 * dpr) { n.x += (dx / d) * 0.6; n.y += (dy / d) * 0.6; }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d / link) * 0.28})`;
            ctx.lineWidth = dpr * 0.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (Math.random() < 0.0009) pulses.push({ a, b, t: 0 });
          }
        }
      }

      pulses = pulses.filter((p) => (p.t += 0.02) < 1);
      for (const p of pulses) {
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.fillStyle = "rgba(34,211,238,0.95)";
        ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 12 * dpr;
        ctx.beginPath(); ctx.arc(x, y, 1.8 * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const n of nodes) {
        ctx.fillStyle = "rgba(190,200,255,0.7)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------- Cursor glow + card spotlight ---------- */
  const glow = $(".cursor-glow");
  if (fine && glow) {
    addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  } else if (glow) glow.remove();

  $$(".spot").forEach((el) =>
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    })
  );

  /* ---------- 3D tilt on console ---------- */
  if (fine && !reduce) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });

    /* magnetic buttons */
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Role typer ---------- */
  const typer = $("#typer");
  const roles = [
    "AI Software Engineer",
    "LLM & RAG Integrations",
    "AI Agents & Automation",
    "React · Next.js · React Native",
    "Remote Contractor — open to work",
  ];
  if (typer && !reduce) {
    let ri = 0, ci = roles[0].length, deleting = true;
    const loop = () => {
      const word = roles[ri];
      typer.textContent = word.slice(0, ci);
      let delay = deleting ? 35 : 70;
      if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 300; }
      else if (!deleting && ci === roles[ri].length) { deleting = true; delay = 2200; }
      ci += deleting ? -1 : 1;
      setTimeout(loop, delay);
    };
    setTimeout(loop, 2400);
  }

  /* ---------- Agent console ---------- */
  const out = $("#console");
  const tokensEl = $("#tokens");
  const latencyEl = $("#latency");
  const script = [
    ['<span class="c-p">❯</span> <span class="c-k">agent</span>.run(<span class="c-s">"Answer investor Q from 10-K"</span>)', 500],
    ['<span class="c-d">  ↳ embedding query…</span>', 350],
    ['<span class="c-d">  ↳ retrieving 6 chunks from vector store</span>', 450],
    ['<span class="c-d">  ↳ calling tool: </span><span class="c-k">get_filing</span>(<span class="c-s">"FY2025"</span>)', 450],
    ['<span class="c-ok">  ✓ grounded answer · 3 citations</span>', 600],
    ["", 200],
    ['<span class="c-p">❯</span> <span class="c-k">ship</span>(<span class="c-s">"support-copilot"</span>, { env: <span class="c-s">"prod"</span> })', 500],
    ['<span class="c-d">  ↳ evals passed 48/48</span>', 400],
    ['<span class="c-d">  ↳ streaming UI · React + TypeScript</span>', 400],
    ['<span class="c-ok">  ✓ deployed — users served 24/7</span>', 900],
    ["", 200],
    ['<span class="c-p">❯</span> <span class="c-k">hire</span>(<span class="c-s">"andrew"</span>) <span class="c-d">// available now</span>', 0],
  ];
  if (out) {
    if (reduce) {
      out.innerHTML = script.map((l) => l[0]).join("\n");
    } else {
      let tokens = 0;
      const run = async () => {
        out.innerHTML = "";
        for (const [line, wait] of script) {
          const div = document.createElement("div");
          div.innerHTML = line || "&nbsp;";
          div.style.opacity = 0;
          div.style.transition = "opacity .35s";
          out.appendChild(div);
          requestAnimationFrame(() => (div.style.opacity = 1));
          tokens += Math.floor(Math.random() * 120 + 40);
          tokensEl.textContent = tokens.toLocaleString();
          latencyEl.textContent = Math.floor(Math.random() * 90 + 110);
          await new Promise((r) => setTimeout(r, wait));
        }
        const cur = document.createElement("span");
        cur.className = "cur";
        out.lastChild.appendChild(cur);
        setTimeout(run, 5000);
      };
      setTimeout(run, 900);
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
          el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 6) * 80}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("is-in"));

  /* ---------- Count-up stats ---------- */
  const counts = $$(".count");
  const countUp = (el) => {
    const to = +el.dataset.to;
    if (reduce) return (el.textContent = to);
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  setTimeout(() => counts.forEach(countUp), 600);

  /* ---------- Nav: scroll state, progress, active link, mobile ---------- */
  const nav = $("#nav");
  const progress = $(".scroll-progress");
  const links = $$('.nav__links a[href^="#"]:not(.btn)');
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    let current = null;
    sections.forEach((s) => { if (s.offsetTop - 140 <= y) current = s.id; });
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $("#navToggle");
  const menu = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });
  $$("a", menu).forEach((a) =>
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    })
  );

  /* ---------- Project filter ---------- */
  const filters = $$(".filter");
  const projects = $$(".project");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      projects.forEach((p) => {
        const show = f === "all" || p.dataset.cat.split(" ").includes(f);
        p.classList.toggle("is-hidden", !show);
        if (show) p.classList.add("is-in");
      });
    })
  );

  /* ---------- Copy email ---------- */
  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const label = $(".copy-label", copyBtn);
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        label.textContent = "Copied ✓";
      } catch {
        location.href = `mailto:${copyBtn.dataset.email}`;
      }
      setTimeout(() => (label.textContent = "Copy"), 2000);
    });
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
