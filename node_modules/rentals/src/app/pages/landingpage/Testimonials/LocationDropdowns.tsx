// LocationDropdowns.tsx
import React from "react";

interface Props {
  cities: any[];
  builders: any[];
  communities: any[];
  selectedCity: string;
  selectedBuilder: string;
  selectedCommunity: string;
  setSelectedCity: (v: string) => void;
  setSelectedBuilder: (v: string) => void;
  setSelectedCommunity: (v: string) => void;
  filteredBuilders: any[];
  filteredCommunities: any[];
  builderDropdownRef: React.RefObject<HTMLDivElement>;
  communityDropdownRef: React.RefObject<HTMLDivElement>;
}

const LocationDropdowns: React.FC<Props> = ({
  cities,
  builders,
  communities,
  selectedCity,
  selectedBuilder,
  selectedCommunity,
  setSelectedCity,
  setSelectedBuilder,
  setSelectedCommunity,
  filteredBuilders,
  filteredCommunities,
  builderDropdownRef,
  communityDropdownRef,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select City</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400" required>
            <option value="">Select a city</option>
            {cities.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 relative" ref={builderDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Builder</label>
          <button type="button" className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-left transition-all duration-200 hover:border-blue-400 ${!selectedCity ? "bg-gray-100 cursor-not-allowed" : ""}`} disabled={!selectedCity}>
            <span>{ selectedBuilder ? filteredBuilders.find((b:any)=>b.id===parseInt(selectedBuilder))?.name : "Select a builder" }</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {selectedCity && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[35vh] overflow-y-auto shadow-lg">
              {filteredBuilders.length > 0 ? (
                filteredBuilders.map((b:any) => (
                  <li key={b.id} onClick={() => setSelectedBuilder(String(b.id))} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">{b.name}</li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No builders available</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="relative mt-4" ref={communityDropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Community</label>
        <button type="button" className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-left transition-all duration-200 hover:border-blue-400 ${!selectedBuilder ? "bg-gray-100 cursor-not-allowed" : ""}`} disabled={!selectedBuilder}>
          <span>{ selectedCommunity ? filteredCommunities.find((c:any)=>c.id===parseInt(selectedCommunity))?.name : "Select a community" }</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {selectedBuilder && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[35vh] overflow-y-auto shadow-lg">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((c:any) => (
                <li key={c.id} onClick={() => setSelectedCommunity(String(c.id))} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">{c.name}</li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No communities available</li>
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default LocationDropdowns;
