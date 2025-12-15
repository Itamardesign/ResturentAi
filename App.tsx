import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { Dashboard } from './components/owner/Dashboard';
import { PublicMenu } from './components/diner/PublicMenu';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { NotFound } from './components/common/NotFound';
import { INITIAL_MENU, DEMO_MENU, EMPTY_MENU } from './constants';
import { Menu } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { saveMenu, getMenu } from './services/menuService';

// Wrapper to handle authenticating and loading owner data
const OwnerDashboardRoute = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [menuData, setMenuData] = useState<Menu | null>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const loadUserMenu = async () => {
        setIsLoadingMenu(true);
        setError(null);
        try {
          const savedMenu = await getMenu(user.uid);
          if (savedMenu) {
            setMenuData(savedMenu);
          } else {
            // New user -> save empty menu
            const newMenu = { ...EMPTY_MENU, id: user.uid };
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
    }
  }, [user, authLoading, navigate]);

  const handleUpdateMenu = async (updatedMenu: Menu) => {
    setMenuData(updatedMenu);
    if (user) {
      try {
        await saveMenu(user.uid, updatedMenu);
      } catch (error) {
        console.error("Failed to save menu", error);
      }
    }
  };

  if (authLoading || (user && isLoadingMenu)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {error.includes("permissions") && (
            <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm mb-6 text-left">
              <strong>Firebase Permissions Error:</strong><br />
              Please checking your Firestore Security Rules.
            </div>
          )}
          <button onClick={() => window.location.reload()} className="bg-orange-600 text-white py-2 px-4 rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  if (!user || !menuData) return null; // Should redirect

  return (
    <Dashboard
      menu={menuData}
      onUpdateMenu={handleUpdateMenu}
      onSwitchToDiner={() => window.open(`/menu/${user.uid}`, '_blank')}
      onLogout={logout}
    />
  );
};

// Route for displaying a public menu by ID
const PublicMenuRoute = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMenu = async () => {
      if (!menuId) return;
      try {
        const data = await getMenu(menuId);
        if (data) {
          setMenu(data);
        } else {
          // Handle "Menu Not Found" specifically if we want, or fall through to 404
          // For now, let's just stay loading false and show null -> 404
        }
      } catch (error) {
        console.error("Error loading menu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, [menuId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!menu) {
    return <NotFound />;
  }

  return <PublicMenu menu={menu} onBack={() => { }} />; // Back button might not be needed for public view, or could go to landing
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPageWrapper />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/dashboard" element={<OwnerDashboardRoute />} />
          <Route path="/demo" element={<PublicMenu menu={DEMO_MENU} onBack={() => window.location.href = '/'} />} />
          <Route path="/menu/:menuId" element={<PublicMenuRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Small wrappers to inject navigation props if needed, or just keep cleaner
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  return (
    <LandingPage
      onGetStarted={() => navigate('/login')}
      onLogin={() => navigate('/login')}
      onViewDemo={() => navigate('/demo')}
    />
  );
};

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  return <LoginPage onLogin={() => navigate('/dashboard')} />;
};