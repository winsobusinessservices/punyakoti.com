import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { FiToggleLeft, FiToggleRight, FiSearch, FiEdit2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const size = 10;
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", mobileNumber: "", password: "" });

  const { data: usersData, isLoading: loading } = useQuery({
    queryKey: ["users", page, size],
    queryFn: () => userApi.getAllUsers(page, size),
    select: (data) => ({
      ...data,
      content: (data.content || []).map((u) => ({
        id: u.id,
        name: u.name || "Unknown",
        email: u.email || "",
        mobile: u.mobileNumber || "N/A",
        registrationDate: u.createdAt
          ? new Date(u.createdAt).toISOString().split("T")[0]
          : "N/A",
        lastLogin: u.lastLogin
          ? new Date(u.lastLogin).toISOString().split("T")[0]
          : "Recently",
        status: u.enabled !== false ? "Active" : "Suspended",
        role: u.role,
      })),
    }),
  });

  const userList = usersData?.content || [];
  const totalPages = usersData?.totalPages || 0;

  const toggleMutation = useMutation({
    mutationFn: ({ id, newStatus }) => userApi.updateUserStatus(id, newStatus),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        `User is now ${variables.newStatus ? "Active" : "Suspended"}`,
      );
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update user status");
    },
  });

  const toggleStatus = (id) => {
    const user = userList.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "Active" ? false : true;
    toggleMutation.mutate({ id, newStatus });
  };

  const updateMutation = useMutation({
    mutationFn: (payload) => userApi.updateUserDetails(editingUser.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User details updated successfully");
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to update user");
    },
  });

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name !== "Unknown" ? user.name : "",
      email: user.email,
      mobileNumber: user.mobile !== "N/A" ? user.mobile : "",
      password: "",
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: editForm.name,
      email: editForm.email,
    };
    if (editForm.mobileNumber) payload.mobileNumber = Number(editForm.mobileNumber);
    if (editForm.password) payload.password = editForm.password;
    updateMutation.mutate(payload);
  };

  const filtered = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.includes(searchQuery),
  );

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">
          Users Management
        </h1>
        <p className="text-xs text-stone-500">
          Monitor registrations, activity logs, and account statuses.
        </p>
      </div>

      {/* Search Input */}
      <div className="flex bg-white p-4 border border-stone-200 rounded-2xl items-center gap-3">
        <FiSearch className="text-stone-400 w-5 h-5 shrink-0" />
        <input
          type="text"
          placeholder="Search user registry by name or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-hidden w-full text-sm focus:outline-hidden text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Users table */}
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-stone-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-stone-850">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">
                    +91 {u.mobile}
                  </td>
                  <td className="px-6 py-4">{u.registrationDate}</td>
                  <td className="px-6 py-4">{u.lastLogin}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        u.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-rose-100 text-rose-800 border-rose-200"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${u.role === "ADMIN" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-rose-100 text-rose-800 border-rose-200"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEditClick(u)}
                      className="text-stone-400 hover:text-primary transition-all focus:outline-hidden"
                      title="Edit User"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`text-2xl transition-all focus:outline-hidden inline-block align-middle ${
                        u.status === "Active"
                          ? "text-primary"
                          : "text-stone-300"
                      }`}
                      title={
                        u.status === "Active" ? "Suspend User" : "Activate User"
                      }
                    >
                      {u.status === "Active" ? (
                        <FiToggleRight />
                      ) : (
                        <FiToggleLeft />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-200">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 text-sm font-semibold bg-stone-100 text-stone-600 rounded-xl disabled:opacity-50 transition-all hover:bg-stone-200"
          >
            Previous
          </button>
          <span className="text-sm text-stone-600 font-medium">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm font-semibold bg-stone-100 text-stone-600 rounded-xl disabled:opacity-50 transition-all hover:bg-stone-200"
          >
            Next
          </button>
        </div>
      )}
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50/50">
              <h2 className="font-display font-bold text-xl text-stone-800">
                Edit User
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all text-stone-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all text-stone-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={editForm.mobileNumber}
                  onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all text-stone-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all text-stone-800 placeholder:text-stone-400"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
