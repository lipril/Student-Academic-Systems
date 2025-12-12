import { useState } from 'react';
import { User } from '../App';

const API = 'http://localhost:3000/api';

type Props = {
  onLogin: (user: User) => void;
};

export default function Login({ onLogin }: Props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('student');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password, role }),
      });
      const data = await res.json();
      
      if (data.ok) {
        onLogin(data.user);
      } else {
        setStatus('❌ Invalid credentials');
      }
    } catch (e) {
      setStatus('❌ Connection error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image - Clear and Visible */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/portal-bg.jpg)',
        }}
      >
        {/* Subtle dark overlay for text readability only */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* University Header */}
        <div className="text-center mb-8">
          {/* University Logo */}
          <div className="inline-block mb-6">
            <img 
              src="/assets/logo.png" 
              alt="NCWU Logo" 
              className="w-48 h-48 mx-auto drop-shadow-2xl"
            />
          </div>
          
          {/* University Name - Single Line */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight px-4">
            North China University of Water Resources and Electric Power
          </h1>
          <p className="text-lg text-cyan-300 font-semibold tracking-wide">华北水利水电大学</p>
          <p className="text-sm text-purple-300 mt-2 font-medium tracking-wider">NCWU</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border-2 border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all">
          <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">Portal Login</h2>
          
          {/* Role Selection */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                role === 'student'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
            >
              👨‍🎓 Student
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                role === 'teacher'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
            >
              👨‍🏫 Teacher
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
            >
              ⚙️ Admin
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2 tracking-wide">
                {role === 'admin' ? 'Admin ID' : role === 'teacher' ? 'Teacher ID' : 'Student ID'}
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={`Enter your ${role} ID`}
                className="w-full px-5 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-medium backdrop-blur-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2 tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-5 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-medium backdrop-blur-sm transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 text-lg"
          >
            {loading ? '⏳ Logging in...' : '🔐 Login to Portal'}
          </button>

          {/* Status Message */}
          {status && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
              <p className="text-center text-sm font-semibold text-red-200">{status}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6 font-medium">
          © 2025 North China University of Water Resources and Electric Power
        </p>
      </div>
    </div>
  );
}
