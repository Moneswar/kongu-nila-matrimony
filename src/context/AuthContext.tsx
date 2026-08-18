import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types';
import { profileService } from '../services/profileService';
import { mockProfiles } from '../data/mockProfiles';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: Profile;
  isAdmin: boolean;
  isDemoMode: boolean;
  login: (asAdmin?: boolean) => void;
  logout: () => void;
  toggleRole: () => void;
  toggleDemoUser: (profileIndex?: number) => void;
  updateCurrentUser: (updates: Partial<Profile>) => void;
  profileCompletion: { score: number; missing: string[]; missingSections?: { title: string; sectionKey: string; actionText: string }[] };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('knm_auth_status');
    return saved !== null ? saved === 'true' : true; // default authenticated for demo experience
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('knm_is_admin');
    return saved === 'true';
  });

  const [currentUser, setCurrentUser] = useState<Profile>(() => {
    return profileService.getCurrentUser();
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('knm_auth_status', String(isAuthenticated));
    localStorage.setItem('knm_is_admin', String(isAdmin));
  }, [isAuthenticated, isAdmin]);

  const login = (asAdmin = false) => {
    setIsAuthenticated(true);
    setIsAdmin(asAdmin);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const toggleRole = () => {
    setIsAdmin(prev => !prev);
  };

  const toggleDemoUser = (profileIndex?: number) => {
    const targetIdx = profileIndex !== undefined ? profileIndex : (currentUser.gender === 'male' ? 0 : 1);
    const targetUser = mockProfiles[targetIdx] || mockProfiles[0];
    setCurrentUser(targetUser);
    profileService.setCurrentUser(targetUser);
  };

  const updateCurrentUser = (updates: Partial<Profile>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    profileService.updateProfile(updated);
    profileService.setCurrentUser(updated);
  };

  const profileCompletion = profileService.getProfileCompletion(currentUser);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isAdmin,
        isDemoMode,
        login,
        logout,
        toggleRole,
        toggleDemoUser,
        updateCurrentUser,
        profileCompletion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
