
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { fileValidator } from '@/utils';
import { UploadedDocument } from '@/types';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

interface FileUploadProps {
    onFileUpload: (file: UploadedDocument) => void;
    onFileRemove: (fileId: string) => void;
    uploadedFiles: UploadedDocument[];
    noteContent?: string;
    onNoteChange?: (content: string) => void;
    maxFiles?: number;
    label?: string;
    accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFileUpload,
    onFileRemove,
    uploadedFiles,
    noteContent = '',
    onNoteChange,
    maxFiles = 3,
    label = 'Upload Document',
    accept = 'image/*,.pdf'
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (e.relatedTarget && (e.currentTarget.contains(e.relatedTarget as Node) || e.currentTarget === e.relatedTarget)) {
            return;
        }
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from<File>(e.dataTransfer.files);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setError('');

        // Check max files
        if (uploadedFiles.length >= maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Validate file
        const validation = fileValidator.validateFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        // Simulate upload
        setIsUploading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create mock uploaded document
        const uploadedDoc: UploadedDocument = {
            id: `file_${Date.now()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file), // In production, this would be the server URL
            uploadedAt: new Date().toISOString()
        };

        onFileUpload(uploadedDoc);
        setIsUploading(false);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) {
            return <ImageIcon size={20} className="text-blue-500" />;
        }
        return <FileText size={20} className="text-red-500" />;
    };

    return (
        <div className="space-y-6">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                {label}
            </label>

            {/* Two-column layout: Text Notes + File Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text Notes Area */}
                {onNoteChange && (
                    <div className="space-y-3">
                        <label className="flex items-center text-xs font-black text-blue-600 uppercase tracking-widest">
                            <FileText size={14} className="mr-2" /> Type Your Notes (MS Word-like Editor)
                        </label>
                        <RichTextEditor
                            value={noteContent}
                            onChange={onNoteChange}
                            placeholder="Write your notes here... Use the toolbar above to format text, add headings, lists, and more."
                        />
                        <p className="text-xs text-gray-500 ml-2">
                            Rich text editor with formatting support
                        </p>
                    </div>
                )}

                {/* File Upload Area */}
                <div className="space-y-4">
                    <label className="flex items-center text-xs font-black text-indigo-600 uppercase tracking-widest">
                        <ImageIcon size={14} className="mr-2" /> Upload Files (PDF/Images)
                    </label>

                    {/* Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                            transition-all duration-200
                            ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }
                            ${uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploadedFiles.length >= maxFiles || isUploading}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center space-y-3">
                                <Loader2 className="animate-spin text-blue-500" size={40} />
                                <p className="text-sm font-bold text-gray-600">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Upload className="text-blue-600" size={28} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">
                                        Drop your file here or <span className="text-blue-600">browse</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF, JPG, PNG up to 5MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in">
                            {error}
                        </p>
                    )}

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                            {uploadedFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        {getFileIcon(file.type)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-700 truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {fileValidator.formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onFileRemove(file.id)}
                                        className="ml-3 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={18} className="text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {uploadedFiles.length > 0 && uploadedFiles.length < maxFiles && (
                        <p className="text-xs text-gray-500 ml-2">
                            {maxFiles - uploadedFiles.length} more file{maxFiles - uploadedFiles.length !== 1 ? 's' : ''} allowed
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
