// TestimonialCard.tsx
import React from "react";
import { FaStar } from "react-icons/fa";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";
import { TestimonialItem } from "./TestimonialsView";

interface Props {
  testimonial: TestimonialItem;
}

const TestimonialCard: React.FC<Props> = ({ testimonial }) => {
  return (
    <div className="w-full max-w-md mx-auto relative group hover:scale-105 transition-transform duration-300">
      <div
        className="bg-gradient-to-b from-gray-400 to-yellow-100 h-24 w-full"
        style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
      />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white border-2 border-white shadow-md">
        {testimonial.image ? (
          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover object-top" />
        ) : (
          <span className="text-2xl font-semibold text-gray-600">{testimonial.name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="bg-gradient-to-b from-blue-200 to-cream-100 rounded-b-lg shadow-lg p-4 pt-12">
        <h3 className="text-lg font-semibold text-gray-900 text-center">{testimonial.name}</h3>

        <div className="text-sm text-gray-600 text-center mt-1">
          {testimonial.city || testimonial.builder || testimonial.community ? (
            <>
              {testimonial.city && `${testimonial.city}`}
              {testimonial.city && (testimonial.builder || testimonial.community) && " | "}
              {testimonial.community && `Community: ${testimonial.community}`}
            </>
          ) : (
            "No location details"
          )}
        </div>

        <div className="flex justify-center items-center mt-2 mb-3">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`w-5 h-5 animate-bounceStar ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        <p className="text-gray-600 text-center text-sm md:text-base break-words">{testimonial.text}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
