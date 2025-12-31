import React, { useState, useEffect } from 'react';
import { Youtube, GraduationCap, BookOpen, Check, X, AlertCircle, Award, Edit, Book } from 'lucide-react';
import {
    ContentSourceMetadata,
    YouTubeSource,
    UniversitySource,
    OnlineCourseSource,
    SelfWrittenSource,
    BookOtherSource,
    SourceTagType,
    ContentTrustLevel
} from '@/types';
import {
    validateYouTubeLink,
    validateUniversityTag,
    validateOnlineCourse,
    calculateTrustLevel,
    getTrustLevelInfo,
    getApprovedPlatforms
} from '@/services/content/contentSourceValidator';

interface ContentSourceFormProps {
    onSourceChange: (metadata: ContentSourceMetadata) => void;
    initialMetadata?: ContentSourceMetadata;
}

export const ContentSourceForm: React.FC<ContentSourceFormProps> = ({
    onSourceChange,
    initialMetadata
}) => {
    const [selectedTags, setSelectedTags] = useState<SourceTagType[]>(initialMetadata?.sourceTags || []);

    // YouTube state
    const [youtubeUrl, setYoutubeUrl] = useState(initialMetadata?.youtubeSource?.url || '');
    const [youtubeValidating, setYoutubeValidating] = useState(false);
    const [youtubeValid, setYoutubeValid] = useState(initialMetadata?.youtubeSource?.validated || false);
    const [youtubeError, setYoutubeError] = useState('');

    // University state
    const [universityName, setUniversityName] = useState(initialMetadata?.universitySource?.name || '');
    const [courseContext, setCourseContext] = useState(initialMetadata?.universitySource?.courseContext || '');
    const [department, setDepartment] = useState(initialMetadata?.universitySource?.department || '');

    // Online Course state
    const [platform, setPlatform] = useState(initialMetadata?.onlineCourseSource?.platform || '');
    const [courseName, setCourseName] = useState(initialMetadata?.onlineCourseSource?.courseName || '');
    const [instructor, setInstructor] = useState(initialMetadata?.onlineCourseSource?.instructorName || '');
    const [courseUrl, setCourseUrl] = useState(initialMetadata?.onlineCourseSource?.url || '');

    // Self-Written state
    const [authorName, setAuthorName] = useState(initialMetadata?.selfWrittenSource?.authorName || '');
    const [selfDescription, setSelfDescription] = useState(initialMetadata?.selfWrittenSource?.description || '');
    const [expertise, setExpertise] = useState(initialMetadata?.selfWrittenSource?.expertise || '');

    // Book/Other state
    const [bookSourceType, setBookSourceType] = useState<'book' | 'research_paper' | 'article' | 'other'>('book');
    const [bookTitle, setBookTitle] = useState(initialMetadata?.bookOtherSource?.title || '');
    const [bookAuthor, setBookAuthor] = useState(initialMetadata?.bookOtherSource?.author || '');
    const [publisher, setPublisher] = useState(initialMetadata?.bookOtherSource?.publisher || '');
    const [isbn, setIsbn] = useState(initialMetadata?.bookOtherSource?.isbn || '');
    const [bookUrl, setBookUrl] = useState(initialMetadata?.bookOtherSource?.url || '');
    const [bookDescription, setBookDescription] = useState(initialMetadata?.bookOtherSource?.description || '');

    const [trustLevel, setTrustLevel] = useState<ContentTrustLevel>('basic');

    // Toggle source tag
    const toggleTag = (tag: SourceTagType) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // Validate YouTube URL
    const handleYoutubeValidation = async () => {
        if (!youtubeUrl.trim()) {
            setYoutubeValid(false);
            setYoutubeError('');
            return;
        }

        setYoutubeValidating(true);
        setYoutubeError('');

        const result = await validateYouTubeLink(youtubeUrl);

        setYoutubeValidating(false);
        setYoutubeValid(result.valid);

        if (!result.valid) {
            setYoutubeError(result.error || 'Invalid YouTube URL');
        }
    };

    // Update metadata whenever sources change
    useEffect(() => {
        const requiresAdmin = selectedTags.includes('self_written') || selectedTags.includes('book_other');

        const metadata: ContentSourceMetadata = {
            sourceTags: selectedTags,
            trustLevel: 'basic',
            multipleSourceBonus: selectedTags.length > 1,
            requiresAdminVerification: requiresAdmin
        };

        // Add YouTube source if selected and valid
        if (selectedTags.includes('youtube') && youtubeValid) {
            metadata.youtubeSource = {
                url: youtubeUrl,
                validated: true
            };
        }

        // Add University source if selected
        if (selectedTags.includes('university') && universityName.trim()) {
            metadata.universitySource = {
                name: universityName,
                courseContext: courseContext || undefined,
                department: department || undefined
            };
        }

        // Add Online Course source if selected
        if (selectedTags.includes('online_course') && platform) {
            metadata.onlineCourseSource = {
                platform,
                courseName: courseName || undefined,
                instructorName: instructor || undefined,
                url: courseUrl || undefined
            };
        }

        // Add Self-Written source if selected
        if (selectedTags.includes('self_written') && authorName.trim() && selfDescription.trim()) {
            metadata.selfWrittenSource = {
                authorName,
                description: selfDescription,
                expertise: expertise || undefined,
                requiresAdminVerification: true
            };
        }

        // Add Book/Other source if selected
        if (selectedTags.includes('book_other') && bookTitle.trim() && bookDescription.trim()) {
            metadata.bookOtherSource = {
                sourceType: bookSourceType,
                title: bookTitle,
                author: bookAuthor || undefined,
                publisher: publisher || undefined,
                isbn: isbn || undefined,
                url: bookUrl || undefined,
                description: bookDescription,
                requiresAdminVerification: true
            };
        }

        // Calculate trust level
        metadata.trustLevel = calculateTrustLevel(metadata);
        setTrustLevel(metadata.trustLevel);

        onSourceChange(metadata);
    }, [selectedTags, youtubeUrl, youtubeValid, universityName, courseContext, department, platform, courseName, instructor, courseUrl, authorName, selfDescription, expertise, bookSourceType, bookTitle, bookAuthor, publisher, isbn, bookUrl, bookDescription]);

    const trustInfo = getTrustLevelInfo(trustLevel);
    const requiresAdminVerification = selectedTags.includes('self_written') || selectedTags.includes('book_other');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="font-black text-amber-900 mb-2">Academic Source Required</h3>
                        <p className="text-sm text-amber-700 font-medium">
                            All content must include at least one academic source for authenticity and traceability.
                            Multiple sources increase your content's trust level.
                        </p>
                    </div>
                </div>
            </div>

            {/* Source Tag Selection */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                    Select Source Types (at least one required)
                </label>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* YouTube */}
                    <button
                        type="button"
                        onClick={() => toggleTag('youtube')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedTags.includes('youtube')
                                ? 'border-red-500 bg-red-50 ring-4 ring-red-100'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <Youtube className={selectedTags.includes('youtube') ? 'text-red-600' : 'text-gray-400'} size={24} />
                            <span className="font-black text-gray-900 text-sm">YouTube</span>
                        </div>
                        <p className="text-xs text-gray-600">Educational video</p>
                    </button>

                    {/* University */}
                    <button
                        type="button"
                        onClick={() => toggleTag('university')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedTags.includes('university')
                                ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <GraduationCap className={selectedTags.includes('university') ? 'text-blue-600' : 'text-gray-400'} size={24} />
                            <span className="font-black text-gray-900 text-sm">University</span>
                        </div>
                        <p className="text-xs text-gray-600">Institution ref</p>
                    </button>

                    {/* Online Course */}
                    <button
                        type="button"
                        onClick={() => toggleTag('online_course')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedTags.includes('online_course')
                                ? 'border-green-500 bg-green-50 ring-4 ring-green-100'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <BookOpen className={selectedTags.includes('online_course') ? 'text-green-600' : 'text-gray-400'} size={24} />
                            <span className="font-black text-gray-900 text-sm">Course</span>
                        </div>
                        <p className="text-xs text-gray-600">NPTEL, etc.</p>
                    </button>

                    {/* Self-Written */}
                    <button
                        type="button"
                        onClick={() => toggleTag('self_written')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedTags.includes('self_written')
                                ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-100'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <Edit className={selectedTags.includes('self_written') ? 'text-purple-600' : 'text-gray-400'} size={24} />
                            <span className="font-black text-gray-900 text-sm">Self-Written</span>
                        </div>
                        <p className="text-xs text-gray-600">Original content</p>
                    </button>

                    {/* Book/Other */}
                    <button
                        type="button"
                        onClick={() => toggleTag('book_other')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedTags.includes('book_other')
                                ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <Book className={selectedTags.includes('book_other') ? 'text-orange-600' : 'text-gray-400'} size={24} />
                            <span className="font-black text-gray-900 text-sm">Book/Other</span>
                        </div>
                        <p className="text-xs text-gray-600">Unlisted source</p>
                    </button>
                </div>
            </div>

            {/* Admin Verification Notice */}
            {requiresAdminVerification && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="font-black text-purple-900 mb-2">Admin Verification Required</h4>
                            <p className="text-sm text-purple-700 font-medium">
                                Self-written content and unlisted sources require admin verification before publication.
                                Your content will be reviewed within 24-48 hours.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* YouTube Source Details */}
            {selectedTags.includes('youtube') && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <Youtube className="text-red-600" size={20} />
                        <h4 className="font-black text-red-900">YouTube Video Link</h4>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-red-700 mb-2">Video URL *</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                onBlur={handleYoutubeValidation}
                                placeholder="https://youtube.com/watch?v=..."
                                className="flex-1 px-4 py-3 bg-white border-2 border-red-200 rounded-xl focus:ring-4 focus:ring-red-100 outline-none font-medium"
                            />
                            {youtubeValidating && (
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                                </div>
                            )}
                            {!youtubeValidating && youtubeUrl && youtubeValid && (
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="text-green-600" size={20} />
                                </div>
                            )}
                            {!youtubeValidating && youtubeUrl && !youtubeValid && youtubeError && (
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <X className="text-red-600" size={20} />
                                </div>
                            )}
                        </div>
                        {youtubeError && (
                            <p className="text-xs text-red-600 font-medium mt-2">{youtubeError}</p>
                        )}
                    </div>
                </div>
            )}

            {/* University Source Details */}
            {selectedTags.includes('university') && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <GraduationCap className="text-blue-600" size={20} />
                        <h4 className="font-black text-blue-900">University/Institution Reference</h4>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-blue-700 mb-2">University Name *</label>
                        <input
                            type="text"
                            value={universityName}
                            onChange={(e) => setUniversityName(e.target.value)}
                            placeholder="e.g., MIT, Stanford, IIT Delhi"
                            className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-blue-700 mb-2">Course Context (Optional)</label>
                        <input
                            type="text"
                            value={courseContext}
                            onChange={(e) => setCourseContext(e.target.value)}
                            placeholder="e.g., CS 101 - Introduction to Programming"
                            className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-blue-700 mb-2">Department (Optional)</label>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g., Computer Science"
                            className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-medium"
                        />
                    </div>

                    <div className="bg-blue-100 rounded-xl p-4 mt-4">
                        <p className="text-xs text-blue-800 font-medium">
                            <strong>Note:</strong> This content is marked as "University-referenced" not "University-approved"
                            to avoid false claims of institutional endorsement.
                        </p>
                    </div>
                </div>
            )}

            {/* Online Course Source Details */}
            {selectedTags.includes('online_course') && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <BookOpen className="text-green-600" size={20} />
                        <h4 className="font-black text-green-900">Online Course Platform</h4>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-green-700 mb-2">Platform *</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none font-medium"
                        >
                            <option value="">Select platform...</option>
                            {getApprovedPlatforms().map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-green-700 mb-2">Course Name (Optional)</label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="e.g., Introduction to Algorithms"
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-green-700 mb-2">Instructor (Optional)</label>
                        <input
                            type="text"
                            value={instructor}
                            onChange={(e) => setInstructor(e.target.value)}
                            placeholder="e.g., Dr. John Smith"
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none font-medium"
                        />
                    </div>

                    {platform === 'Other' && (
                        <div>
                            <label className="block text-xs font-bold text-green-700 mb-2">Course URL (Required for Other)</label>
                            <input
                                type="url"
                                value={courseUrl}
                                onChange={(e) => setCourseUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none font-medium"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Self-Written Source Details */}
            {selectedTags.includes('self_written') && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <Edit className="text-purple-600" size={20} />
                        <h4 className="font-black text-purple-900">Self-Written Original Content</h4>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-purple-700 mb-2">Author Name *</label>
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-purple-700 mb-2">Content Description *</label>
                        <textarea
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            placeholder="Describe your original content and what it covers..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none font-medium resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-purple-700 mb-2">Your Expertise/Background (Optional)</label>
                        <input
                            type="text"
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                            placeholder="e.g., CS Student, Software Engineer, Researcher"
                            className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 outline-none font-medium"
                        />
                    </div>

                    <div className="bg-purple-100 rounded-xl p-4 mt-4">
                        <p className="text-xs text-purple-800 font-medium">
                            <strong>Admin Review:</strong> Self-written content will be reviewed by admins to ensure quality and accuracy before publication.
                        </p>
                    </div>
                </div>
            )}

            {/* Book/Other Source Details */}
            {selectedTags.includes('book_other') && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <Book className="text-orange-600" size={20} />
                        <h4 className="font-black text-orange-900">Book or Unlisted Source</h4>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-orange-700 mb-2">Source Type *</label>
                        <select
                            value={bookSourceType}
                            onChange={(e) => setBookSourceType(e.target.value as any)}
                            className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none font-medium"
                        >
                            <option value="book">Book</option>
                            <option value="research_paper">Research Paper</option>
                            <option value="article">Article</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-orange-700 mb-2">Title *</label>
                        <input
                            type="text"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                            placeholder="e.g., Introduction to Algorithms"
                            className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-orange-700 mb-2">Author (Optional)</label>
                        <input
                            type="text"
                            value={bookAuthor}
                            onChange={(e) => setBookAuthor(e.target.value)}
                            placeholder="e.g., Thomas H. Cormen"
                            className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none font-medium"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-orange-700 mb-2">Publisher (Optional)</label>
                            <input
                                type="text"
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                                placeholder="e.g., MIT Press"
                                className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-orange-700 mb-2">ISBN (Optional)</label>
                            <input
                                type="text"
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)}
                                placeholder="e.g., 978-0262033848"
                                className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-orange-700 mb-2">URL (Optional)</label>
                        <input
                            type="url"
                            value={bookUrl}
                            onChange={(e) => setBookUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-orange-700 mb-2">Description *</label>
                        <textarea
                            value={bookDescription}
                            onChange={(e) => setBookDescription(e.target.value)}
                            placeholder="Describe the source and how it relates to your content..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none font-medium resize-none"
                        />
                    </div>

                    <div className="bg-orange-100 rounded-xl p-4 mt-4">
                        <p className="text-xs text-orange-800 font-medium">
                            <strong>Admin Review:</strong> Unlisted sources will be verified by admins to ensure they are legitimate academic resources.
                        </p>
                    </div>
                </div>
            )}

            {/* Trust Level Preview */}
            {selectedTags.length > 0 && (
                <div className={`bg-gradient-to-r ${trustLevel === 'verified' ? 'from-green-50 to-emerald-50 border-green-300' :
                        trustLevel === 'trusted' ? 'from-blue-50 to-indigo-50 border-blue-300' :
                            'from-gray-50 to-slate-50 border-gray-300'
                    } border-2 rounded-2xl p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Award className={`${trustLevel === 'verified' ? 'text-green-600' :
                                        trustLevel === 'trusted' ? 'text-blue-600' :
                                            'text-gray-600'
                                    }`} size={24} />
                                <h4 className="font-black text-gray-900">Content Trust Level</h4>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{trustInfo.description}</p>
                            {requiresAdminVerification && (
                                <p className="text-xs text-purple-600 font-bold mt-2">⏳ Pending admin verification</p>
                            )}
                        </div>
                        <div className={`px-6 py-3 rounded-2xl font-black text-lg ${trustLevel === 'verified' ? 'bg-green-600 text-white' :
                                trustLevel === 'trusted' ? 'bg-blue-600 text-white' :
                                    'bg-gray-600 text-white'
                            }`}>
                            {trustInfo.icon} {trustInfo.label}
                        </div>
                    </div>

                    {selectedTags.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full">
                                    🏆 Multiple Source Bonus
                                </span>
                                <span className="text-gray-600 font-medium">Higher trust and better discoverability!</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
