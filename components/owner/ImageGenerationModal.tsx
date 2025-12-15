import React, { useState } from 'react';
import { X, RefreshCw, Check, ArrowRight, Wand2 } from 'lucide-react';
import { Button } from '../Button';

interface ImageGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalImage: string; // Base64
    onApply: (newImage: string) => void;
    onGenerate: (prompt: string) => Promise<{ image: string, prompt: string }>;
}

export const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({
    isOpen,
    onClose,
    originalImage,
    onApply,
    onGenerate
}) => {
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [itemsLoading, setItemsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial generation on open or manual trigger
    const handleGenerate = async (customPrompt?: string) => {
        setItemsLoading(true);
        setError(null);
        try {
            const result = await onGenerate(customPrompt || prompt);
            setGeneratedImage(result.image);
            setPrompt(result.prompt);
        } catch (err: any) {
            setError(err.message || 'Failed to generate image');
        } finally {
            setItemsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">AI Studio Shoot</h3>
                            <p className="text-xs text-gray-500">Transform your photo into a studio masterpiece</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* Comparison View */}
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-8">
                        {/* Original */}
                        <div className="w-full md:w-1/2 space-y-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-center">Original</span>
                            <div className="aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 relative group">
                                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="hidden md:flex items-center justify-center text-gray-300">
                            <ArrowRight className="w-8 h-8" />
                        </div>

                        {/* Generated */}
                        <div className="w-full md:w-1/2 space-y-2">
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block text-center">AI Studio Result</span>
                            <div className={`aspect-square rounded-2xl overflow-hidden border-2 ${generatedImage ? 'border-purple-500 shadow-xl shadow-purple-500/20' : 'border-dashed border-gray-200'} bg-gray-50 relative flex items-center justify-center`}>
                                {itemsLoading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                        <p className="text-sm font-medium text-purple-600 animate-pulse">Designing...</p>
                                    </div>
                                ) : generatedImage ? (
                                    <img src={`data:image/jpeg;base64,${generatedImage}`} alt="Generated" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6">
                                        <Button variant="secondary" onClick={() => handleGenerate()} icon={<Wand2 className="w-4 h-4" />}>
                                            Generate Studio Shot
                                        </Button>
                                    </div>
                                )}

                                {/* Error Overlay */}
                                {error && !itemsLoading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center p-4 text-center">
                                        <div className="text-red-500 text-sm">
                                            <p className="font-bold">Error</p>
                                            <p>{error}</p>
                                            <button onClick={() => handleGenerate()} className="mt-2 text-xs underline">Try Again</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Prompt Editing */}
                    {generatedImage && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                            <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase">Magic Prompt</label>
                            <div className="flex gap-2">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe how you want the image to look..."
                                    className="flex-1 text-sm p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-20"
                                />
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => handleGenerate(prompt)}
                                        disabled={itemsLoading}
                                        icon={<RefreshCw className={`w-4 h-4 ${itemsLoading ? 'animate-spin' : ''}`} />}
                                        className="h-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                    >
                                        Regenerate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        disabled={!generatedImage || itemsLoading}
                        onClick={() => generatedImage && onApply(generatedImage)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        icon={<Check className="w-4 h-4" />}
                    >
                        Use This Photo
                    </Button>
                </div>
            </div>
        </div>
    );
};
