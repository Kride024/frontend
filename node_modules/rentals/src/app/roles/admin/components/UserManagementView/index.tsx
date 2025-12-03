import React, { useState, useEffect } from "react";
import { fetchUsersAndRoles, updateUserRecord } from "./services/newApiService";

interface Role {
  id: number;
  role: string;
}

interface User {
  id: number;
  user_name?: string;
  mobile_no: string;
  role_id: number;
  role?: string;
  rstatus: string | number;
}

interface TempChanges {
  [key: number]: Partial<User>;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [tempChanges, setTempChanges] = useState<TempChanges>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        users: fetchedUsers,
        roles: fetchedRoles,
        error,
      }: {
        users: User[];
        roles: Role[];
        error?: string;
      } = await fetchUsersAndRoles();

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      const roleMap = fetchedRoles.reduce<Record<number, string>>((acc, role) => {
        acc[role.id] = role.role;
        return acc;
      }, {});

      const enrichedUsers = fetchedUsers.map((user) => ({
        ...user,
        role: roleMap[user.role_id] || "Unknown",
      }));

      setUsers(enrichedUsers);
      setRoles(fetchedRoles);
    };

    fetchData();
  }, []);

  const handleRowSelect = (userId: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
      setEditingUser(null);
      setTempChanges((prev) => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      newSelected.add(userId);
      setEditingUser(userId);
    }
    setSelectedRows(newSelected);
  };

  const handleChange = (userId: number, field: keyof User, value: string | number) => {
    setTempChanges((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  const handleSaveChanges = async (userId: number) => {
    if (tempChanges[userId]) {
      try {
        const roleId =
          tempChanges[userId]?.role !== undefined
            ? roles.find((role) => role.role === tempChanges[userId].role)?.id
            : users.find((user) => user.id === userId)?.role_id;

        const rstatus =
          tempChanges[userId]?.rstatus ??
          users.find((user) => user.id === userId)?.rstatus;

        if (roleId === undefined && rstatus === undefined) {
          console.error("Invalid input.");
          return;
        }

        const result = await updateUserRecord(userId, roleId!, rstatus);

        if (result.success) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    role_id: roleId ?? user.role_id,
                    role: tempChanges[userId]?.role || user.role,
                    rstatus: rstatus ?? user.rstatus,
                  }
                : user
            )
          );

          setTempChanges((prev) => {
            const { [userId]: _, ...rest } = prev;
            return rest;
          });

          setEditingUser(null);
          setSelectedRows((prev) => {
            const newSelected = new Set(prev);
            newSelected.delete(userId);
            return newSelected;
          });
        } else {
          console.error("Error:", result.error);
        }
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white h-[calc(100vh-110px)] px-6 pb-6 rounded-lg shadow m-5">
      <div className="flex items-center gap-4 py-6 justify-between overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-2 py-1 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="overflow-auto max-h-[calc(100vh-230px)] rounded-lg border">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="border-b bg-gray-200">
              {["Select", "User ID", "Name", "Mobile Number", "Role", "Rstatus", "Actions"].map(
                (heading) => (
                  <th key={heading} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={selectedRows.has(user.id) ? "bg-blue-50" : "hover:bg-gray-50"}
              >
                <td className="px-6 py-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(user.id)}
                    onChange={() => handleRowSelect(user.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>

                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{user.user_name || "N/A"}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{user.mobile_no}</td>

                {/* Role */}
                <td className="px-6 py-2 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <select
                      value={tempChanges[user.id]?.role || user.role}
                      onChange={(e) => handleChange(user.id, "role", e.target.value)}
                      className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 rounded-md"
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.role}>
                          {role.role.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role || "N/A"}
                    </span>
                  )}
                </td>

                {/* Rstatus */}
                <td className="px-6 py-2 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <select
                      value={tempChanges[user.id]?.rstatus ?? user.rstatus}
                      onChange={(e) => handleChange(user.id, "rstatus", e.target.value)}
                      className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 rounded-md"
                    >
                      <option value="">Select Rstatus</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.rstatus}
                    </span>
                  )}
                </td>

                {/* Save Action */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {selectedRows.has(user.id) && editingUser === user.id && (
                    <button
                      onClick={() => handleSaveChanges(user.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ✔
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
