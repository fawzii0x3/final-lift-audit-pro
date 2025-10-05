import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./router.tsx";
import { TanStackProvider } from "@modules/shared/tanstack";
import { AuthProvider } from "@modules/shared/auth/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanStackProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TanStackProvider>
  </StrictMode>,
);
