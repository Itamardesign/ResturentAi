import React, { useState } from 'react';
import { Menu, ViewMode } from '../../types';
import { User } from 'firebase/auth';
import { LayoutDashboard, UtensilsCrossed, BarChart3, QrCode, LogOut, ExternalLink, Menu as MenuIcon, Palette, User as UserIcon, ChevronRight, Settings } from 'lucide-react';
import { MenuEditor } from './MenuEditor';
import { Analytics } from './Analytics';
import { ThemeSelector } from './ThemeSelector';
import { RestaurantSettings } from './RestaurantSettings';
import { Button } from '../Button';
import { Logo } from '../common/Logo';

interface DashboardProps {
  menu: Menu;
  user: User | null;
  onUpdateMenu: (m: Menu) => void;
  onSwitchToDiner: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ menu, user, onUpdateMenu, onSwitchToDiner, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'design' | 'analytics' | 'qrcode' | 'settings'>('editor');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === id
        ? 'bg-orange-50 text-orange-700 font-semibold shadow-sm ring-1 ring-orange-100'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <div className={`relative z-10 transition-colors ${activeTab === id ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
        {icon}
      </div>
      <span className="relative z-10">{label}</span>
      {activeTab === id && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-r-full" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row font-sans">

      {/* Sidebar (Desktop) & Mobile Header */}
      <div className="md:w-72 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col z-20">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className={`${mobileMenuOpen ? 'fixed inset-0 bg-white z-50 flex flex-col' : 'hidden'} md:flex md:flex-col md:h-full md:static`}>

          {/* Mobile Close Button */}
          {mobileMenuOpen && (
            <div className="flex justify-end p-4 md:hidden">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500">
                <ExternalLink className="w-6 h-6 rotate-180" /> {/* Reuse icon for close */}
              </button>
            </div>
          )}

          {/* Brand */}
          <div className="hidden md:flex items-center gap-3 px-6 py-8">
            <Logo />
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 space-y-1.5 py-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Main</div>
            <NavItem id="editor" label="Menu Editor" icon={<UtensilsCrossed className="w-5 h-5" />} />
            <NavItem id="design" label="Design & Theme" icon={<Palette className="w-5 h-5" />} />
            <NavItem id="settings" label="Restaurant Details" icon={<Settings className="w-5 h-5" />} />

            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-6">Insights</div>
            <NavItem id="analytics" label="Analytics" icon={<BarChart3 className="w-5 h-5" />} />
            <NavItem id="qrcode" label="QR Code" icon={<QrCode className="w-5 h-5" />} />
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
            <button
              onClick={onSwitchToDiner}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-700 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-orange-50 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">View Live Menu</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-400" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 px-2 py-3 mt-2">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold border border-orange-200">
                {user?.email ? user.email.substring(0, 2).toUpperCase() : <UserIcon className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName || user?.email || 'Guest Owner'}</p>
                <button onClick={onLogout} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">

          {/* Header Area */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {activeTab === 'editor' && 'Menu Management'}
              {activeTab === 'design' && 'Appearance & Style'}
              {activeTab === 'settings' && 'Restaurant Details'}
              {activeTab === 'analytics' && 'Performance Overview'}
              {activeTab === 'qrcode' && 'QR Code & Sharing'}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'editor' && 'Manage your dishes, categories, and availability.'}
              {activeTab === 'design' && 'Customize how your menu looks to customers.'}
              {activeTab === 'settings' && 'Update address, opening hours, and branding.'}
              {activeTab === 'analytics' && 'Track views and popular items.'}
              {activeTab === 'qrcode' && 'Print and share your digital menu.'}
            </p>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'editor' && <MenuEditor menu={menu} onUpdateMenu={onUpdateMenu} />}
            {activeTab === 'design' && <ThemeSelector currentMenu={menu} onUpdateMenu={onUpdateMenu} />}
            {activeTab === 'settings' && <RestaurantSettings menu={menu} onUpdateMenu={onUpdateMenu} />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'qrcode' && (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg mx-auto">
                <div className="bg-orange-50 p-4 rounded-full mb-4">
                  <QrCode className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan to View Menu</h2>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">Customers can scan this code to view your digital menu instantly.</p>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 transform hover:scale-105 transition-transform duration-300">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(window.location.origin + '/menu/' + menu.id)}`} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(window.location.origin + '/menu/' + menu.id)}`, '_blank')}>Download PNG</Button>
                  <Button onClick={() => window.open(`/menu/${menu.id}`, '_blank')}>Preview Live Menu</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};