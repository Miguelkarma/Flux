import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "../authentication/Login";
import Registration from "@/authentication/Registration";
import App from "@/App.tsx";
import "@/App.css";
import Dashboard from "@/DashboardPages/Dashboard/renderDashboard";
import Assets from "@/DashboardPages/Assets/renderPageAssets";
import Employee from "@/DashboardPages/Employee/RenderEmployee";
import Settings from "@/DashboardPages/Settings/Settings";
import Generate from "@/DashboardPages/QR/RenderGenerate";
import Scanner from "@/DashboardPages/QR/RenderScanner";
import Logs from "@/DashboardPages/QR/RenderLogs";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/qrcode/generate-qr" element={<Generate />} />
        <Route path="/qrcode/scanner-qr" element={<Scanner />} />
        <Route path="/qrcode/qr-logs" element={<Logs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
