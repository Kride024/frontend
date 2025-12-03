// ReviewModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { addNewTestimonial } from "../../../shared/services/api/index";
import RatingStars from "./RatingStars";
import LocationDropdowns from "./LocationDropdowns";

interface UserTypeSimple { id?: number; userName?: string; }

interface Props {
  onClose: () => void;
  onSuccess: (t: any) => void;
  userData: UserTypeSimple | undefined;
  cities: any[];
  builders: any[];
  communities: any[];
}

const MIN_REVIEW_LENGTH = 80;

const ReviewModal: React.FC<Props> = ({ onClose, onSuccess, userData, cities, builders, communities }) => {
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState<string>(userData?.userName || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageScale, setImageScale] = useState<number>(100);
  const [error, setError] = useState<string>("");
  const [reviewLengthError, setReviewLengthError] = useState<string>("");

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedBuilder, setSelectedBuilder] = useState<string>("");
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");

  const builderDropdownRef = useRef<HTMLDivElement | null>(null);
  const communityDropdownRef = useRef<HTMLDivElement | null>(null);

  const [filteredBuilders, setFilteredBuilders] = useState<any[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<any[]>([]);

  // filter builders/communities when city/builder changes
  useEffect(() => {
    if (selectedCity) {
      const filtered = builders.filter((b: any) => b.city_id === parseInt(selectedCity));
      setFilteredBuilders(filtered);
      setSelectedBuilder("");
      setFilteredCommunities([]);
      setSelectedCommunity("");
    } else {
      setFilteredBuilders([]);
      setSelectedBuilder("");
      setFilteredCommunities([]);
      setSelectedCommunity("");
    }
  }, [selectedCity, builders]);

  useEffect(() => {
    if (selectedBuilder) {
      const filtered = communities.filter((c: any) => c.builder_id === parseInt(selectedBuilder));
      setFilteredCommunities(filtered);
      setSelectedCommunity("");
    } else {
      setFilteredCommunities([]);
      setSelectedCommunity("");
    }
  }, [selectedBuilder, communities]);

  // click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (builderDropdownRef.current && !builderDropdownRef.current.contains(event.target as Node)) {
        // intentionally empty (keeps dropdown closed)
      }
      if (communityDropdownRef.current && !communityDropdownRef.current.contains(event.target as Node)) {
        // intentionally empty
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) setProfileImage(file);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 250) {
      setReview(text);
      setError("");
      if (text.length > 0 && text.length < MIN_REVIEW_LENGTH) {
        setReviewLengthError(`Review must be at least ${MIN_REVIEW_LENGTH} characters long`);
      } else {
        setReviewLengthError("");
      }
    } else {
      setError("Review cannot exceed 250 characters");
      setReviewLengthError("");
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!review || !rating || !name || !selectedCity || !selectedBuilder || !selectedCommunity) {
      let errorMessage = "Please fill all required fields: ";
      if (!name) errorMessage += "Name, ";
      if (!review) errorMessage += "Review, ";
      if (!rating) errorMessage += "Rating, ";
      if (!selectedCity) errorMessage += "City, ";
      if (!selectedBuilder) errorMessage += "Builder, ";
      if (!selectedCommunity) errorMessage += "Community, ";
      errorMessage = errorMessage.slice(0, -2) + ". (Image upload is optional)";
      setError(errorMessage);
      return;
    }

    if (review.length < MIN_REVIEW_LENGTH) {
      setError(`Review must be at least ${MIN_REVIEW_LENGTH} characters long. (Image upload is optional)`);
      return;
    }

    try {
      const testimonialData = {
        user_id: userData?.id,
        display_name: name,
        rating,
        description: review,
        current_status: 1,
        city_id: selectedCity,
        builder_id: selectedBuilder,
        community_id: selectedCommunity,
        project_category: 1,
      };

      await addNewTestimonial(testimonialData, profileImage);

      const createdTestimonial = {
        name,
        image: profileImage ? URL.createObjectURL(profileImage) : null,
        rating,
        text: review,
        city: selectedCity ? cities.find((c:any) => c.id === parseInt(selectedCity))?.name : null,
        builder: selectedBuilder ? builders.find((b:any) => b.id === parseInt(selectedBuilder))?.name : null,
        community: selectedCommunity ? communities.find((c:any) => c.id === parseInt(selectedCommunity))?.name : null,
      };

      onSuccess(createdTestimonial);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to submit review. (Image upload is optional)");
    }
  };

  const isFormValid = review.trim() && review.length >= MIN_REVIEW_LENGTH && rating > 0 && name.trim() && selectedCity && selectedBuilder && selectedCommunity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl max-w-md w-full mx-4 shadow-lg border border-gray-200">
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl p-4">
          <h3 className="text-xl font-semibold text-white">Share Your Experience</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center mb-5">
              <div className="relative w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-2 border-2 border-dashed border-blue-300 flex items-center justify-center transition-transform hover:scale-105">
                {profileImage ? (
                  <div className="w-20 h-20 overflow-hidden rounded-full">
                    <img src={URL.createObjectURL(profileImage)} alt="Profile preview" className="w-full h-full object-cover object-top" style={{ transform: `scale(${imageScale / 100})` }} />
                  </div>
                ) : name ? (
                  <span className="text-2xl font-semibold text-gray-600">{name.charAt(0).toUpperCase()}</span>
                ) : (
                  <svg className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>

              <label htmlFor="profileUpload" className="text-sm text-blue-600 cursor-pointer hover:underline transition-colors">Upload Photo (Optional)</label>
              <input type="file" id="profileUpload" accept="image/*" onChange={handleProfileUpload} className="hidden" />

              {profileImage && (
                <div className="mt-3 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adjust Image Size</label>
                  <input type="range" min={50} max={150} value={imageScale} onChange={(e) => setImageScale(parseInt(e.target.value, 10))} className="w-full accent-blue-600" />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your name to be displayed</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400" placeholder="Enter your display name" required />
            </div>

            <LocationDropdowns
              cities={cities}
              builders={builders}
              communities={communities}
              selectedCity={selectedCity}
              selectedBuilder={selectedBuilder}
              selectedCommunity={selectedCommunity}
              setSelectedCity={setSelectedCity}
              setSelectedBuilder={setSelectedBuilder}
              setSelectedCommunity={setSelectedCommunity}
              filteredBuilders={filteredBuilders}
              filteredCommunities={filteredCommunities}
              builderDropdownRef={builderDropdownRef}
              communityDropdownRef={communityDropdownRef}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
              <RatingStars rating={rating} onRate={setRating} />
            </div>

            <div>
              <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
              <textarea id="testimonial" value={review} onChange={handleReviewChange} placeholder="Share your experience with RufRent..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 resize-none" rows={4} maxLength={250} required />
              <p className="text-sm text-gray-500 mt-1">{review.length}/250 characters</p>
              {reviewLengthError && <p className="text-sm text-red-500 mt-1">{reviewLengthError}</p>}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex space-x-4">
            <button type="button" onClick={() => handleSubmit()} disabled={!isFormValid} className={`flex-1 py-3 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isFormValid ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Submit Review</button>
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300">Close</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        @keyframes bounceStar { 0%,20%,50%,80%,100% { transform: translateY(0);} 40% { transform: translateY(-10px);} 60% { transform: translateY(-5px);} }
        .animate-bounceStar { animation: bounceStar 0.8s ease; }
      `}</style>
    </div>
  );
};

export default ReviewModal;
