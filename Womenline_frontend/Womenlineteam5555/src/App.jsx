import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EmotionProvider } from "./contexts/EmotionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HealthData from "./pages/HealthData";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SafetyTutorial from "./components/SafetyTutorial";
import PeriodTracker from "./components/PeriodTracker";
import MentalWellnessTracker from "./components/MentalWellnessTracker";
import PDFGenerator from "./components/PDFGenerator";
import HealthSummaryPDF from "./components/HealthSummaryPDF";
import AppointmentInterface from "./components/AppointmentInterface";
import Leaderboard from "./components/Leaderboard";
import ChatbotPlayer from "./components/ChatbotPlayer";
import Forum from "./pages/Forum";
import SafeSpaceSettings from "./pages/SafeSpaceSettings";
import MaCoinCenter from "./pages/MaCoinCenter";
import ApiTester from "./components/ApiTester";
import WebsiteHealthChecker from "./components/WebsiteHealthChecker";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <EmotionProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset" element={<ForgotPassword />} />
            <Route path="/reset-confirmation" element={<ResetPassword />} />
            <Route path="/api-tester" element={<ApiTester />} />
            <Route path="/health-checker" element={<WebsiteHealthChecker />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/health" element={
              <ProtectedRoute>
                <HealthData />
              </ProtectedRoute>
            } />
            <Route path="/safety-tutorials" element={<SafetyTutorial />} />
            <Route path="/period-tracker" element={
              <ProtectedRoute>
                <PeriodTracker />
              </ProtectedRoute>
            } />
            <Route path="/mental-wellness" element={
              <ProtectedRoute>
                <MentalWellnessTracker />
              </ProtectedRoute>
            } />
            <Route path="/pdf-generator" element={
              <ProtectedRoute>
                <PDFGenerator />
              </ProtectedRoute>
            } />
            <Route path="/health-summary" element={
              <ProtectedRoute>
                <HealthSummaryPDF />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <AppointmentInterface />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <ChatbotPlayer />
              </ProtectedRoute>
            } />
            <Route path="/forum" element={<Forum />} />
            <Route path="/safe-space-settings" element={<SafeSpaceSettings />} />
            <Route path="/macoins" element={
              <ProtectedRoute>
                <MaCoinCenter />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </EmotionProvider>
    </AuthProvider>
  );
}

export default App; 