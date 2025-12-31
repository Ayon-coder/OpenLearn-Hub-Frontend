
import React, { useState } from 'react';
import { Building2, BookOpen, Calendar } from 'lucide-react';
import { FileUpload } from '@/components/forms/upload/FileUpload';
import { UploadedDocument } from '@/types';
import { emailValidator } from '@/utils';

interface StudentVerificationFormProps {
    email: string;
    onSubmit: (data: {
        institutionName?: string;
        department?: string;
        year?: string;
        proofDocuments?: UploadedDocument[];
    }) => void;
}

export const StudentVerificationForm: React.FC<StudentVerificationFormProps> = ({ email, onSubmit }) => {
    const isInstitutional = emailValidator.isInstitutionalEmail(email);
    const [institutionName, setInstitutionName] = useState('');
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // If institutional email, auto-verify
        if (isInstitutional) {
            onSubmit({});
            return;
        }

        // Validate required fields for non-institutional emails
        if (!institutionName.trim()) {
            setError('Please enter your institution name');
            return;
        }

        if (!department.trim()) {
            setError('Please enter your department');
            return;
        }

        if (!year.trim()) {
            setError('Please select your year of study');
            return;
        }

        if (uploadedFiles.length === 0) {
            setError('Please upload your student ID');
            return;
        }

        onSubmit({
            institutionName,
            department,
            year,
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
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="text-green-600" size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Institutional Email Detected!</h3>
                <p className="text-gray-600 font-medium mb-6">
                    Your email <span className="font-bold text-blue-600">{email}</span> is from an educational institution.
                    <br />You'll be automatically verified.
                </p>
                <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all"
                >
                    Complete Registration
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-bold text-yellow-800">
                    📧 Non-institutional email detected. Please provide verification documents.
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                    ⚠️ You must complete verification before you can upload notes or share content.
                </p>
            </div>

            {/* Institution Name */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                    University / College Name *
                </label>
                <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium placeholder:text-gray-500"
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
                        className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium placeholder:text-gray-500"
                        placeholder="e.g., Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Year */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                    Year of Study *
                </label>
                <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                        <option value="PhD">PhD</option>
                    </select>
                </div>
            </div>

            {/* Student ID Upload */}
            <FileUpload
                label="Proof of Enrollment * (ID Card / Fee Receipt / Enrollment Letter)"
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                uploadedFiles={uploadedFiles}
                maxFiles={2}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-2">Accepted Documents:</p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4">
                    <li>• Student ID Card (photo/scan)</li>
                    <li>• School Fee Receipt (recent payment proof)</li>
                    <li>• Enrollment Letter (official document)</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2 font-bold">
                    ⚠️ You must be verified before uploading notes
                </p>
            </div>

            {error && (
                <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all"
            >
                Submit for Verification
            </button>

            <p className="text-xs text-gray-500 text-center">
                Your information will be reviewed within 24-48 hours
            </p>
        </form>
    );
};
