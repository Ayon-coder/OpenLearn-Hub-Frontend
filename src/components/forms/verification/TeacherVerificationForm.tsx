
import React, { useState } from 'react';
import { Building2, BookOpen } from 'lucide-react';
import { FileUpload } from '@/components/forms/upload/FileUpload';
import { UploadedDocument } from '@/types';
import { emailValidator } from '@/utils';

interface TeacherVerificationFormProps {
    email: string;
    onSubmit: (data: {
        institutionName?: string;
        department?: string;
        proofDocuments?: UploadedDocument[];
    }) => void;
}

export const TeacherVerificationForm: React.FC<TeacherVerificationFormProps> = ({ email, onSubmit }) => {
    const isInstitutional = emailValidator.isInstitutionalEmail(email);
    const [institutionName, setInstitutionName] = useState('');
    const [department, setDepartment] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // All teachers must provide documents, regardless of email type
        if (!institutionName.trim()) {
            setError('Please enter your institution name');
            return;
        }

        if (!department.trim()) {
            setError('Please enter your department');
            return;
        }

        if (uploadedFiles.length === 0) {
            setError('Please upload at least one proof document');
            return;
        }

        onSubmit({
            institutionName,
            department,
            proofDocuments: uploadedFiles
        });
    };

    const handleFileUpload = (file: UploadedDocument) => {
        setUploadedFiles([...uploadedFiles, file]);
    };

    const handleFileRemove = (fileId: string) => {
        setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
    };

    if (isInstitutional) {
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-green-800 mb-2">
                        ✅ Institutional Email Detected!
                    </p>
                    <p className="text-xs text-green-700">
                        Your email <span className="font-bold text-purple-600">{email}</span> is from an educational institution.
                        <br />However, you still need to upload proof of employment for verification.
                    </p>
                </div>

                {/* Institution Name */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                        Institution Name *
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium placeholder:text-gray-500"
                            placeholder="e.g., Stanford University"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Department */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                        Department *
                    </label>
                    <div className="relative">
                        <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium placeholder:text-gray-500"
                            placeholder="e.g., Computer Science Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Proof Documents */}
                <FileUpload
                    label="Proof of Employment * (Required for all teachers)"
                    onFileUpload={handleFileUpload}
                    onFileRemove={handleFileRemove}
                    uploadedFiles={uploadedFiles}
                    maxFiles={3}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-800 mb-2">Accepted Documents:</p>
                    <ul className="text-xs text-blue-700 space-y-1 ml-4">
                        <li>• Faculty ID Card</li>
                        <li>• Appointment Letter</li>
                        <li>• Official Institution Profile URL (screenshot)</li>
                    </ul>
                    <p className="text-xs text-purple-600 mt-2 font-bold">
                        ⚠️ Document upload required even with institutional email
                    </p>
                </div>

                {error && (
                    <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-100 hover:bg-purple-700 hover:-translate-y-1 transition-all"
                >
                    Submit for Verification
                </button>

                <p className="text-xs text-gray-500 text-center">
                    Your information will be reviewed within 24-48 hours. You can browse content while waiting.
                </p>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-bold text-yellow-800">
                    📧 Non-institutional email detected. Please provide verification documents.
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                    Note: You won't be able to publish content until verification is approved.
                </p>
            </div>

            {/* Institution Name */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                    Institution Name *
                </label>
                <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium placeholder:text-gray-500"
                        placeholder="e.g., Stanford University"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Department */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                    Department *
                </label>
                <div className="relative">
                    <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium placeholder:text-gray-500"
                        placeholder="e.g., Computer Science Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Proof Documents */}
            <FileUpload
                label="Proof of Employment *"
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                uploadedFiles={uploadedFiles}
                maxFiles={3}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-2">Accepted Documents:</p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4">
                    <li>• Faculty ID Card</li>
                    <li>• Appointment Letter</li>
                    <li>• Official Institution Profile URL (screenshot)</li>
                </ul>
            </div>

            {error && (
                <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-100 hover:bg-purple-700 hover:-translate-y-1 transition-all"
            >
                Submit for Verification
            </button>

            <p className="text-xs text-gray-500 text-center">
                Your information will be reviewed within 24-48 hours. You can browse content while waiting.
            </p>
        </form>
    );
};
