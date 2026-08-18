import React from 'react';
import { Home, Search, Sparkles, MessageCircle, User } from 'lucide-react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { conversations } = useMatrimony();
  const { currentUser } = useAuth();
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'matches', label: 'Matches', icon: Sparkles, badge: 'New' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, count: unreadCount },
    { id: 'dashboard', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12080B]/98 border-t border-amber-500/30 backdrop-blur-xl pb-safe shadow-2xl"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            currentTab === item.id ||
            (item.id === 'dashboard' && (currentTab === 'my-profile' || currentTab === 'profile'));
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[48px] relative transition-colors cursor-pointer ${
                isActive ? 'text-amber-300 font-bold' : 'text-stone-400 font-medium hover:text-amber-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-amber-300' : ''}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-stone-950 text-[9px] font-bold px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center shadow-xs">
                    {item.count}
                  </span>
                )}
                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
