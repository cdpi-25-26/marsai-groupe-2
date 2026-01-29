import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

import Home from "./pages/public/Home.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import ProducerLayout from "./layouts/ProducerLayout.jsx";
import JuryLayout from "./layouts/JuryLayout.jsx";
import ProducerHome from "./pages/producer/ProducerHome.jsx";
import JuryHome from "./pages/jury/JuryHome.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Register } from "./pages/auth/Register.jsx";
import { RoleGuard } from "./middlewares/RoleGuard.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* Route privata ADMIN */}
          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>

          {/* Route privata PRODUCER */}
          <Route
            path="producer"
            element={
              <RoleGuard allowedRoles={["PRODUCER"]}>
                <ProducerLayout />
              </RoleGuard>
            }
          >
            <Route index element={<ProducerHome />} />
          </Route>

          {/* Route privata JURY */}
          <Route
            path="jury"
            element={
              <RoleGuard allowedRoles={["JURY"]}>
                <JuryLayout />
              </RoleGuard>
            }
          >
            <Route index element={<JuryHome />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
