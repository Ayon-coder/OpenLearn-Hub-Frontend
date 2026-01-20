import React, { useState, useEffect } from 'react';
import { MentorMode, ConceptMirrorMode, ModeSelector } from '@/components/ai-assistant';
import { checkBackendHealth, HealthStatus } from '@/services/ai/aiAssistantService';
import { Sparkles, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

/**
 * AI Assistant Page
 * 
 * Main page component for the AI Assistant feature.
 * Hosts the active mode (Mentor vs Mirror) and connectivity status.
 */
export const AIAssistantPage: React.FC = () => {
    const [activeMode, setActiveMode] = useState<'mentor' | 'mirror'>('mentor');
    const [backendStatus, setBackendStatus] = useState<HealthStatus | null>(null);
    const [isCheckingBackend, setIsCheckingBackend] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkHealth = async () => {
            // Only check if window is visible to save resources
            if (document.hidden) return;

            setIsCheckingBackend(true);
            const status = await checkBackendHealth();
            setBackendStatus(status);
            setIsCheckingBackend(false);
        };

        checkHealth();

        // Check verify less frequently (60s) and only if visible
        interval = setInterval(checkHealth, 60000);

        // Add visibility listener to check immediately when user returns
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkHealth();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-[2rem] border border-gray-200/50 shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 m-4 lg:m-6">
            {/* Header */}
            <div className="flex bg-white/50 backdrop-blur-sm border-b border-gray-100 p-4 lg:mt-2 lg:mx-2 lg:rounded-t-[1.5rem] items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500
                        ${activeMode === 'mentor'
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-200'
                            : 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-200'
                        }`}>
                        {activeMode === 'mentor' ? <Sparkles className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Assistant</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            {activeMode === 'mentor' ? 'Interactive Mentor' : 'Concept Mirror Analysis'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
                    </div>

                    {/* Backend Status Indicator */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-300
                        ${backendStatus
                            ? 'bg-green-50 border-green-100 text-green-700'
                            : 'bg-orange-50 border-orange-100 text-orange-700'
                        }`}>
                        {isCheckingBackend ? (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        ) : backendStatus ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        <span className="text-xs font-bold">
                            {isCheckingBackend ? 'Connecting...' : backendStatus ? 'Online' : 'Demo Mode'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Mode Selector */}
            <div className="md:hidden px-4 pb-4 border-b border-gray-100 bg-white/50">
                <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-gray-50/30">
                {activeMode === 'mentor' ? <MentorMode /> : <ConceptMirrorMode />}
            </div>

            {/* Footer - Minimal */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm flex items-center justify-end">
                <div className="text-[10px] text-gray-300 font-medium">
                    v1.0
                </div>
            </div>
        </div>
    );
};

export default AIAssistantPage;
