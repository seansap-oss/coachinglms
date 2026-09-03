// ABHYAS IAS LMS — Types
export type UserRole = 'student' | 'teacher' | 'admin';

export interface LmsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  enrolledCourseIds: string[];
  createdAt: number;
}

export interface PdfResource {
  id: string;
  title: string;
  url: string;
  pages?: number;
  sizeKB?: number;
  uploadedAt: number;
  courseId?: string;
  lessonId?: string;
}

export type QuestionType = 'single' | 'multiple' | 'truefalse';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[]; // 4 for single, 2 for TF, variable for multiple
  correctIndices: number[]; // single = [1], multiple = [0,2]
  explanation?: string;
  marks: number;
  timeSec?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  lessonId?: string;
  questions: QuizQuestion[];
  totalMarks: number;
  durationMin: number;
  passPercent: number;
  isPublished: boolean;
  createdAt: number;
}

export interface Lesson {
  id: string;
  title: string;
  durationMin: number;
  videoUrl?: string; // youtube or zoom recording
  zoomMeetingId?: string;
  zoomPasscode?: string;
  pdfs: PdfResource[];
  quizId?: string;
  isPreview?: boolean;
  order: number;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseCategory = 'Prelims' | 'Mains' | 'Optional' | 'Interview' | 'Foundation' | 'Current Affairs' | 'Test Series';

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  level: CourseLevel;
  instructor: string;
  instructorAvatar?: string;
  thumbnail: string;
  previewVideo?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  students: number;
  language: string;
  lastUpdated: string;
  sections: Section[];
  pdfs: PdfResource[];
  quizIds: string[];
  tags: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  zoomWebinarEnabled?: boolean;
  zoomMeetingId?: string;
}

export interface Package {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  durationMonths: number;
  features: string[];
  courseIds: string[];
  color: string;
  badge?: string;
  popular?: boolean;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessonIds: string[];
  lastLessonId?: string;
  enrolledAt: number;
  certificateUrl?: string;
}

export interface StudyLog {
  date: string; // YYYY-MM-DD
  minutes: number;
  lessonsCompleted: number;
  courseId?: string;
}

export interface LiveClass {
  id: string;
  title: string;
  courseId: string;
  instructor: string;
  meetingId: string;
  passcode?: string;
  startAt: number; // epoch ms
  durationMin: number;
  status: 'scheduled' | 'live' | 'ended';
  zoomJoinUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  courseId?: string;
}

// ZOOM
export interface ZoomSignatureResponse {
  signature: string;
  sdkKey: string;
}
