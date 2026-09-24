import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../hooks/useCart";
import { useMutation } from "@tanstack/react-query";
import { orderApi } from "../api/orderApi";
import { FiTrash2, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import QuantitySelector from "../components/QuantitySelector";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import Breadcrumb from "../components/Breadcrumb";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    clearCart,
    loading: cartLoading,
  } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!user) {
      toast.error("Please log in to checkout.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumb items={[{ label: t("cart") }]} />
        <EmptyState
          title={t("cartEmpty")}
          message="Look like you haven't added anything to your cart yet. Explore our fresh, pure dairy products."
          actionText="Go Shopping"
          onAction={() => navigate("/products")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 text-left relative">
      {cartLoading && <Loader type="full" />}

      <Breadcrumb items={[{ label: t("cart") }]} />

      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-850 m-0 pb-2 border-b border-stone-200">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.weight}`}
              className="bg-white border border-stone-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 shadow-xs relative"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 bg-stone-50 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow space-y-1 text-center sm:text-left">
                <h3 className="font-display font-semibold text-stone-800 text-sm sm:text-base leading-tight">
                  {item.name}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-stone-500 font-medium">
                  <span>
                    Weight:{" "}
                    <strong className="text-stone-700 capitalize">
                      {item?.weight}
                    </strong>
                  </span>
                  <span className="text-stone-300">|</span>
                  <span>
                    Unit Price:{" "}
                    <strong className="text-stone-700">₹{item.price}</strong>
                  </span>
                </div>
              </div>

              {/* Adjust Quantity and Subtotal */}
              <div className="flex items-center gap-3 sm:gap-5 md:gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <QuantitySelector
                  value={item.quantity}
                  onChange={(q) =>
                    updateQuantity(item.productId, item.weight, q)
                  }
                  max={item.stock}
                />

                <div className="w-20 text-right font-bold text-stone-800">
                  ₹{item.price * item.quantity}
                </div>

                <button
                  onClick={() => removeFromCart(item.productId, item.weight)}
                  className="text-stone-400 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 p-2 rounded-xl transition-all"
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary details */}
        <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-stone-850 text-lg border-b border-stone-100 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex justify-between font-medium text-stone-500">
              <span>{t("subtotal")}</span>
              <span className="text-stone-800">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between font-medium text-stone-500">
              <span>Shipping Charges</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>

            <div className="border-t border-stone-100 pt-3.5 flex justify-between font-bold text-stone-850 text-base">
              <span>{t("total")}</span>
              <span className="text-primary-dark">₹{cartSubtotal}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCheckout}
              disabled={cartLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-98 focus:outline-hidden"
            >
              <span>{t("checkout")}</span>
              <FiArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full flex items-center justify-center gap-2 border-2 border-stone-250 hover:bg-stone-50 text-stone-600 hover:text-stone-800 font-semibold py-3 rounded-xl transition-all"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>{t("continueShopping")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
