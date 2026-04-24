import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminLanding from "./pages/AdminLanding";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Menu from "./pages/Menu";
import "./global.css";
import "./admin.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <AdminNavbar />
              <AdminLanding />
            </>
          }
        />

        <Route path="/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminLayout><Orders /></AdminLayout></AdminRoute>} />
        <Route path="/admin/inventory" element={<AdminRoute><AdminLayout><Inventory /></AdminLayout></AdminRoute>} />
        <Route path="/admin/menu" element={<AdminRoute><AdminLayout><Menu /></AdminLayout></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
