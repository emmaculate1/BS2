import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import SmartBookingDashboard from './pages/SmartBookingDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function AppContent() {
    const location = useLocation();
    const isNoLayoutPage = location.pathname === '/admin/login';

    return (
        <div className="flex flex-col min-h-screen bg-[#FCF9F6] font-sans text-gray-900">
            {!isNoLayoutPage && <Navbar />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/dashboard" element={<SmartBookingDashboard />} />
                    <Route path="/my-bookings" element={<SmartBookingDashboard />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
            </main>
            {!isNoLayoutPage && <Footer />}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    )
}

export default App

