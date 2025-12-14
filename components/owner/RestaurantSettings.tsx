import React, { useState } from 'react';
import { Menu } from '../../types';
import { Button } from '../Button';
import { UploadCloud, Image as ImageIcon, MapPin, Clock, Link as LinkIcon, Phone } from 'lucide-react';
import { fileToGenerativePart } from '../../services/geminiService';

interface RestaurantSettingsProps {
  menu: Menu;
  onUpdateMenu: (menu: Menu) => void;
}

export const RestaurantSettings: React.FC<RestaurantSettingsProps> = ({ menu, onUpdateMenu }) => {
  const [formData, setFormData] = useState({
    name: menu.name,
    headerImage: menu.restaurantInfo.headerImage || '',
    openingHours: menu.restaurantInfo.openingHours || '',
    address: menu.restaurantInfo.address || '',
    googleMapsLink: menu.restaurantInfo.googleMapsLink || '',
    phone: menu.restaurantInfo.phone || ''
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToGenerativePart(file);
        const fullBase64 = `data:${file.type};base64,${base64}`;
        handleChange('headerImage', fullBase64);
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMenu({
      ...menu,
      name: formData.name,
      restaurantInfo: {
        ...menu.restaurantInfo,
        headerImage: formData.headerImage,
        openingHours: formData.openingHours,
        address: formData.address,
        googleMapsLink: formData.googleMapsLink,
        phone: formData.phone
      }
    });
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Image Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Restaurant Header Photo</h3>
        <p className="text-sm text-gray-500 mb-6">This image will appear at the top of your digital menu. High-quality landscape photos work best.</p>
        
        <div className="relative w-full h-64 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50/20 transition-all group">
          {formData.headerImage ? (
            <>
              <img src={formData.headerImage} alt="Header" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  <UploadCloud className="w-5 h-5"/> Change Photo
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
              <span className="font-medium">Upload Header Image</span>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Restaurant Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Restaurant Name</label>
            <input 
              type="text"
              className="w-full rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Siam Authentic Taste"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" /> Opening Hours
             </label>
             <input 
              type="text"
              className="w-full rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={formData.openingHours}
              onChange={(e) => handleChange('openingHours', e.target.value)}
              placeholder="e.g. Daily: 10AM - 9PM"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
             </label>
             <input 
              type="text"
              className="w-full rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. 02-123-4567"
            />
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Address
             </label>
             <input 
              type="text"
              className="w-full rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. 123 Sukhumvit Road, Bangkok"
            />
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" /> Google Maps Link
             </label>
             <input 
              type="url"
              className="w-full rounded-xl border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={formData.googleMapsLink}
              onChange={(e) => handleChange('googleMapsLink', e.target.value)}
              placeholder="e.g. https://maps.google.com/..."
            />
            <p className="text-xs text-gray-400 mt-1.5">Paste the share link from Google Maps so customers can find you easily.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={!isDirty}>
           {isDirty ? 'Save Changes' : 'Saved'}
        </Button>
      </div>
    </form>
  );
};