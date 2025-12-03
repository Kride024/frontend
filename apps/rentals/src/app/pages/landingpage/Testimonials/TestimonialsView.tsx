// TestimonialsView.tsx
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { FaStar } from "react-icons/fa";
import { useRoleStore } from "../../../../../../../packages/store/roleStore";
import AuthModal from "../../../../../../../packages/ui/AuthModal/AuthModal";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";
import {
  addNewTestimonial,
  getAllTestimonials,
  fetchFiltersData,
} from "../../../shared/services/api/index";
import TestimonialCard from "./TestimonialCard";
import ReviewModal from "./ReviewModal";

const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

export interface TestimonialItem {
  name: string;
  image: string | null;
  rating: number;
  text: string;
  city?: string | null;
  builder?: string | null;
  community?: string | null;
}

const TestimonialsView: React.FC = () => {
  const { userData } = useRoleStore();

  const [loginOpen, setLoginOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [fetchError, setFetchError] = useState<string>("");

  // dropdown master data
  const [cities, setCities] = useState<any[]>([]);
  const [builders, setBuilders] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);

  // carousel state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getAllTestimonials();
        const mapped: TestimonialItem[] = data.map((item: any) => ({
          name: item.display_name || item.user_name || "Anonymous",
          image: item.image_data || null,
          rating: item.rating,
          text: item.description,
          city: item.city_name || null,
          builder: item.builder_name || null,
          community: item.community_name || null,
        }));
        setTestimonials(mapped);
        setFetchError("");
      } catch (err: any) {
        console.error("Error fetching testimonials:", err);
        setFetchError(
          err?.message === "No approved testimonials found."
            ? "No approved testimonials available."
            : "Unable to load testimonials due to a server error. Please try again later."
        );
      }
    };

    fetchTestimonials();
  }, []);

  // fetch dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetchFiltersData();
        if (response.status === 200) {
          const { cities, builders, communities } = response.data.result;
          setCities(cities || []);
          setBuilders(builders || []);
          setCommunities(communities || []);
        } else {
          setFetchError("Failed to load dropdown data");
        }
      } catch (err) {
        setFetchError("Failed to load dropdown data");
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchDropdownData();
  }, []);

  // auto-rotate carousel
  useEffect(() => {
    if (!isPaused && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev < testimonials.length - 1 ? prev + 1 : 0
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  // touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50 && currentIndex < testimonials.length - 1) {
        setCurrentIndex((c) => c + 1);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 5000);
      } else if (diff < -50 && currentIndex > 0) {
        setCurrentIndex((c) => c - 1);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 5000);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleAddReviewClick = () => {
    if (!userData?.id) {
      setLoginOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setIsModalOpen(true);
  };

  // callback when a new testimonial is submitted successfully from the modal.
  const handleNewTestimonial = (t: TestimonialItem) => {
    setTestimonials((prev) => [...prev, t]);
    // original code reloaded window — keep that behavior
    window.location.reload();
  };

  const jwtToken = Cookies.get(jwtSecretKey);
  const isLogin = jwtToken !== undefined;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl w-full mx-auto">
        <h2 className={`${tailwindStyles.heading_1}`}>Our Client's Experiences</h2>

        {fetchError && <div className="text-center text-red-500 mb-6">{fetchError}</div>}

        {testimonials.length === 0 && !fetchError ? (
          <div className="text-center text-gray-500">No approved testimonials available.</div>
        ) : (
          <>
           <div
  className="overflow-x-auto snap-x snap-mandatory hide-scrollbar"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  <div
    className="flex w-full transition-transform duration-700 ease-in-out"
    style={{
      transform: `translateX(-${currentIndex * (100 / (window.innerWidth < 768 ? 1 : 3))}%)`,
    }}
  >
    {testimonials.map((t, i) => (
      <div
        key={i}
        className="snap-center flex-shrink-0 w-full md:w-1/3 p-4 hide-scrollbar"
        onClick={() => {
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000);
        }}
      >
        <TestimonialCard testimonial={t} />
      </div>
    ))}
  </div>
</div>


            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentIndex(index); setIsPaused(true); setTimeout(()=>setIsPaused(false),5000); }}
                  className={`w-4 h-4 mx-1 transition-all duration-300 ${ index === currentIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-blue-400' }`}
                  style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
                />
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-8">
          <button
            onClick={handleAddReviewClick}
            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            Add Your Review
          </button>
        </div>

        {/* Review modal */}
        {isModalOpen && (
          <ReviewModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleNewTestimonial}
            userData={userData}
            cities={cities}
            builders={builders}
            communities={communities}
          />
        )}

        {/* Login modal */}
        <AuthModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default TestimonialsView;
