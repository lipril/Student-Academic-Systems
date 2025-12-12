import { db, runAsync, getAsync } from './db';
import { schema } from './schema';

// Initialize schema
export async function initDB() {
  // Execute each CREATE TABLE statement separately
  const statements = schema.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    if (stmt.trim()) {
      await runAsync.call(db, stmt);
    }
  }

  // Seed demo data if not present
  const hasStudent = await getAsync.call(db, 'SELECT COUNT(*) as c FROM students WHERE id = ?', 'S12345') as any;
  if (!hasStudent || hasStudent.c === 0) {
    // Create admin user
    await runAsync.call(db, 'INSERT OR IGNORE INTO users(id,name,email,passwordHash,role,createdAt) VALUES (?,?,?,?,?,?)', 
      'admin', 'System Administrator', 'admin@ncwu.edu.cn', 'password:admin123', 'admin', new Date().toISOString());

    // Create demo teacher
    await runAsync.call(db, 'INSERT OR IGNORE INTO teachers(id,name,email,department,passwordHash,createdAt) VALUES (?,?,?,?,?,?)', 
      'T001', 'Dr. Ada Lovelace', 'ada@ncwu.edu.cn', 'Computer Science', 'password:teacher123', new Date().toISOString());
    
    await runAsync.call(db, 'INSERT OR IGNORE INTO teachers(id,name,email,department,passwordHash,createdAt) VALUES (?,?,?,?,?,?)', 
      'T002', 'Dr. Alan Turing', 'turing@ncwu.edu.cn', 'Computer Science', 'password:teacher123', new Date().toISOString());

    // Create demo student
    await runAsync.call(db, 'INSERT OR IGNORE INTO students(id,name,email,department,grade,enrollmentDate,graduationDate,passwordHash,createdAt) VALUES (?,?,?,?,?,?,?,?,?)', 
      'S12345', 'Afroz Ahmed', 'afroz@ncwu.edu.cn', 'Computer Science', 'Grade 2', '2023-09-01', '2027-06-30', 'password:demo', new Date().toISOString());

    await runAsync.call(db, 'INSERT OR IGNORE INTO students(id,name,email,department,grade,enrollmentDate,graduationDate,passwordHash,createdAt) VALUES (?,?,?,?,?,?,?,?,?)', 
      'S12346', 'Li Wei', 'liwei@ncwu.edu.cn', 'Electrical Engineering', 'Grade 1', '2023-09-01', '2027-06-30', 'password:demo123', new Date().toISOString());

    // Create courses
    await runAsync.call(db, 'INSERT OR IGNORE INTO courses(id,title,credit,teacherId,department,grade,semester) VALUES (?,?,?,?,?,?,?)', 
      'CS101', 'Introduction to Computer Science', 3, 'T001', 'Computer Science', 'Grade 1', 'Fall 2025');
    
    await runAsync.call(db, 'INSERT OR IGNORE INTO courses(id,title,credit,teacherId,department,grade,semester) VALUES (?,?,?,?,?,?,?)', 
      'CS201', 'Data Structures & Algorithms', 4, 'T002', 'Computer Science', 'Grade 2', 'Fall 2025');
    
    await runAsync.call(db, 'INSERT OR IGNORE INTO courses(id,title,credit,teacherId,department,grade,semester) VALUES (?,?,?,?,?,?,?)', 
      'CS301', 'Database Systems', 3, 'T001', 'Computer Science', 'Grade 2', 'Fall 2025');

    // Create class routines
    await runAsync.call(db, 'INSERT INTO routine(courseId,day,time,room) VALUES (?,?,?,?)', 
      'CS101', 'Monday', '09:00-10:30', 'Room 101');
    
    await runAsync.call(db, 'INSERT INTO routine(courseId,day,time,room) VALUES (?,?,?,?)', 
      'CS201', 'Wednesday', '11:00-12:30', 'Room 202');
    
    await runAsync.call(db, 'INSERT INTO routine(courseId,day,time,room) VALUES (?,?,?,?)', 
      'CS301', 'Friday', '14:00-15:30', 'Room 303');

    // Enroll students in courses
    await runAsync.call(db, 'INSERT INTO enrollments(studentId,courseId,status,createdAt) VALUES (?,?,?,?)', 
      'S12345', 'CS101', 'active', new Date().toISOString());
    
    await runAsync.call(db, 'INSERT INTO enrollments(studentId,courseId,status,createdAt) VALUES (?,?,?,?)', 
      'S12345', 'CS201', 'active', new Date().toISOString());
    
    await runAsync.call(db, 'INSERT INTO enrollments(studentId,courseId,status,createdAt) VALUES (?,?,?,?)', 
      'S12345', 'CS301', 'active', new Date().toISOString());

    // Enroll second student to more courses
    await runAsync.call(db, 'INSERT INTO enrollments(studentId,courseId,status,createdAt) VALUES (?,?,?,?)', 
      'S12346', 'CS101', 'active', new Date().toISOString());
    
    await runAsync.call(db, 'INSERT INTO enrollments(studentId,courseId,status,createdAt) VALUES (?,?,?,?)', 
      'S12346', 'CS201', 'active', new Date().toISOString());

    // Add sample results
    await runAsync.call(db, 'INSERT INTO results(studentId,courseId,periodType,periodLabel,examType,marks,totalMarks,gpa,grade,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)', 
      'S12345', 'CS101', 'semester', 'Fall 2025', 'Midterm', 85, 100, 3.7, 'A-', new Date().toISOString());
    
    await runAsync.call(db, 'INSERT INTO results(studentId,courseId,periodType,periodLabel,examType,marks,totalMarks,gpa,grade,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)', 
      'S12345', 'CS201', 'semester', 'Fall 2025', 'Midterm', 78, 100, 3.3, 'B+', new Date().toISOString());

    // Add assignments
    await runAsync.call(db, 'INSERT INTO assignments(courseId,title,description,dueDate,totalMarks,createdBy,createdAt) VALUES (?,?,?,?,?,?,?)', 
      'CS101', 'Project 1: Basic Programming', 'Create a simple calculator application using Python', '2025-12-10', 100, 'T001', new Date().toISOString());
    
    await runAsync.call(db, 'INSERT INTO assignments(courseId,title,description,dueDate,totalMarks,createdBy,createdAt) VALUES (?,?,?,?,?,?,?)', 
      'CS201', 'Lab 3: Binary Trees', 'Implement binary search tree operations', '2025-12-15', 50, 'T002', new Date().toISOString());
    
    console.log('✅ Database initialized with demo data for North China University of Water Resources and Electric Power');
  } else {
    console.log('✅ Database already initialized');
  }
}
