import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Settings2, FileSpreadsheet, ChevronDown, Bell, User,
  Settings, LogOut, LineChart, HelpCircle, Lock,
  FileText, Box, Package, Eye, Construction, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import General from '@/components/dashboard/General';
import Tubesheet from '@/components/dashboard/Tubesheet/Tubesheet';
import { ReportVariables } from '@/components/dashboard/ReportVariables';
import { Legends } from '@/components/dashboard/Legends';
import { Preferences } from '@/components/dashboard/Preferences';
import { License } from '@/components/dashboard/License';
import { Help } from '@/components/dashboard/Help';

export const dynamic = 'force-dynamic';

interface UserSession {
  user?: {
    name?: string;
    image?: string;
  };
}

const WELCOME_SHOWN_KEY = 'welcome_shown';

export default function Dashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { data: session, status } = useSession() as { data: UserSession | null; status: string };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Reporting');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const menuItems = {
    main: [
      { id: 'Reporting', icon: FileText, label: 'Reporting', color: 'text-[#FFC857]' },
      { id: 'Tubesheet', icon: Box, label: 'Tubesheet', color: 'text-[#FFC857]' },
      { id: '3D Model', icon: Package, label: '3D Model', color: 'text-[#FFC857]' },
      {
        id: 'Inspection',
        icon: Eye,
        label: 'Inspection',
        color: 'text-[#FFC857]',
        hasDropdown: true,
        subItems: [
          { id: 'ProVis', label: 'ProVis' },
          { id: 'BoroVis', label: 'BoroVis' },
          { id: 'CaliPro', label: 'CaliPro' }
        ]
      },
      {
        id: 'Settings',
        icon: Settings,
        label: 'Settings',
        color: 'text-[#4A90E2]',
        hasDropdown: true,
        subItems: [
          { id: 'General', icon: Settings2, label: 'General' },
          { id: 'Report-Variables', icon: FileSpreadsheet, label: 'Report Variables' },
          { id: 'Legends', icon: LineChart, label: 'Legends' },
          { id: 'Preferences', icon: Settings, label: 'Preferences' },
          { id: 'License', icon: Lock, label: 'License' },
          { id: 'Help', icon: HelpCircle, label: 'Help' }
        ]
      }
    ]
  };

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user) {
      const hasShownWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
      if (!hasShownWelcome) {
        setShowWelcome(true);
        localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
        const timer = setTimeout(() => setShowWelcome(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const renderMenuItem = (item: any, isSubItem = false) => {
    const isActive = activeSection === item.id || activeSubSection === item.id;
    const paddingLeft = isSubItem ? 'pl-8' : 'pl-4';

    return (
      <motion.li key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button
          onClick={() => {
            if (item.id === 'Settings') {
              setIsSettingsOpen(!isSettingsOpen);
            } else if (item.id === 'Inspection') {
              setIsInspectionOpen(!isInspectionOpen);
            } else {
              setActiveSection(item.id);
              setActiveSubSection(item.id);
            }
          }}
          className={`flex w-full items-center gap-3 ${paddingLeft} py-3 rounded-lg transition-all duration-200 group 
            ${isActive ? 'bg-gradient-to-r from-[#282828] to-[#1E1E1E] text-[#E0E0E0] shadow-lg' : 'text-[#9A9A9A] hover:bg-[#282828]/50'}
            ${!isNavCollapsed ? 'px-4' : 'justify-center px-2'}`}
        >
          {item.icon && (
            <div className={`relative ${isActive ? 'text-[#FFC857]' : item.color}`}>
              <item.icon className={`w-5 h-5 group-hover:scale-110 transition-transform duration-200`} />
              {isActive && !isNavCollapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FFC857] rounded-r-full"
                />
              )}
            </div>
          )}
          {!isNavCollapsed && (
            <>
              <span className={`flex-1 truncate ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
              {(item.id === 'Settings' || item.id === 'Inspection') && (
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  (item.id === 'Settings' && isSettingsOpen) || 
                  (item.id === 'Inspection' && isInspectionOpen) ? 'rotate-180' : ''
                }`} />
              )}
            </>
          )}
        </button>

        {item.subItems && !isNavCollapsed && (
          <AnimatePresence>
            {((item.id === 'Settings' && isSettingsOpen) || 
              (item.id === 'Inspection' && isInspectionOpen)) && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {item.subItems.map((subItem: any) => renderMenuItem(subItem, true))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </motion.li>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#181818]">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-4 border-[#282828]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#FFC857] animate-spin"></div>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSubSection || activeSection) {
      case 'Tubesheet':
        return (
          <div className="h-[calc(100vh-theme(spacing.16))]">
            <Tubesheet />
          </div>
        );
      case 'General':
        return <General />;
      case 'Report-Variables':
        return <ReportVariables />;
      case 'Legends':
        return <Legends />;
      case 'Preferences':
        return <Preferences />;
      case 'License':
        return <License />;
      case 'Help':
        return <Help />;
      case 'Reporting':
      case '3D Model':
      case 'ProVis':
      case 'BoroVis':
      case 'CaliPro':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] p-8 rounded-xl shadow-lg border border-[#282828]"
          >
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-gradient-to-br from-[#282828] to-[#1E1E1E] rounded-full flex items-center justify-center shadow-xl"
              >
                <Construction className="w-12 h-12 text-[#FFC857]" />
              </motion.div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#E0E0E0]">
                  Under Construction
                </h3>
                <p className="text-[#9A9A9A]">
                  Our team is working hard to build this feature. Stay tuned!
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3"
              >
                <span className="inline-flex h-3 w-3 animate-bounce rounded-full bg-[#FFC857]"></span>
                <span className="inline-flex h-3 w-3 animate-bounce rounded-full bg-[#FFC857] [animation-delay:0.2s]"></span>
                <span className="inline-flex h-3 w-3 animate-bounce rounded-full bg-[#FFC857] [animation-delay:0.4s]"></span>
              </motion.div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] p-8 rounded-xl shadow-lg border border-[#282828]"
          >
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-gradient-to-br from-[#282828] to-[#1E1E1E] rounded-full flex items-center justify-center shadow-xl"
              >
                <Construction className="w-12 h-12 text-[#FFC857]" />
              </motion.div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#E0E0E0]">
                  {activeSubSection || activeSection}
                </h3>
                <p className="text-[#9A9A9A]">
                  Our team is working hard to build this feature. Stay tuned!
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3"
              >
                <span className="inline-flex h-3 w-3 animate-bounce rounded-full bg-[#FFC857]"></span>
                <span className="inline-flex h-3 w-3 animate-bounce rounded-full bg-[#FFC857] [animation-delay:0.2s]"></span>
                <span className="inline-flex h-3 w-3 animate-bounce rounded-full bg-[#FFC857] [animation-delay:0.4s]"></span>
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181818]">
      {/* Sidebar */}
      <motion.nav
        animate={{ width: isNavCollapsed ? '4rem' : '16rem' }}
        className="bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-screen fixed left-0 top-0 border-r border-[#282828] z-20 shadow-xl"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#282828] bg-gradient-to-r from-[#1E1E1E] to-[#282828]">
          {!isNavCollapsed && (
            <motion.span className="text-xl font-bold bg-gradient-to-r from-[#FFC857] to-[#4A90E2] bg-clip-text text-transparent">
              ProVis
            </motion.span>
          )}
          <button
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[#282828] transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 text-[#E0E0E0] transform transition-transform ${isNavCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="px-2 py-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.main.map(item => renderMenuItem(item))}
          </ul>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className={`flex-1 ${isNavCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <motion.header
          initial={{ y: 0 }}
          animate={{ y: isHeaderVisible ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-16 flex items-center justify-end px-6 border-b border-[#282828] shadow-lg z-10 backdrop-blur-sm bg-opacity-95"
          style={{ width: `calc(100% - ${isNavCollapsed ? '4rem' : '16rem'})` }}
        >
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-[#9A9A9A] hover:bg-[#282828] rounded-full transition-all duration-200 hover:text-[#E0E0E0]"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFC857] rounded-full animate-pulse"></span>
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 text-[#9A9A9A] hover:bg-[#282828] rounded-lg transition-all duration-200 hover:text-[#E0E0E0]"
              >
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-[#282828] group-hover:ring-[#FFC857]" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-tr from-[#FFC857] to-[#4A90E2] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#E0E0E0]" />
                  </div>
                )}
                <span className="font-medium">{session?.user?.name || 'User'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] rounded-lg shadow-xl border border-[#282828] overflow-hidden"
                  >
                    <div className="py-1">
                      <motion.button
                        whileHover={{ backgroundColor: '#282828' }}
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 w-full transition-all duration-200 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="pt-20 p-6">
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-[#1E1E1E] to-[#282828] rounded-lg shadow-lg border border-[#282828]"
              >
                <div className="flex items-center gap-2 text-[#FFC857] font-medium">
                  <span className="text-2xl">👋</span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {renderActiveSection()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}