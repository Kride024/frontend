// types.tsx

export type MessageType = "user" | "bot";

export interface Message {
  type: MessageType;
  text: string;
  isLink?: boolean;
  buttonText?: string;
  clickable?: boolean;
  key?: string | number;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
}

export interface UserType {
  id: number;
  category: string;
}

export interface FormDataState {
  name: string;
  mobile: string;
  userType: string;
  countries: Country[];
  selectedCountry: Country | null;
  isDropdownOpen: boolean;
  searchTerm: string;
  userTypes: UserType[];
  loadingUserTypes: boolean;
  isSubmitting: boolean;
  filteredCountries: Country[];
}

export interface ExtractResult {
  rooms: number | null;
  area: number | null;
  community: string | null;
}
