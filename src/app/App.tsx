
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/user/Dashboard';
import { HubExplorer } from '@/pages/hub/HubExplorer';
import { TopicExplorer } from '@/pages/hub/TopicExplorer';
import { SubtopicExplorer } from '@/pages/hub/SubtopicExplorer';
import { ContentDetail } from '@/pages/content/ContentDetail';
import { DrivePage } from '@/pages/drive/DrivePage';
import { CourseNoteAccessPage } from '@/pages/content/CourseNoteAccessPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { VerificationPage } from '@/pages/auth/VerificationPage';
import { TrendingNotesPage } from '@/pages/content/TrendingNotesPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { AIAssistantPage } from '@/pages/ai/AIAssistantPage';
import { QuizCreationPage } from '@/pages/quiz/QuizCreationPage';
import { NoteUploadPage } from '@/pages/content/NoteUploadPage';
import { BrowseByPathPage } from '@/pages/hub/BrowseByPathPage';
import { SharedNotePage } from '@/pages/content/SharedNotePage';
import { ContributionPage } from '@/pages/user/ContributionPage';
import { SubscriptionsPage } from '@/pages/user/SubscriptionsPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { authService } from '@/services/auth/authService';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    const handleAuth = () => setUser(authService.getUser());
    window.addEventListener('auth-change', handleAuth);
    return () => window.removeEventListener('auth-change', handleAuth);
  }, []);

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes - Outside Layout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Main App Routes with Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Dashboard - accessible to both guests and logged-in users */}
              <Route path="/" element={<Dashboard />} />

              {/* Browsing Routes - Accessible to all guests */}
              <Route path="/hub" element={<HubExplorer />} />
              <Route path="/hub/subject/:subjectId" element={<TopicExplorer />} />
              <Route path="/hub/subject/:subjectId/topic/:topicId" element={<SubtopicExplorer />} />
              <Route path="/hub/subject/:subjectId/topic/:topicId/subtopic/:subtopicId" element={<ContentDetail />} />

              <Route path="/ai-assistant" element={<AIAssistantPage />} />

              <Route path="/my-drive" element={<DrivePage />} />

              {/* Action Routes - Require authentication */}
              <Route path="/hub/subject/:subjectId/topic/:topicId/subtopic/:subtopicId/upload" element={
                <PrivateRoute>
                  <NoteUploadPage />
                </PrivateRoute>
              } />
              <Route path="/course/access/:courseNoteId" element={
                <PrivateRoute>
                  <CourseNoteAccessPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/verification" element={
                <PrivateRoute>
                  <VerificationPage />
                </PrivateRoute>
              } />

              {/* Upload Notes - Restricted */}
              <Route path="/notes/upload" element={
                <PrivateRoute>
                  <NoteUploadPage />
                </PrivateRoute>
              } />

              {/* Create Quiz - Restricted */}
              <Route path="/quiz/create" element={
                <PrivateRoute>
                  <QuizCreationPage />
                </PrivateRoute>
              } />


              {/* Browse - Accessible to guests */}
              <Route path="/browse" element={<BrowseByPathPage />} />
              <Route path="/trending" element={<TrendingNotesPage />} />
              <Route path="/note/:noteId" element={<SharedNotePage />} />

              {/* Subscriptions - Requires authentication */}
              <Route path="/subscriptions" element={
                <PrivateRoute>
                  <SubscriptionsPage />
                </PrivateRoute>
              } />

              <Route path="/contribute" element={
                <PrivateRoute>
                  <ContributionPage />
                </PrivateRoute>
              } />
              <Route path="/leaderboard" element={<div className="p-8"><h1 className="text-3xl font-bold">Top Contributors Coming Soon</h1></div>} />
              <Route path="/settings" element={<div className="p-8"><h1 className="text-3xl font-bold">Settings & Integration</h1></div>} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
