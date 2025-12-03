import { FC } from 'react';

// --- Interface for Props ---
interface FirstGuestProps {
  /** The name of the guest, used for the dashboard greeting. */
  name?: string; 
}

// (Card components below are unchanged, but we define them as FC for completeness)
// To keep the file clean, we'll define the Card FCs locally but omit the internal code.

const RoomDetailsCard: FC = () => { 
  // ... Card 1 JSX implementation (omitted for brevity)
  return (
    <div
      aria-label="Room Details"
      className="box-border h-[420px] w-[261px] overflow-hidden rounded-[20px] bg-white p-6 shadow-[4px_4px_4px_rgba(0,0,0,0.10)] flex flex-col justify-between transition-all duration-200 ease-in-out border-2 border-transparent hover:border-[#4F6BE3] hover:scale-[1.03]"
    >
      <header className="flex flex-col items-center gap-3 min-h-[96px]">
        <div className="flex h-12 w-12 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 41" preserveAspectRatio="xMidYMid meet" className="block h-12 w-12">
            <path d="M8.125 24.6H62.9688C63.5189 24.6 63.995 24.8029 64.397 25.2086C64.799 25.6143 65 26.0948 65 26.65V41H56.875V32.8H8.125V41H0V2.05C0 1.49479 0.201009 1.01432 0.603027 0.608594C1.00505 0.202865 1.48112 0 2.03125 0H6.09375C6.64388 0 7.11995 0.202865 7.52197 0.608594C7.92399 1.01432 8.125 1.49479 8.125 2.05V24.6ZM26.4062 14.35C26.4062 12.0865 25.6128 10.1539 24.0259 8.55234C22.439 6.95078 20.5241 6.15 18.2812 6.15C16.0384 6.15 14.1235 6.95078 12.5366 8.55234C10.9497 10.1539 10.1562 12.0865 10.1562 14.35C10.1562 16.6135 10.9497 18.5461 12.5366 20.1477C14.1235 21.7492 16.0384 22.55 18.2812 22.55C20.5241 22.55 22.439 21.7492 24.0259 20.1477C25.6128 18.5461 26.4062 16.6135 26.4062 14.35ZM65 22.55V20.5C65 17.1047 63.8098 14.2059 61.4294 11.8035C59.0491 9.40117 56.1768 8.2 52.8125 8.2H30.4688C29.9186 8.2 29.4425 8.40286 29.0405 8.80859C28.6385 9.21432 28.4375 9.69479 28.4375 10.25V22.55H65Z" fill="#6CB267"/>
          </svg>
        </div>
        <h3 className="m-0 font-poppins text-[23px] font-semibold text-[#001433] tracking-[-0.154px] truncate">Room Details</h3>
      </header>
      
      <div className="flex flex-col justify-center items-center text-center px-[6px]">
        <div className="font-poppins text-[17px] font-semibold text-black">Room (AC): 204</div>
        <div className="mt-2 font-poppins text-[15px] font-medium text-black">[2 Sharing]</div>
        <div className="mt-5 text-[15px] text-black">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">Partner:</span>
            <span className="font-normal">Ria Sharma</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-semibold">Contact:</span>
            <span className="font-normal">9876543210</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        {/* Intentionally left empty */}
      </div>
    </div>
  );
};
const LeaseDurationCard: FC = () => { 
  // ... Card 2 JSX implementation (omitted for brevity)
  return (
    <div
      aria-label="Lease Duration"
      className="box-border h-[420px] w-[261px] overflow-hidden rounded-[20px] bg-white p-6 shadow-[4px_4px_4px_rgba(0,0,0,0.10)] flex flex-col justify-between transition-all duration-200 ease-in-out border-2 border-transparent hover:border-[#4F6BE3] hover:scale-[1.03]"
    >
      <header className="flex flex-col items-center gap-3 min-h-[96px]">
        <div className="flex h-12 w-12 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 71 58" className="h-full w-full" fill="none">
            <path d="M47.9764 7.16357H38.4958C37.6129 7.16357 36.763 7.49937 36.1119 8.10379L25.2627 18.1775C25.2517 18.1887 25.2406 18.2111 25.2296 18.2223C23.3975 19.9684 23.4306 22.7555 24.9978 24.4904C26.3995 26.0462 29.3463 26.4603 31.1895 24.7926C31.2005 24.7814 31.2226 24.7814 31.2336 24.7702L40.052 16.5769C40.7694 15.9165 41.8951 15.9613 42.5463 16.6888C43.2085 17.4164 43.1533 18.5469 42.4359 19.2185L39.5553 21.8936L55.6249 35.1237C55.945 35.3924 56.2319 35.6834 56.4968 35.9856V14.3271L50.4707 8.21572C49.8195 7.54414 48.9145 7.16357 47.9764 7.16357ZM60.0396 14.3495V39.4107C60.0396 41.3918 61.6179 42.9924 63.5714 42.9924H70.6349V14.3495H60.0396ZM65.3373 39.4107C64.366 39.4107 63.5714 38.6048 63.5714 37.6198C63.5714 36.6348 64.366 35.8289 65.3373 35.8289C66.3085 35.8289 67.1032 36.6348 67.1032 37.6198C67.1032 38.6048 66.3085 39.4107 65.3373 39.4107ZM-0.000488281 42.9813H7.06305C9.01656 42.9813 10.5948 41.3806 10.5948 39.3995V14.3495H-0.000488281V42.9813ZM5.29717 35.8289C6.2684 35.8289 7.06305 36.6348 7.06305 37.6198C7.06305 38.6048 6.2684 39.4107 5.29717 39.4107C4.32593 39.4107 3.53128 38.6048 3.53128 37.6198C3.53128 36.6236 4.32593 35.8289 5.29717 35.8289ZM53.4065 37.9108L36.9286 24.3449L33.6176 27.4229C30.3396 30.4563 25.3179 30.1652 22.3931 26.9305C19.4242 23.6397 19.656 18.5469 22.8788 15.5471L31.9069 7.16357H22.658C21.7199 7.16357 20.8259 7.54414 20.1637 8.21572L14.1266 14.3271V39.3883H16.1463L26.1346 48.5554C29.1587 51.0514 33.6065 50.5813 36.0677 47.5144L36.0898 47.492L38.0654 49.227C39.8202 50.6821 42.4139 50.4022 43.8376 48.6225L47.3032 44.302L47.8992 44.7945C49.4112 46.0369 51.6406 45.8131 52.8657 44.2685L53.9142 42.9589C55.1503 41.4142 54.9185 39.1644 53.4065 37.9108Z" fill="#FF8F6B"/>
          </svg>
        </div>
        <h3 className="m-0 font-poppins text-[23px] font-semibold text-[#001433] tracking-[-0.154px] truncate">Lease Duration</h3>
      </header>

      <div className="flex flex-col justify-center items-start text-left px-[6px]">
        <div className="text-[15px] font-normal text-black"><strong>Start Date:</strong> <span>27 May 2025</span></div>
        <div className="mt-2 text-[15px] font-normal text-black"><strong>End Date:</strong> <span>28 Nov 2025</span></div>
        <div className="mt-6 text-[15px] font-bold">[Lease ends in 56 days]</div>
      </div>
      
      <div className="flex justify-end">
        {/* Intentionally left empty */}
      </div>
    </div>
  );
};
const PaymentStatusCard: FC = () => { 
  // ... Card 3 JSX implementation (omitted for brevity)
  return (
    <div
      aria-label="Payment Status"
      className="box-border h-[420px] w-[261px] overflow-hidden rounded-[20px] bg-white p-6 shadow-[4px_4px_4px_rgba(0,0,0,0.10)] flex flex-col justify-between transition-all duration-200 ease-in-out border-2 border-transparent hover:border-[#4F6BE3] hover:scale-[1.03]"
    >
      <header className="flex flex-col items-center gap-3 min-h-[96px]">
        <div className="flex h-12 w-12 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 56 56" className="h-full w-full" fill="none">
            <path d="M26.25 18.3096C24.066 18.9069 22.75 20.5846 22.75 22.1666C22.75 23.7486 24.066 25.4262 26.25 26.0212V18.3096ZM29.75 29.9786V37.6879C31.934 37.0929 33.25 35.4152 33.25 33.8332C33.25 32.2512 31.934 30.5736 29.75 29.9786Z" fill="#271BAF"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M51.3332 27.9998C51.3332 40.8868 40.8868 51.3332 27.9998 51.3332C15.1128 51.3332 4.6665 40.8868 4.6665 27.9998C4.6665 15.1128 15.1128 4.6665 27.9998 4.6665C40.8868 4.6665 51.3332 15.1128 51.3332 27.9998ZM27.9998 12.2498C28.464 12.2498 28.9091 12.4342 29.2373 12.7624C29.5655 13.0906 29.7498 13.5357 29.7498 13.9998V14.7395C33.5532 15.4208 36.7498 18.2792 36.7498 22.1665C36.7498 22.6306 36.5655 23.0758 36.2373 23.4039C35.9091 23.7321 35.464 23.9165 34.9998 23.9165C34.5357 23.9165 34.0906 23.7321 33.7624 23.4039C33.4342 23.0758 33.2498 22.6306 33.2498 22.1665C33.2498 20.5845 31.9338 18.9068 29.7498 18.3095V26.4062C33.5532 27.0875 36.7498 29.9458 36.7498 33.8332C36.7498 37.7205 33.5532 40.5788 29.7498 41.2602V41.9998C29.7498 42.464 29.5655 42.9091 29.2373 43.2373C28.9091 43.5655 28.464 43.7498 27.9998 43.7498C27.5357 43.7498 27.0906 43.5655 26.7624 43.2373C26.4342 42.9091 26.2498 42.464 26.2498 41.9998V41.2602C22.4465 40.5788 19.2498 37.7205 19.2498 33.8332C19.2498 33.369 19.4342 32.9239 19.7624 32.5957C20.0906 32.2676 20.5357 32.0832 20.9998 32.0832C21.464 32.0832 21.9091 32.2676 22.2373 32.5957C22.5655 32.9239 22.7498 33.369 22.7498 33.8332C22.7498 35.4152 24.0658 37.0928 26.2498 37.6878V29.5935C22.4465 28.9122 19.2498 26.0538 19.2498 22.1665C19.2498 18.2792 22.4465 15.4208 26.2498 14.7395V13.9998C26.2498 13.5357 26.4342 13.0906 26.7624 12.7624C27.0906 12.4342 27.5357 12.2498 27.9998 12.2498Z" fill="#271BAF"/>
          </svg>
        </div>
        <h3 className="m-0 font-poppins text-[23px] font-semibold text-[#001433] tracking-[-0.154px] truncate">Payment Status</h3>
      </header>
      
      <div className="flex flex-col justify-center items-center text-center px-[6px]">
        <div className="font-poppins text-[17px] font-semibold text-black">₹12,000 Paid</div>
        <div className="mt-2 font-poppins text-[15px] font-medium text-black">[Due: 5th October]</div>
      </div>

      <div className="flex justify-end">
        {/* Intentionally left empty */}
      </div>
    </div>
  );
};
const UpcomingEventsCard: FC = () => { 
  // ... Card 4 JSX implementation (omitted for brevity)
  return (
    <div
      aria-label="Upcoming Events"
      className="box-border h-[420px] w-[261px] overflow-hidden rounded-[20px] bg-white p-6 shadow-[4px_4px_4px_rgba(0,0,0,0.10)] flex flex-col justify-between transition-all duration-200 ease-in-out border-2 border-transparent hover:border-[#4F6BE3] hover:scale-[1.03]"
    >
      <header className="flex flex-col items-center gap-3 min-h-[96px]">
        <div className="flex h-12 w-12 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 62 49" className="h-full w-full" fill="none">
            <path d="M58.125 4.58406L42.6114 4.58411V1.53161C42.6114 0.685395 41.7444 0 40.6739 0C39.6035 0 38.7364 0.685395 38.7364 1.53161V4.58334H23.2364V1.53161C23.2364 0.685395 22.3694 0 21.2989 0C20.2285 0 19.3614 0.685395 19.3614 1.53161V4.58334H3.875C1.73503 4.58334 0 5.9549 0 7.64656V45.9368C0 47.6284 1.73503 49 3.875 49H58.125C60.265 49 62 47.6284 62 45.9368V7.64656C62 5.95561 60.265 4.58406 58.125 4.58406ZM58.125 45.9368H3.875V7.64656H19.3614V9.18965C19.3614 10.0358 20.2285 10.7213 21.2989 10.7213C22.3694 10.7213 23.2364 10.0358 23.2364 9.18965V7.64732H38.7364V9.19042C38.7364 10.0366 39.6035 10.722 40.6739 10.722C41.7444 10.722 42.6114 10.0366 42.6114 9.19042V7.64732H58.125V45.9368ZM44.5625 24.495H48.4375C49.507 24.495 50.375 23.8088 50.375 22.9634V19.9001C50.375 19.0547 49.507 18.3685 48.4375 18.3685H44.5625C43.493 18.3685 42.625 19.0547 42.625 19.9001V22.9634C42.625 23.8088 43.493 24.495 44.5625 24.495ZM44.5625 36.7471H48.4375C49.507 36.7471 50.375 36.0617 50.375 35.2155V32.1523C50.375 31.3068 49.507 30.6206 48.4375 30.6206H44.5625C43.493 30.6206 42.625 31.3068 42.625 32.1523V35.2155C42.625 36.0625 43.493 36.7471 44.5625 36.7471ZM32.9375 30.6206H29.0625C27.993 30.6206 27.125 31.3068 27.125 32.1523V35.2155C27.125 36.0617 27.993 36.7471 29.0625 36.7471H32.9375C34.007 36.7471 34.875 36.0617 34.875 35.2155V32.1523C34.875 31.3076 34.007 30.6206 32.9375 30.6206ZM32.9375 18.3685H29.0625C27.993 18.3685 27.125 19.0547 27.125 19.9001V22.9634C27.125 23.8088 27.993 24.495 29.0625 24.495H32.9375C34.007 24.495 34.875 23.8088 34.875 22.9634V19.9001C34.875 19.0539 34.007 18.3685 32.9375 18.3685ZM17.4375 18.3685H13.5625C12.493 18.3685 11.625 19.0547 11.625 19.9001V22.9634C11.625 23.8088 12.493 24.495 13.5625 24.495H17.4375C18.507 24.495 19.375 23.8088 19.375 22.9634V19.9001C19.375 19.0539 18.507 18.3685 17.4375 18.3685ZM17.4375 30.6206H13.5625C12.493 30.6206 11.625 31.3068 11.625 32.1523V35.2155C11.625 36.0617 12.493 36.7471 13.5625 36.7471H17.4375C18.507 36.7471 19.375 36.0617 19.375 35.2155V32.1523C19.375 31.3076 18.507 30.6206 17.4375 30.6206Z" fill="#9E1212"/>
          </svg>
        </div>
        <h3 className="m-0 font-poppins text-[23px] font-semibold text-[#001433] tracking-[-0.154px] truncate">Upcoming Events</h3>
      </header>

      <div className="flex flex-col justify-center items-center text-center px-[6px]">
        <div className="text-center text-[19px] font-semibold text-black">House Keeping Scheduled<br/>tomorrow at 10 AM</div>
        <div className="mt-2 text-sm text-black">(Only for Next day)</div>
      </div>

      <div className="flex justify-end">
        {/* Intentionally left empty */}
      </div>
    </div>
  );
};

// --- Main Component ---

const FirstGuest: FC<FirstGuestProps> = ({ name }) => {
  // This is the full address used for the Google Maps query.
  const pgAddress: string = "Hamsa PG, TNGO Colony, Gachibowli, Hyderabad";
  
  // This creates the URL-safe query string
  // Note: The original mapLink construction was slightly incorrect for template literals: `0{mapQuery}`
  // Assuming the intention was to use the query parameter. I've corrected the base URL too.
  const mapQuery: string = encodeURIComponent(pgAddress);
  const mapLink: string = `https://maps.google.com/?q=${mapQuery}`;

  // Use the name, with a fallback
  const displayName: string = name || "Guest";

  return (
    <section className="p-4 w-full">
      <header className="mb-6">
        {/* Use the displayName variable here */}
        <h1
          className="font-extrabold text-black"
          style={{
            fontSize: "clamp(1rem, 2.6vw, 1.6rem)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {`${displayName}'s Dashboard`}
        </h1>
        {/* Added role subtitle */}
        <span className="text-lg text-gray-600 font-medium">(Guest)</span>

        <div
          className="mt-2 text-[#615F5F] font-extrabold max-w-full flex items-baseline gap-3 flex-wrap"
          style={{
            fontSize: "clamp(0.78rem, 1.6vw, 1rem)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <a
            href={mapLink}
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // Security measure for new tabs
            className="hover:underline" // Adds underline on hover
          >
            Hamsa PG,
          </a>
          <span>
            Timings: 7:00am to 11:00pm
          </span>
        </div>
      </header>

      {/* Cards Grid */}
      <section className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
            <RoomDetailsCard />
            <LeaseDurationCard />
            <PaymentStatusCard />
            <UpcomingEventsCard />
        </div>
      </section>
    </section>
  );
}

export default FirstGuest;

// --- Card Components (Moved below the main component for TSX structure) ---
// (The full original JSX for the cards is kept for reference, but their function definitions are simplified above)