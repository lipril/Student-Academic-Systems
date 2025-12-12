import { useState, useEffect } from 'react';
import { User } from '../App';

const API = 'http://localhost:3000/api';

type Props = {
  user: User;
  onLogout: () => void;
};

type Student = {
  id: string;
  name: string;
  email: string;
  department: string;
  grade?: string;
  enrollmentDate: string;
  graduationDate: string;
  photo?: string;
};

type Teacher = {
  id: string;
  name: string;
  email: string;
  department: string;
  photo?: string;
};

type Course = {
  id: string;
  title: string;
  credit: number;
  teacherId?: string;
  department: string;
  grade?: string;
  semester: string;
};

export default function AdminDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'stats' | 'students' | 'teachers' | 'courses' | 'routines' | 'enrollments'>('stats');
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [newStudent, setNewStudent] = useState({
    id: '', name: '', email: '', department: '', grade: '', enrollmentDate: '', graduationDate: '', password: '', photo: ''
  });

  const [newTeacher, setNewTeacher] = useState({
    id: '', name: '', email: '', department: '', password: '', photo: ''
  });

  const [newCourse, setNewCourse] = useState({
    id: '', title: '', credit: 3, teacherId: '', department: '', grade: '', semester: 'Fall 2025'
  });

  const [newRoutine, setNewRoutine] = useState({
    semester: 'Fall 2025', department: '', grade: '', routinePhoto: ''
  });

  const [showAddEnrollment, setShowAddEnrollment] = useState(false);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState('');
  const [selectedStudentsForEnrollment, setSelectedStudentsForEnrollment] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'students') {
      const res = await fetch(`${API}/admin/students`);
      setStudents(await res.json());
    } else if (activeTab === 'teachers') {
      const res = await fetch(`${API}/admin/teachers`);
      setTeachers(await res.json());
    } else if (activeTab === 'courses') {
      const res = await fetch(`${API}/admin/courses`);
      setCourses(await res.json());
    } else if (activeTab === 'enrollments') {
      const res = await fetch(`${API}/admin/enrollments`);
      setEnrollments(await res.json());
    } else if (activeTab === 'routines') {
      const res = await fetch(`${API}/admin/routines`);
      setRoutines(await res.json());
    } else if (activeTab === 'stats') {
      const res = await fetch(`${API}/admin/stats`);
      setStats(await res.json());
    }
  };

  const handleAddStudent = async () => {
    try {
      const endpoint = editingStudent ? `${API}/admin/students/${editingStudent.id}` : `${API}/admin/students`;
      const method = editingStudent ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent || newStudent),
      });
      
      const result = await response.json();
      if (result.ok) {
        alert(editingStudent ? 'Student updated successfully!' : 'Student added successfully!');
        setShowAddStudent(false);
        setEditingStudent(null);
        setNewStudent({ id: '', name: '', email: '', department: '', grade: '', enrollmentDate: '', graduationDate: '', password: '', photo: '' });
        loadData();
      } else {
        alert('Error: ' + (result.error || 'Failed to save student'));
      }
    } catch (error) {
      alert('Error saving student: ' + error);
      console.error(error);
    }
  };

  const handleAddTeacher = async () => {
    try {
      const endpoint = editingTeacher ? `${API}/admin/teachers/${editingTeacher.id}` : `${API}/admin/teachers`;
      const method = editingTeacher ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTeacher || newTeacher),
      });
      
      const result = await response.json();
      if (result.ok) {
        alert(editingTeacher ? 'Teacher updated successfully!' : 'Teacher added successfully!');
        setShowAddTeacher(false);
        setEditingTeacher(null);
        setNewTeacher({ id: '', name: '', email: '', department: '', password: '', photo: '' });
        loadData();
      } else {
        alert('Error: ' + (result.error || 'Failed to save teacher'));
      }
    } catch (error) {
      alert('Error saving teacher: ' + error);
      console.error(error);
    }
  };

  const handleAddCourse = async () => {
    try {
      const endpoint = editingCourse ? `${API}/admin/courses/${editingCourse.id}` : `${API}/admin/courses`;
      const method = editingCourse ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCourse || newCourse),
      });
      
      const result = await response.json();
      if (result.ok) {
        alert(editingCourse ? 'Course updated successfully!' : 'Course added successfully!');
        setShowAddCourse(false);
        setEditingCourse(null);
        setNewCourse({ id: '', title: '', credit: 3, teacherId: '', department: '', grade: '', semester: 'Fall 2025' });
        loadData();
      } else {
        alert('Error: ' + (result.error || 'Failed to save course'));
      }
    } catch (error) {
      alert('Error saving course: ' + error);
      console.error(error);
    }
  };

  const handleUploadRoutine = async () => {
    try {
      if (!newRoutine.routinePhoto) {
        alert('Please upload a routine photo');
        return;
      }
      
      const response = await fetch(`${API}/admin/routine-photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoutine),
      });
      
      const result = await response.json();
      if (result.ok) {
        alert('Routine uploaded successfully!');
        setShowAddRoutine(false);
        setNewRoutine({ semester: 'Fall 2025', department: '', grade: '', routinePhoto: '' });
      } else {
        alert('Error uploading routine');
      }
    } catch (error) {
      alert('Error uploading routine: ' + error);
      console.error(error);
    }
  };

  const handleAddEnrollment = async () => {
    try {
      if (!selectedCourseForEnrollment || selectedStudentsForEnrollment.length === 0) {
        alert('Please select a course and at least one student');
        return;
      }

      const response = await fetch(`${API}/admin/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourseForEnrollment,
          studentIds: selectedStudentsForEnrollment,
        }),
      });

      const result = await response.json();
      if (result.ok) {
        alert('Students enrolled successfully!');
        setShowAddEnrollment(false);
        setSelectedCourseForEnrollment('');
        setSelectedStudentsForEnrollment([]);
        loadData();
      } else {
        alert('Error: ' + (result.error || 'Failed to enroll students'));
      }
    } catch (error) {
      alert('Error enrolling students: ' + error);
      console.error(error);
    }
  };

  const handleDeleteEnrollment = async (studentId: string, courseId: string) => {
    if (confirm('Are you sure you want to remove this student from the course?')) {
      try {
        await fetch(`${API}/admin/enrollments/${studentId}/${courseId}`, { method: 'DELETE' });
        loadData();
      } catch (error) {
        alert('Error removing enrollment: ' + error);
      }
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await fetch(`${API}/admin/students/${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      await fetch(`${API}/admin/teachers/${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'student' | 'teacher' | 'routine') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'student') {
          if (editingStudent) {
            setEditingStudent({ ...editingStudent, photo: reader.result as string });
          } else {
            setNewStudent({ ...newStudent, photo: reader.result as string });
          }
        } else if (type === 'teacher') {
          if (editingTeacher) {
            setEditingTeacher({ ...editingTeacher, photo: reader.result as string });
          } else {
            setNewTeacher({ ...newTeacher, photo: reader.result as string });
          }
        } else if (type === 'routine') {
          setNewRoutine({ ...newRoutine, routinePhoto: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditStudent = (student: Student) => {
    setEditingStudent({ ...student });
    setShowAddStudent(true);
  };

  const startEditTeacher = (teacher: Teacher) => {
    setEditingTeacher({ ...teacher });
    setShowAddTeacher(true);
  };

  const startEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setShowAddCourse(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900">
      {/* Header with Modern Design */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 border-b-2 border-purple-400/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">NCWU Admin Portal</h1>
                <p className="text-purple-200 text-sm font-medium">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-purple-200 text-xs">System Administrator</p>
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

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-3">
            {[
              { id: 'stats', label: '📊 Dashboard', icon: '📊' },
              { id: 'students', label: '👨‍🎓 Students', icon: '👨‍🎓' },
              { id: 'teachers', label: '👨‍🏫 Teachers', icon: '👨‍🏫' },
              { id: 'courses', label: '📚 Courses', icon: '📚' },
              { id: 'enrollments', label: '🔗 Enrollments', icon: '🔗' },
              { id: 'routines', label: '📅 Routines', icon: '📅' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-lg scale-105'
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
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">System Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all border border-blue-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Total Students</h3>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                    👨‍🎓
                  </div>
                </div>
                <p className="text-6xl font-bold mb-2">{stats.students}</p>
                <p className="text-blue-100">Active enrollments</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all border border-emerald-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Total Teachers</h3>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                    👨‍🏫
                  </div>
                </div>
                <p className="text-6xl font-bold mb-2">{stats.teachers}</p>
                <p className="text-emerald-100">Faculty members</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all border border-purple-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Total Courses</h3>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                    📚
                  </div>
                </div>
                <p className="text-6xl font-bold mb-2">{stats.courses}</p>
                <p className="text-purple-100">Active courses</p>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Student Management</h2>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setNewStudent({ id: '', name: '', email: '', department: '', grade: '', enrollmentDate: '', graduationDate: '', password: '', photo: '' });
                  setShowAddStudent(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                ➕ Add New Student
              </button>
            </div>

            {showAddStudent && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Student ID"
                    value={editingStudent ? editingStudent.id : newStudent.id}
                    onChange={(e) => editingStudent 
                      ? setEditingStudent({ ...editingStudent, id: e.target.value })
                      : setNewStudent({ ...newStudent, id: e.target.value })}
                    disabled={!!editingStudent}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium disabled:opacity-50"
                  />
                  <input
                    placeholder="Full Name"
                    value={editingStudent ? editingStudent.name : newStudent.name}
                    onChange={(e) => editingStudent 
                      ? setEditingStudent({ ...editingStudent, name: e.target.value })
                      : setNewStudent({ ...newStudent, name: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    placeholder="Email"
                    value={editingStudent ? editingStudent.email : newStudent.email}
                    onChange={(e) => editingStudent 
                      ? setEditingStudent({ ...editingStudent, email: e.target.value })
                      : setNewStudent({ ...newStudent, email: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    placeholder="Department"
                    value={editingStudent ? editingStudent.department : newStudent.department}
                    onChange={(e) => editingStudent 
                      ? setEditingStudent({ ...editingStudent, department: e.target.value })
                      : setNewStudent({ ...newStudent, department: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <select
                    value={editingStudent ? editingStudent.grade || '' : newStudent.grade}
                    onChange={(e) => editingStudent 
                      ? setEditingStudent({ ...editingStudent, grade: e.target.value })
                      : setNewStudent({ ...newStudent, grade: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Grade</option>
                    <option value="Freshman" className="text-black">Freshman</option>
                    <option value="Sophomore" className="text-black">Sophomore</option>
                    <option value="Junior" className="text-black">Junior</option>
                    <option value="Senior" className="text-black">Senior</option>
                  </select>
                  <input
                    type="date"
                    placeholder="Enrollment Date"
                    value={editingStudent ? editingStudent.enrollmentDate : newStudent.enrollmentDate}
                    onChange={(e) => editingStudent 
                      ? setEditingStudent({ ...editingStudent, enrollmentDate: e.target.value })
                      : setNewStudent({ ...newStudent, enrollmentDate: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  />
                  <input
                    type="date"
                    placeholder="Graduation Date"
                    value={editingStudent ? editingStudent.graduationDate : newStudent.graduationDate}
                    onChange={(e) => editingStudent 
                      ? setEditingStudent({ ...editingStudent, graduationDate: e.target.value })
                      : setNewStudent({ ...newStudent, graduationDate: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  />
                  {!editingStudent && (
                    <input
                      placeholder="Password"
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                    />
                  )}
                  <div>
                    <label className="block text-white text-sm mb-2 font-medium">Upload Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'student')}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddStudent}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    {editingStudent ? 'Update Student' : 'Save Student'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddStudent(false);
                      setEditingStudent(null);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {students.map((student) => (
                <div key={student.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl border-2 border-blue-300/50 shadow-lg">
                        {student.photo ? <img src={student.photo} className="w-full h-full rounded-2xl object-cover" /> : '👤'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{student.name}</h3>
                        <p className="text-sm text-blue-300 font-medium">{student.id} • {student.department} {student.grade ? `• ${student.grade}` : ''}</p>
                        <p className="text-xs text-white/60">{student.email}</p>
                        <p className="text-xs text-white/60">📅 {student.enrollmentDate} → {student.graduationDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditStudent(student)}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Teacher Management</h2>
              <button
                onClick={() => {
                  setEditingTeacher(null);
                  setNewTeacher({ id: '', name: '', email: '', department: '', password: '', photo: '' });
                  setShowAddTeacher(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                ➕ Add New Teacher
              </button>
            </div>

            {showAddTeacher && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Teacher ID"
                    value={editingTeacher ? editingTeacher.id : newTeacher.id}
                    onChange={(e) => editingTeacher 
                      ? setEditingTeacher({ ...editingTeacher, id: e.target.value })
                      : setNewTeacher({ ...newTeacher, id: e.target.value })}
                    disabled={!!editingTeacher}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium disabled:opacity-50"
                  />
                  <input
                    placeholder="Full Name"
                    value={editingTeacher ? editingTeacher.name : newTeacher.name}
                    onChange={(e) => editingTeacher 
                      ? setEditingTeacher({ ...editingTeacher, name: e.target.value })
                      : setNewTeacher({ ...newTeacher, name: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    placeholder="Email"
                    value={editingTeacher ? editingTeacher.email : newTeacher.email}
                    onChange={(e) => editingTeacher 
                      ? setEditingTeacher({ ...editingTeacher, email: e.target.value })
                      : setNewTeacher({ ...newTeacher, email: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    placeholder="Department"
                    value={editingTeacher ? editingTeacher.department : newTeacher.department}
                    onChange={(e) => editingTeacher 
                      ? setEditingTeacher({ ...editingTeacher, department: e.target.value })
                      : setNewTeacher({ ...newTeacher, department: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  {!editingTeacher && (
                    <input
                      placeholder="Password"
                      type="password"
                      value={newTeacher.password}
                      onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                    />
                  )}
                  <div>
                    <label className="block text-white text-sm mb-2 font-medium">Upload Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'teacher')}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddTeacher}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    {editingTeacher ? 'Update Teacher' : 'Save Teacher'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTeacher(false);
                      setEditingTeacher(null);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center text-3xl border-2 border-emerald-300/50 shadow-lg">
                        {teacher.photo ? <img src={teacher.photo} className="w-full h-full rounded-2xl object-cover" /> : '👨‍🏫'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
                        <p className="text-sm text-emerald-300 font-medium">{teacher.id} • {teacher.department}</p>
                        <p className="text-xs text-white/60">{teacher.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditTeacher(teacher)}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                      >
                        🗑️ Delete
                      </button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Course Management</h2>
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setNewCourse({ id: '', title: '', credit: 3, teacherId: '', department: '', grade: '', semester: 'Fall 2025' });
                  setShowAddCourse(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                ➕ Add New Course
              </button>
            </div>

            {showAddCourse && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Course ID"
                    value={editingCourse ? editingCourse.id : newCourse.id}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, id: e.target.value })
                      : setNewCourse({ ...newCourse, id: e.target.value })}
                    disabled={!!editingCourse}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium disabled:opacity-50"
                  />
                  <input
                    placeholder="Course Title"
                    value={editingCourse ? editingCourse.title : newCourse.title}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, title: e.target.value })
                      : setNewCourse({ ...newCourse, title: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    type="number"
                    placeholder="Credits"
                    value={editingCourse ? editingCourse.credit : newCourse.credit}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, credit: Number(e.target.value) })
                      : setNewCourse({ ...newCourse, credit: Number(e.target.value) })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <select
                    value={editingCourse ? editingCourse.teacherId || '' : newCourse.teacherId}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, teacherId: e.target.value })
                      : setNewCourse({ ...newCourse, teacherId: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id} className="text-black">{t.name} ({t.id})</option>
                    ))}
                  </select>
                  <input
                    placeholder="Department"
                    value={editingCourse ? editingCourse.department : newCourse.department}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, department: e.target.value })
                      : setNewCourse({ ...newCourse, department: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <select
                    value={editingCourse ? editingCourse.grade || '' : newCourse.grade}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, grade: e.target.value })
                      : setNewCourse({ ...newCourse, grade: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Grade</option>
                    <option value="Freshman" className="text-black">Freshman</option>
                    <option value="Sophomore" className="text-black">Sophomore</option>
                    <option value="Junior" className="text-black">Junior</option>
                    <option value="Senior" className="text-black">Senior</option>
                  </select>
                  <input
                    placeholder="Semester (e.g., Fall 2025)"
                    value={editingCourse ? editingCourse.semester : newCourse.semester}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, semester: e.target.value })
                      : setNewCourse({ ...newCourse, semester: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddCourse}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    {editingCourse ? 'Update Course' : 'Save Course'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCourse(false);
                      setEditingCourse(null);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl border-2 border-purple-300/50 shadow-lg">
                        📚
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{course.title}</h3>
                        <p className="text-sm text-purple-300 font-medium">
                          {course.id} • {course.department} {course.grade ? `• ${course.grade}` : ''} • {course.semester}
                        </p>
                        <p className="text-xs text-white/60">Credits: {course.credit} {course.teacherId ? `• Teacher: ${course.teacherId}` : ''}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startEditCourse(course)}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg transition-all"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Student Enrollment Management</h2>
              <button
                onClick={() => setShowAddEnrollment(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                ➕ Enroll Students
              </button>
            </div>

            {showAddEnrollment && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Enroll Students in Course</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={selectedCourseForEnrollment}
                    onChange={(e) => setSelectedCourseForEnrollment(e.target.value)}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id} className="text-black">
                        {course.title} ({course.id}) - {course.department}
                      </option>
                    ))}
                  </select>
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm mb-2 font-medium">Select Students to Enroll</label>
                    <div className="max-h-40 overflow-y-auto bg-white/10 rounded-xl p-3 border border-white/20">
                      {students.map((student) => (
                        <label key={student.id} className="flex items-center gap-3 text-white mb-2 cursor-pointer hover:bg-white/10 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedStudentsForEnrollment.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentsForEnrollment([...selectedStudentsForEnrollment, student.id]);
                              } else {
                                setSelectedStudentsForEnrollment(selectedStudentsForEnrollment.filter(id => id !== student.id));
                              }
                            }}
                            className="w-4 h-4 text-cyan-500 bg-white/20 border-white/30 rounded focus:ring-cyan-400"
                          />
                          <span className="font-medium">{student.name} ({student.id})</span>
                          <span className="text-sm text-white/60">• {student.department} {student.grade && `• ${student.grade}`}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddEnrollment}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Enroll Selected Students
                  </button>
                  <button
                    onClick={() => {
                      setShowAddEnrollment(false);
                      setSelectedCourseForEnrollment('');
                      setSelectedStudentsForEnrollment([]);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {enrollments.map((enrollment) => (
                <div key={`${enrollment.studentId}-${enrollment.courseId}`} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center text-2xl border-2 border-green-300/50 shadow-lg">
                        🔗
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{enrollment.studentName}</h3>
                        <p className="text-sm text-green-300 font-medium">
                          📚 {enrollment.courseTitle} ({enrollment.courseId})
                        </p>
                        <p className="text-xs text-white/60">
                          👨‍🏫 {enrollment.teacherName} • Status: {enrollment.status}
                        </p>
                        <p className="text-xs text-white/60">📅 Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteEnrollment(enrollment.studentId, enrollment.courseId)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {enrollments.length === 0 && (
                <div className="text-center py-12 text-white/60">
                  <div className="text-6xl mb-4">🔗</div>
                  <p className="text-xl font-medium">No enrollments found</p>
                  <p className="text-sm mt-2">Start by enrolling students in courses</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Routines Tab */}
        {activeTab === 'routines' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Class Routine Management</h2>
              <button
                onClick={() => setShowAddRoutine(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                ➕ Upload Routine Photo
              </button>
            </div>

            {showAddRoutine && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Upload Semester Routine</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Semester (e.g., Fall 2025)"
                    value={newRoutine.semester}
                    onChange={(e) => setNewRoutine({ ...newRoutine, semester: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <input
                    placeholder="Department"
                    value={newRoutine.department}
                    onChange={(e) => setNewRoutine({ ...newRoutine, department: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 font-medium"
                  />
                  <select
                    value={newRoutine.grade}
                    onChange={(e) => setNewRoutine({ ...newRoutine, grade: e.target.value })}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium"
                  >
                    <option value="" className="text-black">Select Grade</option>
                    <option value="Freshman" className="text-black">Freshman</option>
                    <option value="Sophomore" className="text-black">Sophomore</option>
                    <option value="Junior" className="text-black">Junior</option>
                    <option value="Senior" className="text-black">Senior</option>
                  </select>
                  <div>
                    <label className="block text-white text-sm mb-2 font-medium">Upload Routine Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'routine')}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUploadRoutine}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Upload Routine
                  </button>
                  <button
                    onClick={() => setShowAddRoutine(false)}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Display Uploaded Routines */}
            <div className="grid gap-4 mt-6">
              {routines.length > 0 ? (
                routines.map((routine) => (
                  <div key={routine.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{routine.semester}</h3>
                        <p className="text-sm text-cyan-300 font-medium">
                          {routine.department} {routine.grade ? `• ${routine.grade}` : ''}
                        </p>
                      </div>
                    </div>
                    {routine.routinePhoto && (
                      <img 
                        src={routine.routinePhoto} 
                        alt="Class Routine" 
                        className="w-full rounded-xl border-2 border-white/20 shadow-lg"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-white/60 text-lg">No routines uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
