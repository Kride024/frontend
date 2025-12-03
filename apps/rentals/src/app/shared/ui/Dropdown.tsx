// import React, { useState, useRef, useEffect } from "react";
// import { Search, X } from "lucide-react";

// // --------------------------
// // Types
// // --------------------------
// export interface DropdownOption {
//   id: string | number;
//   name: string;
// }

// interface SearchableDropdownProps {
//   label: string;
//   value: string;
//   onChange: (event: { target: { value: string } }) => void;
//   options: DropdownOption[];
// }

// const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
//   label,
//   value,
//   onChange,
//   options,
// }) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   // -------------------------------------------------------------------
//   // Close dropdown when clicking outside
//   // -------------------------------------------------------------------
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//         setSearchTerm("");
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Focus the input when dropdown opens
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   const selectedOption = options.find((option) => option.name === value);
//   const displayText = selectedOption ? selectedOption.name : "";

//   // Search filter
//   const filteredOptions = options.filter((option) => {
//     const optionNameNoSpaces = option.name.toLowerCase().replace(/\s/g, "");
//     const searchTermNoSpaces = searchTerm.toLowerCase().replace(/\s/g, "");
//     return optionNameNoSpaces.includes(searchTermNoSpaces);
//   });

//   // Option select
//   const handleOptionClick = (optionName: string) => {
//     onChange({ target: { value: optionName } });
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   // Input click
//   const handleInputClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     e.stopPropagation();
//     setIsOpen(!isOpen);
//   };

//   // Search input change
//   const handleSearchChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setSearchTerm(e.target.value);
//     setIsOpen(true);
//   };

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       {/* Label */}
//       <label className="block text-xs font-semibold text-[#001433] mb-1">
//         {label}
//       </label>

//       {/* Input */}
//       <div className="relative cursor-pointer" onClick={handleInputClick}>
//         <input
//           ref={inputRef}
//           type="text"
//           value={isOpen ? searchTerm : displayText}
//           onChange={handleSearchChange}
//           placeholder={label}
//           className="cursor-pointer bg-white w-full px-2 py-1 text-xs text-[#001433] border border-gray-300 rounded-md focus:outline-none focus:border-[#4A628A] pr-8"
//           autoComplete="off"
//         />

//         {/* Icons */}
//         <div className="absolute right-2 top-[55%] -translate-y-1/2 flex items-center gap-1">
//           {value && !searchTerm ? (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleOptionClick("");
//               }}
//               className="text-gray-400"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           ) : (
//             <Search className="h-3 w-3 text-gray-400" />
//           )}
//         </div>
//       </div>

//       {/* Dropdown List */}
//       {isOpen && (
//         <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-20 mt-1">
//           {filteredOptions.length === 0 ? (
//             <li className="px-2 py-1 text-gray-400 text-xs">
//               No Results Found
//             </li>
//           ) : (
//             filteredOptions.map((option) => (
//               <li
//                 key={option.id}
//                 onClick={() => handleOptionClick(option.name)}
//                 className={`px-2 py-1 text-xs text-[#001433] hover:bg-gray-100 cursor-pointer ${
//                   option.name === value ? "bg-gray-200" : ""
//                 }`}
//               >
//                 {option.name}
//               </li>
//             ))
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchableDropdown;


import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Option {
  id: string | number;
  name: string;
}

interface SearchableDropdownProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (e: { target: { value: string } }) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get selected option or use label
  const selectedOption = options.find((option) => option.name === value);
  const displayText = selectedOption ? selectedOption.name : label;

  // Filter options
  const filteredOptions = options.filter((option) => {
    const optionNameNoSpaces = option.name.toLowerCase().replace(/\s/g, "");
    const searchTermNoSpaces = searchTerm.toLowerCase().replace(/\s/g, "");
    return optionNameNoSpaces.includes(searchTermNoSpaces);
  });

  // Handlers
  const handleOptionClick = (optionValue: string) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Input Trigger */}
      <div className="relative cursor-pointer" onClick={handleInputClick}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm || (isOpen ? "" : displayText)}
          onChange={handleSearchChange}
          placeholder={label}
          autoComplete="off"
          className={`cursor-pointer bg-white w-full px-2 py-1 text-xs text-[#001433] bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:border-[#4A628A] pr-8 ${
            !value && !searchTerm ? "text-gray-500" : ""
          }`}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && !searchTerm ? (
            <button
              onClick={() => handleOptionClick("")}
              className="ml-2 text-gray-400"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="h-3 w-3 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown Modal */}
      {isOpen && (
        <ul
          className="absolute w-full text-left bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-20"
          style={{ top: "calc(100% + 2px)" }}
        >
          {filteredOptions.length === 0 ? (
            <li className="px-2 py-1 text-gray-400 text-xs">
              No Results Found
            </li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => handleOptionClick(option.name)}
                className={`px-2 py-1 text-xs text-[#001433] hover:bg-gray-100 cursor-pointer ${
                  option.name === value ? "bg-gray-200" : ""
                }`}
              >
                {option.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
