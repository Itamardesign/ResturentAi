import React, { useState } from 'react';
import { Menu, MenuItem, MenuCategory } from '../../types';
import { Button } from '../Button';
import { MenuItemForm } from './MenuItemForm';
import { MenuImportModal } from './MenuImportModal';
import { ScanMenuModal } from './ScanMenuModal';
import { CategoryForm } from './CategoryForm';
import { ExtractedCategory } from '../../services/geminiService';
import { Plus, Edit2, Trash2, GripVertical, Search, Sparkles, FolderPlus, MoreHorizontal, Image as ImageIcon, ChevronUp, ChevronDown, Camera } from 'lucide-react';

interface MenuEditorProps {
  menu: Menu;
  onUpdateMenu: (updatedMenu: Menu) => void;
}

export const MenuEditor: React.FC<MenuEditorProps> = ({ menu, onUpdateMenu }) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Item Handlers
  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const updatedCategories = menu.categories.map(cat => {
      if (cat.id !== categoryId) return cat;
      return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
    });
    onUpdateMenu({ ...menu, categories: updatedCategories });
  };

  const handleSaveItem = (item: MenuItem) => {
    const isNew = !menu.categories.some(cat => cat.items.some(i => i.id === item.id));
    let updatedCategories = [...menu.categories];

    if (isNew) {
      updatedCategories = updatedCategories.map(cat => {
        if (cat.id === item.categoryId) return { ...cat, items: [...cat.items, item] };
        return cat;
      });
    } else {
      updatedCategories = updatedCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(i => i.id !== item.id)
      }));
      updatedCategories = updatedCategories.map(cat => {
        if (cat.id === item.categoryId) return { ...cat, items: [...cat.items, item] };
        return cat;
      });
    }
    onUpdateMenu({ ...menu, categories: updatedCategories });
    setEditingItem(null);
    setIsAddingItem(false);
  };

  // Category Handlers
  const handleSaveCategory = (category: MenuCategory) => {
    let updatedCategories = [...menu.categories];
    const existingIndex = updatedCategories.findIndex(c => c.id === category.id);

    if (existingIndex >= 0) {
      updatedCategories[existingIndex] = category;
    } else {
      updatedCategories.push(category);
    }

    onUpdateMenu({ ...menu, categories: updatedCategories });
    setEditingCategory(null);
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = menu.categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.items.length > 0) {
      if (!window.confirm(`This category has ${category.items.length} items. Deleting it will delete all items inside. Continue?`)) return;
    } else {
      if (!window.confirm('Delete this category?')) return;
    }

    onUpdateMenu({
      ...menu,
      categories: menu.categories.filter(c => c.id !== categoryId)
    });
    if (activeCategoryFilter === categoryId) setActiveCategoryFilter('all');
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...menu.categories];
    if (direction === 'up' && index > 0) {
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
    } else if (direction === 'down' && index < newCategories.length - 1) {
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    }
    onUpdateMenu({ ...menu, categories: newCategories });
  };

  const handleAIImport = (extractedData: ExtractedCategory[]) => {
    let newCategories = [...menu.categories];

    extractedData.forEach(extractedCat => {
      let categoryId = '';
      const existingCatIndex = newCategories.findIndex(c =>
        c.name.en.toLowerCase() === extractedCat.category_name_en.toLowerCase()
      );

      if (existingCatIndex >= 0) {
        categoryId = newCategories[existingCatIndex].id;
      } else {
        categoryId = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newCategories.push({
          id: categoryId,
          name: { en: extractedCat.category_name_en, th: extractedCat.category_name_th },
          items: []
        });
      }

      const newItems: MenuItem[] = extractedCat.items.map(item => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        categoryId: categoryId,
        name: { en: item.name_en, th: item.name_th },
        description: { en: item.description_en, th: item.description_th },
        price: item.price,
        isAvailable: true,
        tags: [],
        dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'none' }
      }));

      newCategories = newCategories.map(c => {
        if (c.id === categoryId) return { ...c, items: [...c.items, ...newItems] };
        return c;
      });
    });

    onUpdateMenu({ ...menu, categories: newCategories });
  };

  if (editingItem || isAddingItem) {
    return (
      <MenuItemForm
        initialData={editingItem || undefined}
        categories={menu.categories}
        onSave={handleSaveItem}
        onCancel={() => { setEditingItem(null); setIsAddingItem(false); }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Modals */}
      <MenuImportModal isOpen={isImporting} onClose={() => setIsImporting(false)} onImport={handleAIImport} />
      <ScanMenuModal isOpen={isScanning} onClose={() => setIsScanning(false)} onScanComplete={handleAIImport} />

      {(isAddingCategory || editingCategory) && (
        <CategoryForm
          initialData={editingCategory || undefined}
          onSave={handleSaveCategory}
          onCancel={() => { setEditingCategory(null); setIsAddingCategory(false); }}
        />
      )}

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
          <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[200px] lg:max-w-none">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeCategoryFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            {menu.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeCategoryFilter === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.name.en}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full lg:w-auto justify-end">
          <Button
            variant="ghost"
            onClick={() => setIsAddingCategory(true)}
            icon={<FolderPlus className="w-4 h-4 text-gray-500" />}
            className="bg-gray-50 hover:bg-gray-100 border border-transparent"
          >
            Category
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsImporting(true)}
            icon={<Sparkles className="w-4 h-4 text-purple-600" />}
            className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-transparent"
          >
            AI Import
          </Button>
          <Button onClick={() => setIsAddingItem(true)} icon={<Plus className="w-4 h-4" />}>
            Add Item
          </Button>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-8">
        {menu.categories
          .map((category, index) => {
            // Apply filter if active
            if (activeCategoryFilter !== 'all' && category.id !== activeCategoryFilter) return null;

            const visibleItems = category.items.filter(item =>
              item.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.name.th.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (searchTerm && visibleItems.length === 0) return null;

            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">

                {/* Category Header */}
                <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      {activeCategoryFilter === 'all' && (
                        <>
                          <button
                            onClick={() => handleMoveCategory(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-orange-600 disabled:opacity-30 disabled:hover:text-gray-400"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveCategory(index, 'down')}
                            disabled={index === menu.categories.length - 1}
                            className="p-1 text-gray-400 hover:text-orange-600 disabled:opacity-30 disabled:hover:text-gray-400"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {category.name.en}
                      </h3>
                      <p className="text-sm text-gray-500 font-thai">{category.name.th}</p>
                    </div>
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">{visibleItems.length} items</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-50">
                  {visibleItems.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-500 text-sm">No items match your search.</p>
                    </div>
                  ) : visibleItems.map(item => (
                    <div key={item.id} className="group p-4 sm:px-6 flex items-center gap-4 hover:bg-orange-50/30 transition-colors">

                      {/* Item Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm relative group-hover:shadow-md transition-shadow">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-gray-900 truncate text-base">{item.name.en}</h4>
                          {!item.isAvailable && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold tracking-wide rounded">Sold Out</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 font-thai mb-1">{item.name.th}</div>
                        <p className="text-xs text-gray-400 truncate max-w-md">{item.description.en}</p>
                      </div>

                      {/* Price */}
                      <div className="font-bold text-gray-900 text-lg tabular-nums">
                        ฿{item.price}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 transition-all"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(category.id, item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 transition-all"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Item Row (Quick Action) */}
                <button
                  onClick={() => { setIsAddingItem(true); /* Ideally pre-select this category */ }}
                  className="w-full py-3 text-sm text-gray-400 font-medium hover:text-orange-600 hover:bg-orange-50/50 transition-colors border-t border-gray-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add item to {category.name.en}
                </button>
              </div>
            );
          })}

        {menu.categories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your menu is empty</h3>
            <p className="text-gray-500 mb-6">Create a category to start adding dishes.</p>
            <Button onClick={() => setIsAddingCategory(true)}>Create First Category</Button>
            <div className="mt-4">
              <Button variant="ghost" onClick={() => setIsScanning(true)} className="text-orange-600 hover:bg-orange-50">
                <Camera className="w-4 h-4 mr-2" />
                Scan Printed Menu
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};