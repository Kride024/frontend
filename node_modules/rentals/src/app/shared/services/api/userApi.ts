// apps/rentals/src/services/api/userApi.ts
import axios from "axios";
import { buildApiUrl } from "../../../../../../../packages/servivces/utils/apiHelper";

// ==================== TYPES ====================
export interface PropertyFilters {
  city?: string;
  builders?: string;
  community?: string;
  hometype?: string;
  availability?: string;
  [key: string]: any;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface TestimonialFormData {
  user_id: string | number;
  display_name: string;
  rating: number;
  description: string;
  current_status: number;
  city_id?: string | number;
  builder_id?: string | number;
  project_category?: string;
  community_id?: string | number;
}

export interface Testimonial {
  id: number;
  user_name?: string;
  display_name: string;
  rating: number;
  description: string;
  image_data?: string | null;
  current_status: number;
  testimonial_date: string;
  city_name?: string | null;
  builder_name?: string | null;
  community_name?: string | null;
}

// ==================== USER APIs ====================

/** Fetch logged-in user's profile */
export const fetchUserProfileDetails = async (userId: string | number) => {
  const url = buildApiUrl(`/userProfile?user_id=${userId}`);
  const response = await axios.get(url);
  return response;
};

/** Main landing page listings */
export const fetchAllProperties = async (
  filters: PropertyFilters = {},
  pagination: Pagination = { page: 1, limit: 6 }
) => {
  const { page, limit } = pagination;
  const params = {
    ...filters,
    page,
    limit,
    current_status: 3,
  };

  const url = buildApiUrl("/showPropDetails", "user");
  const response = await axios.get(url, { params });
  return response;
};

/** User's favorites, enquiries, etc. */
export const fetchUserActions = async (userId: string | number) => {
  const url = buildApiUrl(`/usermyfavourties?user_id=${userId}`, "user");
  const response = await axios.get(url);
  return response;
};

/** Data for Post Property form */
export const fetchPostPropertiesData = async () => {
  const response = await axios.get(buildApiUrl("/getPostData", "user"));
  return response;
};

/** Filters dropdown data (city, bhk, etc.) */
export const fetchFiltersData = async () => {
  const response = await axios.get(buildApiUrl("/filterdata", "user"));
  return response;
};

/** Upload new property (with images) */
export const uploadProperty = async (fieldValues: any, images: File[]) => {
  const formData = new FormData();
  
  Object.entries(fieldValues).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await axios.post(buildApiUrl("/addProperty", "user"), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

/** User's own posted listings */
export const fetchUserListings = async (
  userId: string | number,
  page: number = 1,
  limit: number = 10
) => {
  const url = buildApiUrl(
    `/usermylistings?user_id=${userId}&page=${page}&limit=${limit}`,
    "user"
  );
  const response = await axios.get(url);
  
  return response;
};

/** User's transaction history */
export const fetchTransactionsData = async (userId: string | number) => {
  const response = await axios.get(
    buildApiUrl(`/getUserTransactions?tenant_id=${userId}`)
  );
  return response;
};

// ==================== RM TASKS ====================

export const postRMTask = async (
  userId: string | number,
  propertyId: string | number,
  statusId: number
) => {
  const response = await axios.post(buildApiUrl("/addRmTask", "rm"), {
    user_id: userId,
    property_id: propertyId,
    cur_stat_code: statusId,
  });
  return response;
};

export const updateRMTask = async (
  userId: string | number,
  propertyId: string | number,
  statusId: number
) => {
  const response = await axios.put(buildApiUrl("/updateRMTask", "rm"), {
    user_id: userId,
    property_id: propertyId,
    cur_stat_code: statusId,
  });
  return response;
};

export const deleteRMTask = async (trId: number) => {
  const response = await axios.delete(buildApiUrl("/deleteRecord", "crud"), {
    data: {
      tableName: "dy_transactions",
      whereCondition: `id = ${trId}`,
    },
  });
  return response;
};

// ==================== TESTIMONIALS ====================

export const addNewTestimonial = async (
  testimonialData: TestimonialFormData,
  imageFile?: File
) => {
  const formData = new FormData();
  
  Object.entries(testimonialData).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  if (imageFile) {
    formData.append("images", imageFile);
  }

  const response = await axios.post(
    buildApiUrl("/addNewTestimonialRecord", "test"),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const url = buildApiUrl("getAllTestimonialRecords", "test");

  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch testimonials");
  }

  const data = await response.json();
  if (!data.result || data.result.length === 0) return [];

  return data.result.map((item: any): Testimonial => ({
    id: item.id,
    user_name: item.user_name ?? "Anonymous",
    display_name: item.display_name || item.user_name || "Anonymous",
    rating: Number(item.rating),
    description: item.description,
    image_data: item.image_data || null,
    current_status: item.current_status,
    testimonial_date: item.testimonial_date,
    city_name: item.city_name || null,
    builder_name: item.builder_name || null,
    community_name: item.community_name || null,
  }));
};

// ==================== COMMUNITY ====================

export const fetchCommunityAmenities = async (community_id: string | number) => {
  const response = await axios.get(
    buildApiUrl(`/amenities?community_id=${community_id}`, "user")
  );
  return response.data;
};