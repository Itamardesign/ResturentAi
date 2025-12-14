import React, { useState } from 'react';
import { Button } from '../Button';
import { UploadCloud, X, FileImage, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { extractMenuFromImages, fileToGenerativePart, ExtractedCategory } from '../../services/geminiService';

interface MenuImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: ExtractedCategory[]) => void;
}

export const MenuImportModal: React.FC<MenuImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      setFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = await Promise.all(newFiles.map(f => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(f);
        });
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const base64Images = await Promise.all(files.map(fileToGenerativePart));
      const data = await extractMenuFromImages(base64Images);
      if (data && data.length > 0) {
        setExtractedData(data);
      } else {
        setError("Could not identify any menu items. Please ensure the image is clear and contains text.");
      }
    } catch (err) {
      setError("An error occurred while processing the images.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (extractedData) {
      onImport(extractedData);
      onClose();
      // Reset state
      setFiles([]);
      setPreviews([]);
      setExtractedData(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Import from Menu Photo</h2>
            <p className="text-sm text-gray-500">Upload photos of your physical menu to auto-generate items.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Upload Section */}
          {!extractedData && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 10MB)</p>
                  </div>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
              <div className="text-center">
                <p className="font-medium text-gray-900">Analyzing Menu...</p>
                <p className="text-sm text-gray-500">Extracting dishes, prices, and translating content.</p>
              </div>
            </div>
          )}

          {/* Results Preview */}
          {extractedData && !isProcessing && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                   <p className="font-medium text-green-800">Analysis Complete!</p>
                   <p className="text-sm text-green-700">Found {extractedData.reduce((acc, cat) => acc + cat.items.length, 0)} items in {extractedData.length} categories.</p>
                </div>
              </div>

              <div className="space-y-6">
                {extractedData.map((cat, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-gray-800 flex justify-between">
                       <span>{cat.category_name_en}</span>
                       <span className="text-gray-500 font-normal font-thai">{cat.category_name_th}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {cat.items.map((item, j) => (
                        <div key={j} className="p-3 flex justify-between items-center text-sm">
                           <div>
                              <div className="font-medium text-gray-900">{item.name_en}</div>
                              <div className="text-gray-500 font-thai">{item.name_th}</div>
                           </div>
                           <div className="font-medium text-orange-600">฿{item.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {!extractedData ? (
             <Button 
                onClick={handleProcess} 
                disabled={files.length === 0 || isProcessing}
                loading={isProcessing}
                icon={<CheckCircle2 className="w-4 h-4"/>}
             >
                Analyze Photos
             </Button>
          ) : (
             <Button onClick={handleConfirm}>
                Import Items
             </Button>
          )}
        </div>

      </div>
    </div>
  );
};