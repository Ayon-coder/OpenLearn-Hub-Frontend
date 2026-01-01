import React from 'react';

interface ModeSelectorProps {
    activeMode: 'mentor' | 'mirror';
    onModeChange: (mode: 'mentor' | 'mirror') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
    return (
        <div className="flex bg-gray-100 p-1.5 rounded-xl w-fit">
            <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeMode === 'mentor'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                onClick={() => onModeChange('mentor')}
            >
                <span className="mr-2">🎓</span>
                Mentor Mode
            </button>
            <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeMode === 'mirror'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                onClick={() => onModeChange('mirror')}
            >
                <span className="mr-2">🪞</span>
                Concept Mirror
            </button>
        </div>
    );
};

export default ModeSelector;
