import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "../authentication/Login";
import Registration from "@/authentication/Registration";
import App from "@/App.tsx";
import "@/App.css";
import Dashboard from "@/DashboardPages/Dashboard/renderDashboard";
import Assets from "@/DashboardPages/Assets/renderPageAssets";
import Employee from "@/DashboardPages/Employee/RenderEmployee";

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
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
