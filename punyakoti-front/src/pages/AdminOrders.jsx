import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/orderApi";
import { FiShoppingBag, FiSearch } from "react-icons/fi";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const size = 10;
  // We debounce the search query so we don't spam the API on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // Reset to page 0 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: ordersData, isLoading: loading } = useQuery({
    queryKey: ["adminOrders", page, size, debouncedSearch],
    queryFn: () => orderApi.getAdminOrders(page, size, debouncedSearch),
  });
  // console.log(ordersData);

  const orders = ordersData?.content || [];
  const totalPages = ordersData?.totalPages || 0;

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: ({ id, status }) => orderApi.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`Order ${variables.id} is now ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const handleStatusChange = (id, status) => {
    updateOrderStatus({ id, status });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">
          Orders Management
        </h1>
        <p className="text-xs text-stone-500">
          Track pending transactions, modify shipping states, and record billing
          totals.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex bg-white p-4 border border-stone-200 rounded-2xl items-center gap-3">
        <FiSearch className="text-stone-400 w-5 h-5 shrink-0" />
        <input
          type="text"
          placeholder="Search orders by invoice code or customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-hidden w-full text-sm focus:outline-hidden text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader type="skeleton-table" count={4} />
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-600">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Products</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-stone-850">
                      {order.orderNumber || order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-800">
                        {order.address?.fullName || "Guest Farmer"}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        +91 {order.address?.phoneNumber || "9988776655"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-stone-500 font-medium truncate"
                          >
                            {item.productName}{" "}
                            <span className="text-stone-400">
                              ({item.variantWeight} x{item.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-800">
                      ₹{order.total}
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toISOString().split("T")[0]
                        : ""}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                          order.paymentMethod === 'COD' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}>
                          {order.paymentMethod === 'COD' ? 'COD' : 'ONLINE'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                          order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : order.paymentStatus === 'PENDING'
                            ? 'bg-stone-100 text-stone-800 border border-stone-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {order.paymentStatus || 'PENDING'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order?.status === "PENDING" &&
                      order?.paymentStatus !== "SUCCESS" &&
                      order?.paymentStatus !== "PAID" &&
                      order?.paymentMethod !== "COD" ? (
                        <span className="text-xs font-bold border-2 border-rose-200 bg-rose-50 text-rose-800 rounded-xl px-2.5 py-1.5 inline-block">
                          Unpaid / Abandoned
                        </span>
                      ) : (
                        <select
                          value={order?.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={`text-xs font-bold border-2 rounded-xl px-2.5 py-1.5 focus:outline-hidden transition-all ${
                            order?.status === "DELIVERED"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : order?.status === "CONFIRMED" ||
                                  order?.status === "PACKED"
                                ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                                : order?.status === "SHIPPED"
                                  ? "border-blue-200 bg-blue-50 text-blue-800"
                                  : order?.status === "CANCELLED"
                                    ? "border-red-200 bg-red-50 text-red-800"
                                    : "border-amber-200 bg-amber-50 text-amber-800"
                          }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PACKED">Packed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-200 mt-6">
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
    </div>
  );
};

export default AdminOrders;
