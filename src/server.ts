import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { db, runAsync, getAsync, allAsync } from './db';
import { initDB } from './init';


const app = express();
const upload = multer({ dest: 'uploads/' });

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// ============ AUTH ENDPOINTS ============

app.post('/api/login', async (req, res) => {
  const { id, password, role } = req.body as { id: string; password: string; role: 'admin' | 'teacher' | 'student' };
  
  let row: any;
  if (role === 'admin') {
    row = await getAsync.call(db, 'SELECT * FROM users WHERE id=? AND passwordHash=? AND role=?', id, `password:${password}`, 'admin');
  } else if (role === 'teacher') {
    row = await getAsync.call(db, 'SELECT * FROM teachers WHERE id=? AND passwordHash=?', id, `password:${password}`);
  } else {
    row = await getAsync.call(db, 'SELECT * FROM students WHERE id=? AND passwordHash=?', id, `password:${password}`);
  }
  
  if (row) return res.json({ ok: true, user: { id: row.id, name: row.name, role } });
  return res.status(401).json({ ok: false });
});

// ============ ADMIN ENDPOINTS ============

app.get('/api/admin/students', async (req, res) => {
  const students = await allAsync.call(db, 'SELECT * FROM students ORDER BY createdAt DESC');
  res.json(students);
});

app.post('/api/admin/students', async (req, res) => {
  const { id, name, email, department, grade, enrollmentDate, graduationDate, password, photo } = req.body;
  try {
    await runAsync.call(db, 
      'INSERT INTO students(id,name,email,department,grade,enrollmentDate,graduationDate,passwordHash,photo,webauthnId,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      id, name, email, department, grade || null, enrollmentDate, graduationDate, `password:${password}`, photo || null, null, new Date().toISOString()
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

app.put('/api/admin/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, department, grade, enrollmentDate, graduationDate, photo } = req.body;
  try {
    await runAsync.call(db, 
      'UPDATE students SET name=?, email=?, department=?, grade=?, enrollmentDate=?, graduationDate=?, photo=? WHERE id=?',
      name, email, department, grade || null, enrollmentDate, graduationDate, photo || null, id
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

app.delete('/api/admin/students/:id', async (req, res) => {
  const { id } = req.params;
  await runAsync.call(db, 'DELETE FROM students WHERE id=?', id);
  res.json({ ok: true });
});

app.get('/api/admin/teachers', async (req, res) => {
  const teachers = await allAsync.call(db, 'SELECT * FROM teachers ORDER BY createdAt DESC');
  res.json(teachers);
});

app.post('/api/admin/teachers', async (req, res) => {
  const { id, name, email, department, password, photo } = req.body;
  try {
    await runAsync.call(db, 
      'INSERT INTO teachers(id,name,email,department,passwordHash,photo,createdAt) VALUES (?,?,?,?,?,?,?)',
      id, name, email, department, `password:${password}`, photo || null, new Date().toISOString()
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

app.put('/api/admin/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, department, photo } = req.body;
  try {
    await runAsync.call(db, 
      'UPDATE teachers SET name=?, email=?, department=?, photo=? WHERE id=?',
      name, email, department, photo || null, id
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

app.delete('/api/admin/teachers/:id', async (req, res) => {
  const { id } = req.params;
  await runAsync.call(db, 'DELETE FROM teachers WHERE id=?', id);
  res.json({ ok: true });
});

app.post('/api/admin/routine-photo', async (req, res) => {
  try {
    const { semester, department, grade, routinePhoto } = req.body;
    console.log('Uploading routine:', { semester, department, grade, photoSize: routinePhoto?.length });
    
    await runAsync.call(db, 
      'INSERT INTO semesterRoutines(semester,department,grade,routinePhoto,uploadedAt) VALUES (?,?,?,?,?)',
      semester, department, grade || null, routinePhoto, new Date().toISOString()
    );
    console.log('Routine uploaded successfully');
    res.json({ ok: true });
  } catch (e) {
    console.error('Error uploading routine:', e);
    res.status(500).json({ ok: false, error: (e as Error).message });
  }
});

app.get('/api/admin/routines', async (req, res) => {
  const routines = await allAsync.call(db, 'SELECT * FROM semesterRoutines ORDER BY uploadedAt DESC');
  res.json(routines);
});

app.get('/api/admin/courses', async (req, res) => {
  const courses = await allAsync.call(db, 'SELECT * FROM courses ORDER BY title');
  res.json(courses);
});

app.post('/api/admin/courses', async (req, res) => {
  const { id, title, credit, teacherId, department, grade, semester } = req.body;
  try {
    await runAsync.call(db, 
      'INSERT INTO courses(id,title,credit,teacherId,department,grade,semester) VALUES (?,?,?,?,?,?,?)',
      id, title, credit, teacherId || null, department, grade || null, semester
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

app.put('/api/admin/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, credit, teacherId, department, grade, semester } = req.body;
  try {
    await runAsync.call(db, 
      'UPDATE courses SET title=?, credit=?, teacherId=?, department=?, grade=?, semester=? WHERE id=?',
      title, credit, teacherId || null, department, grade || null, semester, id
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

// ============ ENROLLMENT ENDPOINTS ============

app.get('/api/admin/enrollments', async (req, res) => {
  const enrollments = await allAsync.call(db, 
    `SELECT e.*, s.name as studentName, c.title as courseTitle, t.name as teacherName 
     FROM enrollments e 
     JOIN students s ON e.studentId = s.id 
     JOIN courses c ON e.courseId = c.id 
     JOIN teachers t ON c.teacherId = t.id 
     ORDER BY e.createdAt DESC`
  );
  res.json(enrollments);
});

app.get('/api/admin/enrollments/course/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const enrollments = await allAsync.call(db, 
    `SELECT e.*, s.name as studentName, s.email, s.grade 
     FROM enrollments e 
     JOIN students s ON e.studentId = s.id 
     WHERE e.courseId=? AND e.status='active' 
     ORDER BY s.name`,
    courseId
  );
  res.json(enrollments);
});

app.post('/api/admin/enrollments', async (req, res) => {
  try {
    const { studentIds, courseId } = req.body;
    
    if (!Array.isArray(studentIds) || studentIds.length === 0 || !courseId) {
      return res.status(400).json({ ok: false, error: 'Student IDs array and courseId are required' });
    }

    // Check if course exists
    const course = await getAsync.call(db, 'SELECT * FROM courses WHERE id=?', courseId);
    if (!course) {
      return res.status(404).json({ ok: false, error: 'Course not found' });
    }

    // Insert enrollments
    for (const studentId of studentIds) {
      // Check if student exists
      const student = await getAsync.call(db, 'SELECT * FROM students WHERE id=?', studentId);
      if (!student) {
        continue; // Skip invalid student IDs
      }

      // Check if already enrolled
      const existing = await getAsync.call(db, 
        'SELECT * FROM enrollments WHERE studentId=? AND courseId=?', 
        studentId, courseId
      );

      if (!existing) {
        await runAsync.call(db, 
          'INSERT INTO enrollments(studentId, courseId, status, createdAt) VALUES (?,?,?,?)',
          studentId, courseId, 'active', new Date().toISOString()
        );
      }
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

app.delete('/api/admin/enrollments/:studentId/:courseId', async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    const result = await runAsync.call(db, 
      'DELETE FROM enrollments WHERE studentId=? AND courseId=?',
      studentId, courseId
    );

    res.json({ ok: true, deleted: result.changes > 0 });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  const studentCount = await getAsync.call(db, 'SELECT COUNT(*) as c FROM students') as any;
  const teacherCount = await getAsync.call(db, 'SELECT COUNT(*) as c FROM teachers') as any;
  const courseCount = await getAsync.call(db, 'SELECT COUNT(*) as c FROM courses') as any;
  res.json({ 
    students: studentCount.c, 
    teachers: teacherCount.c, 
    courses: courseCount.c 
  });
});

// ============ TEACHER ENDPOINTS ============

app.get('/api/teacher/courses/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  const courses = await allAsync.call(db, 'SELECT * FROM courses WHERE teacherId=?', teacherId);
  res.json(courses);
});

app.get('/api/teacher/students/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const students = await allAsync.call(db, 
    `SELECT s.* FROM students s 
     JOIN enrollments e ON s.id = e.studentId 
     WHERE e.courseId=? AND e.status='active'`, 
    courseId
  );
  res.json(students);
});

app.get('/api/teacher/attendance/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const attendance = await allAsync.call(db, 
    'SELECT a.*, s.name as studentName FROM attendance a JOIN students s ON a.studentId=s.id WHERE a.courseId=? ORDER BY a.ts DESC', 
    courseId
  );
  res.json(attendance);
});

app.post('/api/teacher/attendance', async (req, res) => {
  const { studentId, courseId, date, status, method, markedBy } = req.body;
  await runAsync.call(db, 
    'INSERT INTO attendance(studentId,courseId,date,status,method,markedBy,ts) VALUES (?,?,?,?,?,?,?)',
    studentId, courseId, date, status, method, markedBy, new Date().toISOString()
  );
  res.json({ ok: true });
});

// Face recognition endpoint removed - attendance now only supports manual marking

app.post('/api/teacher/marks', async (req, res) => {
  const { studentId, courseId, examType, marks, totalMarks, periodLabel } = req.body;
  
  // Calculate GPA and grade
  const percentage = (marks / totalMarks) * 100;
  let gpa = 0, grade = 'F';
  if (percentage >= 90) { gpa = 4.0; grade = 'A+'; }
  else if (percentage >= 85) { gpa = 3.7; grade = 'A'; }
  else if (percentage >= 80) { gpa = 3.3; grade = 'A-'; }
  else if (percentage >= 75) { gpa = 3.0; grade = 'B+'; }
  else if (percentage >= 70) { gpa = 2.7; grade = 'B'; }
  else if (percentage >= 65) { gpa = 2.3; grade = 'B-'; }
  else if (percentage >= 60) { gpa = 2.0; grade = 'C+'; }
  else if (percentage >= 55) { gpa = 1.7; grade = 'C'; }
  else if (percentage >= 50) { gpa = 1.0; grade = 'D'; }
  
  await runAsync.call(db, 
    'INSERT INTO results(studentId,courseId,periodType,periodLabel,examType,marks,totalMarks,gpa,grade,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
    studentId, courseId, 'semester', periodLabel, examType, marks, totalMarks, gpa, grade, new Date().toISOString()
  );
  res.json({ ok: true });
});

app.get('/api/teacher/results/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const results = await allAsync.call(db, 
    'SELECT r.*, s.name as studentName FROM results r JOIN students s ON r.studentId=s.id WHERE r.courseId=? ORDER BY r.createdAt DESC', 
    courseId
  );
  res.json(results);
});

app.get('/api/teacher/assignments/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  const assignments = await allAsync.call(db, 
    `SELECT a.*, c.title as courseTitle, c.grade FROM assignments a 
     JOIN courses c ON a.courseId=c.id 
     WHERE c.teacherId=? ORDER BY a.createdAt DESC`, 
    teacherId
  );
  res.json(assignments);
});

app.post('/api/teacher/assignments', async (req, res) => {
  const { courseId, title, description, dueDate, totalMarks, createdBy } = req.body;
  try {
    await runAsync.call(db, 
      'INSERT INTO assignments(courseId,title,description,dueDate,totalMarks,createdBy,createdAt) VALUES (?,?,?,?,?,?,?)',
      courseId, title, description || '', dueDate, totalMarks, createdBy, new Date().toISOString()
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

app.get('/api/teacher/students-by-grade/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  const { grade } = req.query;
  
  let query = `SELECT DISTINCT s.* FROM students s 
               JOIN enrollments e ON s.id = e.studentId 
               JOIN courses c ON e.courseId = c.id 
               WHERE c.teacherId=? AND e.status='active'`;
  
  const params: any[] = [teacherId];
  if (grade) {
    query += ' AND s.grade=?';
    params.push(grade);
  }
  
  const students = await allAsync.call(db, query, ...params);
  res.json(students);
});

// ============ STUDENT ENDPOINTS ============

app.get('/api/student/dashboard/:id', async (req, res) => {
  const id = req.params.id;
  
  const student = await getAsync.call(db, 'SELECT * FROM students WHERE id=?', id);
  const results = await allAsync.call(db, 
    `SELECT r.*, c.title as courseTitle FROM results r 
     JOIN courses c ON r.courseId=c.id 
     WHERE r.studentId=? ORDER BY r.createdAt DESC`, 
    id
  );
  const courses = await allAsync.call(db, 
    `SELECT c.*, t.name as teacherName FROM courses c 
     JOIN teachers t ON c.teacherId=t.id
     JOIN enrollments e ON c.id=e.courseId 
     WHERE e.studentId=? AND e.status='active'`, 
    id
  );
  const routine = await allAsync.call(db, 
    `SELECT r.*, c.title, c.id as courseId FROM routine r 
     JOIN courses c ON r.courseId=c.id
     JOIN enrollments e ON c.id=e.courseId
     WHERE e.studentId=? AND e.status='active'`, 
    id
  );
  const semesterRoutines = await allAsync.call(db,
    `SELECT * FROM semesterRoutines WHERE department=? OR grade=? ORDER BY uploadedAt DESC`,
    (student as any).department, (student as any).grade
  );
  const assignments = await allAsync.call(db, 
    `SELECT a.*, c.title AS courseTitle FROM assignments a 
     JOIN courses c ON a.courseId=c.id
     JOIN enrollments e ON c.id=e.courseId
     WHERE e.studentId=? AND e.status='active' ORDER BY a.dueDate`, 
    id
  );
  const attendance = await allAsync.call(db, 
    `SELECT a.*, c.title as courseTitle FROM attendance a 
     JOIN courses c ON a.courseId=c.id 
     WHERE a.studentId=? ORDER BY a.ts DESC LIMIT 10`, 
    id
  );
  
  res.json({ student, results, courses, routine, semesterRoutines, assignments, attendance });
});

app.get('/api/webauthn/register/start', async (req, res) => {
  const studentId = String(req.query.studentId || '');
  if (!studentId) return res.status(400).json({ error: 'studentId required' });
  const opts = startRegister(studentId);
  res.json(opts);
});

app.post('/api/webauthn/register/finish', async (req, res) => {
  const { studentId, cred } = req.body as any;
  try {
    await finishRegister(studentId, cred);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as Error).message });
  }
});

app.get('/api/webauthn/auth/start', (req, res) => {
  const studentId = String(req.query.studentId || '');
  if (!studentId) return res.status(400).json({ error: 'studentId required' });
  const opts = startAuth(studentId);
  res.json(opts);
});

app.post('/api/webauthn/auth/finish', async (req, res) => {
  const { studentId, cred } = req.body as any;
  try {
    await finishAuth(studentId, cred);
    res.json({ ok: true });
  } catch (e) {
    res.status(401).json({ ok: false, error: (e as Error).message });
  }
});

// Enhanced database initialization with retry logic
async function initializeServer() {
  try {
    console.log('🔧 Initializing database...');
    await initDB();
    console.log('✅ Database initialized successfully');
    
    // Test database connection
    await getAsync.call(db, 'SELECT 1');
    console.log('✅ Database connection verified');
    
    // Start server with error handling
    const server = app.listen(3000, () => {
      console.log('🚀 North China University System API running at http://localhost:3000');
      console.log('📊 Server ready for connections');
    });
    
    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error('❌ Port 3000 already in use. Please stop other instances.');
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🔄 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.log('🔄 Retrying in 3 seconds...');
    setTimeout(initializeServer, 3000);
  }
}

// Start the server
initializeServer();
