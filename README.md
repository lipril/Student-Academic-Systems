# Computerestic Student Academic System

A modern student academic management system with biometric authentication using Windows Hello Face/Touch ID (WebAuthn), featuring a neon matrix-themed UI designed for computer science students.

## Features

- **Secure Login**
  - Student ID + Password
  - Windows Hello Face/Touch/PIN (WebAuthn/Passkeys)
  - Zero ML dependencies, uses OS-level biometrics

- **Dashboard**
  - Semester/Year-wise results with GPA
  - Class routines with schedule, room, teacher
  - Course credits and teacher information
  - Progress tracker (completed vs remaining courses)
  - Assignment status (completed vs due)
  - Attendance tracking with biometric capture

- **Neon CS-themed UI**
  - Dark slate background with cyan/emerald/fuchsia accents
  - Monospaced headings
  - Glowing borders and backdrop blur
  - Responsive grid layout

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- SQLite (better-sqlite3) - file-based database, no setup required
- WebAuthn (@simplewebauthn/server) - platform biometrics
- CORS enabled for local development

### Frontend
- React 18 + Vite + TypeScript
- Tailwind CSS for styling
- WebAuthn API for biometric login/attendance

## Prerequisites

**Install Node.js** (if not already installed):
1. Download from https://nodejs.org/ (LTS version recommended)
2. Run installer and follow prompts
3. Verify installation: `node --version` and `npm --version`

## Installation & Setup

### Step 1: Install Backend Dependencies

```powershell
cd c:/Users/afroz/CodeBuddy/20251125214834
npm install
```

This will install:
- express
- better-sqlite3 (prebuilt binaries for Windows)
- @simplewebauthn/server
- cors
- TypeScript and dev dependencies

### Step 2: Install Frontend Dependencies

```powershell
cd client
npm install
```

This will install:
- react + react-dom
- vite
- tailwindcss + autoprefixer + postcss
- TypeScript

### Step 3: Start Backend Server

Open a PowerShell terminal in the project root:

```powershell
cd c:/Users/afroz/CodeBuddy/20251125214834
npm run dev
```

You should see:
```
API running at http://localhost:3000
```

The backend will:
- Create `academic.db` SQLite database
- Seed demo data (Student ID: S12345, Password: demo)
- Start API on port 3000

### Step 4: Start Frontend Dev Server

Open a **NEW** PowerShell terminal:

```powershell
cd c:/Users/afroz/CodeBuddy/20251125214834/client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 5: Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Usage Guide

### First-Time Setup

1. **Login with Demo Account**
   - Student ID: `S12345`
   - Password: `demo`
   - Click "Login ID"

2. **Register Device Authentication (Optional)**
   - Enter Student ID: `S12345`
   - Click "Register Device Auth"
   - Windows Hello prompt will appear
   - Use your face, fingerprint, or PIN
   - Once registered, you can login with Face/Passkey

### Using the Dashboard

After login, you'll see:

- **Results Section**: Semester-wise GPA and course grades
- **Assignments Section**: Upcoming assignments with due dates
- **Routine Section**: Class schedule with one-click attendance
- **Credits & Teachers**: Course information
- **Progress**: Completed vs remaining courses

### Recording Attendance

1. Find your course in the "Routine" section
2. Click the green "Attend" button
3. Attendance is recorded with timestamp
4. Method is logged (webauthn or id)

### Face/Passkey Login

1. Click "Login Face/Passkey"
2. Windows Hello prompt appears
3. Authenticate with Face/Touch/PIN
4. Dashboard loads automatically

## Database Schema

The system creates these tables automatically:

- `students` - Student profiles and credentials
- `results` - Semester/year results with GPA
- `courses` - Course catalog with credits and teachers
- `enrollments` - Student course enrollments
- `routine` - Class schedule
- `attendance` - Attendance records with method
- `assignments` - Assignment titles and due dates
- `submissions` - Student submission status

## API Endpoints

All endpoints run on `http://localhost:3000/api`:

- `POST /login-id` - Login with Student ID + password
- `GET /webauthn/register/start` - Start device registration
- `POST /webauthn/register/finish` - Complete device registration
- `GET /webauthn/auth/start` - Start biometric authentication
- `POST /webauthn/auth/finish` - Complete biometric authentication
- `GET /dashboard/:id` - Get all student data
- `POST /attendance` - Record attendance

## Deployment

### Option 1: Deploy to Cloud (Recommended for Production)

#### Frontend (Vercel)

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Deploy frontend:
   ```powershell
   cd client
   vercel
   ```

3. Follow prompts:
   - Login to Vercel
   - Set project name
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

4. Update frontend API URL in `client/src/api.ts`:
   ```typescript
   const API = 'https://your-backend.onrender.com/api';
   ```

#### Backend (Render)

1. Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: academic-system-api
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
   ```

2. Push to GitHub

3. Connect to Render.com:
   - Create new Web Service
   - Connect GitHub repo
   - Auto-deploy enabled

4. For persistent SQLite, add disk storage in Render dashboard

**Alternative Backend Hosts:**
- Railway.app (easy SQLite persistence)
- Fly.io (global edge deployment)

### Option 2: Local Network Access

To access from other devices on your network:

1. Find your local IP:
   ```powershell
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.100)

2. Update CORS in `src/server.ts`:
   ```typescript
   app.use(cors({ origin: 'http://192.168.1.100:5173', credentials: true }));
   ```

3. Update WebAuthn rpID in `src/webauthn.ts`:
   ```typescript
   const rpID = '192.168.1.100';
   const expectedOrigin = 'http://192.168.1.100:5173';
   ```

4. Update API in `client/src/api.ts`:
   ```typescript
   const API = 'http://192.168.1.100:3000/api';
   ```

5. Start both servers and access from any device:
   ```
   http://192.168.1.100:5173
   ```

## Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart PowerShell after installation

### "better-sqlite3" build errors
- The package should use prebuilt binaries for Windows
- If errors occur, try: `npm install --build-from-source=false`

### WebAuthn not working
- WebAuthn requires HTTPS or localhost
- Ensure you're using Chrome/Edge/Firefox (recent versions)
- Windows Hello must be set up in Windows Settings

### CORS errors
- Ensure backend is running on port 3000
- Ensure frontend is running on port 5173
- Check CORS origin matches in `src/server.ts`

### Database locked errors
- Close all instances of the backend server
- Delete `academic.db` and restart (will recreate with seed data)

## Customization

### Add More Students

Edit `src/init.ts` and add:

```typescript
addStudent.run('S12346', 'John Doe', 'password:john123', new Date().toISOString());
```

### Add More Courses

```typescript
addCourse.run('CS301', 'Algorithms', 4, 'Dr. Knuth');
addRoutine.run('CS301', 'Fri', '14:00-16:00', 'R303');
```

### Change Theme Colors

Edit `client/src/App.tsx` and modify Tailwind classes:
- `bg-cyan-600` → `bg-blue-600` (change accent color)
- `border-cyan-500/30` → `border-purple-500/30`

## Security Notes

- **Demo credentials**: Change `password:demo` in production
- **WebAuthn challenges**: Currently in-memory; use Redis/DB for production
- **HTTPS**: Required for WebAuthn in production (local development is exempt)
- **Database**: SQLite is file-based; ensure proper file permissions

## Project Structure

```
c:/Users/afroz/CodeBuddy/20251125214834/
├── src/                     # Backend source
│   ├── server.ts           # Express server and routes
│   ├── db.ts               # SQLite connection
│   ├── schema.ts           # Database schema
│   ├── init.ts             # Seed data
│   └── webauthn.ts         # WebAuthn logic
├── client/                  # Frontend source
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── api.ts          # API client
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Tailwind imports
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.cjs
├── package.json            # Backend dependencies
├── tsconfig.json           # Backend TypeScript config
└── README.md               # This file
```

## License

MIT

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Verify Node.js and npm are installed
3. Ensure both servers are running
4. Check browser console for errors

---

**Made for Computer Science Students** 🚀

Neon matrix vibes, biometric security, zero ML dependencies.
