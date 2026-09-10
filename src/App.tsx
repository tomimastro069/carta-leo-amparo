import { useState, useEffect, useRef } from "react";

// ─── Configurable content ──────────────────────────────────────────
const CITA = {
  fechaTarget: "2026-10-10T21:00:00", // Fecha objetivo para la cuenta regresiva (AAAA-MM-DDTHH:mm:ss)
  musicaSrc: "https://res.cloudinary.com/dwkdclfwe/video/upload/v1789070320/WhatsApp_Audio_2026-09-10_at_16.55.58_guwmfp.mp3",
  lugar: "",
  lugarDetalles: [
    { label: "Dirección", value: "Esa noche lo sabras" },
    { label: "Ambiente", value: "Íntimo y reservado" },
    { label: "Dress code", value: "linda como siempre" },
  ],
  hora: "",
  horaDetalles: [
    { label: "Duración", value: "Toda la noche" },
    { label: "Punto de encuentro", value: "A revelar" },
    { label: "Llegada", value: "Puntualidad requerida" },
  ],
  dia: "",
  diaDetalles: [
    { label: "Día", value: "10" },
    { label: "Mes", value: "Octubre" },
  ],
  photoSrc: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789066471/WhatsApp_Image_2026-09-10_at_15.13.36_ygh5be.jpg",
  photoAlt: "El individuo en cuestión",
};

const WHATSAPP = {
  numero: "5492613679985",
  mensaje: "Acepto la misión..",
};

const PHOTOS = [
  { src: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789065671/WhatsApp_Image_2026-09-10_at_15.13.37_fu7kxi.jpg", alt: "Pasillo nocturno misterioso" },
  { src: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789065687/WhatsApp_Image_2026-09-10_at_15.13.37_1_dqn5lp.jpg", alt: "Ciudad de noche" },
  { src: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789065689/WhatsApp_Image_2026-09-10_at_15.13.37_2_pkt7wc.jpg", alt: "Luces nocturnas sobre el agua" },
  { src: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789065707/WhatsApp_Image_2026-09-10_at_15.13.38_cs644q.jpg", alt: "Skyline nocturno" },
  { src: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789065713/WhatsApp_Image_2026-09-10_at_15.13.38_1_gypzdf.jpg", alt: "Calle entre edificios" },
  { src: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789065725/WhatsApp_Image_2026-09-10_at_15.13.38_2_lvlsc8.jpg", alt: "Ciudad nocturna reflejada en el agua" },
  { src: "https://res.cloudinary.com/dwkdclfwe/image/upload/v1789065734/WhatsApp_Image_2026-09-10_at_15.13.39_mztmje.jpg", alt: "Dos personas junto al agua" },
];
// ──────────────────────────────────────────────────────────────────

interface Star { id: number; x: number; y: number; size: number; duration: number; delay: number; }
interface Rose { id: number; x: number; y: number; scale: number; rotation: number; opacity: number; duration: number; delay: number; }

function generateStars(n: number): Star[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 1.8 + 0.4, duration: Math.random() * 4 + 2, delay: Math.random() * 6,
  }));
}

function generateRoses(n: number): Rose[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    scale: Math.random() * 0.7 + 0.4, rotation: Math.random() * 360,
    opacity: Math.random() * 0.22 + 0.12,
    duration: Math.random() * 8 + 10, delay: Math.random() * 6,
  }));
}

function RoseSVG({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 68" fill="none">
      <ellipse cx="30" cy="20" rx="7" ry="11" fill="currentColor" opacity="0.88" transform="rotate(0 30 30)" />
      <ellipse cx="30" cy="20" rx="7" ry="11" fill="currentColor" opacity="0.82" transform="rotate(51 30 30)" />
      <ellipse cx="30" cy="20" rx="7" ry="11" fill="currentColor" opacity="0.78" transform="rotate(102 30 30)" />
      <ellipse cx="30" cy="20" rx="7" ry="11" fill="currentColor" opacity="0.82" transform="rotate(153 30 30)" />
      <ellipse cx="30" cy="20" rx="7" ry="11" fill="currentColor" opacity="0.88" transform="rotate(204 30 30)" />
      <ellipse cx="30" cy="20" rx="7" ry="11" fill="currentColor" opacity="0.82" transform="rotate(255 30 30)" />
      <ellipse cx="30" cy="20" rx="7" ry="11" fill="currentColor" opacity="0.78" transform="rotate(306 30 30)" />
      <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.95" />
      <circle cx="30" cy="30" r="4.5" fill="currentColor" opacity="0.55" />
      <path d="M30 40 Q28 50 27 62" stroke="rgba(20,70,20,0.7)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M29 52 Q21 47 23 41" stroke="rgba(20,70,20,0.6)" strokeWidth="1.1" fill="rgba(20,70,20,0.25)" strokeLinecap="round" />
      <path d="M30 56 Q37 51 35 45" stroke="rgba(20,70,20,0.5)" strokeWidth="1" fill="rgba(20,70,20,0.2)" strokeLinecap="round" />
    </svg>
  );
}

function Background({ stars, roses }: { stars: Star[]; roses: Rose[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div key={s.id} className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`,
            "--duration": `${s.duration}s`, "--delay": `${s.delay}s`
          } as React.CSSProperties} />
      ))}
      {roses.map((r) => (
        <div key={r.id} className="absolute"
          style={{
            left: `${r.x}%`, top: `${r.y}%`, transform: `scale(${r.scale}) rotate(${r.rotation}deg)`,
            opacity: r.opacity, color: "#7A1525",
            animation: `float ${r.duration}s ease-in-out infinite`, animationDelay: `${r.delay}s`
          }}>
          <RoseSVG size={50} />
        </div>
      ))}
      <div className="absolute animate-pulse-glow"
        style={{
          width: "900px", height: "900px", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%)"
        }} />
    </div>
  );
}

// ── Envelope intro screen ──────────────────────────────────────────
function EnvelopeScreen({ onOpen, onFirstTouch }: { onOpen: () => void; onFirstTouch: () => void }) {
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");
  const [hovered, setHovered] = useState(false);
  const touchedRef = useRef(false);

  function handleClick() {
    if (phase !== "idle") return;
    // Disparar audio en el primer toque (requerido por autoplay policy)
    if (!touchedRef.current) {
      touchedRef.current = true;
      onFirstTouch();
    }
    setPhase("opening");
    setTimeout(() => {
      onOpen();
    }, 1100);
  }

  const flapOpen = phase === "opening" || phase === "done";
  const leaving = phase === "done";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        background: "linear-gradient(170deg, #060D1E 0%, #050B18 60%, #040810 100%)",
        opacity: leaving ? 0 : (flapOpen ? 0 : 1),
        transform: leaving ? "scale(1.08)" : "scale(1)",
        transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
        pointerEvents: flapOpen ? "none" : "auto",
      }}
    >
      {/* Ambient glow behind envelope */}
      <div className="absolute" style={{
        width: "600px", height: "600px", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Top label */}
      <p className="animate-fade-in mb-10 text-xs uppercase tracking-[0.4em] font-light"
        style={{
          color: "rgba(201,168,76,0.4)", fontFamily: "'Raleway', sans-serif",
          animationFillMode: "both", animationDelay: "0.3s",
          opacity: flapOpen ? 0 : 1, transition: "opacity 0.5s ease"
        }}>
        Ha llegado una carta para vos...
      </p>

      {/* Giant envelope */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative animate-fade-in"
        style={{
          width: "min(420px, 88vw)", height: "min(300px, 63vw)",
          cursor: "pointer", background: "none", border: "none", padding: 0,
          animationFillMode: "both", animationDelay: "0.5s",
          transform: hovered && phase === "idle" ? "scale(1.025) translateY(-4px)" : "scale(1) translateY(0)",
          transition: "transform 0.4s ease",
          filter: hovered && phase === "idle" ? "drop-shadow(0 0 32px rgba(201,168,76,0.18))" : "none",
        }}
        aria-label="Abrir carta"
      >
        <EnvelopeSVG flapOpen={flapOpen} />
      </button>

      {/* Tap hint */}
      <p className="animate-fade-in mt-10 text-xs tracking-widest uppercase font-light"
        style={{
          color: "rgba(201,168,76,0.3)", fontFamily: "'Raleway', sans-serif",
          animationFillMode: "both", animationDelay: "1.2s",
          opacity: phase === "idle" ? undefined : 0, transition: "opacity 0.3s ease"
        }}>
        {hovered ? "Abrir ✦" : "Toca para abrir"}
      </p>
    </div>
  );
}

function EnvelopeSVG({ flapOpen }: { flapOpen: boolean }) {
  return (
    <svg viewBox="0 0 420 300" fill="none" className="w-full h-full">
      {/* Soft pink ambient shadow under envelope */}
      <ellipse cx="210" cy="285" rx="180" ry="12" fill="rgba(244,114,182,0.15)" filter="blur(8px)" />

      {/* Envelope body - Outer Shell */}
      <rect x="4" y="90" width="412" height="206" rx="12"
        fill="url(#roseGradient)" stroke="rgba(244,114,182,0.4)" strokeWidth="1.5" />

      {/* Dark Inner Pocket (Visible when flap opens for depth effect) */}
      <rect x="10" y="96" width="400" height="194" rx="8"
        fill="url(#innerPocketDark)" />

      {/* LETTER / INSIDE CONTENT (Slides up when flap opens) */}
      <g style={{
        transform: flapOpen ? "translateY(-55px)" : "translateY(0px)",
        transition: "transform 1.0s cubic-bezier(0.34, 1.15, 0.64, 1) 0.2s",
      }}>
        {/* Paper card body inside */}
        <rect x="20" y="100" width="380" height="180" rx="8"
          fill="url(#letterPaperDark)" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />

        {/* Decorative corner lines inside card */}
        <line x1="36" y1="116" x2="76" y2="116" stroke="rgba(251,191,36,0.5)" strokeWidth="1" />
        <line x1="344" y1="116" x2="384" y2="116" stroke="rgba(251,191,36,0.5)" strokeWidth="1" />

        {/* "Para vos" text inside envelope */}
        <text x="210" y="152" textAnchor="middle" fill="#FCE7F3"
          fontSize="16" fontFamily="'Cinzel', serif" letterSpacing="6" fontWeight="600"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
          PARA VOS
        </text>

        {/* Inner gold frame border */}
        <rect x="28" y="108" width="364" height="164" rx="6"
          fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="0.8" strokeDasharray="4 2" />
      </g>

      {/* Deep Shadow under flap fold */}
      <path d="M10 96 L210 185 L410 96Z" fill="rgba(0,0,0,0.4)" filter="blur(4px)" pointerEvents="none" />

      {/* Bottom triangle fold (Envelope Front Pocket) */}
      <path d="M4 296 L210 165 L416 296Z"
        fill="url(#roseFoldGradient)" stroke="rgba(244,114,182,0.25)" strokeWidth="1" />

      {/* Left & Right front fold accent lines */}
      <path d="M4 90 L210 200" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" />
      <path d="M416 90 L210 200" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" />

      {/* Flap — animated */}
      <g style={{
        transformOrigin: "210px 90px",
        transform: flapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
        opacity: flapOpen ? 0.35 : 1,
        transition: "transform 1.2s cubic-bezier(0.4,0,0.2,1), opacity 0.8s ease 0.3s",
      }}>
        <path d="M4 90 L210 220 L416 90Z"
          fill="url(#roseFlapGradient)" stroke="rgba(244,114,182,0.45)" strokeWidth="1.5" />

        {/* Wax seal on flap - Deep Rose Gold */}
        <circle cx="210" cy="215" r="23" fill="url(#waxSealGradient)" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" />
        <circle cx="210" cy="215" r="19" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" strokeDasharray="3 2" />
        <text x="210" y="221" textAnchor="middle" fill="#FCE7F3"
          fontSize="18" fontFamily="'Cinzel', serif" fontWeight="600" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>❤</text>
      </g>

      {/* Subtle inner glow border */}
      <rect x="12" y="98" width="396" height="190" rx="8"
        fill="none" stroke="rgba(244,114,182,0.2)" strokeWidth="1" />

      {/* Gradients */}
      <defs>
        <linearGradient id="letterPaperDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D0B1C" />
          <stop offset="100%" stopColor="#1C0511" />
        </linearGradient>
        <linearGradient id="innerPocketDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10030A" />
          <stop offset="60%" stopColor="#1A0511" />
          <stop offset="100%" stopColor="#250917" />
        </linearGradient>
        <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4C1D32" />
          <stop offset="50%" stopColor="#3B1225" />
          <stop offset="100%" stopColor="#2A0B1A" />
        </linearGradient>
        <linearGradient id="roseFoldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B1225" />
          <stop offset="100%" stopColor="#250917" />
        </linearGradient>
        <linearGradient id="roseFlapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5C223E" />
          <stop offset="100%" stopColor="#3B1225" />
        </linearGradient>
        <linearGradient id="waxSealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BE185D" />
          <stop offset="50%" stopColor="#9D174D" />
          <stop offset="100%" stopColor="#831843" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Scroll reveal ──────────────────────────────────────────────────
function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useRevealOnScroll();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    }}>{children}</div>
  );
}

function GoldLine({ className = "" }: { className?: string }) {
  return <div className={className} style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)" }} />;
}

function MysteryValue({ value }: { value: string }) {
  return <span className="font-light tracking-wider italic" style={{ color: "rgba(201,168,76,0.55)" }}>{value}</span>;
}

function PhotoFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative overflow-hidden rounded-full"
        style={{
          width: "136px", height: "136px", border: "1px solid rgba(201,168,76,0.22)",
          boxShadow: "0 0 32px rgba(201,168,76,0.1), 0 8px 32px rgba(0,0,0,0.7)"
        }}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover"
            style={{ filter: "brightness(0.85) contrast(1.05)" }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(160deg, #0c1830 0%, #050B18 100%)" }}>
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <circle cx="50" cy="35" r="18" fill="rgba(201,168,76,0.14)" />
              <path d="M15 85 Q15 58 50 58 Q85 58 85 85" fill="rgba(201,168,76,0.14)" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle at center, transparent 60%, rgba(5,11,24,0.3) 100%)" }} />
      </div>
      <p className="text-xs uppercase tracking-widest font-light"
        style={{ color: "rgba(201,168,76,0.45)", fontFamily: "'Raleway', sans-serif" }}>
        El individuo en cuestión
      </p>
    </div>
  );
}

function InfoRow({ icon, label, value, detalles }: {
  icon: React.ReactNode; label: string; value: string; detalles: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const isMystery = value === "A definir";
  return (
    <div className="flex flex-col">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between gap-4 w-full text-left rounded-lg px-2 py-1 -mx-2"
        style={{ transition: "background 0.2s ease", background: open ? "rgba(201,168,76,0.05)" : "transparent" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.06)")}
        onMouseLeave={e => (e.currentTarget.style.background = open ? "rgba(201,168,76,0.05)" : "transparent")}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">{icon}</div>
          <span className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: "rgba(201,168,76,0.55)", fontFamily: "'Raleway', sans-serif" }}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {isMystery ? <MysteryValue value={value} /> : (
            <span className="text-sm font-light" style={{ color: "rgba(220,220,240,0.85)", fontFamily: "'Raleway', sans-serif" }}>{value}</span>
          )}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{
              color: "rgba(201,168,76,0.4)", transition: "transform 0.3s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0
            }}>
            <path d="M3 5 L7 9 L11 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      <div style={{
        maxHeight: open ? "200px" : "0px", overflow: "hidden",
        transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease", opacity: open ? 1 : 0
      }}>
        <div className="mt-3 mb-1 ml-7 flex flex-col gap-2 rounded-lg px-3 py-3"
          style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.09)" }}>
          {detalles.map(d => (
            <div key={d.label} className="flex items-baseline justify-between gap-4">
              <span className="text-xs font-light tracking-wide" style={{ color: "rgba(201,168,76,0.4)", fontFamily: "'Raleway', sans-serif", whiteSpace: "nowrap" }}>{d.label}</span>
              <span className="text-xs font-light text-right" style={{ color: "rgba(200,210,235,0.65)", fontFamily: "'Raleway', sans-serif" }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    function calculate() {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60),
        });
      }
    }
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 text-center max-w-sm mx-auto">
      {[
        { label: "Días", val: timeLeft.dias },
        { label: "Horas", val: timeLeft.horas }
      ].map((item, idx) => (
        <div key={idx} className="rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center"
          style={{
            background: "rgba(10, 20, 44, 0.65)",
            border: "1px solid rgba(244, 114, 182, 0.2)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(10px)"
          }}>
          <span className="text-2xl md:text-3xl font-semibold gold-shimmer" style={{ fontFamily: "'Cinzel', serif" }}>
            {String(item.val).padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-60 font-light" style={{ color: "#FCE7F3" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function MusicPlayer({
  audioRef,
  playing,
  setPlaying,
}: {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function togglePlay() {
    if (!audioRef.current) {
      inputRef.current?.click();
      return;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-40 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          width: "60px", height: "60px", padding: 0,
          background: "transparent",
          border: "none",
          boxShadow: playing
            ? "0 0 0 2px rgba(244,114,182,0.5), 0 8px 32px rgba(244,114,182,0.25)"
            : "0 4px 20px rgba(0,0,0,0.5)",
          borderRadius: "50%",
          transition: "box-shadow 0.4s ease",
        }}
        aria-label="Reproducir música de ambiente"
        title={playing ? "Pausar música" : "Reproducir canción"}
      >
        <img
          src="/vinyl.jpg"
          alt="Happy Together – The Turtles"
          style={{
            width: "60px", height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
            animation: playing ? "spin 2.5s linear infinite" : "none",
            display: "block",
          }}
        />
        {/* Pause overlay shown when paused */}
        {!playing && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(6,12,26,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCE7F3" strokeWidth="2" strokeLinecap="round">
              <polygon points="5 3 19 12 5 21 5 3" fill="#FCE7F3" stroke="none" />
            </svg>
          </div>
        )}
      </button>
    </>
  );
}

// ── Main ────────────────────────────────────────────────────────────
export default function App() {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [stars] = useState(() => generateStars(90));
  const [roses] = useState(() => generateRoses(20));

  // ── Audio (levantado aquí para compartir con EnvelopeScreen y MusicPlayer)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (CITA.musicaSrc) {
      audioRef.current = new Audio(CITA.musicaSrc);
      audioRef.current.loop = true;
    }
  }, []);

  function handleFirstTouch() {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
  }

  function handleOpen() {
    setVisible(true);
    setTimeout(() => setOpened(true), 700);
  }

  function handleAccept() {
    if (accepted || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setAccepted(true);
      setAnimating(false);
      const url = `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(WHATSAPP.mensaje)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }, 500);
  }

  return (
    <div className="relative min-h-full w-full"
      style={{ background: "linear-gradient(180deg, #060D1E 0%, #050B18 30%, #040810 100%)", fontFamily: "'Raleway', sans-serif" }}>

      <Background stars={stars} roses={roses} />

      {/* Main content — fades in after envelope opens */}
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.1s", pointerEvents: visible ? "auto" : "none" }}>

        {/* ── HERO ── */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="animate-fade-in" style={{ animationFillMode: "both", animationDelay: "0.1s" }}>
            <div className="animate-float mb-8 flex justify-center" style={{ color: "rgba(201,168,76,0.55)" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="2" y="7" width="32" height="23" rx="2.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
                <path d="M2 12 L18 21 L34 12" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] mb-4 font-light" style={{ color: "rgba(201,168,76,0.4)" }}>
              Una invitación muy especial
            </p>
            <h1 className="gold-shimmer text-5xl md:text-7xl font-semibold leading-tight mb-6"
              style={{ fontFamily: "'Cinzel', serif" }}>
              Cita Sorpresa
            </h1>
            <GoldLine className="w-48 mx-auto mb-6" />
            <p className="text-base md:text-lg font-light max-w-sm mx-auto leading-relaxed"
              style={{ color: "rgba(200,210,230,0.6)" }}>
              Lo que estas a punto de descubrir cambiará el curso de la noche.
            </p>
            <div className="mt-16 flex justify-center">
              <div className="animate-float flex flex-col items-center gap-2" style={{ color: "rgba(201,168,76,0.3)" }}>
                <span style={{ fontSize: "15px" }} className="tracking-widest uppercase">Continuar</span>
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                  <rect x="5.5" y="1" width="5" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="5" r="1.5" fill="currentColor" className="animate-pulse-glow" />
                  <path d="M8 15 L8 23 M5 20 L8 23 L11 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="relative z-10 px-4 md:px-8 pb-4">
          <Reveal className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
            <GalleryImg src={PHOTOS[0].src} alt={PHOTOS[0].alt} ratio="aspect-[4/5]" brightness={0.65} />
            <GalleryImg src={PHOTOS[1].src} alt={PHOTOS[1].alt} ratio="aspect-[4/5]" brightness={0.6} />
            <GalleryImg src={PHOTOS[2].src} alt={PHOTOS[2].alt} ratio="aspect-[4/5] col-span-2 sm:col-span-1" brightness={0.62} />
          </Reveal>
          <Reveal delay={100} className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <GalleryImg src={PHOTOS[3].src} alt={PHOTOS[3].alt} ratio="aspect-[4/3] sm:aspect-[16/7]" brightness={0.65} />
            <GalleryImg src={PHOTOS[4].src} alt={PHOTOS[4].alt} ratio="aspect-[4/3] sm:aspect-[16/7]" brightness={0.58} />
          </Reveal>
          <Reveal delay={150} className="grid grid-cols-2 gap-3 md:gap-4">
            <GalleryImg src={PHOTOS[5].src} alt={PHOTOS[5].alt} ratio="aspect-[4/3] sm:aspect-[16/7]" brightness={0.58} />
            <GalleryImg src={PHOTOS[6].src} alt={PHOTOS[6].alt} ratio="aspect-[4/3] sm:aspect-[16/7]" brightness={0.55} pos="center 40%" />
          </Reveal>
        </section>

        {/* ── DIVIDER & COUNTDOWN ── */}
        <section className="relative z-10 flex flex-col items-center py-16 px-6 text-center">
          <Reveal>
            <GoldLine className="w-32 mx-auto mb-8" />
            <p className="text-xs uppercase tracking-[0.4em] font-light mb-4" style={{ color: "rgba(244, 114, 182, 0.6)" }}>
              Tiempo restante para la misión
            </p>
            <div className="mb-8">
              <CountdownTimer targetDate={CITA.fechaTarget} />
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed max-w-md"
              style={{ color: "rgba(200,215,240,0.7)", fontFamily: "'Cinzel', serif" }}>
              Todo lo que necesitas saber está en las próximas líneas.
            </p>
            <GoldLine className="w-32 mx-auto mt-8" />
          </Reveal>
        </section>

        {/* ── INVITATION CARD ── */}
        <section className="relative z-10 flex justify-center px-4 pb-24">
          <div className="w-full" style={{ maxWidth: "520px" }}>
            <Reveal>
              <div className="flex flex-col items-center mb-8">
                <div className="animate-float mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 3 L14 25 M3 14 L25 14 M6 6 L22 22 M22 6 L6 22"
                      stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                    <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="0.9" fill="none" />
                  </svg>
                </div>
                <GoldLine className="w-40" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative rounded-3xl p-8 md:p-10 flex flex-col items-center gap-7 overflow-hidden"
                style={{
                  background: "linear-gradient(165deg, rgba(16, 26, 52, 0.75) 0%, rgba(8, 14, 30, 0.85) 100%)",
                  backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(244, 114, 182, 0.18)",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                }}>

                {/* Subtle corner ornament accent */}
                <div className="absolute top-3 left-3 text-xs opacity-30 select-none pointer-events-none" style={{ color: "#F472B6" }}>✦</div>
                <div className="absolute top-3 right-3 text-xs opacity-30 select-none pointer-events-none" style={{ color: "#F472B6" }}>✦</div>
                <div className="absolute bottom-3 left-3 text-xs opacity-30 select-none pointer-events-none" style={{ color: "#F472B6" }}>✦</div>
                <div className="absolute bottom-3 right-3 text-xs opacity-30 select-none pointer-events-none" style={{ color: "#F472B6" }}>✦</div>

                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-[0.38em] font-medium" style={{ color: "rgba(244, 114, 182, 0.75)" }}>
                    Misión Confidencial
                  </span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-center tracking-wide"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      background: "linear-gradient(135deg, #FFF1F2 0%, #FCE7F3 40%, #F472B6 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 2px 8px rgba(244,114,182,0.25))"
                    }}>
                    ¡Cita Sorpresa!
                  </h2>
                </div>

                <GoldLine className="w-full opacity-60" />

                <p className="text-center font-light text-sm md:text-base leading-relaxed tracking-wide"
                  style={{ color: "rgba(226, 232, 240, 0.82)", maxWidth: "360px" }}>
                  Estás oficialmente convocada para una cita sorpresa especial.
                </p>

                <PhotoFrame src={CITA.photoSrc} alt={CITA.photoAlt} />

                <GoldLine className="w-full opacity-60" />

                <div className="w-full rounded-2xl p-5 flex flex-col gap-4"
                  style={{
                    background: "rgba(6, 12, 26, 0.65)",
                    border: "1px solid rgba(244, 114, 182, 0.12)",
                    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)"
                  }}>
                  <InfoRow
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow(0 0 4px rgba(244,114,182,0.4))">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    }
                    label="Lugar" value={CITA.lugar} detalles={CITA.lugarDetalles}
                  />
                  <GoldLine className="opacity-30" />
                  <InfoRow
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow(0 0 4px rgba(244,114,182,0.4))">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    }
                    label="Hora" value={CITA.hora} detalles={CITA.horaDetalles}
                  />
                  <GoldLine className="opacity-30" />
                  <InfoRow
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow(0 0 4px rgba(244,114,182,0.4))">
                        <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                      </svg>
                    }
                    label="Día" value={CITA.dia} detalles={CITA.diaDetalles}
                  />
                </div>

                <div className="w-full pt-2">
                  {!accepted ? (
                    <button onClick={handleAccept} disabled={animating}
                      className="w-full rounded-2xl py-4 px-6 text-xs md:text-sm tracking-[0.25em] uppercase font-semibold"
                      style={{
                        background: "linear-gradient(135deg, rgba(244, 114, 182, 0.22), rgba(190, 24, 93, 0.28))",
                        border: "1px solid rgba(244, 114, 182, 0.45)", color: "#FCE7F3",
                        boxShadow: "0 8px 24px rgba(190, 24, 93, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                        transition: "all 0.35s ease", fontFamily: "'Raleway', sans-serif",
                        cursor: animating ? "default" : "pointer"
                      }}
                      onMouseEnter={e => {
                        if (!animating) {
                          const el = e.currentTarget;
                          el.style.boxShadow = "0 12px 32px rgba(244, 114, 182, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)";
                          el.style.transform = "translateY(-2px)";
                          el.style.background = "linear-gradient(135deg, rgba(244, 114, 182, 0.32), rgba(190, 24, 93, 0.4))";
                        }
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget;
                        el.style.boxShadow = "0 8px 24px rgba(190, 24, 93, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
                        el.style.transform = "translateY(0)";
                        el.style.background = "linear-gradient(135deg, rgba(244, 114, 182, 0.22), rgba(190, 24, 93, 0.28))";
                      }}>
                      {animating ? <span style={{ opacity: 0.7 }}>Procesando...</span> : "¿Aceptas la misión?"}
                    </button>
                  ) : (
                    <div className="w-full rounded-2xl py-4 px-6 text-center"
                      style={{
                        background: "rgba(6, 12, 26, 0.7)", border: "1px solid rgba(244, 114, 182, 0.25)",
                        animation: "reveal 0.5s ease forwards"
                      }}>
                      <p className="text-xs md:text-sm leading-relaxed font-light"
                        style={{ color: "#FCE7F3", fontFamily: "'Raleway', sans-serif" }}>
                        <span style={{ color: "rgba(244, 114, 182, 0.6)" }}>✦</span>
                        {"  "}Decisión registrada. Ahora solo falta descubrir cuándo y dónde...{"  "}
                        <span style={{ color: "rgba(244, 114, 182, 0.6)" }}>✦</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2 pt-1">
                  <GoldLine className="w-20 opacity-40" />
                  <p className="text-[10px] tracking-[0.3em] uppercase font-light" style={{ color: "rgba(244, 114, 182, 0.35)" }}>
                    ✦ &nbsp; Confidencial &nbsp; ✦
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mx-auto mt-12"
              style={{ width: "1px", height: "80px", background: "linear-gradient(180deg, rgba(201,168,76,0.25), transparent)" }} />
          </div>
        </section>
      </div>

      {/* Floating Music Player */}
      <MusicPlayer audioRef={audioRef} playing={playing} setPlaying={setPlaying} />

      {/* Envelope overlay — unmounts after opened */}
      {!opened && <EnvelopeScreen onOpen={handleOpen} onFirstTouch={handleFirstTouch} />}
    </div>
  );
}

function GalleryImg({ src, alt, ratio, flex, brightness, pos }: {
  src: string; alt: string; ratio?: string; flex?: boolean; brightness: number; pos?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div className={`rounded-xl overflow-hidden ${flex ? "sm:flex-1" : ""} ${ratio ?? ""}`}
      style={{ background: "#0a1428" }}>
      <img src={src} alt={alt} className="w-full h-full object-cover"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          filter: `brightness(${hov ? brightness + 0.18 : brightness}) saturate(${hov ? 0.85 : 0.65})`,
          transform: hov ? "scale(1.04)" : "scale(1)", objectPosition: pos ?? "center",
          transition: "filter 0.4s ease, transform 0.4s ease"
        }} />
    </div>
  );
}
