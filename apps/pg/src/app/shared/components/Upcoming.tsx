// CheckInOutSection.tsx
import { useMemo, useState } from "react";
import { Calendar, Plus, X, IndianRupee } from "lucide-react";
import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  UserCircleIcon,
  HomeModernIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

/** --- Demo Data --- */
const IN_SEED = [
  ["Rohan Gupta", "101-A", "2 Aug 2025", "Paid", "Prefers AC room"],
  ["Sneha Reddy", "201-A", "23 Aug 2025", "Partial", "Prefers Non-AC room"],
  ["Sree", "106-B", "2 Aug 2025", "Due", "IIT-H Student"],
  ["Ria Shetty", "203-B", "25 Aug 2025", "Partial", "Employee"],
  ["Aman Verma", "305-A", "28 Aug 2025", "Paid", "Night shift"],
  ["Niharika", "402-B", "29 Aug 2025", "Due", "Allergic to dust"],
  ["Vikram", "110-A", "30 Aug 2025", "Partial", "Veg meals"],
  ["Meera", "212-C", "31 Aug 2025", "Paid", "Near lift"],
] as const;

const OUT_SEED = [
  ["Arjun Mehta", "101-A", "4 Aug 2025", "₹2,000", "Good"],
  ["Priya Singh", "201-A", "24 Aug 2025", "₹0", "Warning"],
  ["Sreemayi", "106-B", "3 Aug 2025", "₹1,000", "Bad"],
  ["Keerthi Naidu", "203-B", "27 Aug 2025", "₹1,000", "Good"],
  ["Naveen", "305-B", "28 Aug 2025", "₹0", "Good"],
  ["Rashmi", "402-A", "29 Aug 2025", "₹500", "Warning"],
  ["Harsha", "110-C", "30 Aug 2025", "₹0", "Good"],
  ["Anita", "212-A", "31 Aug 2025", "₹750", "Bad"],
] as const;

/** --- Helpers --- */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthToNum = Object.fromEntries(months.map((m, i) => [m.toLowerCase(), i + 1]));
const pad2 = (n: number | string) => String(n).padStart(2, "0");

function formatDateToDDMMYY(input: string | null | undefined): string {
  if (!input) return "—";
  const trimmed = String(input).trim();
  if (/^\d{2}\/\d{2}\.\d{2}$/.test(trimmed)) return trimmed;

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${pad2(d)}/${pad2(m)}.${String(y).slice(-2)}`;
  }

  const humanMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (humanMatch) {
    const [, dStr, monStr, yStr] = humanMatch;
    const m = monthToNum[monStr.toLowerCase()] || 1;
    return `${pad2(dStr)}/${pad2(m)}.${String(yStr).slice(-2)}`;
  }
  return trimmed;
}

/** --- Reusable Components --- */
const Badge: React.FC<{ tone?: "ok" | "warn" | "bad" | "neutral"; children: React.ReactNode }> = ({
  tone = "neutral",
  children,
}) => {
  const map = {
    ok: "text-emerald-700 ring-emerald-300",
    warn: "text-amber-700 ring-amber-300",
    bad: "text-rose-700 ring-rose-300",
    neutral: "text-gray-700 ring-gray-300",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-transparent ${map[tone]}`}>
      {children}
    </span>
  );
};

const PayBadge: React.FC<{ value?: string }> = ({ value = "" }) => {
  const paid = value.includes("Paid");
  const partial = value.includes("Partial");
  const Icon = paid ? CheckCircleIcon : partial ? ExclamationTriangleIcon : XCircleIcon;
  const pill = paid
    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
    : partial
    ? "bg-amber-50 text-amber-800 ring-amber-200"
    : "bg-rose-50 text-rose-800 ring-rose-200";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${pill}`}>
      <Icon className="h-4 w-4" />
      {value.replace(/[Good|Warning|Bad]/g, "").trim()}
    </span>
  );
};

const FeedbackBadge: React.FC<{ value?: string }> = ({ value = "" }) => {
  const good = value === "Good";
  const warn = value === "Warning";
  const Icon = good ? CheckCircleIcon : warn ? ExclamationTriangleIcon : XCircleIcon;
  const pill = good
    ? "bg-emerald-50 text-emerald-800"
    : warn
    ? "bg-amber-50 text-amber-800"
    : "bg-rose-50 text-rose-800";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${pill}`}>
      <Icon className="h-5 w-5" />
    </span>
  );
};

const HeaderCell: React.FC<{ icon?: React.ElementType; text: string }> = ({ icon: Icon, text }) => (
  <th className="px-4 py-3">
    <div className="flex flex-col items-center justify-center gap-1">
      {Icon ? <Icon className="h-5 w-5 text-[#0041BA]" /> : null}
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0A1E4A]">
        {text}
      </span>
    </div>
  </th>
);

const DateChip: React.FC<{ value: string }> = ({ value }) => (
  <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 ring-1 ring-[#0041BA]/20 bg-[#0041BA]/10">
    <CalendarDaysIcon className="h-4 w-4 text-[#0041BA]" />
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

/** --- Modal --- */
interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit?: (formData: FormData) => void;
  submitText?: string;
}

const Modal: React.FC<ModalProps> = ({ title, open, onClose, children, onSubmit, submitText = "Save" }) => {
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(new FormData(e.currentTarget));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold text-[#0A1E4A]">{title}</h3>
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {children}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#0041BA] text-white hover:opacity-90">
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/** --- Main Component --- */
const CheckInOutSection: React.FC = () => {
  const [showAllIn, setShowAllIn] = useState(false);
  const [showAllOut, setShowAllOut] = useState(false);
  const [inRows, setInRows] = useState(IN_SEED);
  const [outRows, setOutRows] = useState(OUT_SEED);
  const [inOpen, setInOpen] = useState(false);
  const [outOpen, setOutOpen] = useState(false);

  const headerGradient = useMemo(() => "bg-gradient-to-r from-[#0041BA] to-[#00308F]", []);

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* =================== CHECK-IN =================== */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="ml-5 h-6 w-6 text-[#0041BA]" />
              <span>Upcoming Check-Ins</span>
            </h2>
            <button
              onClick={() => setInOpen(true)}
              className="ml-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Check-in
            </button>
          </div>

          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm border-[#0041BA]/25">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#0041BA]/5">
                  <tr className="h-14">
                    <HeaderCell icon={UserCircleIcon} text="Guest" />
                    <HeaderCell icon={HomeModernIcon} text="Room/Bed" />
                    <HeaderCell icon={CalendarDaysIcon} text="Date" />
                    <HeaderCell icon={IndianRupee} text="Payment" />
                    <HeaderCell icon={DocumentTextIcon} text="Notes" />
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(showAllIn ? inRows : inRows.slice(0, 4)).map((row, i) => (
                    <tr
                      key={i}
                      className="h-[56px] border-b last:border-0 odd:bg-white even:bg-[#0041BA]/3 hover:bg-[#0041BA]/8 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{row[0]}</td>
                      <td className="px-4 py-3 text-gray-800">{row[1]}</td>
                      <td className="px-4 py-3">
                        <DateChip value={formatDateToDDMMYY(row[2])} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex mt-0.5">
                          <PayBadge value={row[3]} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                className="text-[#0041BA] font-medium hover:underline flex items-center"
                onClick={() => setShowAllIn((v) => !v)}
              >
                {showAllIn ? (
                  <>
                    View less
                    <ChevronDoubleUpIcon className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                ) : (
                  <>
                    View more ({Math.max(inRows.length - 4, 0)})
                    <ChevronDoubleDownIcon className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =================== CHECK-OUT =================== */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="ml-6 h-6 w-6 text-[#0041BA]" />
              <span>Upcoming Check-Outs</span>
            </h2>
            <button
              onClick={() => setOutOpen(true)}
              className="ml-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Check-Out
            </button>
          </div>

          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm border-[#0041BA]/25">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#0041BA]/5">
                  <tr className="h-14">
                    <HeaderCell icon={UserCircleIcon} text="Guest" />
                    <HeaderCell icon={HomeModernIcon} text="Room/Bed" />
                    <HeaderCell icon={CalendarDaysIcon} text="Date" />
                    <HeaderCell icon={IndianRupee} text="Due" />
                    <HeaderCell icon={ChatBubbleLeftRightIcon} text="Feedback" />
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(showAllOut ? outRows : outRows.slice(0, 4)).map((row, i) => (
                    <tr
                      key={i}
                      className="h-[56px] border-b last:border-0 odd:bg-white even:bg-[#0041BA]/3 hover:bg-[#0041BA]/8 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{row[0]}</td>
                      <td className="px-4 py-3 text-gray-800">{row[1]}</td>
                      <td className="px-4 py-3">
                        <DateChip value={formatDateToDDMMYY(row[2])} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={row[3] === "₹0" ? "ok" : "bad"}>{row[3]}</Badge>
                      </td>
                      <td className="px-4 py-3 flex items-center">
                        <FeedbackBadge value={row[4]} />
                      </td>
                      <td className="px-4 py-3" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                className="text-[#0041BA] font-medium hover:underline flex items-center"
                onClick={() => setShowAllOut((v) => !v)}
              >
                {showAllOut ? (
                  <>
                    View less
                    <ChevronDoubleUpIcon className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                ) : (
                  <>
                    View more ({Math.max(outRows.length - 4, 0)})
                    <ChevronDoubleDownIcon className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Check-In Modal */}
      <Modal
        title="Add Upcoming Check-In"
        open={inOpen}
        onClose={() => setInOpen(false)}
        onSubmit={(fd) => {
          const name = fd.get("name")?.toString()?.trim() || "New Guest";
          const room = fd.get("room")?.toString()?.trim() || "—";
          const dateIso = fd.get("date")?.toString() || "";
          const notes = fd.get("notes")?.toString()?.trim() || "";
          const pay = fd.get("payment")?.toString() || "Partial";
          const formatted = formatDateToDDMMYY(dateIso);
          setInRows((prev) => [[name, room, formatted, pay, notes], ...prev]);
          setInOpen(false);
        }}
        submitText="Add Check-In"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Guest</label>
            <input name="name" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
          <div>
            <label className="block text-sm mb-1">Room/Bed</label>
            <input name="room" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="date" name="date" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
          <div>
            <label className="block text-sm mb-1">Payment</label>
            <select name="payment" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]">
              <option>Paid</option>
              <option>Partial</option>
              <option>Due</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Notes</label>
            <input name="notes" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
        </div>
      </Modal>

      {/* Add Check-Out Modal */}
      <Modal
        title="Add Upcoming Check-Out"
        open={outOpen}
        onClose={() => setOutOpen(false)}
        onSubmit={(fd) => {
          const name = fd.get("name")?.toString()?.trim() || "New Guest";
          const room = fd.get("room")?.toString()?.trim() || "—";
          const dateIso = fd.get("date")?.toString() || "";
          const due = fd.get("due")?.toString() || "₹0";
          const feedback = fd.get("feedback")?.toString() || "Good";
          const formatted = formatDateToDDMMYY(dateIso);
          setOutRows((prev) => [[name, room, formatted, due, feedback], ...prev]);
          setOutOpen(false);
        }}
        submitText="Add Check-Out"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Guest</label>
            <input name="name" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
          <div>
            <label className="block text-sm mb-1">Room/Bed</label>
            <input name="room" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="date" name="date" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
          <div>
            <label className="block text-sm mb-1">Payment Due</label>
            <input name="due" placeholder="₹0" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Feedback</label>
            <select name="feedback" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0041BA]">
              <option>Good</option>
              <option>Warning</option>
              <option>Bad</option>
            </select>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default CheckInOutSection;