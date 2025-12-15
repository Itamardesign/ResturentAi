import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/owner/Dashboard';
import { PublicMenu } from './components/diner/PublicMenu';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { INITIAL_MENU, DEMO_MENU, EMPTY_MENU } from './constants';
import { Menu } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';


type ViewMode = 'landing' | 'login' | 'owner' | 'diner' | 'demo';

import { saveMenu, getMenu } from './services/menuService';

function AppContent() {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [menuData, setMenuData] = useState<Menu | null>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setViewMode('owner');
      const loadUserMenu = async () => {
        setIsLoadingMenu(true);
        setError(null);
        try {
          const savedMenu = await getMenu(user.uid);
          if (savedMenu) {
            setMenuData(savedMenu);
          } else {
            // If new user, save the empty menu
            const newMenu = { ...EMPTY_MENU, id: user.uid }; // Use userId as menuId for simplicity
            await saveMenu(user.uid, newMenu);
            setMenuData(newMenu);
          }
        } catch (err: any) {
          console.error("Failed to load menu", err);
          setError(err.message || "Failed to load menu");
        } finally {
          setIsLoadingMenu(false);
        }
      };
      loadUserMenu();
    } else if (viewMode === 'owner') {
      setViewMode('landing');
      setMenuData(null);
      setError(null);
    }
  }, [user]);

  const handleUpdateMenu = async (updatedMenu: Menu) => {
    setMenuData(updatedMenu);
    if (user) {
      try {
        await saveMenu(user.uid, updatedMenu);
      } catch (error) {
        console.error("Failed to save menu", error);
        // Optionally set error here too, but might be annoying for auto-save
      }
    }
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
        menu={menuData || EMPTY_MENU} // Fallback to empty if null (shouldn't happen in diner mode usually)
        onBack={() => setViewMode('owner')}
      />
    );
  }

  // Default to Owner Dashboard if authenticated
  if (user && viewMode === 'owner') {
    if (error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            {error.includes("permissions") && (
              <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm mb-6 text-left">
                <strong>Firebase Permissions Error:</strong><br />
                You need to update your Firestore Security Rules in the Firebase Console to allow reading/writing data.
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (isLoadingMenu || !menuData) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      );
    }

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