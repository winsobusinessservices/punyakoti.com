import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactApi } from "../api/contactApi";
import { FiCheck, FiTrash2, FiMessageCircle, FiMail, FiPhone, FiUser } from "react-icons/fi";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumb";

const AdminContacts = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(0);
  const size = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["adminContacts", page],
    queryFn: () => contactApi.getAdminContacts(page, size),
  });

  const resolveMutation = useMutation({
    mutationFn: contactApi.resolveContact,
    onSuccess: () => {
      toast.success("Contact query marked as resolved.");
      queryClient.invalidateQueries({ queryKey: ["adminContacts"] });
    },
    onError: () => {
      toast.error("Failed to resolve contact query.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: contactApi.deleteContact,
    onSuccess: () => {
      toast.success("Contact query deleted.");
      queryClient.invalidateQueries({ queryKey: ["adminContacts"] });
    },
    onError: () => {
      toast.error("Failed to delete contact query.");
    },
  });

  const queries = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", path: "/admin" },
          { label: "Contact Queries" },
        ]}
      />

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div>
          <h2 className="text-2xl font-display font-bold text-stone-800">
            Contact Queries
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Manage customer inquiries and messages.
          </p>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : queries.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-stone-200 text-center">
          <p className="text-stone-500">No contact queries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queries.map((query) => (
            <div
              key={query.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                query.resolved ? "border-emerald-200" : "border-stone-200"
              } flex flex-col`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-stone-800 text-lg line-clamp-1" title={query.subject}>
                    {query.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        query.resolved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {query.resolved ? "Resolved" : "Pending"}
                    </span>
                    <span className="text-xs text-stone-400">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-stone-600">
                  <FiUser className="text-stone-400 shrink-0" />
                  <span className="truncate">{query.name}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <FiMail className="text-stone-400 shrink-0" />
                  <a href={`mailto:${query.email}`} className="truncate hover:text-primary transition-colors">
                    {query.email}
                  </a>
                </div>
                {query.phone && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <FiPhone className="text-stone-400 shrink-0" />
                    <a href={`tel:${query.phone}`} className="truncate hover:text-primary transition-colors">
                      {query.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-stone-50 p-4 rounded-xl text-stone-700 text-sm mb-6 flex-1 overflow-y-auto max-h-32 custom-scrollbar border border-stone-100">
                <p className="whitespace-pre-wrap">{query.message}</p>
              </div>

              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-stone-100">
                {!query.resolved && (
                  <button
                    onClick={() => {
                      if (window.confirm("Mark this query as resolved?")) {
                        resolveMutation.mutate(query.id);
                      }
                    }}
                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Mark as Resolved"
                  >
                    <FiCheck className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this query?")) {
                      deleteMutation.mutate(query.id);
                    }
                  }}
                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-stone-200 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-stone-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-stone-600">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 border border-stone-200 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-stone-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
