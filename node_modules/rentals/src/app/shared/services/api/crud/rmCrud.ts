import axios, { AxiosResponse } from "axios";
import apiStatusConstants from "../../../../../../../../packages/servivces/utils/apiStatus";
import { buildApiUrl } from "../../../../../../../../packages/servivces/utils/apiHelper";

// ---------------------------
// Common Interfaces
// ---------------------------

export interface AddNewRecordResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface FilterPropertiesResponse {
  status: string;
  data: any[] | null;
  errorMsg: string | null;
}

export interface PropertyData {
  [key: string]: any;
}

export interface RequestData {
  [key: string]: any;
}

export interface UpdateTaskPayload {
  transactionId?: number | string;
  status?: number | string;
  [key: string]: any;
}

export interface UpdatePropertyResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ---------------------------
// API FUNCTIONS
// ---------------------------

// Add new record
export const addNewRecord = async (
  tableName: string,
  fieldNames: string[],
  fieldValues: any[]
): Promise<AxiosResponse<AddNewRecordResponse>> => {
  try {
    return await axios.post(
      buildApiUrl("/addNewRecord", null, true),
      { tableName, fieldNames, fieldValues }
    );
  } catch (error) {
    console.error("Error adding new record:", error);
    throw error;
  }
};

// Add new property
export const addProperty = async (
  propertyData: PropertyData,
  images: File[]
): Promise<AxiosResponse<any>> => {
  try {
    const formData = new FormData();
    formData.append("propertyData", JSON.stringify(propertyData));

    images.forEach((image) => formData.append("images", image));

    return await axios.post(
      buildApiUrl("/AddProperty", "user"),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  } catch (error) {
    console.error("Error adding new record:", error);
    throw error;
  }
};

// Add request
export const addRequest = async (
  requestData: RequestData
): Promise<any> => {
  try {
    const response = await axios.post(
      buildApiUrl("/addRequest", null, true),
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding request:", error);
    throw error;
  }
};

// Filter properties
export const fetchFilteredProperties = async (
  filters: Record<string, string | number>
): Promise<FilterPropertiesResponse> => {
  try {
    let url = buildApiUrl("/filterProperties", null, true);
    const queryParams = new URLSearchParams(filters as any).toString();

    if (queryParams) url += `?${queryParams}`;

    const response = await axios.get(url);

    return {
      status: apiStatusConstants.success,
      data: response.data.results,
      errorMsg: null,
    };
  } catch (error: any) {
    return {
      status: apiStatusConstants.failure,
      data: null,
      errorMsg: error.response?.data?.error || "Fetch Failed",
    };
  }
};

// Get all transactions based on RM ID
export const getAllTransactionBasedOnId = async (
  rmId: string | number
): Promise<any> => {
  try {
    const response = await axios.get(
      buildApiUrl("/requests", null, true),
      { params: { rm_id: rmId } }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching request details:", error);
    throw error;
  }
};

// Get FM list by community ID
export const listOfFmBasedOnCommunityId = async (
  communityId: number | string
): Promise<any> => {
  try {
    const response = await axios.get(
      buildApiUrl("/FmList", null, true),
      { params: { communityId } }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching FM list:", error);
    throw error;
  }
};

// Generic get records function
export const getRecords = async (
  tableName: string,
  fieldNames: string[],
  additionalParams: Record<string, any> = {}
): Promise<any[]> => {
  try {
    const whereCondition = Object.keys(additionalParams)
      .map((key) => `${key}=${additionalParams[key]}`)
      .join(" AND ");

    const response = await axios.get(
      buildApiUrl("/getRecords", null, true),
      {
        params: {
          tableName,
          fieldNames,
          whereCondition: whereCondition || null,
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

// Update transaction
export const updateTransaction = async (
  transactionId: string | number,
  status: number
): Promise<any> => {
  try {
    const response = await axios.put(
      buildApiUrl("/updatetranscationsstatus", "user"),
      { transactionId, status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Delete record
export const deleteRecord = async (
  tableName: string,
  whereCondition: string
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.delete(buildApiUrl("/deleteRecord", null, true), {
      data: { tableName, whereCondition },
    });
  } catch (error: any) {
    console.error("Error deleting records:", error);
    throw new Error(error.response?.data?.message || "Failed to delete records");
  }
};

// Get RM/Fm tasks
export const getTasks = async ({
  rmId,
  fmId,
}: {
  rmId?: string | number;
  fmId?: string | number;
}): Promise<any> => {
  try {
    const params: Record<string, any> = {};
    if (rmId) params.rm_id = rmId;
    if (fmId) params.fm_id = fmId;

    const response = await axios.get(
      buildApiUrl("/rmdata", "rm"),
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching task details:", error);
    throw error;
  }
};

// Get FM list (FM role)
export const getFmList = async (
  communityId: string | number
): Promise<any> => {
  try {
    const response = await axios.get(
      buildApiUrl("/getFmList", "fm"),
      { params: { communityId } }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching FM list:", error);
    throw error;
  }
};

// Get FM tasks
export const getFmTasks = async ({
  rmId,
  fmId,
}: {
  rmId?: string | number;
  fmId?: string | number;
}): Promise<any> => {
  try {
    const params: Record<string, any> = {};
    if (rmId) params.rm_id = rmId;
    if (fmId) params.fm_id = fmId;

    const response = await axios.get(
      buildApiUrl("/fmdata", "fm"),
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching task details:", error);
    throw error;
  }
};

// Update Task
export const updateTask = async (
  payload: UpdateTaskPayload
): Promise<any> => {
  try {
    const response = await axios.put(
      buildApiUrl("/updateTask", "rm"),
      payload
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating transaction:", error.response?.data || error.message);
    throw error;
  }
};

// Update Property
export const updateProperty = async (
  propertyId: string | number,
  propertyData: PropertyData,
  newImages: File[] = [],
  removedImages: string[] = []
): Promise<UpdatePropertyResponse> => {
  const url = buildApiUrl("/updateProperty", "user");

  const propertyPayload = {
    property_id: propertyId,
    removedImages,
    ...propertyData,
  };

  const formData = new FormData();
  formData.append("propertyData", JSON.stringify(propertyPayload));

  newImages.forEach((file) => formData.append("images", file));

  try {
    const response = await axios.put(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating property:", error);
    throw error;
  }
};
