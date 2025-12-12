import { useState, useEffect } from 'react';
import { User } from '../App';

const API = 'http://localhost:3000/api';

type Props = {
  user: User;
  onLogout: () => void;
};

type DashboardData = {
  student: any;
  results: any[];
  courses: any[];
  routine: any[];
  semesterRoutines: any[];
  assignments: any[];
  attendance: any[];
};

export default function StudentDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'courses' | 'routine' | 'attendance' | 'assignments'>('overview');
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const res = await fetch(`${API}/student/dashboard/${user.id}`);
    setData(await res.json());
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl font-mono animate-pulse">LOADING SYSTEM...</div>
      </div>
    );
  }

  const calculateOverallGPA = () => {
    if (data.results.length === 0) return 'N/A';
    const avg = data.results.reduce((acc, r) => acc + r.gpa, 0) / data.results.length;
    return avg.toFixed(2);
  };

  const getAttendancePercentage = () => {
    if (data.attendance.length === 0) return 0;
    const present = data.attendance.filter(a => a.status === 'present').length;
    return Math.round((present / data.attendance.length) * 100);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-blue-950/10 to-black pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      
      {/* Animated Corner Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Cyber Header */}
      <header className="relative bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-cyan-950/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.3)] sticky top-0 z-50 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-wider font-mono">
                  NCWU STUDENT PORTAL
                </h1>
                <p className="text-cyan-300/80 text-sm font-mono tracking-wide">SYSTEM ACCESS GRANTED</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-cyan-400 font-bold font-mono tracking-wide">{data.student.name}</p>
                <p className="text-cyan-500/60 text-xs font-mono">{data.student.id} • {data.student.grade || 'STUDENT'}</p>
              </div>
              {data.student.photo && (
                <img src={data.student.photo} className="w-14 h-14 rounded-lg border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.4)]" />
              )}
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600/80 to-rose-700/80 hover:from-red-500 hover:to-rose-600 text-white rounded-lg transition-all font-mono font-semibold border border-red-400/30 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Cyber Style */}
      <div className="relative bg-gradient-to-r from-cyan-950/50 to-blue-950/50 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {[
              { id: 'overview', label: 'DASHBOARD', icon: '🏠' },
              { id: 'results', label: 'EXAM RESULTS', icon: '📊' },
              { id: 'courses', label: 'MY COURSES', icon: '📚' },
              { id: 'routine', label: 'SCHEDULE', icon: '📅' },
              { id: 'assignments', label: 'ASSIGNMENTS', icon: '📝' },
              { id: 'attendance', label: 'ATTENDANCE', icon: '✅' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-mono font-bold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_20px_rgba(0,255,255,0.6)] scale-105'
                    : 'text-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-300 border border-cyan-500/20'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab - Cyber Theme */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Student Info Card - Cyber Style */}
            <div className="relative bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full"></div>
              <div className="relative flex items-center gap-6">
                <div className="w-28 h-28 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl border-4 border-cyan-400/40 shadow-[0_0_25px_rgba(0,255,255,0.4)]">
                  {data.student.photo ? <img src={data.student.photo} className="w-full h-full rounded-2xl object-cover" /> : '👤'}
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-3 font-mono tracking-wide">
                    {data.student.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-mono">
                    <p className="text-cyan-400">🆔 ID: <span className="font-bold text-white">{data.student.id}</span></p>
                    <p className="text-cyan-400">📧 EMAIL: <span className="font-bold text-white">{data.student.email}</span></p>
                    <p className="text-cyan-400">🏫 DEPT: <span className="font-bold text-white">{data.student.department}</span></p>
                    <p className="text-cyan-400">📚 GRADE: <span className="font-bold text-white">{data.student.grade || 'N/A'}</span></p>
                    <p className="text-cyan-400">📅 ENROLLED: <span className="font-bold text-white">{data.student.enrollmentDate}</span></p>
                    <p className="text-cyan-400">🎓 GRADUATION: <span className="font-bold text-white">{data.student.graduationDate}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid - Cyber Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative group bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/30 shadow-[0_0_20px_rgba(0,255,0,0.2)] hover:shadow-[0_0_35px_rgba(0,255,0,0.4)] transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-6xl mb-3 filter drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">🎯</div>
                <h3 className="relative text-lg font-bold text-green-400 mb-2 font-mono">OVERALL GPA</h3>
                <p className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 font-mono">{calculateOverallGPA()}</p>
              </div>
              
              <div className="relative group bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500/30 shadow-[0_0_20px_rgba(0,150,255,0.2)] hover:shadow-[0_0_35px_rgba(0,150,255,0.4)] transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-6xl mb-3 filter drop-shadow-[0_0_10px_rgba(0,150,255,0.8)]">📚</div>
                <h3 className="relative text-lg font-bold text-blue-400 mb-2 font-mono">COURSES</h3>
                <p className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 font-mono">{data.courses.length}</p>
              </div>
              
              <div className="relative group bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/30 shadow-[0_0_20px_rgba(150,0,255,0.2)] hover:shadow-[0_0_35px_rgba(150,0,255,0.4)] transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-6xl mb-3 filter drop-shadow-[0_0_10px_rgba(150,0,255,0.8)]">✅</div>
                <h3 className="relative text-lg font-bold text-purple-400 mb-2 font-mono">ATTENDANCE</h3>
                <p className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-mono">{getAttendancePercentage()}%</p>
              </div>
              
              <div className="relative group bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-orange-500/30 shadow-[0_0_20px_rgba(255,100,0,0.2)] hover:shadow-[0_0_35px_rgba(255,100,0,0.4)] transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-6xl mb-3 filter drop-shadow-[0_0_10px_rgba(255,100,0,0.8)]">📝</div>
                <h3 className="relative text-lg font-bold text-orange-400 mb-2 font-mono">ASSIGNMENTS</h3>
                <p className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-300 font-mono">{data.assignments.length}</p>
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/20 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 font-mono tracking-wide">📊 RECENT EXAM RESULTS</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.results.slice(0, 4).map((result: any) => (
                  <div key={result.id} className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/40 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-bold font-mono">{result.courseTitle}</h4>
                        <p className="text-sm text-cyan-400/60 font-mono">{result.examType}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-bold font-mono border-2 ${
                        result.grade.startsWith('A') ? 'bg-green-500/20 text-green-300 border-green-500/40 shadow-[0_0_10px_rgba(0,255,0,0.3)]' :
                        result.grade.startsWith('B') ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(0,150,255,0.3)]' :
                        result.grade.startsWith('C') ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-[0_0_10px_rgba(255,255,0,0.3)]' :
                        'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(255,0,0,0.3)]'
                      }`}>
                        {result.grade}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-300 font-mono">SCORE: {result.marks}/{result.totalMarks}</span>
                      <span className="text-cyan-400 font-bold font-mono">GPA: {result.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/20 shadow-[0_0_25px_rgba(150,0,255,0.15)]">
              <h3 className="text-2xl font-bold text-purple-400 mb-4 font-mono tracking-wide">📝 PENDING ASSIGNMENTS</h3>
              <div className="space-y-3">
                {data.assignments.map((assignment: any) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-purple-950/30 border border-purple-500/20 rounded-xl hover:border-purple-400/40 transition-all hover:shadow-[0_0_15px_rgba(150,0,255,0.2)]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center text-2xl border-2 border-purple-400/30">
                        📝
                      </div>
                      <div>
                        <h4 className="text-white font-bold font-mono">{assignment.title}</h4>
                        <p className="text-sm text-purple-300 font-mono">{assignment.courseTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium font-mono">DUE: {assignment.dueDate}</p>
                      <p className="text-sm text-purple-400/60 font-mono">MARKS: {assignment.totalMarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono tracking-wide">
                📊 EXAM RESULTS & GRADES
              </h2>
              <div className="text-right bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-xl px-6 py-3 rounded-xl border-2 border-yellow-500/30">
                <p className="text-yellow-400/60 text-sm font-mono">OVERALL GPA</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 font-mono">{calculateOverallGPA()}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {data.results.map((result: any) => (
                <div key={result.id} className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/20 hover:border-cyan-400/40 transition-all shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-cyan-300 mb-2 font-mono">{result.courseTitle}</h3>
                      <p className="text-cyan-400 text-sm mb-4 font-mono">{result.examType} • {result.periodLabel}</p>
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-cyan-400/60 text-xs font-mono mb-1">SCORE</p>
                          <p className="text-3xl font-bold text-white font-mono">{result.marks}/{result.totalMarks}</p>
                        </div>
                        <div>
                          <p className="text-cyan-400/60 text-xs font-mono mb-1">PERCENTAGE</p>
                          <p className="text-3xl font-bold text-cyan-300 font-mono">{Math.round((result.marks / result.totalMarks) * 100)}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`w-32 h-32 rounded-2xl flex items-center justify-center text-5xl font-bold border-4 font-mono ${
                        result.grade.startsWith('A') ? 'bg-green-500/20 text-green-300 border-green-500 shadow-[0_0_25px_rgba(0,255,0,0.4)]' :
                        result.grade.startsWith('B') ? 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-[0_0_25px_rgba(0,150,255,0.4)]' :
                        result.grade.startsWith('C') ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500 shadow-[0_0_25px_rgba(255,255,0,0.4)]' :
                        'bg-red-500/20 text-red-300 border-red-500 shadow-[0_0_25px_rgba(255,0,0,0.4)]'
                      }`}>
                        {result.grade}
                      </div>
                      <p className="text-white font-bold mt-3 font-mono">GPA: {result.gpa}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 font-mono tracking-wide">
              📚 ENROLLED COURSES
            </h2>
            
            <div className="grid gap-4">
              {data.courses.map((course: any) => (
                <div key={course.id} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl p-5 border-2 border-purple-500/20 hover:border-purple-400/40 transition-all shadow-[0_0_20px_rgba(150,0,255,0.1)] hover:shadow-[0_0_30px_rgba(150,0,255,0.2)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center text-3xl border-2 border-purple-400/30 shadow-[0_0_15px_rgba(150,0,255,0.3)]">
                        📚
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-xl font-mono">{course.title}</h4>
                        <p className="text-sm text-purple-300 font-mono">{course.id} • {course.department}</p>
                        <p className="text-sm text-purple-400/60 font-mono">👨‍🏫 INSTRUCTOR: {course.teacherName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 font-mono">{course.credit}</p>
                      <p className="text-sm text-purple-400/60 font-mono">CREDITS</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routine Tab */}
        {activeTab === 'routine' && (
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 font-mono tracking-wide">
              📅 CLASS SCHEDULE
            </h2>
            
            {data.semesterRoutines.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4 font-mono">SEMESTER ROUTINES</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.semesterRoutines.map((routine: any) => (
                    <div key={routine.id} className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-4 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                      <h4 className="text-white font-bold mb-2 font-mono">{routine.semester} - {routine.department}</h4>
                      {routine.grade && <p className="text-cyan-400 text-sm mb-3 font-mono">GRADE: {routine.grade}</p>}
                      {routine.routinePhoto && (
                        <img src={routine.routinePhoto} className="rounded-xl w-full border-2 border-cyan-500/20" alt="Routine" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.routine.map((item: any) => (
                <div key={item.id} className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/20 hover:border-cyan-400/40 transition-all shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl flex items-center justify-center text-2xl border-2 border-cyan-400/30">
                      📚
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg font-mono">{item.title}</h3>
                      <p className="text-cyan-400 text-sm font-mono">{item.courseId}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-300 font-mono">
                      <span className="text-xl">📆</span>
                      <span className="font-semibold">{item.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-300 font-mono">
                      <span className="text-xl">⏰</span>
                      <span className="font-semibold">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-300 font-mono">
                      <span className="text-xl">🚪</span>
                      <span className="font-semibold">{item.room}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 font-mono tracking-wide">
              📝 MY ASSIGNMENTS
            </h2>
            
            <div className="grid gap-4">
              {data.assignments.map((assignment: any) => (
                <div key={assignment.id} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/20 hover:border-purple-400/40 transition-all shadow-[0_0_20px_rgba(150,0,255,0.1)] hover:shadow-[0_0_30px_rgba(150,0,255,0.2)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center text-3xl border-2 border-purple-400/30 shadow-[0_0_15px_rgba(150,0,255,0.3)]">
                        📝
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-purple-300 mb-1 font-mono">{assignment.title}</h3>
                        <p className="text-purple-400 text-sm font-mono mb-2">{assignment.courseTitle}</p>
                        {assignment.description && (
                          <p className="text-purple-300/80 mt-2 font-mono text-sm">{assignment.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right bg-gradient-to-br from-orange-900/30 to-red-900/30 px-4 py-3 rounded-xl border-2 border-orange-500/30">
                      <p className="text-orange-400/60 text-xs font-mono mb-1">DUE DATE</p>
                      <p className="text-white font-bold font-mono text-lg">{assignment.dueDate}</p>
                      <p className="text-orange-300 text-sm font-mono mt-2">MARKS: {assignment.totalMarks}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono tracking-wide">
                ✅ ATTENDANCE RECORD
              </h2>
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-2xl px-8 py-4 border-2 border-green-500/30">
                <p className="text-green-400/60 text-sm font-mono mb-1">ATTENDANCE RATE</p>
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 font-mono">{getAttendancePercentage()}%</p>
              </div>
            </div>

            <div className="space-y-3">
              {data.attendance.map((att: any) => (
                <div key={att.id} className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-5 border-2 border-cyan-500/20 hover:border-cyan-400/40 transition-all shadow-[0_0_20px_rgba(0,255,255,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl border-2 ${
                      att.status === 'present' ? 'bg-green-500/20 border-green-500/40 shadow-[0_0_15px_rgba(0,255,0,0.3)]' :
                      att.status === 'sick' ? 'bg-yellow-500/20 border-yellow-500/40 shadow-[0_0_15px_rgba(255,255,0,0.3)]' :
                      'bg-red-500/20 border-red-500/40 shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                    }`}>
                      {att.status === 'present' ? '✅' : att.status === 'sick' ? '🤒' : '❌'}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg font-mono">{att.courseTitle}</h4>
                      <p className="text-sm text-cyan-400/60 font-mono">{new Date(att.ts).toLocaleDateString()} • {new Date(att.ts).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-5 py-2.5 rounded-xl font-bold font-mono border-2 ${
                      att.status === 'present' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                      att.status === 'sick' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}>
                      {att.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-cyan-400/60 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 font-mono">
                      {att.method === 'face' ? '📸 FACE ID' : '✍️ MANUAL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Cyber Footer */}
      <footer className="relative border-t border-cyan-500/20 bg-gradient-to-r from-cyan-950/50 to-blue-950/50 backdrop-blur-xl mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-cyan-400/60 text-sm font-mono">
            © 2025 NORTH CHINA UNIVERSITY OF WATER RESOURCES AND ELECTRIC POWER
          </p>
          <p className="text-cyan-500/40 text-xs mt-1 font-mono tracking-wider">NCWU • STUDENT PORTAL SYSTEM • v2.0</p>
        </div>
      </footer>
    </div>
  );
}
