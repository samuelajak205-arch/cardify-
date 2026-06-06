import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { role } = useAuth();

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'teacher') {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}
