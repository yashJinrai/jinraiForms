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

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms" element={<MyForms />} />
        <Route path="/forms/create" element={<CreateForm />} />
        <Route path="/responses" element={<Responses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/form/:id" element={<LiveForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
