import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, Clipboard } from 'lucide-react';

export default function ClassReportPage() {
  const { role } = useAuth();
  
  if (role !== 'teacher') return <div className="p-6">Access Denied</div>;

  const students = [
    { id: 1, name: 'Student A' },
    { id: 2, name: 'Student B' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clipboard /> Class Reports</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-sm">Student</th>
              <th className="p-3 text-sm">Marks</th>
              <th className="p-3 text-sm">Attendance</th>
              <th className="p-3 text-sm">Behavior/Conduct</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b">
                <td className="p-3 text-sm">{s.name}</td>
                <td className="p-3"><input type="number" className="border rounded p-1 w-20" placeholder="0-100" /></td>
                <td className="p-3"><input type="number" className="border rounded p-1 w-20" placeholder="%" /></td>
                <td className="p-3"><input type="text" className="border rounded p-1 w-full" placeholder="Comment..." /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Save size={16}/> Save All Reports
        </button>
      </div>
    </div>
  );
}
