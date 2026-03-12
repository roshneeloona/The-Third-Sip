import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminNavbar  from "./components/AdminNavbar";
import AdminLayout  from "./layouts/AdminLayout";
import AdminLanding from "./pages/AdminLanding";
import Dashboard    from "./pages/Dashboard";
import Orders       from "./pages/Orders";
import Inventory    from "./pages/Inventory";
import Menu         from "./pages/Menu";
import "./global.css";
import "./admin.css";

// Navbar only on landing page, sidebar layout only on dashboard pages
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing page — has navbar, no sidebar */}
        <Route
          path="/"
          element={
            <>
              <AdminNavbar />
              <AdminLanding />
            </>
          }
        />

        {/* Dashboard pages — sidebar layout only, no navbar */}
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/orders"    element={<AdminLayout><Orders /></AdminLayout>} />
        <Route path="/admin/inventory" element={<AdminLayout><Inventory /></AdminLayout>} />
        <Route path="/admin/menu"      element={<AdminLayout><Menu /></AdminLayout>} />

      </Routes>
    </BrowserRouter>
  );
}