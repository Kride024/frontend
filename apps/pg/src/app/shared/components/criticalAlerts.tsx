import { BellRing, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// --- Types ---
type Severity = "high" | "medium" | "low";
type Priority = "P1 - High" | "P2 - Medium" | "P3 - Low";
type AlertFilter = "all" | "critical" | "week";

interface Alert {
  id: number;
  message: string;
  date: string; // ISO date string (YYYY-MM-DD)
  severity: Severity;
  priority: Priority;
}

// --- Helper Constants & Functions ---
const severityOrder: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

function daysUntil(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

function DueBadge({ date }: { date: string }) {
  const diff = daysUntil(date);
  if (diff === null) return null;

  if (diff < 0) {
    return (
      <span className="ml-2 rounded-full px-2.5 py-1 text-[11px] font-medium bg-rose-100 text-rose-700">
        Overdue {Math.abs(diff)}d
      </span>
    );
  }
  if (diff === 0) {
    return (
      <span className="ml-2 rounded-full px-2.5 py-1 text-[11px] font-medium bg-indigo-100 text-indigo-700">
        Due today
      </span>
    );
  }
  if (diff <= 7) {
    return (
      <span className="ml-2 rounded-full px-2.5 py-1 text-[11px] font-medium bg-amber-100 text-amber-700">
        Due in {diff}d
      </span>
    );
  }
  return (
    <span className="ml-2 rounded-full px-2.5 py-1 text-[11px] font-medium bg-gray-100 text-gray-700">
      In {diff}d
    </span>
  );
}

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
    date: "2025-09-25",
    severity: "high",
    priority: "P1 - High",
  },
  {
    id: 3,
    message: "Electricity bill payment",
    date: "2025-09-28",
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

// --- Component ---
export default function CriticalAlerts() {
  // State
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [alertFilter, setAlertFilter] = useState<AlertFilter>("all");
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [expandedAlertId, setExpandedAlertId] = useState<number | null>(null);
  const [newAlertMsg, setNewAlertMsg] = useState<string>("");
  const [newAlertDate, setNewAlertDate] = useState<string>("");
  const [newAlertPriority, setNewAlertPriority] = useState<Priority>("P2 - Medium");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Data Fetching Simulation
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        setError("Failed to load alerts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  // Alert Logic
  const priorityToSeverity = (p: Priority): Severity => {
    if (p.startsWith("P1")) return "high";
    if (p.startsWith("P2")) return "medium";
    return "low";
  };

  const toggleAlertExpansion = (id: number) =>
    setExpandedAlertId((prev) => (prev === id ? null : id));

  const resolveAlert = (id: number) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  const addAlert = () => {
    if (!newAlertMsg.trim() || !newAlertDate) return;

    const newId = alerts.length > 0 ? Math.max(...alerts.map((a) => a.id)) + 1 : 1;
    const newAlert: Alert = {
      id: newId,
      message: newAlertMsg.trim(),
      date: newAlertDate,
      priority: newAlertPriority,
      severity: priorityToSeverity(newAlertPriority),
    };

    setAlerts((cur) =>
      [...cur, newAlert].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    // Reset form
    setNewAlertMsg("");
    setNewAlertDate("");
    setNewAlertPriority("P2 - Medium");
    setShowAlertModal(false);
  };

  const alertCounts = useMemo(() => ({
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
  }), [alerts]);

  const filteredAlerts = useMemo(() => {
    const within7Days = (a: Alert): boolean => {
      const d = daysUntil(a.date);
      return d !== null && d >= 0 && d <= 7;
    };

    let list = [...alerts].sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return (daysUntil(a.date) ?? 9999) - (daysUntil(b.date) ?? 9999);
    });

    if (alertFilter === "critical") list = list.filter((a) => a.severity === "high");
    if (alertFilter === "week") list = list.filter(within7Days);

    return list;
  }, [alerts, alertFilter]);

  // Render
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <p>Loading Alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BellRing className="h-5 w-5 text-rose-500" />
          Critical Alerts & Reminders
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Counts */}
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-rose-200 bg-rose-50 text-rose-700">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical {alertCounts.high}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-amber-200 bg-amber-50 text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Medium {alertCounts.medium}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-yellow-200 bg-yellow-50 text-yellow-700">
            <span className="h-2 w-2 rounded-full bg-yellow-300" /> Low {alertCounts.low}
          </span>

          {/* Filter Dropdown */}
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value as AlertFilter)}
            className="hidden sm:block bg-white rounded-lg shadow px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All alerts</option>
            <option value="critical">Critical only</option>
            <option value="week">Due this week</option>
          </select>

          {/* Add Alert Button */}
          <button
            onClick={() => setShowAlertModal(true)}
            className="ml-1 px-3 py-2 rounded-lg text-sm font-medium bg-[#073C9E] text-white hover:bg-indigo-700 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Alert
          </button>
        </div>
      </div>

      {/* Alert List Section */}
      <section className="bg-white rounded-[20px] shadow-[8px_8px_8px_0px_rgba(0,0,0,0.25)] p-4 sm:p-6">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="text-2xl">Well done</div>
            <p className="mt-2 text-gray-800 font-medium">No reminders — you’re all caught up!</p>
            <p className="text-sm text-gray-500">You’ll see new reminders here as they come in.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredAlerts.map((alert) => (
              <li key={alert.id}>
                {/* Mobile View */}
                <div className="sm:hidden">
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => toggleAlertExpansion(alert.id)}
                  >
                    <span
                      className={`mt-1 flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                        alert.severity === "high"
                          ? "bg-rose-500"
                          : alert.severity === "medium"
                          ? "bg-amber-400"
                          : "bg-yellow-300"
                      }`}
                    />
                    <p
                      className={`flex-1 text-sm text-gray-700 leading-relaxed ${
                        expandedAlertId !== alert.id ? "truncate" : "whitespace-normal"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                  <div className="pl-[22px] mt-2 flex items-center justify-between">
                    <DueBadge date={alert.date} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveAlert(alert.id);
                      }}
                      className="text-xs px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium"
                    >
                      Resolve
                    </button>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden sm:flex items-center w-full gap-4">
                  <span
                    className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                      alert.severity === "high"
                        ? "bg-rose-500"
                        : alert.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-yellow-300"
                    }`}
                  />
                  <span className="flex-1 text-sm text-gray-700">
                    {alert.message}
                    <DueBadge date={alert.date} />
                  </span>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="text-xs px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium"
                  >
                    Resolve
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Add Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAlertModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BellRing className="h-5 w-5 text-rose-500" /> Add Alert
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
                  onChange={(e) => setNewAlertPriority(e.target.value as Priority)}
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
    </div>
  );
}