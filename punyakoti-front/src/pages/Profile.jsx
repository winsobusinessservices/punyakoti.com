import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiLogOut,
  FiShoppingBag,
  FiShield,
  FiCalendar,
  FiDollarSign,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import Loader from "../components/Loader";
import Breadcrumb from "../components/Breadcrumb";
import { userApi } from "../api/userApi";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [ordersPage, setOrdersPage] = useState(0);
  const ordersSize = 10;

  const { data: ordersData, isLoading: loading } = useQuery({
    queryKey: ["orders", ordersPage, ordersSize],
    queryFn: () => orderApi.getOrders(ordersPage, ordersSize),
    enabled: !!user,
  });

  const orders = ordersData?.content || [];
  const ordersTotalPages = ordersData?.totalPages || 0;

  const [activeTab, setActiveTab] = useState("orders"); // 'orders', 'profile', 'addresses'

  // Profile Update Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getProfile,
    enabled: !!user,
  });

  useEffect(() => {
    if (profile || user) {
      setProfileForm({
        name: profile?.name || user?.name || "",
        email: profile?.email || user?.email || "",
        mobile: profile?.mobileNumber || user?.mobile || "",
      });
    }
  }, [profile, user]);

  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: userApi.getAddresses,
    enabled: !!user,
  });

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phoneNumber: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phoneNumber: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleEditAddress = (addr) => {
    setAddressForm({
      fullName: addr.fullName || "",
      phoneNumber: addr.phoneNumber || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "India",
      isDefault: addr.isDefault || false,
    });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["profile"]);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const addAddressMutation = useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: () => {
      toast.success("Address added successfully");
      queryClient.invalidateQueries(["addresses"]);
      resetAddressForm();
    },
    onError: () => toast.error("Failed to add address"),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.updateAddress(id, data),
    onSuccess: () => {
      toast.success("Address updated successfully");
      queryClient.invalidateQueries(["addresses"]);
      resetAddressForm();
    },
    onError: () => toast.error("Failed to update address"),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      toast.success("Address deleted successfully");
      queryClient.invalidateQueries(["addresses"]);
    },
    onError: () => toast.error("Failed to delete address"),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddressMutation.mutate({ id: editingAddressId, data: addressForm });
    } else {
      addAddressMutation.mutate(addressForm);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async (paymentOrder) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TecnignPhWzH4D",
        amount: Math.round(paymentOrder.total * 100),
        currency: "INR",
        name: "Punyakoti",
        description: "Order Payment",
        order_id: paymentOrder.razorpayOrderId,
        handler: async function (response) {
          try {
            await paymentApi.verifyPayment(
              paymentOrder.id,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
            );
            toast.success("Payment successful!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
          } catch (verifyError) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: "",
        },
        theme: {
          color: "#3b82f6",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Failed to initiate payment.");
    }
  };

  const getStatusColor = (status, paymentStatus) => {
    if (
      status === "PENDING" &&
      paymentStatus !== "SUCCESS" &&
      paymentStatus !== "PAID"
    ) {
      return "bg-rose-100 text-rose-800 border-rose-200";
    }
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CONFIRMED":
      case "PACKED":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <Breadcrumb items={[{ label: t("profile") }]} />

      <h1 className="font-display font-extrabold text-3xl text-stone-850 m-0 pb-2 border-b border-stone-200">
        Account Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Navigation */}
        <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-stone-100 pb-5">
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
              {profile?.name
                ? profile.name[0]
                : user?.name
                  ? user.name[0]
                  : "U"}
            </div>
            <div>
              <h3 className="font-display font-semibold text-stone-800 text-base leading-snug">
                {profile?.name || user?.name || "Guest User"}
              </h3>
              <span className="text-xs text-stone-400 capitalize font-medium">
                {user?.role || "Customer"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === "orders" ? "bg-primary text-white" : "text-stone-600 hover:bg-stone-50"}`}
            >
              <FiShoppingBag className="w-4 h-4" /> Order History
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === "profile" ? "bg-primary text-white" : "text-stone-600 hover:bg-stone-50"}`}
            >
              <FiUser className="w-4 h-4" /> Profile Details
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === "addresses" ? "bg-primary text-white" : "text-stone-600 hover:bg-stone-50"}`}
            >
              <FiGlobe className="w-4 h-4" /> Address Book
            </button>

            {/* System settings */}
            {user?.role === "Admin" && (
              <div className="pt-4 mt-4 border-t border-stone-100">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 px-4 py-2 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  <FiShield className="w-4 h-4" /> Go to Admin Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl transition-all active:scale-98 focus:outline-hidden"
            >
              <FiLogOut className="w-4 h-4" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="lg:col-span-8 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          {activeTab === "orders" && (
            <>
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <h3 className="font-display font-bold text-stone-850 text-base md:text-lg">
                  Order History
                </h3>
              </div>

              {loading ? (
                <Loader />
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 bg-stone-50/30 hover:border-stone-300 transition-colors"
                    >
                      <div className="space-y-3 w-full text-xs sm:text-sm">
                        {/* Header: Order Number and Status */}
                        <div className="flex flex-wrap justify-between items-center gap-2.5 border-b border-stone-100 pb-3">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-stone-850 text-base">
                              {order.orderNumber || `Order #${order.id}`}
                            </span>
                            <span className="flex items-center gap-1.5 text-stone-500 mt-1">
                              <FiCalendar className="w-3.5 h-3.5" />
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : ""}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-3 py-1 border rounded-full ${getStatusColor(order.status, order.paymentStatus)}`}
                          >
                            {order.status === "PENDING" &&
                            order.paymentStatus !== "SUCCESS" &&
                            order.paymentStatus !== "PAID"
                              ? "UNPAID / ABANDONED"
                              : order.status}
                          </span>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Shipping Address */}
                          {order.address && (
                            <div className="bg-white border border-stone-150 p-3 rounded-xl space-y-1">
                              <h4 className="font-bold text-stone-700 mb-1 text-[11px] uppercase tracking-wide">
                                Shipping Address
                              </h4>
                              <p className="font-semibold text-stone-800">
                                {order.address.fullName}
                              </p>
                              <p className="text-stone-500 text-[11px] leading-relaxed">
                                {order.address.line1}
                                {order.address.line2
                                  ? `, ${order.address.line2}`
                                  : ""}
                                <br />
                                {order.address.city}, {order.address.state} -{" "}
                                {order.address.postalCode}
                                <br />
                                {order.address.country}
                              </p>
                              <p className="text-stone-500 font-medium pt-1 flex items-center gap-1">
                                <FiPhone className="w-3 h-3" /> +91{" "}
                                {order.address.phoneNumber}
                              </p>
                            </div>
                          )}

                          {/* Payment Summary */}
                          <div className="bg-white border border-stone-150 p-3 rounded-xl space-y-1">
                            <h4 className="font-bold text-stone-700 mb-1 text-[11px] uppercase tracking-wide">
                              Payment Summary
                            </h4>
                            <div className="flex justify-between text-stone-600">
                              <span>Payment Status:</span>
                              <span className="font-medium">
                                {order.paymentStatus}
                              </span>
                            </div>
                            {order.paymentId && (
                              <div className="flex justify-between text-stone-600 mt-1">
                                <span>Transaction ID:</span>
                                <span className="font-mono text-[10px]">
                                  {order.paymentId}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between text-stone-850 font-bold mt-2 pt-2 border-t border-stone-100">
                              <span className="flex items-center gap-1">
                                <FiDollarSign className="w-3.5 h-3.5" />
                                Total
                              </span>
                              <span>₹{order.total}</span>
                            </div>
                            {order.status === "PENDING" &&
                            order.paymentStatus !== "SUCCESS" &&
                            order.paymentStatus !== "PAID" && (
                              <div className="pt-2 mt-2 border-t border-stone-100">
                                <button
                                  onClick={() => handlePayNow(order)}
                                  className="w-full py-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                                >
                                  Pay Now
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white border border-stone-150 p-3 rounded-xl mt-3">
                          <h4 className="font-bold text-stone-700 mb-2 text-[11px] uppercase tracking-wide border-b border-stone-100 pb-2">
                            Order Items
                          </h4>
                          <div className="space-y-2">
                            {(order.items || []).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-start text-[11px] sm:text-xs pt-1 border-t border-stone-50 first:border-0 first:pt-0"
                              >
                                <div>
                                  <span className="font-semibold text-stone-800 block">
                                    {item.productName}
                                  </span>
                                  <span className="text-stone-500 text-[10px]">
                                    Variant: {item.variantWeight}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-stone-500 text-[10px] block">
                                    ₹{item.price} x {item.quantity}
                                  </span>
                                  <span className="font-bold text-stone-700">
                                    ₹
                                    {item.lineTotal ||
                                      item.price * item.quantity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  {ordersTotalPages > 1 && (
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-200 mt-6">
                      <button
                        onClick={() => setOrdersPage((p) => Math.max(0, p - 1))}
                        disabled={ordersPage === 0}
                        className="px-4 py-2 text-sm font-semibold bg-stone-100 text-stone-600 rounded-xl disabled:opacity-50 transition-all hover:bg-stone-200"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-stone-600 font-medium">
                        Page {ordersPage + 1} of {ordersTotalPages}
                      </span>
                      <button
                        onClick={() =>
                          setOrdersPage((p) =>
                            Math.min(ordersTotalPages - 1, p + 1),
                          )
                        }
                        disabled={ordersPage >= ordersTotalPages - 1}
                        className="px-4 py-2 text-sm font-semibold bg-stone-100 text-stone-600 rounded-xl disabled:opacity-50 transition-all hover:bg-stone-200"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <span className="text-3xl">📦</span>
                  <h4 className="font-semibold text-stone-700 text-sm">
                    No orders registered yet
                  </h4>
                  <p className="text-xs text-stone-405">
                    When you purchase products, your history will show up here.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <>
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <h3 className="font-display font-bold text-stone-850 text-base md:text-lg">
                  Profile Details
                </h3>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      disabled
                      value={profileForm.mobile}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          mobile: e.target.value,
                        })
                      }
                      className="w-full bg-stone-100 border border-stone-250 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden text-stone-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-stone-100 border border-stone-250 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden text-stone-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark"
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "addresses" && (
            <>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-display font-bold text-stone-850 text-base md:text-lg">
                  Saved Addresses
                </h3>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark"
                  >
                    <FiPlus /> Add New
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <form
                  onSubmit={handleAddressSubmit}
                  className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4"
                >
                  <h4 className="font-bold text-stone-800 text-sm mb-2">
                    {editingAddressId ? "Edit Address" : "New Address"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={addressForm.fullName}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={addressForm.phoneNumber}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      required
                      value={addressForm.line1}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          line1: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary sm:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={addressForm.line2}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          line2: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary sm:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          state: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      required
                      value={addressForm.postalCode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetAddressForm}
                      className="px-4 py-2 text-sm font-semibold text-stone-500 hover:text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        addAddressMutation.isPending ||
                        updateAddressMutation.isPending
                      }
                      className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl border border-stone-200 flex justify-between items-start gap-4 hover:border-primary/30 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-stone-800 text-sm">
                            {addr.fullName}
                          </h4>
                          {addr.isDefault && (
                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mb-2">
                          {addr.phoneNumber}
                        </p>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {addr.line1}, {addr.line2 && `${addr.line2},`} <br />
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="text-stone-400 hover:text-primary transition-colors"
                          title="Edit Address"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAddressMutation.mutate(addr.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors"
                          title="Delete Address"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-stone-500">
                        You have no saved addresses.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
