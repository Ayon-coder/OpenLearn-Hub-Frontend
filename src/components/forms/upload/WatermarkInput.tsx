import React, { useState } from 'react';
import { Shield, Eye } from 'lucide-react';

export interface WatermarkConfig {
    enabled: boolean;
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'diagonal';
    opacity: number;
}

interface WatermarkInputProps {
    value: WatermarkConfig;
    onChange: (config: WatermarkConfig) => void;
    defaultText?: string;
}

export const WatermarkInput: React.FC<WatermarkInputProps> = ({
    value,
    onChange,
    defaultText = 'Your Name'
}) => {
    const handleToggle = () => {
        onChange({ ...value, enabled: !value.enabled });
    };

    const handleTextChange = (text: string) => {
        onChange({ ...value, text });
    };

    const handlePositionChange = (position: WatermarkConfig['position']) => {
        onChange({ ...value, position });
    };

    const handleOpacityChange = (opacity: number) => {
        onChange({ ...value, opacity });
    };

    const getPreviewPosition = () => {
        const baseStyle = 'absolute text-white font-bold text-sm pointer-events-none';
        switch (value.position) {
            case 'top-left':
                return `${baseStyle} top-3 left-3`;
            case 'top-right':
                return `${baseStyle} top-3 right-3`;
            case 'bottom-left':
                return `${baseStyle} bottom-3 left-3`;
            case 'bottom-right':
                return `${baseStyle} bottom-3 right-3`;
            case 'center':
                return `${baseStyle} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`;
            case 'diagonal':
                return `${baseStyle} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] text-2xl`;
            default:
                return `${baseStyle} bottom-3 right-3`;
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border-2 border-purple-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-600 text-white rounded-xl">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900">Watermark Protection</h3>
                        <p className="text-xs text-gray-600 font-medium">Protect your intellectual property (Optional)</p>
                    </div>
                </div>

                {/* Enable Toggle */}
                <label className="flex items-center space-x-3 cursor-pointer">
                    <span className="text-sm font-bold text-gray-700">Enable</span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={value.enabled}
                            onChange={handleToggle}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                    </div>
                </label>
            </div>

            {value.enabled && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    {/* Watermark Text */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">
                            Watermark Text
                        </label>
                        <input
                            type="text"
                            value={value.text}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder={defaultText}
                            className="w-full px-6 py-4 bg-white border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Position Selector */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">
                            Position
                        </label>
                        <select
                            value={value.position}
                            onChange={(e) => handlePositionChange(e.target.value as WatermarkConfig['position'])}
                            className="w-full px-6 py-4 bg-white border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none font-medium"
                        >
                            <option value="top-left">Top Left</option>
                            <option value="top-right">Top Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right (Recommended)</option>
                            <option value="center">Center</option>
                            <option value="diagonal">Diagonal (Maximum Protection)</option>
                        </select>
                    </div>

                    {/* Opacity Slider */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">
                            Opacity: {Math.round(value.opacity * 100)}%
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={value.opacity * 100}
                            onChange={(e) => handleOpacityChange(parseInt(e.target.value) / 100)}
                            className="w-full h-3 bg-purple-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 font-medium mt-1">
                            <span>Subtle</span>
                            <span>Visible</span>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <Eye size={14} className="text-gray-700" />
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">
                                Preview
                            </label>
                        </div>
                        <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 border-purple-300">
                            {/* Sample content background */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm font-medium">
                                Your content will appear here
                            </div>

                            {/* Watermark Preview */}
                            {value.text && (
                                <div
                                    className={getPreviewPosition()}
                                    style={{ opacity: value.opacity }}
                                >
                                    {value.text}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-purple-100 border border-purple-300 rounded-2xl p-4">
                        <p className="text-xs text-purple-900 font-medium leading-relaxed">
                            💡 <strong>Tip:</strong> Your watermark will be applied to all uploaded content. This helps protect your work from unauthorized use while maintaining proper attribution.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
