
import { User, UserRole, VerificationStatus, VerificationData } from '@/types';
import { emailValidator } from '@/utils';
import { trustLevelService } from '@/services/user/trustLevelService';

const AUTH_STORAGE_KEY = 'openlearn_auth_user';

export const authService = {
  getUser(): User | null {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Login with backend user data or fallback to local registry
   * @param email User email
   * @param password Optional password (not used locally)
   * @param userData Optional full user data from backend API
   */
  login(email: string, password?: string, userData?: Partial<User>): User {
    // If backend provided user data, use it directly with proper initialization
    if (userData && userData.email) {
      const user = this.buildUserFromBackendData(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      // Also save to registry for future lookups
      this.saveToRegistry(user);
      window.dispatchEvent(new Event('auth-change'));
      return user;
    }

    // Check if there's an existing registered user with this email
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      const existingUser = JSON.parse(storedUser) as User;
      // If the email matches, return the existing user
      if (existingUser.email === email) {
        window.dispatchEvent(new Event('auth-change'));
        return existingUser;
      }
    }

    // Check for registered users in a separate registry
    const usersRegistry = localStorage.getItem('openlearn_users_registry');
    if (usersRegistry) {
      const users = JSON.parse(usersRegistry) as User[];
      const foundUser = users.find(u => u.email === email);
      if (foundUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
        window.dispatchEvent(new Event('auth-change'));
        return foundUser;
      }
    }

    // Fallback to mock user only if no registered user found (for demo purposes)
    const mockUser: User = {
      id: 'user_1',
      name: 'Demo User',
      email: email,
      role: 'student',
      verificationStatus: 'verified',
      verificationLevel: 'strong',
      joinedDate: 'January 2024',
      reputation: 1240,
      badges: ['Pathfinder', 'Top Educator', 'Early Adopter'],
      avatar: 'DU',
      legacyRole: 'Contributor'
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    window.dispatchEvent(new Event('auth-change'));
    return mockUser;
  },

  /**
   * Build a complete User object from backend data with proper role-based initialization
   */
  buildUserFromBackendData(data: Partial<User>): User {
    const role = (data.role || 'student') as UserRole;
    const name = data.name || 'User';

    // Initialize community metrics for community contributors
    let communityMetrics = data.communityMetrics;
    if (role === 'community_contributor' && !communityMetrics) {
      communityMetrics = trustLevelService.getInitialMetrics();
    }

    // Determine verification status based on role
    const isInstitutional = data.email ? emailValidator.isInstitutionalEmail(data.email) : false;
    const verificationLevel = data.email ? emailValidator.getVerificationLevel(data.email) : 'basic';
    const verificationStatus: VerificationStatus =
      data.verificationStatus ||
      (role === 'community_contributor' ? 'verified' : (isInstitutional ? 'verified' : 'unverified'));

    return {
      id: data.id || `user_${Date.now()}`,
      name: name,
      email: data.email || '',
      role: role,
      verificationStatus: verificationStatus,
      verificationLevel: role === 'community_contributor' ? 'basic' : (data.verificationLevel || verificationLevel),
      joinedDate: data.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      reputation: data.reputation || 0,
      badges: data.badges || [],
      avatar: data.avatar || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      communityMetrics: communityMetrics,
      legacyRole: data.legacyRole
    };
  },

  /**
   * Save user to the registry for future login lookups
   */
  saveToRegistry(user: User): void {
    const usersRegistry = localStorage.getItem('openlearn_users_registry');
    const users: User[] = usersRegistry ? JSON.parse(usersRegistry) : [];
    const filteredUsers = users.filter(u => u.email !== user.email);
    filteredUsers.push(user);
    localStorage.setItem('openlearn_users_registry', JSON.stringify(filteredUsers));
  },

  /**
   * Register a new user with role-based verification
   */
  register(email: string, password: string, name: string, role: UserRole): User {
    const isInstitutional = emailValidator.isInstitutionalEmail(email);
    const verificationLevel = emailValidator.getVerificationLevel(email);

    // Auto-verify institutional emails (not applicable to community contributors)
    const verificationStatus: VerificationStatus =
      role === 'community_contributor' ? 'verified' :
        isInstitutional ? 'verified' : 'unverified';

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name,
      email: email,
      role: role,
      verificationStatus: verificationStatus,
      verificationLevel: role === 'community_contributor' ? 'basic' : verificationLevel,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      reputation: 0,
      badges: [],
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      // Initialize community metrics for community contributors
      communityMetrics: role === 'community_contributor' ? trustLevelService.getInitialMetrics() : undefined
    };

    // Save to current auth user
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

    // Also save to users registry for login lookup
    const usersRegistry = localStorage.getItem('openlearn_users_registry');
    const users: User[] = usersRegistry ? JSON.parse(usersRegistry) : [];
    // Remove existing user with same email if any, then add new user
    const filteredUsers = users.filter(u => u.email !== email);
    filteredUsers.push(newUser);
    localStorage.setItem('openlearn_users_registry', JSON.stringify(filteredUsers));

    window.dispatchEvent(new Event('auth-change'));
    return newUser;
  },

  /**
   * Submit verification data for review
   */
  submitVerification(verificationData: VerificationData): void {
    const user = this.getUser();
    if (!user) return;

    const updatedUser: User = {
      ...user,
      verificationData: {
        ...verificationData,
        submittedAt: new Date().toISOString()
      },
      verificationStatus: 'pending',
      verificationLevel: 'medium'
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('auth-change'));
  },

  /**
   * Update verification status (mock admin action)
   */
  updateVerificationStatus(status: VerificationStatus, notes?: string): void {
    const user = this.getUser();
    if (!user) return;

    const updatedUser: User = {
      ...user,
      verificationStatus: status,
      verificationLevel: status === 'verified' ? 'strong' : user.verificationLevel,
      verificationData: user.verificationData ? {
        ...user.verificationData,
        reviewedAt: new Date().toISOString(),
        reviewNotes: notes
      } : undefined
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('auth-change'));
  },

  /**
   * Check if user can upload/publish notes
   * All verified users (students, teachers, educators) can upload notes
   * High reputation students can also upload without explicit verification
   */
  canUploadNotes(user: User | null): boolean {
    if (!user) return false;

    // Community contributors need silver or gold trust level
    if (user.role === 'community_contributor') {
      return user.communityMetrics?.canUploadNotes || false;
    }

    // Teachers and Online Educators generally have access (verification optional/post-check)
    if (user.role === 'teacher' || user.role === 'online_educator') {
      return true;
    }

    // High reputation students (>= 500) bypass verification
    if (user.role === 'student' && user.reputation >= 500) {
      return true;
    }

    // Students need to be verified
    return user.verificationStatus === 'verified';
  },

  /**
   * Check if user can take quizzes
   * All users can take quizzes
   */
  canTakeQuizzes(user: User | null): boolean {
    // All users can take quizzes
    return user !== null;
  },

  canCreateQuizzes(user: User | null): boolean {
    if (!user) return false;

    // Teachers and Online Educators can always create quizzes
    if (user.role === 'teacher' || user.role === 'online_educator') {
      return true;
    }

    // Community contributors need Silver or Gold level
    if (user.role === 'community_contributor') {
      return user.communityMetrics?.trustLevel !== 'bronze';
    }

    // High reputation students (>= 500) bypass verification
    if (user.role === 'student' && user.reputation >= 500) {
      return true;
    }

    // Students need to be verified
    return user.verificationStatus === 'verified';
  },

  /**
   * Get verification badge label for display
   */
  getVerificationBadge(user: User): string {
    if (user.verificationStatus !== 'verified') {
      return 'Unverified';
    }

    switch (user.role) {
      case 'student':
        return 'Student Verified';
      case 'teacher':
        return 'Teacher Verified';
      case 'online_educator':
        return 'Educator Verified';
      case 'community_contributor':
        if (user.communityMetrics) {
          const levelInfo = trustLevelService.getTrustLevelInfo(user.communityMetrics.trustLevel);
          return levelInfo.label;
        }
        return 'Community Contributor';
      default:
        return 'Verified';
    }
  },

  /**
   * Legacy method - kept for backward compatibility
   * @deprecated Use canUploadNotes instead
   */
  canPublishContent(user: User | null): boolean {
    return this.canUploadNotes(user);
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('auth-change'));
  },

  updateProfile(updates: Partial<User>) {
    const current = this.getUser();
    if (current) {
      const updated = { ...current, ...updates };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('auth-change'));
      return updated;
    }
    return null;
  }
};
