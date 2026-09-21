import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages - Storefront
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Pages - Admin Panel
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminReviews from "./pages/AdminReviews";
import AdminFAQ from "./pages/AdminFAQ";
import AdminWhyChooseUs from "./pages/AdminWhyChooseUs";
import AdminHowItWorks from "./pages/AdminHowItWorks";
import AdminCategories from "./pages/AdminCategories";
import AdminBanners from "./pages/AdminBanners";
import AdminAbandonedCarts from "./pages/AdminAbandonedCarts";

function App() {
  return (
    <BrowserRouter>
      {/* Global Toaster Alerts */}
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
          className:"font-sans text-xs sm:text-sm font-semibold rounded-2xl shadow-lg border border-stone-150 p-4",
          duration: 3500,
          success: { iconTheme: { primary: "#797596", secondary: "#fff" } },
        }}/>

      <Routes>
        {/* Root Redirect */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

        {/* Public Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>}/>
        <Route path="/verify-email" element={<PublicRoute><EmailVerification /></PublicRoute>}/>

        {/* Protected Storefront Routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Admin />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="carts" element={<AdminAbandonedCarts />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="faq" element={<AdminFAQ />} />
          <Route path="why-choose-us" element={<AdminWhyChooseUs />} />
          <Route path="how-it-works" element={<AdminHowItWorks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
