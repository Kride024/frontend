import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Types ----------
interface FirstManagerProps {
  name?: string;
}

interface KpiCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

interface KpiCarouselProps {
  cards: React.ReactElement[];
}

// ---------- Main Component ----------
export default function FirstManager({ name }: FirstManagerProps) {
  const navigate = useNavigate();
  const displayName = name || "Manager";

  const cards: React.ReactElement[] = [
    <KpiCard key="checkin" title="Today’s Check-in" icon={IconCheckIn}>
      <p style={{ fontSize: 20, color: "#000" }}>
        <span style={{ fontWeight: 800, fontSize: 28 }}>5</span> scheduled today<br /> 12/09/25
      </p>
    </KpiCard>,
    <KpiCard key="checkout" title="Today’s Check-out" icon={IconCheckOut}>
      <p style={{ fontSize: 20, color: "#000" }}>
        <span style={{ fontWeight: 800, fontSize: 28 }}>3</span> scheduled today as<br /> 12/09/25
      </p>
    </KpiCard>,
    <KpiCard key="tickets" title="Maintenance Tickets" icon={IconMaintenance} onClick={() => navigate("/maintenance-alerts")}>
      <p style={{ fontSize: 20, color: "#000" }}>
        <span style={{ fontWeight: 800, fontSize: 28 }}>7</span> Open Tickets
      </p>
    </KpiCard>,
    <KpiCard key="overdue" title="Overdue" icon={IconOverdue}>
      <p style={{ fontSize: 20, color: "#000" }}>
        <span style={{ fontWeight: 800, fontSize: 28 }}>8</span> Overdues
      </p>
    </KpiCard>,
  ];

  return (
    <div className="w-full p-4">
      <header className="mb-6">
        <h1
          className="font-extrabold text-black"
          style={{ fontSize: "clamp(1rem, 2.6vw, 1.6rem)", fontFamily: "Poppins, sans-serif" }}
        >
          {`${displayName}'s Dashboard`}
        </h1>
        <span className="text-lg text-gray-600 font-medium">(Manager)</span>

        <div
          className="mt-2 text-[#615F5F] font-extrabold truncate max-w-full"
          style={{ fontSize: "clamp(0.78rem, 1.6vw, 1rem)", fontFamily: "Poppins, sans-serif" }}
        >
          Hamsa PG, TNGO Colony, Gachibowli, Hyderabad, 25 rooms with 50 beds, Owner: Mohan-923456781
        </div>
      </header>

      <section className="w-full">
        <KpiCarousel cards={cards} />
      </section>
    </div>
  );
}

// ---------- Icons ----------
const IconCheckIn = (
  <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#0B2595" strokeWidth="1.8" />
    <path d="M3 9h18" stroke="#0B2595" strokeWidth="1.8" />
    <path d="M8 3v3M16 3v3" stroke="#0B2595" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17 14h-6m0 0l2-2m-2 2l2 2" stroke="#0B2595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCheckOut = (
  <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#0B2595" strokeWidth="1.8" />
    <path d="M3 9h18" stroke="#0B2595" strokeWidth="1.8" />
    <path d="M8 3v3M16 3v3" stroke="#0B2595" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11 14h6m0 0l-2-2m2 2l-2 2" stroke="#0B2595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMaintenance = (
  <img src="/Vector.png" alt="Maintenance Icon" width={42} height={42} />
);

const IconOverdue = (
  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
    <path
      d="M22.5151 5.25004L39.1856 34.125C39.3392 34.3911 39.42 34.6929 39.42 35C39.42 35.3072 39.3392 35.609 39.1856 35.875C39.032 36.1411 38.8111 36.362 38.545 36.5156C38.279 36.6692 37.9772 36.75 37.6701 36.75H4.32906C4.02187 36.75 3.7201 36.6692 3.45407 36.5156C3.18805 36.362 2.96714 36.1411 2.81355 35.875C2.65996 35.609 2.5791 35.3072 2.5791 35C2.5791 34.6929 2.65996 34.3911 2.81356 34.125L19.4841 5.25004C19.6377 4.98403 19.8586 4.76314 20.1246 4.60956C20.3906 4.45597 20.6924 4.37512 20.9996 4.37512C21.3067 4.37512 21.6085 4.45597 21.8745 4.60956C22.1405 4.76314 22.3615 4.98403 22.5151 5.25004ZM19.2496 28V31.5H22.7496V28H19.2496ZM19.2496 15.75V24.5H22.7496V15.75H19.2496Z"
      fill="#0B2595"
    />
  </svg>
);

// ---------- Reusable KPI Card ----------
function KpiCard({ title, icon, children, onClick }: KpiCardProps) {
  return (
    <article
      className="rounded-[30px] flex-shrink-0 transition-all duration-300 cursor-pointer"
      style={{
        width: 261,
        height: 380,
        border: "1px solid rgba(79, 107, 227, 0.00)",
        background: "#FFF",
        boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.10)",
      }}
      onClick={onClick}
    >
      <div
        className="h-full rounded-[20px] p-6 flex flex-col justify-between"
        style={{
          color: "#001433",
          fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        }}
      >
        {/* Header */}
        <header className="flex flex-col items-center gap-3 mt-2 text-center">
          <div style={{ width: 48, height: 48 }} className="flex-shrink-0">
            {icon}
          </div>
          <h3
            className="font-semibold"
            style={{ color: "#0F45A9", fontSize: 22, fontWeight: 700, letterSpacing: "-0.2px" }}
          >
            {title}
          </h3>
        </header>

        {/* Body */}
        <div className="px-2 text-center flex-1 flex flex-col justify-center" style={{ lineHeight: 1.35 }}>
          {children}
        </div>

        {/* Footer */}
        <div className="mt-2 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="text-[#0F45A9] font-medium inline-block hover:underline focus:outline-none"
            style={{
              fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            View Details →
          </button>
        </div>
      </div>

      {/* Hover Effect */}
      <style jsx>{`
        article:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 6px 8px 12px rgba(0, 0, 0, 0.12);
          border: 0.7px solid #ff8f6b !important;
          z-index: 2;
        }
      `}</style>
    </article>
  );
}

// ---------- Mobile Carousel ----------
function KpiCarousel({ cards }: KpiCarouselProps) {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = cards.length;

  const go = (n: number) => setIdx(((n % count) + count) % count);
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let startX = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        dx > 0 ? prev() : next();
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [idx]);

  const trackWidth = `${count * 100}%`;
  const translateX = `-${(100 / count) * idx}%`;
  const childWidth = `${100 / count}%`;

  return (
    <>
      {/* Mobile View */}
      <div className="sm:hidden relative w-full">
        <div className="overflow-hidden" ref={trackRef}>
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ width: trackWidth, transform: `translateX(${translateX})` }}
          >
            {cards.map((card, i) => (
              <div key={i} className="flex justify-center p-1" style={{ width: childWidth }}>
                {card}
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Previous"
          onClick={prev}
          className="group absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg hover:bg-white hover:shadow-xl active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BE3]/60"
        >
          <ChevronLeft className="w-5 h-5 text-[#0B2595] transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          aria-label="Next"
          onClick={next}
          className="group absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg hover:bg-white hover:shadow-xl active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BE3]/60"
        >
          <ChevronRight className="w-5 h-5 text-[#0B2595] transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="flex justify-center gap-2 mt-3">
          {cards.map((_, i) => {
            const isActive = i === idx;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`inline-block w-2.5 h-2.5 rounded-full transition-colors ${isActive ? "bg-[#4F6BE3]" : "bg-gray-300"}`}
                aria-label={`Go to card ${i + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
        {cards}
      </div>
    </>
  );
}