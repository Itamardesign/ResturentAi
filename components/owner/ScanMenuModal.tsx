import React, { useState } from 'react';
import { X, UploadCloud, Loader2, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../Button';
import { extractMenuFromImages, fileToGenerativePart, ExtractedCategory } from '../../services/geminiService';

interface ScanMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanComplete: (categories: ExtractedCategory[]) => void;
}

export const ScanMenuModal: React.FC<ScanMenuModalProps> = ({ isOpen, onClose, onScanComplete }) => {
    const [images, setImages] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                try {
                    const base64 = await fileToGenerativePart(e.target.files[i]);
                    newImages.push(base64);
                } catch (err) {
                    console.error("Error reading file", err);
                }
            }
            setImages(prev => [...prev, ...newImages]);
            setError(null);
        }
    };

    const handleScan = async () => {
        if (images.length === 0) return;

        setIsScanning(true);
        setError(null);

        try {
            const extractedCategories = await extractMenuFromImages(images);
            if (extractedCategories && extractedCategories.length > 0) {
                onScanComplete(extractedCategories);
                onClose();
            } else {
                setError("Could not extract any menu items. Please try a clearer image.");
            }
        } catch (err) {
            console.error("Scan failed", err);
            setError("An error occurred during scanning. Please try again.");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Scan Printed Menu</h2>
                        <p className="text-sm text-gray-500 mt-1">Upload photos of your menu to auto-import items.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">

                    {/* Upload Area */}
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50/10 transition-all group">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleImageUpload}
                            disabled={isScanning}
                        />
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Camera className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Click to upload or drag photos here</p>
                                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                    <img src={`data:image/jpeg;base64,${img}`} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                                        disabled={isScanning}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isScanning}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleScan}
                        disabled={images.length === 0 || isScanning}
                        className="min-w-[120px]"
                    >
                        {isScanning ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Scanning...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Start Scan
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
