import React, { useState, useEffect, useRef } from 'react';
import { MenuItem, MenuCategory, ImageEnhancement, SpicinessLevel } from '../../types';
import { Button } from '../Button';
import { Wand2, Image as ImageIcon, Sparkles, Loader2, X, UploadCloud, ChevronLeft, ArrowLeft, Flame, Leaf, WheatOff, ChefHat, ThumbsUp, TrendingUp, Clock } from 'lucide-react';
import { translateContent, generateDescription, fileToGenerativePart, transformImage } from '../../services/geminiService';
import { ImageGenerationModal } from './ImageGenerationModal';

interface MenuItemFormProps {
    initialData?: MenuItem;
    categories: MenuCategory[];
    onSave: (item: MenuItem) => void;
    onCancel: () => void;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ initialData, categories, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<MenuItem>>(initialData || {
        name: { en: '', th: '' },
        description: { en: '', th: '' },
        price: 0,
        categoryId: categories[0]?.id || '',
        isAvailable: true,
        tags: [],
        dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'none' }
    });

    const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.image);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [loadingAI, setLoadingAI] = useState<string | null>(null); // 'translate' | 'desc' | 'image'
    const [showImageGenModal, setShowImageGenModal] = useState(false);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLocalizedChange = (field: 'name' | 'description', lang: 'en' | 'th', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value }
        }));
    };

    const handleDietaryChange = (field: keyof MenuItem['dietaryInfo'], value: any) => {
        setFormData(prev => ({
            ...prev,
            dietaryInfo: {
                ...(prev.dietaryInfo || { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'none' }),
                [field]: value
            }
        }));
    }

    const toggleTag = (tag: string) => {
        setFormData(prev => {
            const currentTags = prev.tags || [];
            if (currentTags.includes(tag)) {
                return { ...prev, tags: currentTags.filter(t => t !== tag) };
            } else {
                return { ...prev, tags: [...currentTags, tag] };
            }
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const base64 = await fileToGenerativePart(file);
            const fullBase64 = `data:${file.type};base64,${base64}`;
            setImagePreview(fullBase64);
            setFormData(prev => ({ ...prev, image: fullBase64 }));
        }
    };


    const triggerAITranslate = async (field: 'name' | 'description', sourceLang: 'en' | 'th') => {
        const sourceText = formData[field]?.[sourceLang];
        if (!sourceText) return;
        setLoadingAI(`translate-${field}`);
        const targetLang = sourceLang === 'en' ? 'th' : 'en';
        const result = await translateContent(sourceText, targetLang);
        handleLocalizedChange(field, targetLang, result);
        setLoadingAI(null);
    };

    const triggerAIGenerateDesc = async () => {
        const name = formData.name?.en || formData.name?.th;
        if (!name) return;
        setLoadingAI('desc');
        if (!formData.description?.en) {
            const descEn = await generateDescription(name, 'en');
            handleLocalizedChange('description', 'en', descEn);
        }
        if (!formData.description?.th) {
            const descTh = await generateDescription(name, 'th');
            handleLocalizedChange('description', 'th', descTh);
        }
        setLoadingAI(null);
    }

    const saveItem = (overrideData?: Partial<MenuItem>) => {
        const dataToSave = { ...formData, ...overrideData };

        // Basic validation: Check required fields (Name EN, Price, Category)
        // If these are missing, we can't save yet. 
        // For auto-save context (image generation), the user might be editing a valid existing item, in which case this passes.
        // If it's a completely new item and they haven't typed a name yet but generated an image, this will silently fail to auto-save, which is probably safer than erroring.
        if (!dataToSave.name?.en || !dataToSave.price || !dataToSave.categoryId) return;

        const finalData: MenuItem = {
            id: initialData?.id || Date.now().toString(),
            ...dataToSave as MenuItem
        };

        if (!finalData.dietaryInfo) {
            finalData.dietaryInfo = { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'none' };
        }
        onSave(finalData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveItem();
    };


    const currentDietary = formData.dietaryInfo || { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'none' };
    const currentTags = formData.tags || [];

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Dish' : 'New Dish'}</h2>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </div>

            <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Image Upload (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="sticky top-24">
                            <label className="block text-sm font-bold text-gray-900 mb-2">Dish Photo</label>
                            <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-orange-300 hover:bg-orange-50/20 transition-all group">
                                {imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-medium flex items-center gap-2">
                                                <UploadCloud className="w-4 h-4" /> Change Photo
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                        <div className="p-4 bg-white rounded-full shadow-sm">
                                            <ImageIcon className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <span className="text-sm font-medium">Click to upload image</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {imagePreview && (
                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full justify-center bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100"
                                        onClick={() => setShowImageGenModal(true)}
                                        icon={<Wand2 className="w-4 h-4" />}
                                    >
                                        AI Studio Shoot (Nano Banana Style)
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Details (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Basic Info */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                            <h3 className="font-bold text-gray-900">Basic Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-xl border-gray-300 p-3 bg-white shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            value={formData.categoryId}
                                            onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name.en}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (THB)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">฿</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Name EN */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex justify-between">
                                        Name (English)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            value={formData.name?.en}
                                            onChange={(e) => handleLocalizedChange('name', 'en', e.target.value)}
                                            placeholder="e.g., Pad Thai"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => triggerAITranslate('name', 'en')}
                                            className="px-3 bg-white border border-gray-200 rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all text-gray-400"
                                            title="Translate to Thai"
                                        >
                                            {loadingAI === 'translate-name' ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Name TH */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex justify-between">
                                        Name (Thai)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-thai"
                                            value={formData.name?.th}
                                            onChange={(e) => handleLocalizedChange('name', 'th', e.target.value)}
                                            placeholder="e.g., ผัดไทย"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => triggerAITranslate('name', 'th')}
                                            className="px-3 bg-white border border-gray-200 rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all text-gray-400"
                                            title="Translate to English"
                                        >
                                            {loadingAI === 'translate-name' ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Highlights (Tags) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
                            <h3 className="font-bold text-gray-900">Highlights</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => toggleTag("Recommended")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${currentTags.includes("Recommended")
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <ThumbsUp className={`w-4 h-4 ${currentTags.includes("Recommended") ? 'fill-current' : ''}`} />
                                    Recommended
                                </button>

                                <button
                                    type="button"
                                    onClick={() => toggleTag("Chef's Choice")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${currentTags.includes("Chef's Choice")
                                        ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <ChefHat className="w-4 h-4" />
                                    Chef's Favourite
                                </button>

                                <button
                                    type="button"
                                    onClick={() => toggleTag("Best Seller")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${currentTags.includes("Best Seller")
                                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700 ring-1 ring-yellow-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Best Seller
                                </button>

                                <button
                                    type="button"
                                    onClick={() => toggleTag("New")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${currentTags.includes("New")
                                        ? 'bg-purple-50 border-purple-200 text-purple-700 ring-1 ring-purple-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    New
                                </button>
                            </div>
                        </div>

                        {/* Dietary & Preferences */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6">
                            <h3 className="font-bold text-gray-900">Dietary & Preferences</h3>

                            {/* Spiciness Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Spiciness Level</label>
                                <div className="flex gap-2">
                                    {(['none', 'mild', 'medium', 'hot'] as SpicinessLevel[]).map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => handleDietaryChange('spiciness', level)}
                                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${currentDietary.spiciness === level
                                                ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {level === 'none' && <span className="text-gray-400">No Spice</span>}
                                            {level === 'mild' && <><Flame className="w-3 h-3 text-orange-400" /> Mild</>}
                                            {level === 'medium' && <><Flame className="w-3 h-3 text-red-500" /> Medium</>}
                                            {level === 'hot' && <><Flame className="w-3 h-3 text-red-700 fill-red-700" /> Hot</>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${currentDietary.isVegetarian ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${currentDietary.isVegetarian ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                                        {currentDietary.isVegetarian && <Leaf className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={currentDietary.isVegetarian}
                                        onChange={(e) => handleDietaryChange('isVegetarian', e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                                </label>

                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${currentDietary.isVegan ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${currentDietary.isVegan ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                                        {currentDietary.isVegan && <Leaf className="w-3 h-3 text-white fill-current" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={currentDietary.isVegan}
                                        onChange={(e) => handleDietaryChange('isVegan', e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Vegan</span>
                                </label>

                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${currentDietary.isGlutenFree ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${currentDietary.isGlutenFree ? 'bg-amber-500 border-amber-500' : 'border-gray-300 bg-white'}`}>
                                        {currentDietary.isGlutenFree && <WheatOff className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={currentDietary.isGlutenFree}
                                        onChange={(e) => handleDietaryChange('isGlutenFree', e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Gluten Free</span>
                                </label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Descriptions</h3>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="text-orange-600 text-xs bg-orange-50 hover:bg-orange-100"
                                    onClick={triggerAIGenerateDesc}
                                    loading={loadingAI === 'desc'}
                                    icon={<Sparkles className="w-3 h-3" />}
                                >
                                    Auto-Generate
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">English</label>
                                    <textarea
                                        className="w-full rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all min-h-[100px] text-sm"
                                        placeholder="Describe the dish ingredients and taste..."
                                        value={formData.description?.en}
                                        onChange={(e) => handleLocalizedChange('description', 'en', e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thai</label>
                                    <textarea
                                        className="w-full rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all min-h-[100px] text-sm font-thai"
                                        placeholder="คำอธิบายรสชาติและวัตถุดิบ..."
                                        value={formData.description?.th}
                                        onChange={(e) => handleLocalizedChange('description', 'th', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                checked={formData.isAvailable}
                                onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                                className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isAvailable" className="text-gray-900 font-medium">Available for ordering</label>
                        </div>

                    </div>
                </div>
            </div>

            {/* AI Studio Modal */}
            {imagePreview && (
                <ImageGenerationModal
                    isOpen={showImageGenModal}
                    onClose={() => setShowImageGenModal(false)}
                    originalImage={imagePreview}
                    onApply={(newImage) => {
                        const fullBase64 = `data:image/jpeg;base64,${newImage}`;
                        setFormData(prev => ({ ...prev, image: fullBase64 }));
                        setImagePreview(fullBase64);
                        setShowImageGenModal(false);
                        // Auto-save immediately with the new image
                        saveItem({ image: fullBase64 });
                    }}
                    onGenerate={async (prompt) => {
                        const base64Content = imagePreview.split(',')[1];
                        return await transformImage(base64Content, prompt);
                    }}
                />
            )}
        </form>
    );
};