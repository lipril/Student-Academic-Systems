const API = 'http://localhost:3000/api';

export const loginId = (id: string, pw: string, role: 'admin' | 'teacher' | 'student') =>
  fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, password: pw, role }),
  }).then(r => r.json());

export const startReg = (id: string) =>
  fetch(`${API}/webauthn/register/start?studentId=${encodeURIComponent(id)}`).then(r => r.json());

export const finishReg = (studentId: string, cred: any) =>
  fetch(`${API}/webauthn/register/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, cred }),
  }).then(r => r.json());

export const startAuth = (id: string) =>
  fetch(`${API}/webauthn/auth/start?studentId=${encodeURIComponent(id)}`).then(r => r.json());

export const finishAuth = (studentId: string, cred: any) =>
  fetch(`${API}/webauthn/auth/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, cred }),
  }).then(r => r.json());

export const getDashboard = (id: string) => fetch(`${API}/student/dashboard/${id}`).then(r => r.json());

export const markAttendance = (studentId: string, courseId: string, method: 'webauthn' | 'id') =>
  fetch(`${API}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, courseId, method }),
  }).then(r => r.json());
