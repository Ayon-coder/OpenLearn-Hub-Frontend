import React from 'react';
import { BookOpen, GraduationCap, Youtube, Eye, ThumbsUp, MessageSquare, Star, Download, ShieldCheck, Tag } from 'lucide-react';
import { DemoContent } from '@/data/demoContents';
import { FollowButton } from '@/components/ui/FollowButton';
import { subscriptionService } from '@/services/user/subscriptionService';
import { VideoPlayer } from './VideoPlayer';

interface EnhancedContentCardProps {
    content: DemoContent;
    onClick?: () => void;
    forceFree?: boolean;
}

export const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({
    content,
    onClick,
    forceFree = false
}) => {
    const { title, description, organization, uploadedBy, views, likes } = content;
    const { subjectPath, universityPath, channelPath } = organization;

    // Mock interaction stats (in production, these would come from the content object)
    const upvotes = likes || 0;
    const comments = Math.floor(Math.random() * 20) + 1;
    const averageRating = 4.2 + Math.random() * 0.8; // Random rating between 4.2-5.0

    // Get creator info
    const creator = subscriptionService.getCreatorByUploaderName(uploadedBy);
    const eligibility = creator ? subscriptionService.getFollowEligibility({
        id: creator.id,
        name: creator.name,
        email: '',
        role: creator.role,
        verificationStatus: creator.verificationStatus,
        verificationLevel: creator.verificationLevel,
        communityMetrics: creator.communityMetrics,
        joinedDate: '',
        reputation: creator.reputation,
        badges: []
    }) : { canBeFollowed: false, badge: 'none' as const };

    return (
        <div
            onClick={onClick}
            className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col"
        >
            {/* Title */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors flex-1 pr-2 line-clamp-1">
                    {title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full text-[10px] font-bold text-green-700 border border-green-200">
                        <ShieldCheck size={10} />
                        {!forceFree && organization.coursePath ? (
                            <span>Course</span>
                        ) : (
                            <span>Free</span>
                        )}
                    </div>
                    {/* Video Badge */}
                    {content.videoUrl && (
                        <div className="flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-full text-[10px] font-bold text-red-700 border border-red-200">
                            <Youtube size={10} />
                            <span>Video</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 font-medium mb-4 line-clamp-2">
                {description}
            </p>

            {/* Media Preview Area - Always 16:9 for alignment */}
            <div className={`mb-4 rounded-xl overflow-hidden bg-gray-50 aspect-video shadow-sm border border-gray-100 relative group`}>
                {content.videoUrl && (forceFree || !organization.coursePath) ? (
                    <VideoPlayer
                        url={content.videoUrl}
                        title={title}
                        className="w-full h-full"
                    />
                ) : content.videoUrl && organization.coursePath ? (
                    // Course content with video/verification link - show thumbnail or platform badge
                    (() => {
                        // Check if it's a YouTube URL
                        const youtubeMatch = content.videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                        const videoId = youtubeMatch && youtubeMatch[2].length === 11 ? youtubeMatch[2] : null;

                        // Detect platform from URL
                        const getPlatformInfo = (url: string) => {
                            if (url.includes('youtube.com') || url.includes('youtu.be')) return { name: 'YouTube', color: 'red', icon: '▶️' };
                            if (url.includes('udemy.com')) return { name: 'Udemy', color: 'purple', icon: '📚' };
                            if (url.includes('coursera.org')) return { name: 'Coursera', color: 'blue', icon: '🎓' };
                            if (url.includes('edx.org')) return { name: 'edX', color: 'red', icon: '🏛️' };
                            if (url.includes('skillshare.com')) return { name: 'Skillshare', color: 'green', icon: '🎨' };
                            if (url.includes('linkedin.com/learning')) return { name: 'LinkedIn Learning', color: 'blue', icon: '💼' };
                            if (url.includes('pluralsight.com')) return { name: 'Pluralsight', color: 'pink', icon: '💡' };
                            return { name: 'Course Link', color: 'gray', icon: '🔗' };
                        };

                        const platform = getPlatformInfo(content.videoUrl);

                        if (videoId) {
                            // YouTube video - show thumbnail with play overlay
                            return (
                                <div className="relative w-full h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); window.open(content.videoUrl, '_blank'); }}>
                                    <img
                                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                        alt={title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                        }}
                                    />
                                    {/* Play overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                    {/* Course badge */}
                                    <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1">
                                        <span>🎓</span>
                                        <span>Course Content</span>
                                    </div>
                                </div>
                            );
                        } else {
                            // Non-YouTube platform - show platform badge with external link
                            return (
                                <div
                                    className="w-full h-full bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-6 text-center cursor-pointer group-hover:from-purple-100 group-hover:to-indigo-200 transition-all"
                                    onClick={(e) => { e.stopPropagation(); window.open(content.videoUrl, '_blank'); }}
                                >
                                    <div className={`w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border-2 border-${platform.color}-200`}>
                                        <span className="text-3xl">{platform.icon}</span>
                                    </div>
                                    <span className={`text-sm font-black text-${platform.color}-600 mb-1`}>
                                        {platform.name}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-purple-500 transition-colors flex items-center space-x-1">
                                        <span>Open Course</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </span>
                                </div>
                            );
                        }
                    })()
                ) : content.coverImage ? (
                    // No video URL but cover image is available - show cover image
                    <div className="relative w-full h-full">
                        <img
                            src={content.coverImage}
                            alt={title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        {/* Overlay badge for course content */}
                        {organization.coursePath && (
                            <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1">
                                <span>🎓</span>
                                <span>Course Content</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 text-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-all">
                        <>
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <BookOpen className="text-gray-400 group-hover:text-blue-500 transition-colors" size={24} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                                Preview Note
                            </span>
                        </>
                    </div>
                )}
            </div>



            {/* Organization Paths - Show max 2, simplified */}
            <div className="space-y-2 mb-4 flex-grow">
                {/* Priority 0: Course Path (for course uploads) */}
                {organization.coursePath && !universityPath && (
                    <div className="flex items-start space-x-2">
                        <GraduationCap className="text-purple-600 flex-shrink-0 mt-0.5" size={16} />
                        <div className="flex items-center space-x-1 text-xs font-medium text-purple-900 flex-wrap min-w-0">
                            <span className="truncate max-w-[120px]">{organization.coursePath.provider}</span>
                            <span className="text-purple-400">›</span>
                            <span className="truncate max-w-[150px]">{organization.coursePath.courseName}</span>
                        </div>
                    </div>
                )}

                {/* Priority 1: University Path (most specific for course content) */}
                {universityPath && (
                    <div className="flex items-start space-x-2">
                        <GraduationCap className="text-purple-600 flex-shrink-0 mt-0.5" size={16} />
                        <div className="flex items-center space-x-1 text-xs font-medium text-purple-900 flex-wrap min-w-0">
                            <span className="truncate max-w-[200px]">{universityPath.university}</span>
                            <span className="text-purple-400">›</span>
                            <span className="truncate max-w-[150px]">{universityPath.department.split('(')[1]?.replace(')', '') || universityPath.department}</span>
                        </div>
                    </div>
                )}

                {/* Priority 2: Subject Path (if no university path and no course path) */}
                {!universityPath && !organization.coursePath && subjectPath && (
                    <div className="flex items-start space-x-2">
                        <BookOpen className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                        <div className="flex items-center space-x-1 text-xs font-medium text-blue-900 flex-wrap min-w-0">
                            <span className="truncate max-w-[150px]">{subjectPath.subject}</span>
                            <span className="text-blue-400">›</span>
                            <span className="truncate max-w-[150px]">{subjectPath.coreTopic}</span>
                        </div>
                    </div>
                )}

                {/* Priority 3: Channel Path (secondary info) - only if we have space */}
                {channelPath && !organization.competitiveExamPath && (
                    <div className="flex items-start space-x-2">
                        <Youtube className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                        <div className="flex items-center space-x-1 text-xs font-medium text-red-900 flex-wrap min-w-0">
                            <span className="truncate max-w-[200px]">{channelPath.channelName}</span>
                        </div>
                    </div>
                )}

                {/* Priority 4: Competitive Exam (replaces channel if present) */}
                {organization.competitiveExamPath && (
                    <div className="flex items-start space-x-2">
                        <div className="text-amber-600 flex-shrink-0 mt-0.5">🏆</div>
                        <div className="flex items-center space-x-1 text-xs font-medium text-amber-900 flex-wrap min-w-0">
                            <span className="truncate max-w-[120px]">{organization.competitiveExamPath.exam}</span>
                            <span className="text-amber-400">›</span>
                            <span className="truncate max-w-[100px]">{organization.competitiveExamPath.year}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-3 flex-wrap mt-auto">
                <div className="flex items-center space-x-2 min-w-0">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); /* Navigate to profile */ }}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                            {uploadedBy.charAt(0)}
                        </div>
                        <span className="font-medium underline decoration-dotted underline-offset-2 truncate max-w-[120px]">{uploadedBy}</span>
                    </div>

                    {/* Follow Button - show for all creators */}
                    {creator && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <FollowButton
                                creatorId={creator.id}
                                creatorName={creator.name}
                                variant="compact"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-gray-500 shrink-0">
                    <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer">
                        <Eye size={14} />
                        <span className="font-medium">{views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer">
                        <ThumbsUp size={14} />
                        <span className="font-medium">{upvotes}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer">
                        <MessageSquare size={14} />
                        <span className="font-medium">{comments}</span>
                    </div>
                    {content.downloads && (
                        <div className="flex items-center space-x-1 hover:text-green-600 transition-colors cursor-pointer">
                            <Download size={14} className="text-green-600" />
                            <span className="font-medium">{content.downloads}</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Transparency Notice */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center font-medium">
                    ℹ️ Community-contributed content
                </p>
            </div>
        </div>
    );
};
