import { useEffect, useRef } from 'react';

export function ConstellationBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const constellationCount = Math.min(Math.floor(width * height / 15000), 100);
      const freeStarCount = Math.min(Math.floor(width * height / 8000), 200);
      particles = [];

      for (let i = 0; i < constellationCount + freeStarCount; i++) {
        const isFree = i >= constellationCount;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isFree ? 0.3 : 0.8),
          vy: (Math.random() - 0.5) * (isFree ? 0.3 : 0.8),
          size: Math.random() * (isFree ? 1.5 : 2.5) + (isFree ? 0.5 : 1),
          isFree: isFree,
          baseAlpha: Math.random() * 0.3 + (isFree ? 0.3 : 0.6),
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        p.twinklePhase += p.twinkleSpeed;
        const currentAlpha = Math.max(0, p.baseAlpha + Math.sin(p.twinklePhase) * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${currentAlpha})`;
        
        ctx.shadowBlur = p.isFree ? p.size * 3 : p.size * 5;
        ctx.shadowColor = `rgba(0, 229, 255, ${currentAlpha})`;
        
        ctx.fill();
        
        ctx.shadowBlur = 0;

        if (!p.isFree) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (p2.isFree) continue;

            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 229, 255, ${0.7 * (1 - dist / 150)})`;
              ctx.lineWidth = 1;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100"
      style={{ background: 'transparent' }} />);


}