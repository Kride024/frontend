// MaintenanceAlertsDashboard.tsx
import {
  BarChart3,
  BellRing,
  ClipboardList,
  Droplets,
  Plus,
  Star,
  UserRoundCheck,
  Wifi,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ---------- Types ---------- */
interface Alert {
  id: number;
  message: string;
  date: string;
  severity: "high" | "medium" | "low";
  priority: string;
}

interface Request {
  id: number;
  date: string;
  category: string;
  status: string;
  assigned: string;
  sla: string;
  rating: number;
  raisedBy: string;
  room: string;
  bed: string;
  title?: string;
  notes?: string;
}

/* ---------- Constants ---------- */
const STATUS = ["All", "Open", "In Progress", "Resolved", "Overdue"] as const;
const CATEGORY = ["All", "Electricity", "Plumbing", "WiFi/Internet", "Housekeeping"] as const;

const badgeClasses = (status: string): string => {
  switch (status) {
    case "Open":
      return "bg-rose-100 text-rose-600";
    case "Resolved":
      return "bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "bg-amber-100 text-amber-700";
    case "Overdue":
      return "bg-rose-100 text-rose-700 border border-rose-300";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const statusDotClass: Record<string, string> = {
  Open: "bg-rose-600",
  "In Progress": "bg-amber-500",
  Resolved: "bg-emerald-600",
  Overdue: "bg-rose-700",
};

const categoryIcon = (cat: string): React.ReactNode => {
  const base = "h-4 w-4 mr-2";
  switch (cat) {
    case "Electricity":
      return <Zap className={`${base} text-yellow-500`} aria-hidden="true" />;
    case "Plumbing":
      return <Droplets className={`${base} text-sky-500`} aria-hidden="true" />;
    case "WiFi/Internet":
      return <Wifi className={`${base} text-indigo-500`} aria-hidden="true" />;
    case "Housekeeping":
      return (
        <span className={`${base} inline-flex items-center justify-center text-emerald-500`}>
          Broom
        </span>
      );
    default:
      return <span className={`${base} inline-block rounded-full bg-gray-400`} />;
  }
};

const severityOrder = { high: 0, medium: 1, low: 2 };

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

const DueBadge: React.FC<{ date: string }> = ({ date }) => {
  const diff = daysUntil(date);
  if (diff === null) return null;
  if (diff < 0)
    return (
      <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-rose-100 text-rose-700">
        Overdue {Math.abs(diff)}d
      </span>
    );
  if (diff === 0)
    return (
      <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-indigo-100 text-indigo-700">
        Due today
      </span>
    );
  if (diff <= 7)
    return (
      <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-amber-100 text-amber-700">
        Due in {diff}d
      </span>
    );
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-gray-100 text-gray-700">
      In {diff}d
    </span>
  );
};

/* ---------- Mock Data ---------- */
const initialAlerts: Alert[] = [
  {
    id: 1,
    message: "PG lease agreement is expiring on 15th September 2025",
    date: "2025-09-15",
    severity: "medium",
    priority: "P2 - Medium",
  },
  {
    id: 2,
    message: "Power backup battery maintenance due",
    date: "2025-09-05",
    severity: "high",
    priority: "P1 - High",
  },
  {
    id: 3,
    message: "Electricity bill payment",
    date: "2025-09-05",
    severity: "medium",
    priority: "P2 - Medium",
  },
  {
    id: 4,
    message: "Property tax payment reminder",
    date: "2025-12-10",
    severity: "low",
    priority: "P3 - Low",
  },
];

const initialRequests: Request[] = [
  {
    id: 101,
    date: "2025-07-12",
    category: "Electricity",
    status: "Open",
    assigned: "Unassigned",
    sla: "within 24hrs",
    rating: 0,
    raisedBy: "Rohan Gupta",
    room: "101",
    bed: "A",
  },
  {
    id: 102,
    date: "2025-07-12",
    category: "WiFi/Internet",
    status: "Resolved",
    assigned: "Suresh (IT)",
    sla: "within 48hrs",
    rating: 0,
    raisedBy: "Sneha Reddy",
    room: "201",
    bed: "B",
  },
  {
    id: 103,
    date: "2025-07-12",
    category: "Electricity",
    status: "In Progress",
    assigned: "Arya (Vendor)",
    sla: "Overdue",
    rating: 3,
    raisedBy: "Aman Verma",
    room: "305",
    bed: "A",
  },
  {
    id: 104,
    date: "2025-07-12",
    category: "Plumbing",
    status: "Open",
    assigned: "Unassigned",
    sla: "Overdue",
    rating: 0,
    raisedBy: "Ria Shetty",
    room: "203",
    bed: "B",
  },
];

/* ---------- Main Component ---------- */
const MaintenanceAlertsDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  // Pretend-auth: who is using the app (use your auth user here)
  const currentUser = "Sneha Reddy"; // TODO: replace with signed-in user name

  // Filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Modals & fields
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [newAlertMsg, setNewAlertMsg] = useState("");
  const [newAlertDate, setNewAlertDate] = useState("");
  const [newAlertPriority, setNewAlertPriority] = useState("P2 - Medium");

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [nrTitle, setNrTitle] = useState("");
  const [nrCategory, setNrCategory] = useState("Electricity");
  const [nrStatus, setNrStatus] = useState("Open");
  const [nrDate, setNrDate] = useState("");
  const [nrAssignee, setNrAssignee] = useState("");
  const [nrNotes, setNrNotes] = useState("");
  const [nrRaisedBy, setNrRaisedBy] = useState("");
  const [nrRoom, setNrRoom] = useState("");
  const [nrBed, setNrBed] = useState("");

  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [assignName, setAssignName] = useState("");

  const [alertFilter, setAlertFilter] = useState<"all" | "critical" | "week">("all");
  const [expandedAlertId, setExpandedAlertId] = useState<number | null>(null);

  /* --- Helpers --- */
  const priorityToSeverity = (p: string): "high" | "medium" | "low" => {
    if (p.startsWith("P1")) return "high";
    if (p.startsWith("P2")) return "medium";
    return "low";
  };

  const toggleAlertExpansion = (id: number) => {
    setExpandedAlertId((prevId) => (prevId === id ? null : id));
  };

  /* --- Actions --- */
  const resolveAlert = (id: number) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  const alertCounts = useMemo(
    () => ({
      high: alerts.filter((a) => a.severity === "high").length,
      medium: alerts.filter((a) => a.severity === "medium").length,
      low: alerts.filter((a) => a.severity === "low").length,
    }),
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    const within7 = (a: Alert) => {
      const d = daysUntil(a.date);
      return d !== null && d <= 7;
    };

    let list = alerts.slice();
    list.sort((a, b) => {
      const s = severityOrder[a.severity] - severityOrder[b.severity];
      if (s !== 0) return s;
      return (daysUntil(a.date) ?? 9999) - (daysUntil(b.date) ?? 9999);
    });

    if (alertFilter === "critical") list = list.filter((a) => a.severity === "high");
    if (alertFilter === "week") list = list.filter(within7);
    return list;
  }, [alerts, alertFilter]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const textOk = `${r.id} ${r.category} ${r.status} ${r.assigned}`
        .toLowerCase()
        .includes(q.toLowerCase());
      const statusOk = status ? (status === "All" ? true : r.status === status) : true;
      const catOk = category ? (category === "All" ? true : r.category === category) : true;
      const t = new Date(r.date).getTime();
      const fOk = from ? t >= new Date(from).getTime() : true;
      const tOk = to ? t <= new Date(to).getTime() : true;
      return textOk && statusOk && catOk && fOk && tOk;
    });
  }, [requests, q, status, category, from, to]);

  const addAlert = () => {
    if (!newAlertMsg.trim() || !newAlertDate) return;
    const item: Alert = {
      id: Math.max(0, ...alerts.map((a) => a.id)) + 1,
      message: newAlertMsg.trim(),
      date: newAlertDate,
      priority: newAlertPriority,
      severity: priorityToSeverity(newAlertPriority),
    };
    setAlerts((cur) => [item, ...cur]);
    setNewAlertMsg("");
    setNewAlertDate("");
    setNewAlertPriority("P2 - Medium");
    setShowAlertModal(false);
  };

  const addNewRequest = () => {
    if (!nrTitle.trim() || !nrDate) return;
    const item: Request = {
      id: Math.max(0, ...requests.map((r) => r.id)) + 1,
      date: nrDate,
      category: nrCategory,
      status: nrStatus,
      assigned: nrAssignee || "Unassigned",
      sla: "within 24hrs",
      rating: 0,
      raisedBy: nrRaisedBy || currentUser || "Guest",
      room: nrRoom || "-",
      bed: nrBed || "-",
      title: nrTitle,
      notes: nrNotes,
    };
    setRequests((cur) => [item, ...cur]);
    setShowNewReqModal(false);
    setNrTitle("");
    setNrCategory("Electricity");
    setNrStatus("Open");
    setNrDate("");
    setNrAssignee("");
    setNrNotes("");
    setNrRaisedBy("");
    setNrRoom("");
    setNrBed("");
  };

  const setRequestRating = (id: number, value: number) =>
    setRequests((cur) =>
      cur.map((r) => (r.id === id ? { ...r, rating: value } : r))
    );

  const openAssign = (id: number) => {
    setAssigningId(id);
    setAssignName("");
  };

  const confirmAssign = () => {
    if (!assigningId) return;
    setRequests((cur) =>
      cur.map((r) =>
        r.id === assigningId
          ? { ...r, assigned: assignName || "Unassigned", status: "In Progress" }
          : r
      )
    );
    setAssigningId(null);
    setAssignName("");
  };

  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-10">
      <div className="w-full space-y-10 px-3 sm:px-6">
    

        {/* Maintenance Requests Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              Maintenance &amp; Service Requests
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAnalytics(true)}
              className="px-4 py-2 rounded-lg bg-gray-50 text-gray-900 hover:bg-gray-200 inline-flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics &amp; Reporting
            </button>
            <button
              onClick={() => setShowNewReqModal(true)}
              className="px-4 py-2 rounded-lg bg-[#073C9E] text-white hover:bg-indigo-700 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[minmax(220px,1fr)_200px_200px_repeat(2,180px)]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full min-w-[160px] bg-white rounded-lg shadow px-3 py-2 text-sm text-gray-700 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="" disabled hidden>Status</option>
            <option value="All">All</option>
            {STATUS.filter((s) => s !== "All").map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full min-w-[160px] bg-white rounded-lg shadow px-3 py-2 text-sm text-gray-700 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="" disabled hidden>Category</option>
            <option value="All">All</option>
            {CATEGORY.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full min-w-[160px] bg-white rounded-lg shadow px-3 py-2 text-sm text-gray-700 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full min-w-[160px] bg-white rounded-lg shadow px-3 py-2 text-sm text-gray-700 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Requests Table */}
        <section className="bg-white rounded-[20px] shadow-[8px_8px_8px_0px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-[#073C9E] text-white">
                <tr className="text-white">
                  <th className="text-left font-semibold px-6 py-3">ID</th>
                  <th className="text-left font-semibold px-6 py-3">Date</th>
                  <th className="text-left font-semibold px-6 py-3">Category</th>
                  <th className="text-left font-semibold px-6 py-3">Status</th>
                  <th className="text-left font-semibold px-6 py-3">Assigned</th>
                  <th className="text-left font-semibold px-13 py-3">SLA</th>
                  <th className="text-left font-semibold px-6 py-3">Rating</th>
                  <th className="text-left font-semibold px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const canRate = r.status === "Resolved" && r.rating === 0 && r.raisedBy === currentUser;
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-6 py-4 text-gray-900">
                        <div className="relative group inline-block">
                          <span className="underline decoration-dotted cursor-default">
                            {r.id}
                          </span>
                          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute left-0 top-6 z-10 w-56 rounded-lg border bg-white p-3 text-xs text-gray-700 shadow-lg">
                            <div><strong>Raised By:</strong> {r.raisedBy}</div>
                            <div><strong>Room/Bed:</strong> {r.room}/{r.bed}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(r.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="inline-flex items-center">
                          {categoryIcon(r.category)} {r.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${badgeClasses(r.status)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass[r.status] || "bg-gray-400"}`} />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{r.assigned}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs px-4 py-1 rounded-full ${
                          r.sla === "Overdue"
                            ? "bg-red-100 text-red-700"
                            : r.sla === "On Track"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {r.sla}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {canRate ? (
                          <StarsEditable onRate={(v) => setRequestRating(r.id, v)} />
                        ) : (
                          <Stars value={r.rating} />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {(r.status === "Open" || r.status === "In Progress") && (
                            <button
                              onClick={() => openAssign(r.id)}
                              className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs inline-flex items-center gap-1"
                              title="Assign to staff/vendor"
                            >
                              <UserRoundCheck className="h-3.5 w-3.5" />
                              Assign
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      No requests found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modals */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAlertModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BellRing className="h-5 w-5 text-rose-500" />
              Add Alert
            </h3>
            <label className="block mb-3">
              <span className="text-sm text-gray-700">Alert Message</span>
              <input
                value={newAlertMsg}
                onChange={(e) => setNewAlertMsg(e.target.value)}
                placeholder="Describe the alert"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-gray-700">Date</span>
                <input
                  type="date"
                  value={newAlertDate}
                  onChange={(e) => setNewAlertDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block col-span-2">
                <span className="text-sm text-gray-700">Priority</span>
                <select
                  value={newAlertPriority}
                  onChange={(e) => setNewAlertPriority(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option>P1 - High</option>
                  <option>P2 - Medium</option>
                  <option>P3 - Low</option>
                </select>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAlertModal(false)}
                className="px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addAlert}
                className="px-3 py-2 rounded-lg text-sm bg-[#073C9E] text-white hover:bg-indigo-700"
              >
                Add Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNewReqModal(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Request
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">Title</span>
                <input
                  value={nrTitle}
                  onChange={(e) => setNrTitle(e.target.value)}
                  placeholder="Eg: Fan not working in 101"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Category</span>
                <select
                  value={nrCategory}
                  onChange={(e) => setNrCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {CATEGORY.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Status</span>
                <select
                  value={nrStatus}
                  onChange={(e) => setNrStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {STATUS.filter((s) => s !== "All").map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Date</span>
                <input
                  type="date"
                  value={nrDate}
                  onChange={(e) => setNrDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Assign To</span>
                <input
                  value={nrAssignee}
                  onChange={(e) => setNrAssignee(e.target.value)}
                  placeholder="Person or vendor"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Raised By</span>
                <input
                  value={nrRaisedBy}
                  onChange={(e) => setNrRaisedBy(e.target.value)}
                  placeholder="Guest name"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Room</span>
                <input
                  value={nrRoom}
                  onChange={(e) => setNrRoom(e.target.value)}
                  placeholder="e.g., 101"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Bed</span>
                <input
                  value={nrBed}
                  onChange={(e) => setNrBed(e.target.value)}
                  placeholder="e.g., A"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm text-gray-700">Notes</span>
                <textarea
                  value={nrNotes}
                  onChange={(e) => setNrNotes(e.target.value)}
                  rows={3}
                  placeholder="Additional details"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowNewReqModal(false)}
                className="px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addNewRequest}
                className="px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalytics && <AnalyticsModal onClose={() => setShowAnalytics(false)} />}

      {assigningId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAssigningId(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              Assign Request #{assigningId}
            </h3>
            <input
              value={assignName}
              onChange={(e) => setAssignName(e.target.value)}
              placeholder="Assign to (person/vendor)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
                onClick={() => setAssigningId(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={confirmAssign}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Stars Components ---------- */
const Stars: React.FC<{ value?: number }> = ({ value = 0 }) => {
  const v = Math.max(0, Math.min(5, Math.floor(value)));
  const empty = 5 - v;
  let fill = "#ef4444";
  if (v >= 4) fill = "#22c55e";
  else if (v === 3) fill = "#3b82f6";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: v }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4" fill={fill} stroke="none" />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
};

const StarsEditable: React.FC<{ onRate: (value: number) => void }> = ({ onRate }) => {
  const [hover, setHover] = useState(0);
  const [temp, setTemp] = useState(0);
  const current = hover || temp;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const active = n <= current;
        return (
          <Star
            key={n}
            className={`h-4 w-4 cursor-pointer ${active ? "text-amber-500" : "text-gray-300"}`}
            fill={active ? "#f59e0b" : "none"}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => {
              setTemp(n);
              onRate(n);
            }}
          />
        );
      })}
    </div>
  );
};

/* ---------- Analytics & KPI ---------- */
const Modal: React.FC<{ onClose: () => void; title?: string; children: React.ReactNode }> = ({
  onClose,
  title,
  children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  </div>
);

const AnalyticsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [range, setRange] = useState<"weekly" | "monthly" | "yearly">("weekly");

  const data = {
    weekly: [
      { label: "Mon", open: 23, resolved: 12 },
      { label: "Tue", open: 15, resolved: 30 },
      { label: "Wed", open: 10, resolved: 21 },
      { label: "Thu", open: 7, resolved: 18 },
      { label: "Fri", open: 12, resolved: 23 },
      { label: "Sat", open: 5, resolved: 8 },
      { label: "Sun", open: 3, resolved: 5 },
    ],
    monthly: Array.from({ length: 12 }).map((_, i) => ({
      label: `M${i + 1}`,
      open: 10 + (i % 5) * 4,
      resolved: 12 + ((i + 2) % 6) * 3,
    })),
    yearly: Array.from({ length: 5 }).map((_, i) => ({
      label: `${2021 + i}`,
      open: 100 + i * 20,
      resolved: 120 + i * 18,
    })),
  };

  const rows = data[range];
  const max = Math.max(...rows.flatMap((r) => [r.open, r.resolved])) || 1;

  return (
    <Modal onClose={onClose} title="Analytics & Reporting">
      <div className="flex items-center gap-2 mb-4">
        {(["weekly", "monthly", "yearly"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              range === r
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            {r[0].toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <KPI title="Open requests" value={rows.reduce((a, b) => a + b.open, 0)} hint="Needs attention" tone="rose" />
        <KPI title="In Progress" value={rows.reduce((a, b) => a + Math.round(b.open * 0.4), 0)} hint="Being worked on" tone="amber" />
        <KPI title="Resolved this period" value={rows.reduce((a, b) => a + b.resolved, 0)} hint="Great job team" tone="emerald" />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-800">Avg Resolution Time</div>
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <div className="w-10 shrink-0 text-xs text-gray-600">{r.label}</div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-gray-100 mb-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${(r.open / max) * 100}%`, background: "#fb923c" }}
                />
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${(r.resolved / max) * 100}%`, background: "#60a5fa" }}
                />
              </div>
            </div>
            <div className="w-12 text-right text-xs text-gray-600">{r.resolved}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200">
          Close
        </button>
      </div>
    </Modal>
  );
};

const KPI: React.FC<{ title: string; value: number; hint: string; tone?: "rose" | "amber" | "emerald" }> = ({
  title,
  value,
  hint,
  tone = "rose",
}) => {
  const bg = { rose: "bg-rose-100", amber: "bg-amber-100", emerald: "bg-emerald-100" }[tone] || "bg-gray-100";
  return (
    <div className={`rounded-xl ${bg} p-4`}>
      <div className="text-gray-800 font-medium">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{hint}</div>
    </div>
  );
};

export default MaintenanceAlertsDashboard;