
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
}

export interface Session {
  user: UserProfile | null;
  accessToken: string | null;
}

export interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  initialCheckDone: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any | null, user: UserProfile | null }>;
  signOut: () => Promise<{ error: any | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any | null }>;
  signInWithOAuth: (provider: 'google' | 'facebook' | 'github') => Promise<{ error: any | null }>;
}
