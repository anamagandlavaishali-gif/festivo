import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// 16 Required Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExploreEventsPage from './pages/ExploreEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import ManageParticipantsPage from './pages/ManageParticipantsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageEventsPage from './pages/ManageEventsPage';
import ManageUsersPage from './pages/ManageUsersPage';
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* 1. Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* 2. Login Page */}
              <Route path="/login" element={<LoginPage />} />

              {/* 3. Student Registration Page */}
              <Route path="/register" element={<RegisterPage />} />

              {/* 4. Explore Events Page */}
              <Route path="/events" element={<ExploreEventsPage />} />

              {/* 5. Event Details Page */}
              <Route path="/events/:id" element={<EventDetailsPage />} />

              {/* 6. Student Dashboard */}
              <Route
                path="/dashboard/student"
                element={
                  <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 7. My Registrations */}
              <Route
                path="/my-registrations"
                element={
                  <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                    <MyRegistrationsPage />
                  </ProtectedRoute>
                }
              />

              {/* 8. Organizer Dashboard */}
              <Route
                path="/dashboard/organizer"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 9. Create Event */}
              <Route
                path="/events/create"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />

              {/* 10. Edit Event */}
              <Route
                path="/events/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <EditEventPage />
                  </ProtectedRoute>
                }
              />

              {/* 11. Manage Participants */}
              <Route
                path="/events/:id/participants"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <ManageParticipantsPage />
                  </ProtectedRoute>
                }
              />

              {/* 12. Admin Dashboard */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 13. Manage Events */}
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageEventsPage />
                  </ProtectedRoute>
                }
              />

              {/* 14. Manage Users */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageUsersPage />
                  </ProtectedRoute>
                }
              />

              {/* 15. User Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 16. 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
