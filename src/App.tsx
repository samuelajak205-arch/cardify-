/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './components/dashboard/Dashboard';
import LearnersPage from './pages/LearnersPage';
import RevisionAssistantPage from './pages/RevisionAssistantPage';
import FlashCardsPage from './pages/FlashCardsPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ClassReportPage from './pages/teacher/ClassReportPage';
import AttendancePage from './pages/teacher/AttendancePage';
import MessagesPage from './pages/MessagesPage';
import TeacherClassesPage from './pages/TeacherClassesPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return role ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/learners" element={<LearnersPage />} />
                  <Route path="/revision-assistant" element={<RevisionAssistantPage />} />
                  <Route path="/flashcards" element={<FlashCardsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin/users" element={<UserManagementPage />} />
                  <Route path="/teacher/class-reports" element={<ClassReportPage />} />
                  <Route path="/teacher/attendance" element={<AttendancePage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/classes" element={<TeacherClassesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<div className="p-4 text-center">Page under construction</div>} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
