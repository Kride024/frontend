import { getRecords, updateUserRecordApi } from "../apiRoute";

/* ---------- Types ---------- */

export interface User {
  id: number | string;
  user_name: string;
  mobile_no: string;
  role_id: number | string;
  rstatus: number;
}

export interface Role {
  id: number | string;
  role: string;
}

export interface FetchUsersAndRolesResult {
  users?: User[];
  roles?: Role[];
  error?: string;
}

export interface UpdateUserRecordResult {
  success?: boolean;
  data?: unknown;
  error?: string;
}

/* ---------- Fetch Users & Roles ---------- */

export const fetchUsersAndRoles = async (): Promise<FetchUsersAndRolesResult> => {
  try {
    const usersResponse = await getRecords(
      "dy_user",
      "id,user_name,mobile_no,role_id,rstatus"
    );

    const rolesResponse = await getRecords("st_role", "id,role");

    return {
      users: usersResponse.result as User[],
      roles: rolesResponse.result as Role[],
    };
  } catch (error: any) {
    console.error("Error fetching users and roles:", error);
    return { error: error?.message ?? "Unknown error" };
  }
};

/* ---------- Update User Role / Status ---------- */

export const updateUserRecord = async (
  userId: number | string,
  roleId: number | string,
  rstatus: number
): Promise<UpdateUserRecordResult> => {
  try {
    const response = await updateUserRecordApi(userId, roleId, rstatus);

    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error updating user record:", error);
    return { error: error?.message ?? "Unknown error" };
  }
};
