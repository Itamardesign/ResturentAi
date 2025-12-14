import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/owner/Dashboard';
import { PublicMenu } from './components/diner/PublicMenu';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { INITIAL_MENU, DEMO_MENU } from './constants';
import { Menu } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';


type ViewMode = 'landing' | 'login' | 'owner' | 'diner' | 'demo';

function AppContent() {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [menuData, setMenuData] = useState<Menu>(INITIAL_MENU);

  useEffect(() => {
    if (user) {
      setViewMode('owner');
    } else if (viewMode === 'owner') {
      setViewMode('landing');
    }
  }, [user]);

  const handleUpdateMenu = (updatedMenu: Menu) => {
    setMenuData(updatedMenu);
  };

  // Routing Logic
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setViewMode('login')}
        onLogin={() => setViewMode('login')}
        onViewDemo={() => setViewMode('demo')}
      />
    );
  }

  if (viewMode === 'demo') {
    return (
      <PublicMenu
        menu={DEMO_MENU}
        onBack={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'login') {
    return <LoginPage onLogin={() => { }} />; // Login logic handled inside LoginPage via context
  }

  if (viewMode === 'diner') {
    return (
      <PublicMenu
        menu={menuData}
        onBack={() => setViewMode('owner')}
      />
    );
  }

  // Default to Owner Dashboard if authenticated
  if (user && viewMode === 'owner') {
    return (
      <Dashboard
        menu={menuData}
        onUpdateMenu={handleUpdateMenu}
        onSwitchToDiner={() => setViewMode('diner')}
        onLogout={logout}
      />
    );
  }

  // Fallback
  return <LoginPage onLogin={() => { }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}