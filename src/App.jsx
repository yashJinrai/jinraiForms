// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import OtpVerifyPage from './pages/OtpVerify'
import ResetPasswordSuccess from './pages/ResetPasswordSuccess'
import Dashboard from './pages/Dashboard'
import MyForms from './pages/MyForms'
import Responses from './pages/Responses'
import CreateForm from './pages/CreateForm'
import Analytics from './pages/Analytics'
import LiveForm from './pages/LiveForm'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import ProtectedRoute from './components/auth/ProtectedRoute'
import NotFound from './pages/NotFound'
import { useAuth } from './hooks/useAuth'
import { Navigate } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - but restricted if already logged in */}
        <Route path="/" element={<AuthRedirect><Signup /></AuthRedirect>} />
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordSuccess />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/forms" element={<ProtectedRoute><MyForms /></ProtectedRoute>} />
        <Route path="/forms/create" element={<ProtectedRoute><CreateForm /></ProtectedRoute>} />
        <Route path="/responses" element={<ProtectedRoute><Responses /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        
        {/* Always Public */}
        <Route path="/form/:id" element={<LiveForm />} />
        <Route path="/form/:id/response/:responseId" element={<ProtectedRoute><LiveForm /></ProtectedRoute>} />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function AuthRedirect({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default App
