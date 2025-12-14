import React from 'react';
import { Menu, MenuTemplate } from '../../types';
import { MENU_TEMPLATES } from '../../constants';
import { Check, Palette, Smartphone, Monitor } from 'lucide-react';

interface ThemeSelectorProps {
  currentMenu: Menu;
  onUpdateMenu: (menu: Menu) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentMenu, onUpdateMenu }) => {
  
  const handleSelectTemplate = (template: MenuTemplate) => {
    onUpdateMenu({
      ...currentMenu,
      style: template.style
    });
  };

  const isCurrentStyle = (template: MenuTemplate) => {
    return JSON.stringify(template.style) === JSON.stringify(currentMenu.style);
  };

  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MENU_TEMPLATES.map((template) => {
          const isActive = isCurrentStyle(template);
          return (
            <div 
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`group relative rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                isActive 
                  ? 'border-purple-600 shadow-xl ring-2 ring-purple-100 scale-[1.02]' 
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {/* Preview Header */}
              <div className={`h-40 ${template.thumbnail} relative flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  {/* Abstract UI representation */}
                  <div className="w-32 h-48 bg-white rounded-t-xl shadow-lg transform translate-y-8 flex flex-col p-2 gap-2 opacity-90">
                      <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                      <div className="h-2 w-2/3 bg-gray-200 rounded-full mb-2"></div>
                      <div className="flex gap-2">
                         <div className="w-8 h-8 bg-gray-100 rounded"></div>
                         <div className="flex-1 space-y-1">
                             <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                             <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <div className="w-8 h-8 bg-gray-100 rounded"></div>
                         <div className="flex-1 space-y-1">
                             <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                         </div>
                      </div>
                  </div>

                  {isActive && (
                    <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md z-10 animate-in zoom-in duration-300">
                      <Check className="w-5 h-5 text-purple-600 stroke-[3]" />
                    </div>
                  )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-gray-900 text-lg ${isActive ? 'text-purple-700' : ''}`}>{template.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{template.description}</p>
                
                {/* Style Specs */}
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-lg">Aa</span>
                    {template.style.fontFamily === 'sans' ? 'Sans' : 'Serif'}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                    <Smartphone className="w-3.5 h-3.5" />
                    {template.style.layout === 'list' ? 'List View' : 'Grid View'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Current Style Details */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-4">
             <div className="p-3 bg-gray-100 rounded-2xl text-gray-500">
                 <Monitor className="w-6 h-6" />
             </div>
             <div>
                <h3 className="font-bold text-gray-900">Current Configuration</h3>
                <p className="text-sm text-gray-500">Customize specific colors manually if needed.</p>
             </div>
         </div>
         
         <div className="flex gap-6">
             <div className="text-center">
                 <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 mb-2 mx-auto" style={{ backgroundColor: currentMenu.style.primaryColor }}></div>
                 <span className="text-xs font-mono text-gray-500 uppercase">{currentMenu.style.primaryColor}</span>
             </div>
             <div className="text-center">
                 <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 mb-2 mx-auto" style={{ backgroundColor: currentMenu.style.backgroundColor }}></div>
                 <span className="text-xs font-mono text-gray-500 uppercase">{currentMenu.style.backgroundColor}</span>
             </div>
         </div>
      </div>
    </div>
  );
};