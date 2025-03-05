import AppRouter from "./routes/route.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "flowbite";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import { ThemeProvider } from "./Animation/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </StrictMode>
);
