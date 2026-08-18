import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { MatrimonyProvider, useMatrimony } from './context/MatrimonyContext';

import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

import { ProfileDetailModal } from './components/profile/ProfileDetailModal';
import { ProfileComparisonModal } from './components/profile/ProfileComparisonModal';
import { MultiStepRegistrationModal } from './components/auth/MultiStepRegistrationModal';
import { LoginModal } from './components/auth/LoginModal';
import { AssistedMatrimonyModal } from './components/common/AssistedMatrimonyModal';
import { UpgradePlanModal } from './components/membership/UpgradePlanModal';
import { ChatDrawer } from './components/chat/ChatDrawer';

import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { MatchesView } from './views/MatchesView';
import { HoroscopeView } from './views/HoroscopeView';
import { MembershipView } from './views/MembershipView';
import { StoriesView } from './views/StoriesView';
import { DashboardView } from './views/DashboardView';
import { MyProfileView } from './views/MyProfileView';
import { ShortlistsView } from './views/ShortlistsView';
import { InterestsView } from './views/InterestsView';
import { MessagesView } from './views/MessagesView';
import { SafetyView } from './views/SafetyView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import { BlogView } from './views/BlogView';
import { TermsView } from './views/TermsView';

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { setSearchFilters } = useMatrimony();

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleQuickSearch = (filters: any) => {
    setSearchFilters(prev => ({
      ...prev,
      ...filters
    }));
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'about':
        return <AboutView setCurrentTab={setCurrentTab} />;
      case 'search':
        return <SearchView />;
      case 'matches':
        return <MatchesView setCurrentTab={setCurrentTab} />;
      case 'horoscope':
        return <HoroscopeView />;
      case 'membership':
        return <MembershipView />;
      case 'stories':
      case 'success-stories':
        return <StoriesView />;
      case 'blog':
        return <BlogView />;
      case 'safety':
        return <SafetyView />;
      case 'privacy':
      case 'terms':
        return <TermsView />;
      case 'contact':
        return <ContactView />;
      case 'dashboard':
        return <DashboardView setCurrentTab={setCurrentTab} />;
      case 'my-profile':
      case 'profile':
        return <MyProfileView setCurrentTab={setCurrentTab} />;
      case 'shortlists':
        return <ShortlistsView setCurrentTab={setCurrentTab} />;
      case 'interests':
        return <InterestsView setCurrentTab={setCurrentTab} />;
      case 'messages':
        return <MessagesView setCurrentTab={setCurrentTab} />;
      case 'admin':
        return <AdminView />;
      case 'home':
      default:
        return (
          <HomeView
            setCurrentTab={setCurrentTab}
            onQuickSearch={handleQuickSearch}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF7F2] dark:bg-[#120B0D] text-[#2D2424] dark:text-[#EFE6DA] flex flex-col font-sans transition-colors duration-200 selection:bg-[#7A1C2E] selection:text-white">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 lg:pb-0">
        {renderActiveTab()}
      </main>

      <Footer setCurrentTab={setCurrentTab} />
      <MobileBottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Global Modals & Drawers */}
      <ProfileDetailModal />
      <ProfileComparisonModal />
      <MultiStepRegistrationModal />
      <LoginModal />
      <AssistedMatrimonyModal />
      <UpgradePlanModal />
      <ChatDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <MatrimonyProvider>
              <MainContent />
            </MatrimonyProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
