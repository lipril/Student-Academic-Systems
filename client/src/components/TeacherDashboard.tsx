import { useState, useEffect } from 'react';
import { User } from '../App';

const API = 'http://localhost:3000/api';

type Props = {
  user: User;
  onLogout: () => void;
};

type Course = {
  id: string;
  title: string;
  credit: number;
  department: string;
  grade?: string;
  semester: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  department: string;
  grade?: string;
  photo?: string;
};

type Attendance = {
  id: number;
  studentId: string;
  studentName: string;
  date: string;
  status: string;
  method: string;
  ts: string;
};

type Assignment = {
  id: number;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  courseTitle?: string;
  grade?: string;
};

type Result = {
  id: number;
  studentId: string;
  studentName: string;
  examType: string;
  marks: number;
  totalMarks: number;
  grade: string;
  gpa: number;
};

export default function TeacherDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'courses' | 'attendance' | 'marks' | 'assignments'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showAddMarks, setShowAddMarks] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);

  const [newMark, setNewMark] = useState({
    studentId: '', examType: '', marks: 0, totalMarks: 100, periodLabel: 'Fall 2025'
  });

  const [newAttendance, setNewAttendance] = useState({
    studentId: '', date: new Date().toISOString().split('T')[0], status: 'present'
  });

  const [newAssignment, setNewAssignment] = useState({
    courseId: '', title: '', description: '', dueDate: '', totalMarks: 100
  });

  useEffect(() => {
    loadCourses();
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseData();
    }
  }, [selectedCourse, selectedGrade, activeTab]);

  const loadCourses = async () => {
    const res = await fetch(`${API}/teacher/courses/${user.id}`);
    const data = await res.json();
    setCourses(data);
    if (data.length > 0) setSelectedCourse(data[0].id);
  };

  const loadAssignments = async () => {
    const res = await fetch(`${API}/teacher/assignments/${user.id}`);
    setAssignments(await res.json());
  };

  const loadCourseData = async () => {
    if (activeTab === 'courses' || activeTab === 'marks') {
      const res = await fetch(`${API}/teacher/students/${selectedCourse}`);
      let studentData = await res.json();
      
      if (selectedGrade) {
        studentData = studentData.filter((s: Student) => s.grade === selectedGrade);
      }
      
      setStudents(studentData);
      
      if (activeTab === 'marks') {
        const resRes = await fetch(`${API}/teacher/results/${selectedCourse}`);
        setResults(await resRes.json());
      }
    } else if (activeTab === 'attendance') {
      const res = await fetch(`${API}/teacher/attendance/${selectedCourse}`);
      setAttendance(await res.json());
      
      const stuRes = await fetch(`${API}/teacher/students/${selectedCourse}`);
      let studentData = await stuRes.json();
      
      if (selectedGrade) {
        studentData = studentData.filter((s: Student) => s.grade === selectedGrade);
      }
      
      setStudents(studentData);
    }
  };

  const handleAddMarks = async () => {
    await fetch(`${API}/teacher/marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newMark,
        courseId: selectedCourse,
      }),
    });
    setShowAddMarks(false);
    setNewMark({ studentId: '', examType: '', marks: 0, totalMarks: 100, periodLabel: 'Fall 2025' });
    loadCourseData();
  };

  const handleMarkAttendance = async () => {
    await fetch(`${API}/teacher/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newAttendance,
        courseId: selectedCourse,
        method: 'manual',
        markedBy: user.id,
      }),
    });
    setShowMarkAttendance(false);
    setNewAttendance({ studentId: '', date: new Date().toISOString().split('T')[0], status: 'present' });
    loadCourseData();
  };

  const handleAddAssignment = async () => {
    await fetch(`${API}/teacher/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newAssignment,
        courseId: selectedCourse,
        createdBy: user.id,
      }),
    });
    setShowAddAssignment(false);
    setNewAssignment({ courseId: '', title: '', description: '', dueDate: '', totalMarks: 100 });
    loadAssignments();
  };

  const handleFaceAttendance = async () => {
    alert('📸 Face recognition feature: In production, this would activate camera and scan student faces using face-api.js or similar library');
  };

  const currentCourse = courses.find(c => c.id === selectedCourse);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950">
      {/* Professional Header */}
      <header className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 shadow-2xl sticky top-0 z-50 border-b-2 border-teal-400/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">NCWU Faculty Portal</h1>
                <p className="text-emerald-100 text-sm font-medium">Teacher Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-emerald-200 text-xs">Faculty Member</p>
              </div>
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all font-medium border border-white/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Course & Grade Selector */}
      <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-sm border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-white font-semibold">Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-white font-medium backdrop-blur-lg"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id} className="text-black">
                  {course.title} ({course.id}) {course.grade ? `- ${course.grade}` : ''}
                </option>
              ))}
            </select>
            
            <label className="text-white font-semibold ml-6">Filter by Grade:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-white font-medium backdrop-blur-lg"
            >
              <option value="" className="text-black">All Grades</option>
              <option value="Freshman" className="text-black">Freshman</option>
              <option value="Sophomore" className="text-black">Sophomore</option>
              <option value="Junior" className="text-black">Junior</option>
              <option value="Senior" className="text-black">Senior</option>
            </select>

            {currentCourse && (
              <div className="ml-auto flex items-center gap-4 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                <span className="text-white/80 text-sm">Credits: <span className="font-bold text-white">{currentCourse.credit}</span></span>
                <span className="text-white/80 text-sm">•</span>
                <span className="text-white/80 text-sm">Semester: <span className="font-bold text-white">{currentCourse.semester}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-3">
            {[
              { id: 'courses', label: '📚 Students', icon: '📚' },
              { id: 'attendance', label: '✅ Attendance', icon: '✅' },
              { id: 'marks', label: '📊 Marks & GPA', icon: '📊' },
              { id: 'assignments', label: '📝 Assignments', icon: '📝' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-600 shadow-lg scale-105'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Students Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">
                Enrolled Students {selectedGrade && `(${selectedGrade})`}
              </h2>
              <div className="px-4 py-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                <span className="text-white font-semibold">{students.length} Students</span>
              </div>
            </div>
            
            <div className="grid gap-4">
              {students.map((student) => (
                <div key={student.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl border-2 border-cyan-300/50 shadow-lg">
                      {student.photo ? <img src={student.photo} className="w-full h-full rounded-2xl object-cover" /> : '👤'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{student.name}</h3>
                      <p className="text-sm text-cyan-300 font-medium">
                        {student.id} • {student.department} {student.grade ? `• ${student.grade}` : ''}
                      </p>
                      <p className="text-xs text-white/60">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30">
                        📚 Enrolled Student
                      </span>
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
              <h2 className="text-3xl font-bold text-white">Attendance Management</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleFaceAttendance}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
                >
                  📸 Mark by Face ID
                </button>
                <button
                  onClick={() => setShowMarkAttendance(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
                >
                  ➕ Mark Attendance
                </button>
              </div>
            </div>

            {showMarkAttendance && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Mark Student Attendance</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    value={newAttendance.studentId}
                    onChange={(e) => setNewAttendance({ ...newAttendance, studentId: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id} className="text-black">{s.name} ({s.id})</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newAttendance.date}
                    onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  />
                  <select
                    value={newAttendance.status}
                    onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="present" className="text-black">✅ Present</option>
                    <option value="absent" className="text-black">❌ Absent</option>
                    <option value="sick" className="text-black">🤒 Sick Leave</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleMarkAttendance}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Save Attendance
                  </button>
                  <button
                    onClick={() => setShowMarkAttendance(false)}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Recent Attendance Records</h3>
              <div className="space-y-3">
                {attendance.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all">
                    <div>
                      <span className="text-white font-semibold text-lg">{att.studentName}</span>
                      <span className="text-sm text-white/60 ml-3">📅 {att.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                        att.status === 'present' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        att.status === 'sick' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {att.status === 'present' ? '✅ Present' : att.status === 'sick' ? '🤒 Sick Leave' : '❌ Absent'}
                      </span>
                      <span className="text-xs text-white/60 px-3 py-1 bg-white/10 rounded-lg">
                        {att.method === 'face' ? '📸 Face ID' : '✍️ Manual'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Marks Tab */}
        {activeTab === 'marks' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Marks & GPA Management</h2>
              <button
                onClick={() => setShowAddMarks(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                ➕ Add Exam Marks
              </button>
            </div>

            {showAddMarks && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Add Student Marks</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={newMark.studentId}
                    onChange={(e) => setNewMark({ ...newMark, studentId: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id} className="text-black">{s.name} ({s.id})</option>
                    ))}
                  </select>
                  <input
                    placeholder="Exam Type (e.g., Midterm, Final)"
                    value={newMark.examType}
                    onChange={(e) => setNewMark({ ...newMark, examType: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    type="number"
                    placeholder="Marks Obtained"
                    value={newMark.marks}
                    onChange={(e) => setNewMark({ ...newMark, marks: Number(e.target.value) })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    type="number"
                    placeholder="Total Marks"
                    value={newMark.totalMarks}
                    onChange={(e) => setNewMark({ ...newMark, totalMarks: Number(e.target.value) })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddMarks}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Save Marks
                  </button>
                  <button
                    onClick={() => setShowAddMarks(false)}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {students.map((student) => {
                const studentResults = results.filter(r => r.studentId === student.id);
                const avgGPA = studentResults.length > 0
                  ? (studentResults.reduce((acc, r) => acc + r.gpa, 0) / studentResults.length).toFixed(2)
                  : 'N/A';
                
                return (
                  <div key={student.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center text-2xl border-2 border-orange-300/50 shadow-lg">
                          {student.photo ? <img src={student.photo} className="w-full h-full rounded-2xl object-cover" /> : '👤'}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{student.name}</h3>
                          <p className="text-sm text-white/60">{student.id} • {student.grade || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60">Course GPA</p>
                        <p className="text-3xl font-bold text-yellow-300">{avgGPA}</p>
                      </div>
                    </div>
                    {studentResults.length > 0 && (
                      <div className="space-y-2">
                        {studentResults.map((result) => (
                          <div key={result.id} className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10">
                            <span className="text-white font-medium">{result.examType}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-white">{result.marks}/{result.totalMarks}</span>
                              <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                                result.grade.startsWith('A') ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                result.grade.startsWith('B') ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                result.grade.startsWith('C') ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                'bg-red-500/20 text-red-300 border-red-500/30'
                              }`}>
                                {result.grade}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Assignment Management</h2>
              <button
                onClick={() => setShowAddAssignment(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                ➕ Create Assignment
              </button>
            </div>

            {showAddAssignment && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Create New Assignment</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Assignment Title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  />
                  <input
                    type="number"
                    placeholder="Total Marks"
                    value={newAssignment.totalMarks}
                    onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: Number(e.target.value) })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <select
                    value={newAssignment.courseId || selectedCourse}
                    onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="text-black">{c.title} ({c.id})</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Assignment Description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium md:col-span-2 h-24"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddAssignment}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Create Assignment
                  </button>
                  <button
                    onClick={() => setShowAddAssignment(false)}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl border-2 border-purple-300/50">
                          📝
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{assignment.title}</h3>
                          <p className="text-sm text-purple-300 font-medium">
                            {assignment.courseTitle} {assignment.grade ? `• ${assignment.grade}` : ''}
                          </p>
                        </div>
                      </div>
                      {assignment.description && (
                        <p className="text-white/80 mt-3 mb-3 pl-15">{assignment.description}</p>
                      )}
                      <div className="flex items-center gap-6 mt-3 pl-15">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📅</span>
                          <div>
                            <p className="text-xs text-white/60">Due Date</p>
                            <p className="text-white font-semibold">{assignment.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎯</span>
                          <div>
                            <p className="text-xs text-white/60">Total Marks</p>
                            <p className="text-white font-semibold">{assignment.totalMarks}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-violet-500/20 rounded-xl border border-violet-400/30">
                      <p className="text-xs text-violet-200">Status</p>
                      <p className="text-white font-semibold">Active</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
