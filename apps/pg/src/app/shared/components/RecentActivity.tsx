import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";

interface Activity {
  id: number;
  text: string;
}

export default function RecentActivityFeed(): JSX.Element {
  const activities: Activity[] = [
    { id: 1, text: "Candidate 1 check-in recorded on 3rd Sep 2025" },
    { id: 2, text: "Candidate 2 checked-out on 3rd Sep 2025" },
    { id: 3, text: "₹25K Payment received from Candidate 3 on 3rd Sep 2025" },
    { id: 4, text: "Water leakage ticket is closed on 3rd Sep 2025" },
    { id: 5, text: "Candidate 4 check-in recorded on 4th Sep 2025" },
    { id: 6, text: "Candidate 5 checked-out on 4th Sep 2025" },
  ];

  const [expanded, setExpanded] = useState<boolean>(false);
  const visibleActivities = expanded ? activities : activities.slice(0, 4);
  const remainingCount = activities.length - 4;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-gray-700" size={22} />
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Activity Feed
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <ul className="space-y-2">
          {visibleActivities.map((activity: Activity) => (
            <li key={activity.id} className="flex items-start gap-3 text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-2"></span>
              <p className="text-sm">{activity.text}</p>
            </li>
          ))}
        </ul>

        {/* View More / View Less */}
        {activities.length > 4 && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#0041BA] text-sm font-medium hover:underline flex items-center"
            >
              {expanded ? (
                <>
                  View less <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  View more ({remainingCount})
                  <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
