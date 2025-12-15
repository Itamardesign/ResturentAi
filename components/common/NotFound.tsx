import React from 'react';
import { Home, Search } from 'lucide-react';
import { Button } from '../Button';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center font-sans">
            <div className="max-w-md w-full">
                {/* Animated Illustration Placeholder */}
                <div className="mb-8 relative mx-auto w-64 h-64">
                    <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse opacity-50"></div>
                    <img
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZpb2V4b3R4b3R4b3R4b3R4b3R4b3R4b3R4b3R4b3R4b3R4/l2JdZ8eBdvqK6g92E/giphy.gif"
                        alt="Confused Travolta"
                        className="relative z-10 w-full h-full object-cover rounded-full shadow-xl border-4 border-white"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 rotate-12">
                        <span className="text-4xl">🤷‍♂️</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Lost in the Sauce?
                </h1>

                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                    Oops! The page you're looking for seems to have wandered off the menu. It might have been eaten, or it never existed in the first place.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go Back Home
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/'}
                        className="text-gray-500 hover:text-gray-900"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Check the Menu
                    </Button>
                </div>

                <div className="mt-12 text-xs text-gray-300 font-medium uppercase tracking-widest">
                    ERROR 404: TASTE NOT FOUND
                </div>
            </div>
        </div>
    );
};
