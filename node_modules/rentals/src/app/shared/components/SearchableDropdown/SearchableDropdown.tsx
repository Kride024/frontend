import React, { useState, useRef, useEffect } from "react";

interface OptionType {
  [key: string]: any; // allows dynamic keys like displayKey, valueKey
}

interface SearchableDropdownProps {
  options: OptionType[];
  value: string | number | null;
  onChange: (transactionId: string | number, name: string, value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  displayKey: string;
  valueKey: string;
  name: string;
  transactionId: string | number;
  currentStatusId?: number;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  isLoading = false,
  disabled = false,
  error,
  helperText,
  displayKey,
  valueKey,
  name,
  transactionId,
  currentStatusId = 0,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(value ? value.toString() : "");
  const [touched, setTouched] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // selected option
  const selectedOption = options.find(
    (opt) => opt[valueKey]?.toString() === value?.toString()
  );

  // update searchTerm when selected option changes
  useEffect(() => {
    if (selectedOption && !touched) {
      setSearchTerm(selectedOption[displayKey] || "");
    } else if (!value && !touched) {
      setSearchTerm("");
    }
  }, [selectedOption, displayKey, value, touched]);

  // filtered list
  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option[displayKey]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setTouched(false);
        setSearchTerm(selectedOption ? selectedOption[displayKey] : "");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption, displayKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTouched(true);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (option: OptionType) => {
    setTouched(false);
    setSearchTerm(option[displayKey]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange(transactionId, name, `${option[valueKey]}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prev) =>
          prev + 1 >= filteredOptions.length ? 0 : prev + 1
        );
        e.preventDefault();
        break;

      case "ArrowUp":
        setHighlightedIndex((prev) =>
          prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1
        );
        e.preventDefault();
        break;

      case "Enter":
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        e.preventDefault();
        break;

      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;

      default:
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    setTouched(true);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSearchTerm("");
    setTouched(false);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange(transactionId, name, "");
  };

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0) {
      const optionElement = document.getElementById(`option-${highlightedIndex}`);
      optionElement?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`w-full px-2 py-1 border rounded-md ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-100" : ""}`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {searchTerm && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
            type="button"
          >
            ×
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(
              (option, index) =>
                (currentStatusId === 28 ||
                  name === "schedule_time" ||
                  option.id >= currentStatusId) && (
                  <div
                    id={`option-${index}`}
                    key={option[valueKey]}
                    className={`p-1 cursor-pointer ${
                      option[valueKey]?.toString() === value?.toString()
                        ? "bg-blue-50"
                        : ""
                    } ${
                      index === highlightedIndex
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option[displayKey]}
                  </div>
                )
            )
          ) : (
            <div className="p-2 text-gray-500">No results found</div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
};

export default SearchableDropdown;
