'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Course, Quiz, Package, Enrollment, StudyLog, PdfResource, LiveClass, UserRole, LmsUser } from './types';
import { DEMO_COURSES, DEMO_QUIZZES, PACKAGES, DEMO_LIVE } from './data';

interface LmsStore {
  courses: Course[];
  quizzes: Quiz[];
  packages: Package[];
  liveClasses: LiveClass[];
  users: LmsUser[];
  currentUser: LmsUser | null;
  enrollments: Enrollment[];
  studyLogs: StudyLog[];
  _hydrated: boolean;
  setHydrated: (v:boolean)=>void;
  // auth
  login: (email:string, role:UserRole)=>void;
  logout: ()=>void;
  switchRole: (role:UserRole)=>void;
  // courses
  setCourses: (c:Course[])=>void;
  addCourse: (c:Course)=>void;
  updateCourse: (id:string, patch:Partial<Course>)=>void;
  deleteCourse: (id:string)=>void;
  addPdfToCourse: (courseId:string, pdf:PdfResource)=>void;
  removePdfFromCourse: (courseId:string, pdfId:string)=>void;
  // quizzes
  setQuizzes:(q:Quiz[])=>void;
  addQuiz:(q:Quiz)=>void;
  updateQuiz:(id:string, patch:Partial<Quiz>)=>void;
  deleteQuiz:(id:string)=>void;
  // packages
  setPackages:(p:Package[])=>void;
  // enrollments
  enroll: (courseId:string)=>void;
  enrollPackage: (pkgId:string)=>void;
  toggleLessonComplete: (courseId:string, lessonId:string)=>void;
  updateProgress: (courseId:string, progress:number)=>void;
  // study logs
  addStudyMinutes: (date:string, minutes:number)=>void;
  // live
  addLiveClass:(l:LiveClass)=>void;
  updateLiveClass:(id:string, patch:Partial<LiveClass>)=>void;
}

function getDefaults() {
  const now = Date.now();
  const DAY = 1000 * 60 * 60 * 24;
  const demoUser: LmsUser = {
    id: 'u-student-1',
    name: 'Aarav Singh',
    email: 'aarav@abhyas.ias',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=11',
    enrolledCourseIds: ['c1', 'c5'],
    createdAt: now - DAY * 30,
  };
  const studyLogs: StudyLog[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    studyLogs.push({
      date: d.toISOString().slice(0, 10),
      minutes: i % 7 === 0 ? 0 : Math.floor(20 + Math.random() * 80),
      lessonsCompleted: Math.floor(Math.random() * 3),
    });
  }
  return {
    courses: DEMO_COURSES,
    quizzes: DEMO_QUIZZES,
    packages: PACKAGES,
    liveClasses: DEMO_LIVE,
    users: [
      demoUser,
      { id: 'u-teacher-1', name: 'Dr. Ibemhal Devi', email: 'teacher@abhyas.ias', role: 'teacher' as const, avatar: 'https://i.pravatar.cc/150?img=5', enrolledCourseIds: [], createdAt: now },
      { id: 'u-admin-1', name: 'Admin', email: 'admin@abhyas.ias', role: 'admin' as const, avatar: 'https://i.pravatar.cc/150?img=8', enrolledCourseIds: [], createdAt: now },
    ],
    currentUser: demoUser,
    enrollments: [
      { userId: 'u-student-1', courseId: 'c1', progress: 38, completedLessonIds: ['l1', 'l4'], lastLessonId: 'l5', enrolledAt: now - DAY * 12 },
      { userId: 'u-student-1', courseId: 'c5', progress: 72, completedLessonIds: ['l1'], lastLessonId: 'l1', enrolledAt: now - DAY * 5 },
    ],
    studyLogs,
  };
}

export const useLmsStore = create<LmsStore>()(
  persist(
    (set, get) => ({
      courses: [],
      quizzes: [],
      packages: [],
      liveClasses: [],
      users: [],
      currentUser: null,
      enrollments: [],
      studyLogs: [],
      _hydrated: false,
      setHydrated: (v) => set({ _hydrated: v }),
      login: (email, role) => {
        const existing = get().users.find(u => u.email === email);
        if (existing) set({ currentUser: { ...existing, role } });
        else {
          const nu: LmsUser = { id: 'u-' + Date.now(), name: email.split('@')[0], email, role, enrolledCourseIds: [], createdAt: Date.now() };
          set(s => ({ users: [...s.users, nu], currentUser: nu }));
        }
      },
      logout: () => set({ currentUser: null }),
      switchRole: (role) => set(s => s.currentUser ? { currentUser: { ...s.currentUser, role } } : {}),
      setCourses: (courses) => set({ courses }),
      addCourse: (c) => set(s => ({ courses: [c, ...s.courses] })),
      updateCourse: (id, patch) => set(s => ({ courses: s.courses.map(x => x.id === id ? { ...x, ...patch } : x) })),
      deleteCourse: (id) => set(s => ({ courses: s.courses.filter(x => x.id !== id) })),
      addPdfToCourse: (courseId, pdf) => set(s => ({ courses: s.courses.map(c => c.id === courseId ? { ...c, pdfs: [pdf, ...c.pdfs] } : c) })),
      removePdfFromCourse: (courseId, pdfId) => set(s => ({ courses: s.courses.map(c => c.id === courseId ? { ...c, pdfs: c.pdfs.filter(p => p.id !== pdfId) } : c) })),
      setQuizzes: (quizzes) => set({ quizzes }),
      addQuiz: (q) => set(s => ({ quizzes: [q, ...s.quizzes] })),
      updateQuiz: (id, patch) => set(s => ({ quizzes: s.quizzes.map(x => x.id === id ? { ...x, ...patch } : x) })),
      deleteQuiz: (id) => set(s => ({ quizzes: s.quizzes.filter(x => x.id !== id) })),
      setPackages: (packages) => set({ packages }),
      enroll: (courseId) => {
        const u = get().currentUser; if (!u) return;
        const exists = get().enrollments.find(e => e.userId === u.id && e.courseId === courseId);
        if (exists) return;
        set(s => ({
          enrollments: [...s.enrollments, { userId: u.id, courseId, progress: 0, completedLessonIds: [], enrolledAt: Date.now() }],
          users: s.users.map(x => x.id === u.id ? { ...x, enrolledCourseIds: [...x.enrolledCourseIds, courseId] } : x),
          currentUser: s.currentUser ? { ...s.currentUser, enrolledCourseIds: [...s.currentUser.enrolledCourseIds, courseId] } : null
        }));
      },
      enrollPackage: (pkgId) => {
        const pkg = get().packages.find(p => p.id === pkgId); if (!pkg) return;
        pkg.courseIds.forEach(id => get().enroll(id));
      },
      toggleLessonComplete: (courseId, lessonId) => {
        const u = get().currentUser; if (!u) return;
        set(s => {
          const idx = s.enrollments.findIndex(e => e.userId === u.id && e.courseId === courseId);
          let enrollments = [...s.enrollments];
          if (idx === -1) {
            enrollments.push({ userId: u.id, courseId, progress: 0, completedLessonIds: [lessonId], enrolledAt: Date.now(), lastLessonId: lessonId });
          } else {
            const e = enrollments[idx];
            const has = e.completedLessonIds.includes(lessonId);
            const nextIds = has ? e.completedLessonIds.filter(x => x !== lessonId) : [...e.completedLessonIds, lessonId];
            const course = s.courses.find(c => c.id === courseId);
            const totalLessons = course ? course.sections.reduce((a, sec) => a + sec.lessons.length, 0) : Math.max(1, nextIds.length);
            const progress = Math.round((nextIds.length / totalLessons) * 100);
            enrollments[idx] = { ...e, completedLessonIds: nextIds, progress, lastLessonId: lessonId };
          }
          return { enrollments };
        });
      },
      updateProgress: (courseId, progress) => set(s => {
        const u = s.currentUser; if (!u) return {};
        return { enrollments: s.enrollments.map(e => e.userId === u.id && e.courseId === courseId ? { ...e, progress } : e) };
      }),
      addStudyMinutes: (date, minutes) => set(s => {
        const idx = s.studyLogs.findIndex(x => x.date === date);
        if (idx !== -1) { const copy = [...s.studyLogs]; copy[idx] = { ...copy[idx], minutes: copy[idx].minutes + minutes }; return { studyLogs: copy }; }
        return { studyLogs: [...s.studyLogs, { date, minutes, lessonsCompleted: 1 }] };
      }),
      addLiveClass: (l) => set(s => ({ liveClasses: [l, ...s.liveClasses] })),
      updateLiveClass: (id, patch) => set(s => ({ liveClasses: s.liveClasses.map(x => x.id === id ? { ...x, ...patch } : x) })),
    }),
    {
      name: 'abhyas-lms-v1',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        return localStorage;
      }),
      partialize: (s) => ({
        courses: s.courses, quizzes: s.quizzes, packages: s.packages, liveClasses: s.liveClasses, users: s.users, currentUser: s.currentUser, enrollments: s.enrollments, studyLogs: s.studyLogs
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        try {
          const hasData = state.courses && state.courses.length > 0;
          if (!hasData) {
            const defaults = getDefaults();
            state.setCourses(defaults.courses);
            state.setQuizzes(defaults.quizzes);
            state.setPackages(defaults.packages);
            state.liveClasses = defaults.liveClasses;
            state.users = defaults.users;
            state.currentUser = defaults.currentUser;
            state.enrollments = defaults.enrollments;
            state.studyLogs = defaults.studyLogs;
          }
          state.setHydrated(true);
        } catch {
          state.setHydrated(true);
        }
      }
    }
  )
);
