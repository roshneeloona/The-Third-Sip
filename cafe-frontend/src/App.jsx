import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/login";
import Signup from "./pages/signup";
import OrderTracking from "./pages/OrderTracking";
import { CartProvider } from "./context/CartContext";
import AdminRoute from "./admin/components/AdminRoute";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminOrders from "./admin/pages/Orders";
import AdminInventory from "./admin/pages/Inventory";
import AdminMenu from "./admin/pages/Menu";
import CustomerRoute from "./components/CustomerRoute";

function CustomerLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/staff" element={<Navigate to="/staff/login" replace />} />
        <Route path="/staff/login" element={<AdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/staff/login" replace />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="menu" element={<AdminMenu />} />
        </Route>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/orders"
            element={
              <CustomerRoute>
                <OrderTracking />
              </CustomerRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
