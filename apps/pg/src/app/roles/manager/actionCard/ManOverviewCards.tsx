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
    <KpiCard key="checkin" title="Today's Check-in" icon={IconCheckIn}>
      <p style={{ fontSize: 20, color: "#000" }}>
        <span style={{ fontWeight: 800, fontSize: 28 }}>5</span> scheduled today<br /> 12/09/25
      </p>
    </KpiCard>,
    <KpiCard key="checkout" title="Today's Check-out" icon={IconCheckOut}>
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
  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M35 12.25H27.125V9.625C27.125 7.875 25.725 6.475 24.025 6.475H17.975C16.225 6.475 14.875 7.875 14.875 9.625V12.25H7C5.225 12.25 3.815 13.65 3.815 15.45L3.5 33.075C3.5 34.875 4.9 36.25 6.7 36.25H35.3C37.1 36.25 38.5 34.875 38.5 33.075V15.45C38.5 13.65 37.1 12.25 35.3 12.25H35ZM16.625 9.625H25.375V12.25H16.625V9.625ZM21 28.7C19.5625 28.7 18.375 27.5 18.375 26.075C18.375 24.625 19.5625 23.475 21 23.475C22.425 23.475 23.625 24.625 23.625 26.075C23.625 27.5 22.425 28.7 21 28.7Z" fill="#0B2595" />
  </svg>
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

// ---------- Responsive Carousel with Smart Arrow Positioning ----------
function KpiCarousel({ cards }: KpiCarouselProps) {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const count = cards.length;

  // Responsive layout state
  const [arrowOffset, setArrowOffset] = useState(12);
  const [visibleAreaWidth, setVisibleAreaWidth] = useState(0);

  const CARD_WIDTH = 261;
  const MIN_GAP = 16;
  const SIDE_PADDING_MIN = 8;
  const ARROW_SIZE = 40;

  const go = (n: number) => setIdx(((n % count) + count) % count);
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  // Compute responsive arrow positioning based on screen width
  useEffect(() => {
    const compute = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const wrapperWidth = wrapper.clientWidth;
      const available = Math.max(0, wrapperWidth - SIDE_PADDING_MIN * 2);
      
      // Calculate how many cards fit
      let maxCount = Math.floor((available + MIN_GAP) / (CARD_WIDTH + MIN_GAP));
      maxCount = Math.max(1, Math.min(maxCount, count));

      const gapsCount = Math.max(0, maxCount - 1);
      const remaining = Math.max(0, wrapperWidth - maxCount * CARD_WIDTH - SIDE_PADDING_MIN * 2);

      // Calculate gap
      let computedGap = MIN_GAP;
      if (gapsCount > 0) {
        const maxGapAllowed = 100;
        computedGap = Math.floor(remaining / gapsCount);
        computedGap = Math.max(MIN_GAP, Math.min(computedGap, maxGapAllowed));
      }

      // Calculate arrow position based on visible cards width
      const computedVisibleAreaWidth = maxCount * CARD_WIDTH + gapsCount * computedGap;
      const leftSpace = Math.max(0, (wrapperWidth - computedVisibleAreaWidth) / 2);
      const offset = Math.max(8, Math.round(leftSpace - ARROW_SIZE / 2));

      setVisibleAreaWidth(computedVisibleAreaWidth);
      setArrowOffset(offset);
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

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
      <div className="sm:hidden relative w-full" ref={wrapperRef}>
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
          style={{
            position: "absolute",
            left: `${arrowOffset}px`,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
          }}
          className="group grid place-items-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg hover:bg-white hover:shadow-xl active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BE3]/60"
        >
          <ChevronLeft className="w-5 h-5 text-[#0B2595] transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          aria-label="Next"
          onClick={next}
          style={{
            position: "absolute",
            right: `${arrowOffset}px`,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
          }}
          className="group grid place-items-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg hover:bg-white hover:shadow-xl active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BE3]/60"
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