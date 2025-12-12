import { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

export type User = {
  id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {user.role === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'teacher' && <TeacherDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'student' && <StudentDashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}
