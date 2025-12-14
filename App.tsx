import React, { useState } from 'react';
import { Dashboard } from './components/owner/Dashboard';
import { PublicMenu } from './components/diner/PublicMenu';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { INITIAL_MENU, DEMO_MENU } from './constants';
import { Menu } from './types';

type ViewMode = 'landing' | 'login' | 'owner' | 'diner' | 'demo';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [menuData, setMenuData] = useState<Menu>(INITIAL_MENU);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setViewMode('owner');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setViewMode('landing');
  };

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
    return <LoginPage onLogin={handleLogin} />;
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
  if (isAuthenticated && viewMode === 'owner') {
     return (
        <Dashboard 
          menu={menuData} 
          onUpdateMenu={handleUpdateMenu} 
          onSwitchToDiner={() => setViewMode('diner')}
          onLogout={handleLogout}
        />
     );
  }

  // Fallback (shouldn't happen with logic above but safe to have)
  return <LoginPage onLogin={handleLogin} />;
}