"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dummy fetch functions - replace with real API calls
async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  return res.json();
}
async function addUser(
  user: Omit<User, "_id"> & { password: string }
): Promise<void> {
  await fetch("/api/users", { method: "POST", body: JSON.stringify(user) });
}
async function updateUser(
  id: string,
  user: Omit<User, "_id"> & { password?: string }
): Promise<void> {
  await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}
async function deleteUser(id: string): Promise<void> {
  await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "client",
    password: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (editingId) {
      // For editing, only include password if it's not empty
      const updateData = {
        username: form.username,
        email: form.email,
        role: form.role,
        ...(form.password && { password: form.password }),
      };
      await updateUser(editingId, updateData);
    } else {
      await addUser(form);
    }
    setForm({
      username: "",
      email: "",
      role: "client",
      password: "",
    });
    setEditingId(null);
    fetchUsers().then(setUsers);
  };

  const handleEdit = (user: User): void => {
    setForm({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
    setEditingId(user._id);
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteUser(id);
    fetchUsers().then(setUsers);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6">
            User Management
          </h1>

          {/* Form Section */}
          <div className="bg-gray-700 rounded-lg p-6 mb-6 border border-gray-600">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              {editingId ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, username: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value }))
                    }
                  >
                    <option value="client">Client</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {editingId
                      ? "New Password (leave blank to keep current)"
                      : "Password"}
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder={
                      editingId
                        ? "Enter new password (optional)"
                        : "Enter password"
                    }
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required={!editingId}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium"
                  type="submit"
                >
                  {editingId ? "Update User" : "Add User"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium"
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        username: "",
                        email: "",
                        role: "client",
                        password: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table Section */}
          <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-gray-200">
                Users List
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-red-900 text-red-200"
                              : user.role === "manager"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-green-900 text-green-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-400 hover:text-blue-300 mr-4 transition-colors duration-200"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
