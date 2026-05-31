/* =====================================================================
   marks.jsx — hand-drawn SVG marks + grain + custom cursor
   These are intentional DESIGN MOTIFS (user asked for hand-drawn marks).
   ===================================================================== */
const { useState, useEffect, useRef, useCallback } = React;

function Grain({ opacity = 0.05 }) {
  const uri = "data:image/svg+xml;utf8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"
  );
  return <div className="en-grain" style={{ backgroundImage: `url("${uri}")`, opacity }} />;
}

function Underline({ color = 'var(--accent)', w = 3, style }) {
  return (
    <svg className="en-hand" viewBox="0 0 200 14" preserveAspectRatio="none"
      style={{ left: -2, right: -2, bottom: -9, width: 'calc(100% + 4px)', height: 11, ...style }}>
      <path d="M3 8 C 45 2, 85 13, 125 6 S 182 4, 197 9" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
    </svg>
  );
}

function CircleMark({ color = 'var(--accent)', w = 2.5, style }) {
  return (
    <svg className="en-hand" viewBox="0 0 120 64" preserveAspectRatio="none"
      style={{ inset: '-22% -14%', width: '128%', height: '144%', ...style }}>
      <path d="M62 5 C 104 3, 118 20, 112 34 C 106 52, 66 59, 36 55 C 10 51, 3 34, 11 21 C 18 9, 42 5, 68 7" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
    </svg>
  );
}

function Arrow({ color = 'var(--accent)', w = 2.5, style }) {
  return (
    <svg className="en-hand" viewBox="0 0 90 70" style={{ width: 70, height: 56, ...style }}>
      <path d="M8 12 C 36 6, 60 22, 66 50" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d="M52 44 L70 54 L58 64" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* custom cursor: ring that grows over interactive elements */
function useCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const ring = document.createElement('div');
    ring.className = 'en-cursor';
    document.body.appendChild(ring);
    let rx = innerWidth / 2, ry = innerHeight / 2, x = rx, y = ry, raf;
    const loop = () => { rx += (x - rx) * 0.28; ry += (y - ry) * 0.28; ring.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop); };
    loop();
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      const t = e.target.closest('a,button,.en-post,.en-tag,.en-sw,.en-tcard,input,.en-field');
      ring.classList.toggle('hot', !!t);
    };
    const down = () => ring.classList.add('dot');
    const up = () => ring.classList.remove('dot');
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => { cancelAnimationFrame(raf); ring.remove(); window.removeEventListener('mousemove', move); window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up); };
  }, []);
}

/* scroll reveal — robust: inline styles (always win) + class for transition */
function useReveal(dep) {
  useEffect(() => {
    const els = [...document.querySelectorAll('.en-rev:not(.in)')];
    if (!els.length) return;
    const show = (el) => {
      el.classList.add('in');
      el.style.opacity = '1';
      el.style.transform = 'none';
    };
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px -5% 0px' }) : null;
    requestAnimationFrame(() => {
      els.forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight * 0.94) show(el);
        else if (io) io.observe(el); else show(el);
      });
    });
    const t = setTimeout(() => els.forEach(show), 800);
    return () => { if (io) io.disconnect(); clearTimeout(t); };
  }, [dep]);
}

Object.assign(window, { Grain, Underline, CircleMark, Arrow, useCursor, useReveal });
