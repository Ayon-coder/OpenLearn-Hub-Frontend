
export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

export enum DriveSource {
  Uploaded = 'Uploaded',
  Downloaded = 'Downloaded'
}

// Authentication & Verification Types
export type UserRole = 'student' | 'teacher' | 'online_educator' | 'community_contributor';
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'unverified';
export type VerificationLevel = 'basic' | 'medium' | 'strong';
export type TrustLevel = 'bronze' | 'silver' | 'gold';

// Community Contributor Metrics
export interface CommunityMetrics {
  notesUploaded: number;
  upvotes: number;
  downvotes: number;
  helpfulMarks: number;
  reportCount: number;
  trustScore: number;
  trustLevel: TrustLevel;
  canUploadNotes: boolean;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface VerificationData {
  institutionName?: string;
  department?: string;
  year?: string;
  studentId?: string;
  proofDocuments?: UploadedDocument[];
  credibilityLinks?: string[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  verificationLevel: VerificationLevel;
  verificationData?: VerificationData;
  university?: string;
  semester?: string;
  channelName?: string;
  communityMetrics?: CommunityMetrics;
  joinedDate: string;
  reputation: number;
  badges: string[];
  // Legacy support
  legacyRole?: 'Student' | 'Educator' | 'Contributor';
}

// Quiz Publishing Types
export type QuizVerificationMethod = 'none' | 'chatbot' | 'manual';
export type QuizAuthorType = 'educator' | 'student_verified' | 'community_trusted';
export type QuizStatus = 'draft' | 'pending_verification' | 'published' | 'rejected';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizMetadata {
  role: UserRole;
  trustLevel?: TrustLevel | VerificationLevel;
  quizVerification: QuizVerificationMethod;
  authorType: QuizAuthorType;
  published: boolean;
  verifiedAt?: string;
  verificationFeedback?: string;
  conceptualScore?: number;
  clarityScore?: number;
  plagiarismScore?: number;
  alignmentScore?: number;
  overallScore?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
  metadata: QuizMetadata;
  status: QuizStatus;
}

export interface ChatbotVerificationResult {
  passed: boolean;
  score: number;
  feedback: {
    conceptualCorrectness: { passed: boolean; score: number; message: string };
    questionClarity: { passed: boolean; score: number; message: string };
    plagiarismCheck: { passed: boolean; score: number; message: string };
    subjectAlignment: { passed: boolean; score: number; message: string };
  };
  suggestions: string[];
}

export interface PublishingInfo {
  canPublish: boolean;
  requiresVerification: boolean;
  reason: string;
  authorType: QuizAuthorType;
}


// Content Source Validation Types
export type SourceTagType = 'youtube' | 'university' | 'online_course' | 'self_written' | 'book_other';
export type ContentTrustLevel = 'basic' | 'trusted' | 'verified';

export interface YouTubeSource {
  url: string;
  channelName?: string;
  videoTitle?: string;
  validated: boolean;
}

export interface UniversitySource {
  name: string;
  courseContext?: string;
  department?: string;
}

export interface OnlineCourseSource {
  platform: string; // 'NPTEL' | 'Coursera' | 'MIT OCW' | 'edX' | 'Khan Academy' | 'Other'
  courseName?: string;
  instructorName?: string;
  url?: string;
}

export interface SelfWrittenSource {
  authorName: string;
  description: string;
  expertise?: string;
  requiresAdminVerification: true;
}

export interface BookOtherSource {
  sourceType: 'book' | 'research_paper' | 'article' | 'other';
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  url?: string;
  description: string;
  requiresAdminVerification: true;
}

export interface ContentSourceMetadata {
  sourceTags: SourceTagType[];
  youtubeSource?: YouTubeSource;
  universitySource?: UniversitySource;
  onlineCourseSource?: OnlineCourseSource;
  selfWrittenSource?: SelfWrittenSource;
  bookOtherSource?: BookOtherSource;
  trustLevel: ContentTrustLevel;
  multipleSourceBonus: boolean;
  requiresAdminVerification: boolean;
}

// Multi-Path Content Organization Types
export type OrganizationPath = 'subject' | 'university' | 'channel' | 'course' | 'competitive_exam';

export interface SubjectPath {
  subject: string;
  coreTopic: string;
  subtopic: string;
  resourceTitle: string;
}

export interface UniversityPath {
  university: string;
  semester: string;
  department: string;
  subject: string;
  topic: string;
}

export interface ChannelPath {
  channelName: string;
  playlistName: string;
  topic: string;
  resourceTitle: string;
}

export interface CoursePath {
  provider: string; // e.g., Coursera, Udemy, YouTube, NPTEL
  instructor: string; // e.g., CodeWithHarry, Stanford, Google
  courseName: string; // e.g., Python Zero to Hero
  topic: string; // e.g., Python Intro
  resourceTitle: string;
}

export interface CompetitiveExamPath {
  exam: string; // e.g., JEE Advanced, NEET, GATE, UPSC
  year: string; // e.g., Target 2025, 2024 PYQ, General
  subject: string; // e.g., Physics, Maths, General Studies
  topic: string; // e.g., Rotational Motion, Algebra
  resourceTitle: string;
}

export interface ContentOrganization {
  subjectPath?: SubjectPath;
  universityPath?: UniversityPath;
  channelPath?: ChannelPath;
  coursePath?: CoursePath;
  competitiveExamPath?: CompetitiveExamPath;
  primaryPath: OrganizationPath | 'course';
}

export interface ContentUpload {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  subtopic?: string;
  files: UploadedDocument[];
  attachedVideo?: UploadedDocument;
  sourceMetadata: ContentSourceMetadata;
  organization?: ContentOrganization;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}


export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'verified' | 'pending';
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  status: 'verified' | 'pending';
  difficulty: Difficulty;
  votes: number;
  lastUpdated: string;
  content: string;
  readiness: number;
}

export interface Subtopic {
  id: string;
  topicId: string;
  title: string;
  description: string;
  status: 'verified' | 'pending';
  videoUrl?: string;
}

export interface DriveItem {
  id: string;
  name: string;
  subjectId: string;
  topicId: string;
  subtopicId: string;
  subjectName: string;
  topicName: string;
  subtopicName: string;
  title: string;
  description?: string; // Content description for card display
  videoUrl?: string; // YouTube/video URL for embedded playback
  coverImage?: string; // Fallback image when videoUrl is not available
  contentId?: string; // Reference to original content
  source: DriveSource;
  timestamp: string;
  mimeType: string;
  size?: string;
  // Firebase integration fields
  syncStatus?: 'pending' | 'synced' | 'failed' | 'local-only';
  firebaseUrl?: string;
  firebasePath?: string;
  allowLocalDownload?: boolean; // true for own captures, false for others' course notes
  uploadedBy?: string; // userId of uploader
  isCourseContent?: boolean; // true if this is course-related content
}

export interface ContentItem {
  id: string;
  subtopicId: string;
  topicId: string;
  subjectId: string;
  title: string;
  body: string;
  author: string;
  votes: number;
  readiness: number;
  lastUpdated: string;
  difficulty: Difficulty;
  videoUrl?: string;
}

export interface UserStats {
  notesUploaded: number;
  contributions: number;
  studentsHelped: number;
  currentStreak: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  parts: (
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  )[];
}

export interface ChatContext {
  subject?: string;
  topic?: string;
  subtopic?: string;
}

// Viewer Interaction Types
export interface Comment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  upvotes: number;
  replies?: Comment[];
}

export interface Review {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  title: string;
  text: string;
  helpful: number;
  notHelpful: number;
  createdAt: string;
}

export interface ContentInteraction {
  contentId: string;
  userVote: 'up' | 'down' | null;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

// Follow/Subscription Types
export type FollowableRole = 'teacher' | 'online_educator';

export interface FollowableCreator {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  verificationLevel: VerificationLevel;
  institution?: string; // For teachers: university name
  channelName?: string; // For online educators: channel/platform
  totalNotes: number;
  totalCourseNotes: number;
  averageRating: number;
  followerCount: number;
  reputation: number;
  communityMetrics?: CommunityMetrics; // For community contributors
}

export interface Subscription {
  id: string;
  userId: string; // The follower
  creatorId: string; // The followed creator
  followedAt: string;
}

export interface CreatorNotesGroup {
  topic: string;
  notes: CreatorNote[];
}

export interface CreatorNote {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic?: string;
  uploadedAt: string;
  isCourseNote: boolean;
  courseId?: string;
  previewAvailable: boolean;
}

export interface SubscriptionCreatorView {
  creator: FollowableCreator;
  communityNotes: CreatorNotesGroup[];
  courseNotes: CreatorNotesGroup[];
  totalCommunityNotes: number;
  totalCourseNotes: number;
}

// Follow eligibility check
export interface FollowEligibility {
  canBeFollowed: boolean;
  reason?: string;
  badge: 'verified_teacher' | 'online_educator' | 'trusted_contributor' | 'none';
}
