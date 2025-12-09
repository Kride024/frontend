import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import AddGuestModal from "../addGuest/AddGuest";
import AddManagerModal from "../../manager/addManModal/AddManagerModal";
import AddNewPGModal from "../../manager/addPg/AddNewPG";
import DownloadReportModal from "@pg/app/shared/components/DownloadReport";
import SendAnnouncementModal from "@pg/app/shared/components/SendAnnouncement";

interface ActionButtonsProps {
  onAddManager: () => void;
  onSendAnnouncement: () => void;
  onDownloadReport: () => void;
  onAddPG: () => void;
  onAddGuest: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddManager,
  onSendAnnouncement,
  onDownloadReport,
  onAddPG,
  onAddGuest,
}) => {
  const [isAddManagerOpen, setIsAddManagerOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isSendOpen, setIsSendOpen] = useState<boolean>(false);
  const [isAddNewPGOpen, setIsAddNewPGOpen] = useState<boolean>(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState<boolean>(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState<boolean>(false);

  // Layout constants
  const BUTTON_WIDTH = 220;
  const MIN_GAP = 16; // Reduced from 24 to allow more cards
  const SIDE_PADDING_MIN = 8; // Reduced from 12
  const ARROW_SIZE = 36;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Responsive state
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [gap, setGap] = useState<number>(MIN_GAP);
  const [sidePadding, setSidePadding] = useState<number>(SIDE_PADDING_MIN);
  const [arrowOffset, setArrowOffset] = useState<number>(12);

  // Button definitions
  const buttonDefs = [
    {
      id: "add-manager",
      label: "Add Manager",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M23.1 18.9V10.5H18.9V18.9H10.5V23.1H18.9V31.5H23.1V23.1H31.5V18.9H23.1ZM21 42C15.4305 42 10.089 39.7875 6.15076 35.8492C2.21249 31.911 0 26.5695 0 21C0 15.4305 2.21249 10.089 6.15076 6.15076C10.089 2.21249 15.4305 0 21 0C26.5695 0 31.911 2.21249 35.8492 6.15076C39.7875 10.089 42 15.4305 42 21C42 26.5695 39.7875 31.911 35.8492 35.8492C31.911 39.7875 26.5695 42 21 42Z" fill="#0B2595" />
        </svg>
      ),
      onClick: () => setIsAddManagerOpen(true),
    },
    {
      id: "download-report",
      label: "Download Report",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M29.2373 12.957C28.9065 12.628 28.4533 12.4618 28 12.4618C27.5467 12.4618 27.0935 12.628 26.7628 12.957L22.75 16.9697V5.25C22.75 4.78587 22.5656 4.34075 22.2374 4.01256C21.9092 3.68437 21.4641 3.5 21 3.5C20.5359 3.5 20.0908 3.68437 19.7626 4.01256C19.4344 4.34075 19.25 4.78587 19.25 5.25V16.9697L15.2372 12.957C15.0751 12.7939 14.8823 12.6645 14.67 12.5762C14.4577 12.4879 14.23 12.4424 14 12.4424C13.77 12.4424 13.5423 12.4879 13.33 12.5762C13.1177 12.6645 12.9249 12.7939 12.7628 12.957C12.4347 13.2852 12.2504 13.7302 12.2504 14.1943C12.2504 14.6583 12.4347 15.1033 12.7628 15.4315L21 23.625L29.2407 15.428C29.5673 15.0995 29.7503 14.655 29.7496 14.1918C29.749 13.7286 29.5647 13.2846 29.2373 12.957ZM36.7272 28C36.7342 27.8132 36.7111 27.6265 36.659 27.447L33.159 16.947C33.043 16.5987 32.8204 16.2957 32.5226 16.0808C32.2249 15.866 31.8671 15.7503 31.5 15.75H31.1168C30.9522 16.079 30.7492 16.394 30.4745 16.6687L27.881 19.25H30.24L33.1573 28H8.8445L11.7618 19.25H14.1208L11.5255 16.6687C11.2634 16.399 11.0466 16.0888 10.8832 15.75H10.5C10.1329 15.7503 9.77511 15.866 9.47738 16.0808C9.17965 16.2957 8.95702 16.5987 8.841 16.947L5.341 27.447C5.28886 27.6265 5.26582 27.8132 5.27275 28C5.25 28 5.25 36.75 5.25 36.75C5.25 37.2141 5.43437 37.6592 5.76256 37.9874C6.09075 38.3156 6.53587 38.5 7 38.5H35C35.4641 38.5 35.9093 38.3156 36.2374 37.9874C36.5656 37.6592 36.75 37.2141 36.75 36.75C36.75 36.75 36.75 28 36.7272 28Z" fill="#0B2595" />
        </svg>
      ),
      onClick: () => setIsDownloadOpen(true),
    },
    {
      id: "send-announcement",
      label: "Send Announcement",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M4.10359 3.92874C4.36481 3.70183 4.68743 3.55744 5.03069 3.51383C5.37395 3.47022 5.72243 3.52935 6.03209 3.68375L37.5321 19.4337C37.8233 19.5789 38.0683 19.8023 38.2395 20.079C38.4108 20.3557 38.5015 20.6746 38.5015 21C38.5015 21.3254 38.4108 21.6443 38.2395 21.921C38.0683 22.1977 37.8233 22.4211 37.5321 22.5662L6.03209 38.3162C5.72245 38.4712 5.37382 38.5308 5.03029 38.4875C4.68677 38.4442 4.36381 38.3 4.10227 38.0732C3.84072 37.8463 3.65236 37.5469 3.56101 37.2129C3.46966 36.879 3.47944 36.5254 3.58909 36.197L8.07259 22.75H17.4998C17.964 22.75 18.4091 22.5656 18.7373 22.2374C19.0655 21.9092 19.2498 21.4641 19.2498 21C19.2498 20.5359 19.0655 20.0907 18.7373 19.7626C18.4091 19.4344 17.964 19.25 17.4998 19.25H8.07259L3.58734 5.80299C3.47825 5.47472 3.4689 5.12147 3.56048 4.78788C3.65205 4.45429 3.84219 4.15532 4.10359 3.92874Z" fill="#0B2595" />
        </svg>
      ),
      onClick: () => setIsSendOpen(true),
    },
    {
      id: "add-pg",
      label: "Add New PG",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M16.1962 5.00593C17.5733 3.94589 19.2622 3.37109 21 3.37109C22.7378 3.37109 24.4267 3.94589 25.8037 5.00593L34.9912 12.0751C35.947 12.8108 36.7211 13.7564 37.2536 14.8387C37.7861 15.9209 38.0628 17.1111 38.0625 18.3173V30.1876C38.0625 32.2761 37.2328 34.2792 35.756 35.756C34.2791 37.2329 32.2761 38.0626 30.1875 38.0626H11.8125C9.72392 38.0626 7.72088 37.2329 6.24403 35.756C4.76719 34.2792 3.9375 32.2761 3.9375 30.1876V18.3173C3.93718 17.1111 4.21395 15.9209 4.74645 14.8387C5.27895 13.7564 6.05295 12.8108 7.00875 12.0751L16.1962 5.00593ZM18.375 21.0001C16.5638 21.0001 15.0938 22.4701 15.0938 24.2813V34.1251H26.9062V24.2813C26.9062 22.4701 25.4363 21.0001 23.625 21.0001H18.375Z" fill="#0B2595" />
        </svg>
      ),
      onClick: () => setIsAddNewPGOpen(true),
    },
    {
      id: "add-guest",
      label: "Add Guest",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M13.125 11.375C13.125 15.7168 16.6582 19.25 21 19.25C25.3417 19.25 28.875 15.7168 28.875 11.375C28.875 7.03325 25.3417 3.5 21 3.5C16.6582 3.5 13.125 7.03325 13.125 11.375ZM35 36.75H36.75V35C36.75 28.2467 31.2533 22.75 24.5 22.75H17.5C10.745 22.75 5.25 28.2467 5.25 35V36.75H35Z" fill="#0B2595" />
        </svg>
      ),
      onClick: () => setIsAddGuestOpen(true),
    },
  ];

  const totalButtons = buttonDefs.length;

  // Responsive layout computation - optimized for tablet
  useEffect(() => {
    const compute = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperWidth = wrapper.clientWidth;

      // Calculate available space more aggressively
      const available = Math.max(0, wrapperWidth - SIDE_PADDING_MIN * 2);
      
      // Calculate how many cards can fit
      let maxCount = Math.floor((available + MIN_GAP) / (BUTTON_WIDTH + MIN_GAP));
      maxCount = Math.max(1, Math.min(maxCount, totalButtons));

      const totalCardWidth = maxCount * BUTTON_WIDTH;
      const remaining = Math.max(0, wrapperWidth - totalCardWidth);

      const gapsCount = Math.max(0, maxCount - 1);
      const preferredSidePadding = SIDE_PADDING_MIN;

      let computedGap;
      if (gapsCount > 0) {
        // Distribute remaining space across gaps
        computedGap = Math.floor((remaining - preferredSidePadding * 2) / gapsCount);
        computedGap = Math.max(MIN_GAP, computedGap);
        
        // Cap maximum gap at 100px for better aesthetics
        const maxGapAllowed = 100;
        computedGap = Math.min(computedGap, maxGapAllowed);
      } else {
        computedGap = MIN_GAP;
      }

      if (!isFinite(computedGap) || computedGap <= 0) computedGap = MIN_GAP;

      const computedVisibleAreaWidth = maxCount * BUTTON_WIDTH + gapsCount * computedGap;
      const leftSpace = Math.max(0, (wrapperWidth - computedVisibleAreaWidth) / 2);
      const offset = Math.max(8, Math.round(leftSpace - ARROW_SIZE / 2));

      setVisibleCount(maxCount);
      setGap(Math.round(computedGap));
      setSidePadding(preferredSidePadding);
      setArrowOffset(offset);
      setStartIndex((s) => Math.min(s, Math.max(0, totalButtons - maxCount)));
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [totalButtons]);

  // Navigation
  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + visibleCount < totalButtons;
  const goLeft = () => setStartIndex((s) => Math.max(0, s - 1));
  const goRight = () => setStartIndex((s) => Math.min(totalButtons - visibleCount, s + 1));

  return (
    <>
      <div className="w-full px-0 py-6">
        <section className="flex justify-center relative">
          <div
            className="w-full max-w-[1260px] 2xl:max-w-[2300px] mx-auto relative"
            ref={wrapperRef}
          >
            <div 
              ref={containerRef} 
              style={{ 
                overflowX: "hidden", 
                overflowY: "visible",
                padding: `calc(0.5rem + 12px) ${sidePadding}px` 
              }}
            >
              <div
                aria-live="polite"
                className="flex items-start"
                style={{
                  gap: `${gap}px`,
                  justifyContent: "center",
                  transition: "gap 160ms linear",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {buttonDefs.slice(startIndex, startIndex + visibleCount).map((btn) => (
                  <button
                    key={btn.id}
                    aria-label={btn.label}
                    onClick={btn.onClick}
                    className="group w-[220px] h-[171px] rounded-[25px] bg-white shadow-[6px_6px_6px_rgba(0,0,0,0.25)] relative flex flex-col items-center justify-center gap-4 transition-transform duration-200 hover:-translate-y-2 flex-shrink-0"
                  >
                    <span 
                      aria-hidden="true" 
                      className="absolute -inset-[1px] rounded-[25px] border-[0.7px] border-transparent pointer-events-none group-hover:border-[#FF8F6B]" 
                    />
                    <div className="w-[42px] h-[42px] flex items-center justify-center">
                      {btn.icon}
                    </div>
                    <div 
                      className="text-center font-poppins font-semibold text-[20px]" 
                      style={{ color: "#073C9E" }}
                    >
                      {btn.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Arrow Buttons */}
            <button
              aria-label="Previous button"
              onClick={goLeft}
              disabled={!canGoLeft}
              style={{
                position: "absolute",
                left: `${arrowOffset}px`,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 30,
                display: canGoLeft ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                width: ARROW_SIZE,
                height: ARROW_SIZE,
                borderRadius: 9999,
                background: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                border: "none",
                color: "#0B2595",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              aria-label="Next button"
              onClick={goRight}
              disabled={!canGoRight}
              style={{
                position: "absolute",
                right: `${arrowOffset}px`,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 30,
                display: canGoRight ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                width: ARROW_SIZE,
                height: ARROW_SIZE,
                borderRadius: 9999,
                background: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                border: "none",
                color: "#0B2595",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </div>

      {/* Modals */}
      <AddManagerModal
        open={isAddManagerOpen}
        onClose={() => setIsAddManagerOpen(false)}
        onSubmit={(p) => {
          console.log(p);
          setIsAddManagerOpen(false);
        }}
      />
      <DownloadReportModal
        open={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        onSubmit={(p) => console.log(p)}
      />
      <SendAnnouncementModal
        open={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        onSubmit={(p) => {
          console.log(p);
          setIsSendOpen(false);
          setAnnouncementSuccess(true);
        }}
      />
      <AddNewPGModal
        open={isAddNewPGOpen}
        onClose={() => setIsAddNewPGOpen(false)}
        onSubmit={(p) => {
          console.log(p);
          setIsAddNewPGOpen(false);
        }}
      />
      <AddGuestModal
        open={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        onSubmit={(p) => {
          console.log(p);
          setIsAddGuestOpen(false);
        }}
      />

      {announcementSuccess && (
        <div className="fixed inset-0 z-60 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Announcement Sent</h3>
              <button
                type="button"
                onClick={() => setAnnouncementSuccess(false)}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-gray-100"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700">Your announcement was sent successfully.</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setAnnouncementSuccess(false)}
                className="px-4 py-2 rounded-lg bg-[#605BFF] text-white hover:bg-[#5048e6]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;