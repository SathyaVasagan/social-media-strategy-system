import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/dashboard/Home";

import Brands from "../pages/brands/Brands";
import Workspace from "../pages/brands/Workspace";

import CalendarPage from "../pages/calendar/CalendarPage";

import Posts from "../pages/posts/Posts";
import PostDetails from "../pages/posts/PostDetails";

import Backlinks from "../pages/backlinks/Backlinks";
import BacklinkDetails from "../pages/backlinks/BacklinkDetails";

import Analytics from "../pages/analytics/Analytics";

/* WRAPPER FOR PROTECTED + LAYOUT */

const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES */}

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/brands" element={<Brands />} />
        <Route path="/brand" element={<Navigate to="/brands" />} />

        <Route path="/brand/:brandId" element={<Workspace />} />

        <Route path="/brand/:brandId/calendar" element={<CalendarPage />} />

        <Route path="/brand/:brandId/posts" element={<Posts />} />
        <Route path="/brand/:brandId/posts/:postId" element={<PostDetails />} />

        <Route path="/brand/:brandId/backlinks" element={<Backlinks />} />
        <Route
          path="/brand/:brandId/backlinks/:id"
          element={<BacklinkDetails />}
        />

        <Route path="/brand/:brandId/analytics" element={<Analytics />} />
      </Route>

      {/* FALLBACK */}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
