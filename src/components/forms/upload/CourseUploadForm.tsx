import React, { useState } from 'react';
import { ArrowLeft, Upload, BookOpen, Lock, Globe, ChevronRight, ChevronLeft, Edit, Image as ImageIcon, FileText } from 'lucide-react';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { QuizAttachment } from '@/components/quiz/QuizAttachment';
import { ShareableLink } from '@/components/ui/ShareableLink';
import { Quiz } from '@/types';
import { authService } from '@/services/auth/authService';

interface CourseUploadFormProps {
    onComplete: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

export const CourseUploadForm: React.FC<CourseUploadFormProps> = ({ onComplete, onBack, initialData }) => {
    const [step, setStep] = useState(initialData ? 7 : 1); // Start at review step if editing
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [generatedNoteId, setGeneratedNoteId] = useState(initialData?.noteId || '');
    const [formData, setFormData] = useState({
        platform: initialData?.platform || '',
        courseName: initialData?.courseName || '',
        verificationLink: initialData?.verificationLink || '',
        chapter: initialData?.chapter || '',
        title: initialData?.title || '',
        description: initialData?.description || '', // Added description
        file: initialData?.file || null as File | null,
        authorImage: initialData?.authorImage || null as string | null,
        coverImage: initialData?.coverImage || null as string | null,
        quiz: initialData?.quiz || null as Quiz | null,
        authorizedEmails: initialData?.authorizedEmails || [] as string[]
    });

    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.relatedTarget && (e.currentTarget.contains(e.relatedTarget as Node) || e.currentTarget === e.relatedTarget)) {
            return;
        }
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setFormData({ ...formData, file });
        }
    };

    const user = authService.getUser();
    const platforms = ['Coursera', 'Udemy', 'YouTube', 'edX', 'Khan Academy', 'Other'];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, coverImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuizAttach = (quiz: Quiz) => {
        setFormData({ ...formData, quiz });
        handleNext();
    };

    const handleNext = () => {
        if (step < 7) setStep(step + 1);
    };

    const handleSkipQuiz = () => {
        setFormData({ ...formData, quiz: null });
        setStep(7); // Skip to final step
    };

    const handleSubmit = async () => {
        setIsGenerating(true);
        // Simulate network delay for "generation" effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate a unique note ID (in production, this would come from backend)
        const noteId = generatedNoteId || `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        if (!generatedNoteId) setGeneratedNoteId(noteId);

        setIsGenerating(false);
        setUploadComplete(true);
        onComplete({ ...formData, noteId });
    };

    if (!user) return null;

    // Loading State
    if (isGenerating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex items-center justify-center">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                        <Lock size={40} className="text-purple-600 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">{initialData ? 'Updating Secure Link...' : 'Generating Secure Link...'}</h2>
                    <p className="text-gray-500 font-medium">Encrypting content and creating access token</p>
                </div>
            </div>
        );
    }

    // Show shareable link after upload complete
    if (uploadComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex items-center justify-center">
                <div className="max-w-2xl w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ShareableLink
                        noteId={generatedNoteId}
                        noteTitle={formData.title}
                        noteType="course"
                        platform={formData.platform}
                        courseName={formData.courseName}
                        chapter={formData.chapter}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onBack}
                            className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                        >
                            <Upload size={20} />
                            <span>{initialData ? 'Edit Another' : 'Upload Another'}</span>
                        </button>

                        <button
                            onClick={() => window.location.hash = '#/'}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center space-x-2"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-bold mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Upload Type</span>
                </button>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Progress Bar */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Lock size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-white">{initialData ? 'Edit Course Note' : 'Course Note Upload'}</h1>
                                    <p className="text-purple-100 text-sm font-medium">Protected content for enrolled students</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        {/* Step 1: Platform */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Select Platform</h2>
                                <p className="text-gray-600 mb-6">Where is this course from?</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {platforms.map((platform) => (
                                        <button
                                            key={platform}
                                            onClick={() => {
                                                setFormData({ ...formData, platform });
                                                // If editing, go back to review step instead of next step
                                                if (initialData) setStep(7);
                                                else handleNext();
                                            }}
                                            className={`p-6 rounded-2xl border-2 transition-all ${formData.platform === platform
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                        >
                                            <p className="font-black text-gray-900 text-lg">{platform}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Course Name */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Course Name</h2>
                                <p className="text-gray-600 mb-6">What's the name of the course?</p>
                                <input
                                    type="text"
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                    placeholder="e.g., Python Zero to Hero"
                                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none font-medium text-lg"
                                />
                                <button
                                    onClick={() => initialData ? setStep(7) : handleNext()}
                                    disabled={!formData.courseName}
                                    className="mt-6 w-full py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {initialData ? 'Update & Review' : 'Continue'}
                                </button>
                            </div>
                        )}

                        {/* Step 3: Course Verification Link */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Verify Course Ownership</h2>
                                <p className="text-gray-600 mb-6">Provide a link to your published course to verify you're the instructor</p>

                                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-xl">
                                            <Lock size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-blue-900 mb-1">Why do we need this?</h4>
                                            <p className="text-sm font-medium text-blue-700">
                                                To prevent unauthorized sharing, we verify that you're the actual course creator. Paste your course URL from {formData.platform}.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Course URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.verificationLink || ''}
                                    onChange={(e) => setFormData({ ...formData, verificationLink: e.target.value })}
                                    placeholder={`e.g., https://www.udemy.com/course/your-course-name/`}
                                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none font-medium text-lg mb-4"
                                />

                                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
                                    <p className="text-sm font-bold text-amber-800">
                                        💡 <strong>Tip:</strong> Make sure the course is published and publicly visible. We'll verify your instructor status.
                                    </p>
                                </div>

                                <button
                                    onClick={() => initialData ? setStep(7) : handleNext()}
                                    disabled={!formData.verificationLink || !formData.verificationLink.startsWith('http')}
                                    className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {initialData ? 'Update & Review' : 'Verify & Continue'}
                                </button>
                            </div>
                        )}

                        {/* Step 4: Chapter */}
                        {step === 4 && (
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Chapter/Module</h2>
                                <p className="text-gray-600 mb-6">Which chapter or module is this for?</p>
                                <input
                                    type="text"
                                    value={formData.chapter}
                                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                    placeholder="e.g., Chapter 1 or Week 1"
                                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none font-medium text-lg"
                                />
                                <button
                                    onClick={() => initialData ? setStep(7) : handleNext()}
                                    disabled={!formData.chapter}
                                    className="mt-6 w-full py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {initialData ? 'Update & Review' : 'Continue'}
                                </button>
                            </div>
                        )}

                        {/* Step 5: File Upload */}
                        {step === 5 && (
                            <div className="space-y-6">
                                {/* Simple Upload for New Courses */}
                                {!initialData && (
                                    <>
                                        <h2 className="text-2xl font-black text-gray-900 mb-2">Upload Note</h2>
                                        <p className="text-gray-600 mb-6">Upload your course notes file</p>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Note title"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none font-medium mb-4"
                                        />

                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            id="course-file-upload"
                                        />
                                        <label
                                            htmlFor="course-file-upload"
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`block border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${isDragging
                                                ? 'border-purple-600 bg-purple-50 shadow-lg'
                                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                                                }`}
                                        >
                                            <Upload
                                                size={48}
                                                className={`mx-auto mb-4 ${isDragging ? 'text-purple-600 animate-bounce' : 'text-gray-300'} transition-colors`}
                                            />
                                            <p className="font-bold text-gray-700 mb-2">
                                                {formData.file ? formData.file.name : 'Click to upload or drag and drop'}
                                            </p>
                                            <p className="text-sm text-gray-500">PDF, DOC, DOCX (max 50MB)</p>
                                        </label>

                                        <button
                                            onClick={handleNext}
                                            disabled={!formData.title}
                                            className="mt-6 w-full py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Continue
                                        </button>
                                    </>
                                )}

                                {/* Detailed Editor for Editing Existing Courses */}
                                {initialData && (
                                    <div className="space-y-8 animate-in slide-in-from-right-4">
                                        {/* Resource Header Label */}
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Resource Header</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Enter a descriptive title..."
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-900 text-white border-none focus:ring-4 focus:ring-purple-200 outline-none text-xl font-black placeholder:text-gray-500"
                                            />
                                        </div>

                                        {/* Grid Layout */}
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            {/* Left Column: Description Editor */}
                                            <div className="lg:col-span-7 space-y-3">
                                                <label className="flex items-center text-xs font-black text-purple-600 uppercase tracking-widest">
                                                    <Edit size={14} className="mr-2" /> Comprehensive Explanation (MS Word-like Editor)
                                                </label>

                                                <RichTextEditor
                                                    value={formData.description}
                                                    onChange={(html) => setFormData({ ...formData, description: html })}
                                                />
                                            </div>

                                            {/* Right Column: Document Attachment */}
                                            <div className="lg:col-span-5 space-y-3">
                                                <div className="space-y-3">
                                                    <label className="flex items-center text-xs font-black text-green-600 uppercase tracking-widest">
                                                        <FileText size={14} className="mr-2" /> Document Attachment (PDF)
                                                    </label>

                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept=".pdf,.doc,.docx"
                                                        className="hidden"
                                                        id="course-file-upload"
                                                    />
                                                    <label
                                                        htmlFor="course-file-upload"
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={handleDrop}
                                                        className={`block border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${isDragging
                                                            ? 'border-purple-600 bg-purple-50 shadow-lg'
                                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                                                            }`}
                                                    >
                                                        <Upload
                                                            size={48}
                                                            className={`mx-auto mb-4 ${isDragging ? 'text-purple-600 animate-bounce' : 'text-gray-300'} transition-colors`}
                                                        />
                                                        <p className="font-bold text-gray-700 mb-2">
                                                            {formData.file ? formData.file.name : 'Click to upload or drag and drop'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">PDF, DOC, DOCX (max 50MB)</p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-between pt-4">
                                            <button
                                                onClick={() => setStep(4)}
                                                className="flex items-center space-x-2 px-6 py-3 text-gray-500 hover:text-gray-700 font-bold transition-colors"
                                            >
                                                <ChevronLeft size={20} />
                                                <span>Previous</span>
                                            </button>

                                            <button
                                                onClick={() => initialData ? setStep(7) : handleNext()}
                                                disabled={!formData.title}
                                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
                                            >
                                                {initialData ? 'Update & Review' : 'Next Level →'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 6: Quiz Attachment (Optional) */}
                        {step === 6 && (
                            <div className="max-h-[600px] overflow-y-auto">
                                <h2 className="text-2xl font-black text-gray-900 mb-4">Attach Quiz (Optional)</h2>
                                <p className="text-gray-600 mb-6">Create or attach a quiz to test student understanding</p>

                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <QuizAttachment
                                        user={user}
                                        subject={formData.platform || 'Course'}
                                        topic={formData.courseName || 'General'}
                                        subtopic={formData.chapter}
                                        onQuizAttached={(quiz) => {
                                            setFormData({ ...formData, quiz });
                                            if (initialData) setStep(7);
                                            else handleNext();
                                        }}
                                        onSkip={handleSkipQuiz}
                                        compact={false}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 7: Summary & Submit (Redesigned) */}
                        {step === 7 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Header */}
                                <div className="mb-3">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">RESOURCE HEADER</h3>
                                </div>

                                {/* Title Banner */}
                                <div className="bg-[#0f1016] rounded-2xl p-8 mb-8 flex justify-between items-start relative overflow-hidden group border border-gray-800 shadow-2xl">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="px-3 py-1 bg-purple-500/20 rounded-lg text-xs font-bold text-purple-300 border border-purple-500/30 uppercase tracking-wide">
                                                {formData.platform}
                                            </span>
                                            <span className="text-gray-600 text-sm">•</span>
                                            <span className="text-gray-400 text-sm font-bold tracking-wide uppercase">{formData.chapter}</span>
                                        </div>
                                        <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-2">{formData.title}</h2>
                                        <div className="flex items-center space-x-2 text-gray-500 font-medium">
                                            <BookOpen size={16} />
                                            <span>{formData.courseName}</span>
                                        </div>
                                    </div>
                                    {initialData && (
                                        <button
                                            onClick={() => setStep(5)}
                                            className="relative z-10 p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all backdrop-blur-md border border-white/5 hover:border-white/10"
                                            title="Edit Title & File"
                                        >
                                            <Edit size={20} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                    {/* Left Column: Course Details */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <Edit size={18} className="text-blue-600" />
                                                <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">COMPREHENSIVE EXPLANATION (MS WORD-LIKE EDITOR)</h3>
                                            </div>

                                            <div className="relative">
                                                <RichTextEditor
                                                    value={formData.description}
                                                    onChange={(html) => setFormData({ ...formData, description: html })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Visual Aids & Metadata */}
                                    <div className="space-y-6">
                                        {/* Visual Aids */}
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <ImageIcon size={18} className="text-purple-600" />
                                                <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">VISUAL AIDS</h3>
                                            </div>
                                            {!formData.coverImage ? (
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleCoverImageUpload}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center h-48 group-hover:border-purple-300 group-hover:bg-purple-50/30 transition-all">
                                                        <Upload size={32} className="text-gray-300 mb-2 group-hover:text-purple-500 transition-colors" />
                                                        <p className="font-bold text-gray-400 text-sm group-hover:text-purple-600">Upload Cover Image</p>
                                                        <p className="text-xs text-gray-300">(JPG, PNG)</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative group h-48 rounded-3xl overflow-hidden border-2 border-gray-100">
                                                    <img
                                                        src={formData.coverImage}
                                                        alt="Cover"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => setFormData({ ...formData, coverImage: null })}
                                                        className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur text-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {/* File Attachment */}
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <Upload size={18} className="text-pink-600" />
                                                <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">ATTACHMENTS</h3>
                                            </div>

                                            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all group relative">
                                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <div className="font-black text-red-500 text-lg">PDF</div>
                                                </div>
                                                <p className="font-bold text-gray-900 line-clamp-2 mb-1">{formData.file?.name}</p>
                                                <p className="text-xs font-bold text-gray-400 uppercase">DOCUMENT</p>

                                                {initialData && (
                                                    <button onClick={() => setStep(5)} className="absolute top-2 right-2 p-2 text-gray-300 hover:text-purple-600 hover:bg-purple-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quiz */}
                                        <div>
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl p-6 group relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-black text-purple-400 uppercase tracking-widest">INTERACTIVE</span>
                                                    {formData.quiz ? (
                                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">ACTIVE</span>
                                                    ) : (
                                                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-md">NONE</span>
                                                    )}
                                                </div>

                                                {formData.quiz ? (
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 mb-1">{formData.quiz.title}</h4>
                                                        <p className="text-sm text-gray-500 font-medium">{formData.quiz.questions.length} Questions Included</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400 font-medium text-sm">
                                                        No quiz attached to this note.
                                                    </div>
                                                )}

                                                {initialData && (
                                                    <button onClick={() => setStep(6)} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-purple-600 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Course Metadata (Moved) */}
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <Globe size={18} className="text-indigo-600" />
                                                <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">COURSE METADATA</h3>
                                            </div>
                                            <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">Platform</span>
                                                    <span className="font-bold text-gray-900">{formData.platform}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">Chapter</span>
                                                    <span className="font-bold text-gray-900">{formData.chapter}</span>
                                                </div>
                                                {formData.quiz && (
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500 font-medium">Quiz</span>
                                                        <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded">Attached</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
                                    <Lock size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm font-medium text-amber-800 leading-relaxed">
                                        <strong>Access Control:</strong> This content is encrypted. Only verified students with the link will be able to access it. You can track engagement in your dashboard.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300 hover:-translate-y-1 transition-all active:scale-95"
                                >
                                    {initialData ? 'Update Course Note' : `Upload Course Note${formData.quiz ? ' & Quiz' : ''}`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
