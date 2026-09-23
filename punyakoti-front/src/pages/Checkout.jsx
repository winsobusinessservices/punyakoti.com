import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../hooks/useCart";
import { paymentApi } from "../api/paymentApi";
import { userApi } from "../api/userApi";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import Breadcrumb from "../components/Breadcrumb";
import toast from "react-hot-toast";
import { FiMapPin, FiPlus, FiCheck } from "react-icons/fi";

const Checkout = () => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: userApi.getAddresses,
    onSuccess: (data) => {
      if (data.length > 0 && !selectedAddressId) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        setSelectedAddressId(defaultAddr.id);
      }
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: (newAddr) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setSelectedAddressId(newAddr.id);
      setShowAddForm(false);
      toast.success("Address added successfully");
    },
    onError: () => toast.error("Failed to add address"),
  });

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      const paymentOrder = await paymentApi.createOrder(selectedAddressId, paymentMethod);

      if (paymentMethod === "COD") {
        clearCart();
        toast.success("Order placed successfully with Cash on Delivery!");
        navigate(`/order-success?orderId=${paymentOrder.id}`);
        return;
      }

      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

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
            clearCart();
            toast.success("Payment successful! Order placed.");
            navigate(`/order-success?orderId=${paymentOrder.id}`);
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
      toast.error("Failed to initiate payment or place order.");
    }
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    addAddressMutation.mutate(newAddress);
  };

  if (cartItems.length === 0) {
    navigate("/cart");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <Breadcrumb
        items={[{ label: "Cart", path: "/cart" }, { label: "Checkout" }]}
      />

      <h1 className="font-display font-extrabold text-3xl text-stone-850 m-0 pb-2 border-b border-stone-200">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Address Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-stone-850 text-xl border-b border-stone-100 pb-3">
              Delivery Address
            </h3>

            {addressesLoading ? (
              <Loader />
            ) : (
              <div className="space-y-4">
                {addresses.length === 0 && !showAddForm ? (
                  <p className="text-sm text-stone-500">
                    You have no saved addresses.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-stone-200 hover:border-primary/50"}`}
                      >
                        {selectedAddressId === addr.id && (
                          <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                            <FiCheck className="w-3 h-3" />
                          </div>
                        )}
                        <p className="text-[11px] text-stone-600 leading-relaxed mt-2">
                          {addr.line1}, {addr.line2 && `${addr.line2},`} <br />
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {!showAddForm ? (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-all"
                  >
                    <FiPlus /> Add New Address
                  </button>
                ) : (
                  <form
                    onSubmit={handleAddAddressSubmit}
                    className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4 mt-4"
                  >
                    <h4 className="font-bold text-stone-800 text-sm mb-2">
                      New Address Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        required
                        value={newAddress.line1}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            line1: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        value={newAddress.line2}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            line2: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        required
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        required
                        value={newAddress.postalCode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 text-sm font-semibold text-stone-500 hover:text-stone-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addAddressMutation.isPending}
                        className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
          
          {/* Payment Method Selection */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-stone-850 text-xl border-b border-stone-100 pb-3">
              Payment Method
            </h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5' : 'border-stone-200 hover:border-primary/30'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="ONLINE" 
                  checked={paymentMethod === 'ONLINE'} 
                  onChange={() => setPaymentMethod('ONLINE')}
                  className="w-4 h-4 text-primary focus:ring-primary border-stone-300"
                />
                <div>
                  <span className="block font-semibold text-stone-800 text-sm">Pay Online</span>
                  <span className="block text-xs text-stone-500 mt-0.5">UPI, Cards, NetBanking (via Razorpay)</span>
                </div>
              </label>
              
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-stone-200 hover:border-primary/30'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')}
                  className="w-4 h-4 text-primary focus:ring-primary border-stone-300"
                />
                <div>
                  <span className="block font-semibold text-stone-800 text-sm">Cash on Delivery</span>
                  <span className="block text-xs text-stone-500 mt-0.5">Pay at your doorstep</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-stone-850 text-xl border-b border-stone-100 pb-3">
            Order Summary
          </h3>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-50 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-stone-800 text-xs">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <div className="font-bold text-sm text-stone-800 shrink-0">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm pt-4 border-t border-stone-100">
            <div className="flex justify-between font-medium text-stone-500">
              <span>Subtotal</span>
              <span className="text-stone-800">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between font-medium text-stone-500">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>

            <div className="border-t border-stone-100 pt-3.5 flex justify-between font-bold text-stone-850 text-lg">
              <span>Total</span>
              <span className="text-primary-dark">₹{cartSubtotal}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!selectedAddressId}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
