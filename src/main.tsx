import AppRouter from "./routes/route.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "flowbite";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
