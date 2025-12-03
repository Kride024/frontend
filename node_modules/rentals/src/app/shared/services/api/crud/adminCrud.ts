// config/adminConfig.ts
import axios, { AxiosResponse } from "axios";
import { buildApiUrl } from "../../../../../../../../packages/servivces/utils/apiHelper";

/**
 * Shared interfaces
 */
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  result?: T;
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalRecords?: number;
    limit?: number;
    [k: string]: any;
  };
  [k: string]: any;
}

/** Filter shape used by fetchPropertiesApi */
export interface PropertyFilter {
  property_id?: number | string;
  status?: number | string;
  city?: string;
  community?: string | number;
  searchQuery?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

/** Minimal property record shape — expand later if backend provides more fields */
export interface PropertyRecord {
  id?: number;
  property_id?: number;
  title?: string;
  community_name?: string;
  city_name?: string;
  current_status?: number | string;
  images?: string[];
  [key: string]: any;
}

/** Testimonial shape */
export interface Testimonial {
  id?: number;
  name?: string;
  message?: string;
  rating?: number;
  [key: string]: any;
}

/* --------------------------
   Dashboard API's
   -------------------------- */

export const fetchDashboardDataApi = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    return await axios.get(buildApiUrl("/admindashboard", "admin"));
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

/* --------------------------
   Property Listings API's
   -------------------------- */

/**
 * Generic getRecords wrapper.
 * Returns AxiosResponse<ApiResponse>
 */
export const getRecords = async (
  tableName: string,
  fieldNames: string,
  whereCondition = ""
): Promise<AxiosResponse<ApiResponse>> => {
  try {
    if (!tableName || !fieldNames) {
      throw new Error("Missing required parameters: tableName or fieldNames.");
    }
    const params = { tableName, fieldNames, whereCondition };
    return await axios.get(buildApiUrl("/getRecords", "crud"), { params });
  } catch (error: any) {
    console.error("Error fetching records:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch properties (admin listing)
 * Accepts PropertyFilter and returns the backend response data (shape may vary)
 */
export const fetchPropertiesApi = async (
  filters: PropertyFilter
): Promise<{ results?: any; pagination?: any } | never> => {
  const whereConditions: string[] = [];

  if (filters.property_id) {
    whereConditions.push(`property_id=${filters.property_id}`);
  } else {
    if (filters.status) {
      whereConditions.push(`current_status=${filters.status}`);
    }
    if (filters.city && filters.city !== "All City") {
      whereConditions.push(`city_name='${filters.city}'`);
    }
    if (filters.community && filters.community !== "All Community") {
      whereConditions.push(`community=${filters.community}`);
    }
    if (filters.searchQuery) {
      whereConditions.push(
        `(community_name LIKE '%${filters.searchQuery}%' OR city_name LIKE '%${filters.searchQuery}%')`
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    whereConditions.push(`page=${page}`);
    whereConditions.push(`limit=${limit}`);
  }

  const whereClause = whereConditions.join("&");
  const url = buildApiUrl(`/adminPropListings?${whereClause}`, "admin");

  try {
    const response = await axios.get(url);
    // backend returns data in `response.data` — keep that shape
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

/**
 * Update property status via crud updateRecord endpoint
 */
export const updatePropertyStatusApi = async (
  propertyId: number | string,
  newStatus: number | string
): Promise<any> => {
  const url = buildApiUrl("/updateRecord", "crud");
  const payload = {
    tableName: "dy_property",
    fieldValuePairs: { current_status: newStatus },
    whereCondition: `id=${propertyId}`,
  };
  try {
    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating property status:", error);
    throw error;
  }
};

/* --------------------------
   Requests API's
   -------------------------- */

export const fetchAllRequest = async (): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(buildApiUrl("/rmdata", "rm"));
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const fetchAllRmsFms = async (): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(buildApiUrl("/getFmList", "fm"));
  } catch (error) {
    console.error("Error fetching FMs:", error);
    throw error;
  }
};

/**
 * updateRecordInDB — posts updateTask payload.
 * updateRecords param expected to contain:
 * { currentStatus, updatedScheduleDate, updatedScheduleTime, updatedFm, updatedRm }
 */
export const updateRecordInDB = async (
  recordId: number | string,
  updateRecords: {
    currentStatus: string | number;
    updatedScheduleDate?: string;
    updatedScheduleTime?: string;
    updatedFm?: string | number;
    updatedRm?: string | number;
    [k: string]: any;
  }
): Promise<void> => {
  try {
    const response = await axios.put(buildApiUrl("/updateTask", "rm"), {
      id: recordId,
      cur_stat_code: parseInt(String(updateRecords.currentStatus), 10),
      schedule_date: updateRecords.updatedScheduleDate,
      schedule_time: updateRecords.updatedScheduleTime,
      fm_id: updateRecords.updatedFm ? parseInt(String(updateRecords.updatedFm), 10) : undefined,
      rm_id: updateRecords.updatedRm ? parseInt(String(updateRecords.updatedRm), 10) : undefined,
    });

    if (response.status === 200) {
      // keep same behavior as original
      alert("Record updated successfully!");
    } else {
      alert("Failed to update record!");
    }
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};
