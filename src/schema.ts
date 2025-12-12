export const schema = `
CREATE TABLE IF NOT EXISTS users(
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  passwordHash TEXT,
  role TEXT,
  photo TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS students(
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  department TEXT,
  grade TEXT,
  enrollmentDate TEXT,
  graduationDate TEXT,
  passwordHash TEXT,
  photo TEXT,
  webauthnId TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS teachers(
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  department TEXT,
  passwordHash TEXT,
  photo TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS courses(
  id TEXT PRIMARY KEY,
  title TEXT,
  credit REAL,
  teacherId TEXT,
  department TEXT,
  grade TEXT,
  semester TEXT
);
CREATE TABLE IF NOT EXISTS results(
  id INTEGER PRIMARY KEY,
  studentId TEXT,
  courseId TEXT,
  periodType TEXT,
  periodLabel TEXT,
  examType TEXT,
  marks REAL,
  totalMarks REAL,
  gpa REAL,
  grade TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS enrollments(
  id INTEGER PRIMARY KEY,
  studentId TEXT,
  courseId TEXT,
  status TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS routine(
  id INTEGER PRIMARY KEY,
  courseId TEXT,
  day TEXT,
  time TEXT,
  room TEXT,
  routinePhoto TEXT
);
CREATE TABLE IF NOT EXISTS attendance(
  id INTEGER PRIMARY KEY,
  studentId TEXT,
  courseId TEXT,
  date TEXT,
  status TEXT,
  method TEXT,
  markedBy TEXT,
  ts TEXT
);
CREATE TABLE IF NOT EXISTS assignments(
  id INTEGER PRIMARY KEY,
  courseId TEXT,
  title TEXT,
  description TEXT,
  dueDate TEXT,
  totalMarks REAL,
  createdBy TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS submissions(
  id INTEGER PRIMARY KEY,
  studentId TEXT,
  assignmentId INTEGER,
  status TEXT,
  marks REAL,
  submittedAt TEXT
);
CREATE TABLE IF NOT EXISTS semesterRoutines(
  id INTEGER PRIMARY KEY,
  semester TEXT,
  department TEXT,
  grade TEXT,
  routinePhoto TEXT,
  uploadedAt TEXT
);
CREATE TABLE IF NOT EXISTS teacherCourses(
  id INTEGER PRIMARY KEY,
  teacherId TEXT,
  courseId TEXT,
  grade TEXT,
  semester TEXT,
  assignedAt TEXT
);
`;
