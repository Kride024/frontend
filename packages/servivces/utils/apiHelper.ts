
// ==================== CONSTANTS ====================
export const API_BASE = import.meta.env.VITE_API_URL as string;

export const apiPrefixes = {
  user: "user",
  admin: "admin",
  rm: "rm",
  fm: "fm",
  auth: "auth",
  pay: "pay",
  studio: "studio",
  noti: "noti",
  test: "test",
  regions: "regions",
  crud: "",
  project: "project",
  maintask: "maintask",
  subtask: "subtask",
  payment: "payment",
  invoice: "invoice",
} as const;

export type ApiRole = keyof typeof apiPrefixes;

// ==================== MAIN FUNCTION ====================
import { useRoleStore } from "../../store/roleStore";

export const buildApiUrl = (
  endpoint: string,
  explicitRole: ApiRole | null = null,
  shared = false
): string => {
  if (shared) {
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_BASE}${path}`;
  }

  const role = explicitRole || useRoleStore.getState().userData?.role;
  const prefix = apiPrefixes[role] ?? "";

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE}/${prefix}${path}`;
};