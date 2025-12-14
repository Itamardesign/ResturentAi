import React, { useState } from 'react';
import { MenuCategory } from '../../types';
import { Button } from '../Button';
import { Loader2, Wand2 } from 'lucide-react';
import { translateContent } from '../../services/geminiService';

interface CategoryFormProps {
  initialData?: MenuCategory;
  onSave: (category: MenuCategory) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSave, onCancel }) => {
  const [nameEn, setNameEn] = useState(initialData?.name.en || '');
  const [nameTh, setNameTh] = useState(initialData?.name.th || '');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn) return;

    onSave({
      id: initialData?.id || `cat-${Date.now()}`,
      name: { en: nameEn, th: nameTh || nameEn },
      items: initialData?.items || []
    });
  };

  const handleTranslate = async (source: 'en' | 'th') => {
    const text = source === 'en' ? nameEn : nameTh;
    if (!text) return;

    setLoadingAI(source);
    const targetLang = source === 'en' ? 'th' : 'en';
    const result = await translateContent(text, targetLang);
    
    if (source === 'en') setNameTh(result);
    else setNameEn(result);
    
    setLoadingAI(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {initialData ? 'Edit Category' : 'New Category'}
        </h3>
        
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                required
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g., Desserts"
              />
              <button
                type="button"
                onClick={() => handleTranslate('en')}
                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                title="Translate to Thai"
              >
                 {loadingAI === 'en' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (Thai)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-orange-500 outline-none font-thai"
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="e.g., ของหวาน"
              />
              <button
                type="button"
                onClick={() => handleTranslate('th')}
                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                title="Translate to English"
              >
                 {loadingAI === 'th' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Category</Button>
        </div>
      </form>
    </div>
  );
};