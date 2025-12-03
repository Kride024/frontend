import axios, { AxiosResponse } from "axios";

/* -------------------------------------------
   ENV
------------------------------------------- */
export const apiUrl: string = import.meta.env.VITE_API_URL as string;

/* -------------------------------------------
   SHARED TYPES
------------------------------------------- */

export type IdType = string | number;

export interface ApiResponse<T = any> {
  success?: boolean;
  result?: T;
  message?: string;
  error?: string;
  [key: string]: any;
}

/* -------------------------------------------
   getRecords
------------------------------------------- */

/**
 * Fetch records from the database using query parameters.
 */
export const getRecords = async <T = any>(
  tableName: string,
  fieldNames: string,
  whereCondition: string = ""
): Promise<ApiResponse<T>> => {
  try {
    if (!tableName || !fieldNames) {
      throw new Error("Missing required parameters: tableName or fieldNames.");
    }

    const params = { tableName, fieldNames, whereCondition };

    const response: AxiosResponse<ApiResponse<T>> = await axios.get(
      `${apiUrl}/getRecords`,
      { params }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching records:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

/* -------------------------------------------
   fetchPropertiesApi
------------------------------------------- */

export interface PropertyFilters {
  status?: string;
  city?: string;
  community?: string;
  searchQuery?: string;
}

/**
 * Fetch properties based on filters.
 */
export const fetchPropertiesApi = async (
  filters: PropertyFilters
): Promise<ApiResponse> => {
  const whereConditions: string[] = [];

  if (filters.status && filters.status !== "All Status") {
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

  const whereClause =
    whereConditions.length > 0 ? whereConditions.join("&") : "";

  const url = `${apiUrl}/showPropDetails?${whereClause}`;

  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

/* -------------------------------------------
   updatePropertyStatusApi
------------------------------------------- */

export const updatePropertyStatusApi = async (
  propertyId: IdType,
  newStatus: IdType
): Promise<ApiResponse> => {
  const payload = {
    tableName: "dy_property",
    fieldValuePairs: { current_status: newStatus },
    whereCondition: `id=${propertyId}`,
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axios.put(
      `${apiUrl}/updateRecord`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating property status:", error);
    throw error;
  }
};

/* -------------------------------------------
   updateUserRecordApi
------------------------------------------- */

export const updateUserRecordApi = async (
  userId: IdType,
  roleId?: IdType,
  rstatus?: number
): Promise<ApiResponse> => {
  const payload = {
    tableName: "dy_user",
    fieldValuePairs: {
      ...(roleId !== undefined && { role_id: roleId }),
      ...(rstatus !== undefined && { rstatus }),
    },
    whereCondition: `id="${userId}"`,
  };

  try {
    const response: AxiosResponse<ApiResponse> = await axios.put(
      `${apiUrl}/updateRecord`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating user record:", error);
    throw error;
  }
};
