import React, { useState } from 'react';
import { Button } from '../Button';
import { ChefHat } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-600/20">
            <ChefHat className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to manage your digital menu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="owner@restaurant.com"
              defaultValue="demo@bistrotai.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs font-medium text-orange-600 hover:text-orange-700">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="••••••••"
              defaultValue="password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-3" 
            loading={isLoading}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="#" className="font-medium text-orange-600 hover:text-orange-700">Create one</a>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400">
        © 2025 Bistrot AI. All rights reserved.
      </p>
    </div>
  );
};