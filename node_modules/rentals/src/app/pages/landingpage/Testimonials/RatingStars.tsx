// RatingStars.tsx
import React from "react";
import { FaStar } from "react-icons/fa";

interface Props {
  rating: number;
  onRate: (n: number) => void;
}

const RatingStars: React.FC<Props> = ({ rating, onRate }) => {
  return (
    <div className="flex">
      {[1,2,3,4,5].map(star => (
        <FaStar key={star} className={`cursor-pointer w-7 h-7 ${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:scale-110 transition-transform duration-200`} onClick={() => onRate(star)} />
      ))}
    </div>
  );
};

export default RatingStars;
