import { Routes, Route, Navigate } from "react-router-dom";

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with dashboard layout */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/brands"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Brands />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/brand" element={<Navigate to="/brands" />} />

      <Route
        path="/brand/:brandId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Workspace />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/brand/:brandId/calendar"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CalendarPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/brand/:brandId/posts"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Posts />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/brand/:brandId/posts/:postId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PostDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/brand/:brandId/backlinks"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Backlinks />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/brand/:brandId/backlinks/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BacklinkDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/brand/:brandId/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
