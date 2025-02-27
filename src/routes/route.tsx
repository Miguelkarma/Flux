import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../authentication/Login";
import Registration from "@/authentication/Registration";
import App from "@/App.tsx";
import "@/App.css";
import ExternalAPI from "@/DashboardPages/ExternalAPI";
import Dashboard from "@/DashboardPages/Pages/Dashboard/layout";
import Assets from "@/DashboardPages/Pages/Assets/renderPageAssets";
import Settings from "@/DashboardPages/Pages/CurrencyExchange/renderPageCurrency";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />{" "}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/home" element={<App />} />
        <Route path="/ExternalAPI" element={<ExternalAPI />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Assets" element={<Assets />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
