import { Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";
import BusListingPage from "./pages/BusListingPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import StaticInfoPage from "./pages/StaticInfoPage";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buses"
          element={
            <ProtectedRoute>
              <BusListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buses/:id/seats"
          element={
            <ProtectedRoute>
              <SeatSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/confirm"
          element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<StaticInfoPage title="Privacy Policy" text="BusBay collects only required booking data to provide services." />} />
        <Route path="/terms-of-service" element={<StaticInfoPage title="Terms of Service" text="Use BusBay responsibly. Seat availability and fares are subject to change." />} />
        <Route path="/tos" element={<StaticInfoPage title="Terms of Service" text="Use BusBay responsibly. Seat availability and fares are subject to change." />} />
        <Route path="/contact" element={<StaticInfoPage title="Contact" text="Email: support@busbay.com | Phone: +91 90000 00000" />} />
        <Route path="/about" element={<StaticInfoPage title="About BusBay" text="BusBay helps you search buses, select seats, and complete bookings quickly." />} />
        <Route path="/routes" element={<StaticInfoPage title="Routes" text="BusBay supports direct and connecting routes across major Indian cities with live route-map suggestions." />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
