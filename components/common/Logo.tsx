import React from 'react';

interface LogoProps {
    variant?: 'orange' | 'white';
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'orange', className = '' }) => {
    const isWhite = variant === 'white';

    // Colors
    const primaryColor = isWhite ? '#FFFFFF' : '#EA580C'; // Orange-600
    const textColor = isWhite ? 'text-white' : 'text-gray-900';
    const iconBg = isWhite ? 'bg-white/10' : 'bg-orange-50';

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-sm relative overflow-hidden group border border-transparent ${!isWhite && 'border-orange-100'}`}>

                {/* Abstract "B" / Cloche Shape */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 transition-transform duration-300">
                    <path
                        d="M12 4C7.58172 4 4 7.58172 4 12V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V12C20 7.58172 16.4183 4 12 4Z"
                        stroke={primaryColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M12 4V2"
                        stroke={primaryColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    {/* AI Sparkle */}
                    <path
                        d="M16 8L17.5 5L19 8"
                        stroke={primaryColor}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        className="opacity-100"
                    />
                </svg>

                {/* Shine effect */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none" />
            </div>

            <div className="flex flex-col justify-center translate-y-[-1px]">
                <span className={`font-serif text-xl font-bold leading-none tracking-tight ${textColor}`}>
                    Bistrot
                </span>
                <span className={`font-sans text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 ${textColor} ml-0.5`}>
                    AI
                </span>
            </div>
        </div>
    );
};
