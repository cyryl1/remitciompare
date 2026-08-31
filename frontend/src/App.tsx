import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Compare from './pages/Compare';
import CompareResult from './pages/CompareResult';
import ProviderDirectory from './pages/ProviderDirectory';
import ProviderDetails from './pages/ProviderDetails';
import ProviderHandoff from './pages/ProviderHandoff';
import HowItWorks from './pages/HowItWorks';
import RateHistory from './pages/RateHistory';
import CompareHistory from './pages/CompareHistory';
import RateAlerts from './pages/RateAlerts';
import SavingsInsight from './pages/SavingsInsight';
import AccountSettings from './pages/AccountSettings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import QuoteMonitoring from './pages/admin/QuoteMonitoring';
import Providers from './pages/admin/Providers';
import AdminRoutesPage from './pages/admin/Routes';
import Users from './pages/admin/Users';
import Referrals from './pages/admin/Referrals';
import Alerts from './pages/admin/Alerts';
import Health from './pages/admin/Health';
import ActivityLogs from './pages/admin/ActivityLogs';
import { AdminLayout } from './components/layout/AdminLayout';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/compare/results" element={<CompareResult />} />
          <Route path="/providers" element={<ProviderDirectory />} />
          <Route path="/providers/:slug" element={<ProviderDetails />} />
          <Route path="/providers/:slug/send" element={<ProviderHandoff />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/history/rates" element={<RateHistory />} />
          <Route path="/history" element={<CompareHistory />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/alerts" element={<RateAlerts />} />
            <Route path="/savings" element={<SavingsInsight />} />
            <Route path="/settings" element={<AccountSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/quotes" element={<QuoteMonitoring />} />
              <Route path="/admin/providers" element={<Providers />} />
              <Route path="/admin/routes" element={<AdminRoutesPage />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/referrals" element={<Referrals />} />
              <Route path="/admin/alerts" element={<Alerts />} />
              <Route path="/admin/health" element={<Health />} />
              <Route path="/admin/logs" element={<ActivityLogs />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
