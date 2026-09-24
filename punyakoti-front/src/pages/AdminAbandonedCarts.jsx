import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api/cartApi";
import { FiShoppingCart, FiCalendar, FiDollarSign } from "react-icons/fi";
import Loader from "../components/Loader";

const AdminAbandonedCarts = () => {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: cartsData, isLoading: loading } = useQuery({
    queryKey: ["adminCarts", page, size],
    queryFn: () => cartApi.getAdminCarts(page, size),
  });

  const carts = cartsData?.content || [];
  const totalPages = cartsData?.totalPages || 0;

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="font-display font-extrabold text-2xl text-stone-850 m-0">
          Abandoned Carts
        </h1>
        <p className="text-xs text-stone-500">
          Monitor user carts that have items but haven't been purchased yet.
        </p>
      </div>

      {/* Carts Table */}
      {loading ? (
        <Loader type="skeleton-table" count={4} />
      ) : carts.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <span className="text-3xl">🛒</span>
          <h4 className="font-semibold text-stone-700 text-sm">
            No abandoned carts found
          </h4>
          <p className="text-xs text-stone-405">
            All user carts are currently empty.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-600">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Cart ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {carts.map((cart) => (
                  <tr
                    key={cart.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-stone-850">
                      {cart.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-800">
                        {cart.userName || "Guest"}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {cart.userEmail} <br />
                        {cart.userPhone ? `+91 ${cart.userPhone}` : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                        {(cart.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-stone-500 font-medium truncate"
                          >
                            {item.product.name}
                            <span className="text-stone-400">
                              ({item.variant.weight} x{item.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-800">
                      ₹{cart.total}
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {cart.lastUpdated
                        ? new Date(cart.lastUpdated).toISOString().split("T")[0]
                        : ""}
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

export default AdminAbandonedCarts;
