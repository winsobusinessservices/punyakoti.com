import React from "react";
import { FiX, FiMapPin, FiUser, FiPackage, FiCreditCard, FiCalendar, FiClock } from "react-icons/fi";

const AdminOrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              Order Details
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-stone-500">#{order.orderNumber || order.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                order?.status === "DELIVERED"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : order?.status === "CONFIRMED" || order?.status === "PACKED"
                    ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                    : order?.status === "SHIPPED"
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : order?.status === "CANCELLED"
                        ? "border-red-200 bg-red-50 text-red-800"
                        : "border-amber-200 bg-amber-50 text-amber-800"
              }`}>
                {order.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <FiUser className="text-stone-400" /> Customer Info
              </h3>
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <div className="font-semibold text-stone-800 text-base">{order.name || "Guest Farmer"}</div>
                <div className="text-stone-500 font-mono text-sm mt-1">+91 {order.phoneNumber}</div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <FiMapPin className="text-stone-400" /> Delivery Address
              </h3>
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 h-[88px]">
                {order.address ? (
                  <div className="text-sm text-stone-600 leading-relaxed">
                    {order.address.line1}
                    {order.address.line2 && `, ${order.address.line2}`}
                    <br />
                    {order.address.city}, {order.address.state} - <span className="font-mono">{order.address.postalCode}</span>
                  </div>
                ) : (
                  <div className="text-sm text-stone-400 italic">No address provided</div>
                )}
              </div>
            </div>

            {/* Payment & Timestamps */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <FiCreditCard className="text-stone-400" /> Payment & Timeline
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase mb-1">Method</div>
                  <div className="font-semibold text-stone-800">{order.paymentMethod || "ONLINE"}</div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase mb-1">Payment Status</div>
                  <div className={`font-semibold ${order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus || 'PENDING'}
                  </div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase mb-1">Order Date</div>
                  <div className="font-semibold text-stone-800 flex items-center gap-1">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase mb-1">Time</div>
                  <div className="font-semibold text-stone-800 flex items-center gap-1">
                    {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <FiPackage className="text-stone-400" /> Order Items
              </h3>
              <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-[10px] uppercase text-stone-500 font-bold">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-center">Weight</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(order.items || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="px-4 py-3 font-medium text-stone-800">{item.productName}</td>
                        <td className="px-4 py-3 text-center text-stone-500">{item.variantWeight}</td>
                        <td className="px-4 py-3 text-center text-stone-500">x{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium text-stone-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-bold text-stone-600">Grand Total</td>
                      <td className="px-4 py-3 text-right font-bold text-lg text-primary">₹{order.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-800 text-white font-bold rounded-xl hover:bg-stone-900 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsModal;
