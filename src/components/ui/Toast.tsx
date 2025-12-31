import React, { useEffect } from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    subMessage?: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    subMessage,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const bgColors = {
        success: 'bg-gray-900',
        error: 'bg-red-600',
        info: 'bg-blue-600'
    };

    const icons = {
        success: <CheckCircle2 className="text-green-400" size={20} />,
        error: <AlertCircle className="text-white" size={20} />,
        info: <Info className="text-white" size={20} />
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`${bgColors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-sm`}>
                <div className="mt-0.5 shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm">{message}</h4>
                    {subMessage && (
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{subMessage}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
