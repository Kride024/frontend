import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  IconComponent: LucideIcon;
  title: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ IconComponent, title, value }) => {
  return (
    <li className="p-5 bg-white shadow-lg rounded-lg flex items-center space-x-3">
      <div className="icon text-2xl text-gray-600">
        <IconComponent />
      </div>
      <div className="pl-2">
        <h4 className="text-gray-600 text-xs">{title}</h4>
        <h2 className="text-lg font-bold">{value}</h2>
      </div>
    </li>
  );
};

export default StatsCard;
