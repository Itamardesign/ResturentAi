import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MOCK_DAILY_VIEWS, MOCK_POPULAR_ITEMS } from '../../constants';
import { TrendingUp, Users, MousePointerClick } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Users className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total Views (Week)</span>
            </div>
            <div className="mt-auto">
                <p className="text-3xl font-bold text-gray-900">1,477</p>
                <p className="text-xs text-green-600 mt-2 flex items-center font-medium bg-green-50 self-start inline-block px-2 py-1 rounded-full w-fit">
                    <TrendingUp className="w-3 h-3 mr-1" /> 12% vs last week
                </p>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">Avg. Time on Menu</span>
            </div>
             <div className="mt-auto">
                <p className="text-3xl font-bold text-gray-900">3m 42s</p>
                <p className="text-xs text-gray-400 mt-2">Diners spend time browsing.</p>
             </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <MousePointerClick className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">Top Category</span>
            </div>
             <div className="mt-auto">
                <p className="text-3xl font-bold text-gray-900">Signature</p>
                <p className="text-xs text-gray-400 mt-2">45% of total interactions.</p>
             </div>
         </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Views & Orders Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Weekly Traffic</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DAILY_VIEWS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="views" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Most Popular Items</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_POPULAR_ITEMS} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#4B5563', fontWeight: 500}}/>
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="views" fill="#F97316" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};