
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_SUBTOPICS, INITIAL_CONTENT } from '@/constants';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VoteButtons } from '@/components/ui/VoteButtons';
import { CommentSection } from '@/components/interaction/CommentSection';
import { ReviewSection } from '@/components/interaction/ReviewSection';
import {
  Share2,
  Download,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Sparkles,
  FileText,
  Loader2,
  Bookmark,
  Lock,
  Info,
  Youtube
} from 'lucide-react';
import { driveSyncService } from '@/services/drive/driveSyncService';
import { geminiService } from '@/services/ai/geminiService';
import { interactionService } from '@/services/content/interactionService';
import { authService } from '@/services/auth/authService';
import { subscriptionService } from '@/services/user/subscriptionService';
import { ContentInteraction } from '@/types';
import { FollowButton } from '@/components/ui/FollowButton';
import { VideoPlayer } from '@/components/content/VideoPlayer';

export const ContentDetail: React.FC = () => {
  const { subjectId, topicId, subtopicId } = useParams<{ subjectId: string, topicId: string, subtopicId: string }>();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [interactions, setInteractions] = useState<Map<string, ContentInteraction>>(new Map());
  const user = authService.getUser();

  // Check if user can contribute
  const canContribute = user ? authService.canUploadNotes(user) : true;
  const isBronze = user?.role === 'community_contributor' && user?.communityMetrics?.trustLevel === 'bronze';

  const subject = INITIAL_SUBJECTS.find(s => s.id === subjectId);
  const topic = INITIAL_TOPICS.find(t => t.id === topicId);
  const subtopic = INITIAL_SUBTOPICS.find(st => st.id === subtopicId);

  const content = React.useMemo(() =>
    INITIAL_CONTENT.filter(c => c.subtopicId === subtopicId),
    [subtopicId]
  );

  // Load interactions for all content items
  useEffect(() => {
    const newInteractions = new Map<string, ContentInteraction>();
    content.forEach(item => {
      newInteractions.set(item.id, interactionService.getContentInteractions(item.id));
    });
    setInteractions(newInteractions);
  }, [content]);

  const handleDownloadSync = (itemTitle: string) => {
    if (subject && topic && subtopic) {
      driveSyncService.syncDownload({
        subject,
        topic,
        subtopic,
        title: itemTitle
      });
      alert(`Successfully synced "${itemTitle}" to your personal Drive.`);
    }
  };

  const handleGenerateSummary = async (text: string) => {
    setIsSummarizing(true);
    try {
      // Re-using classifyNote or similar for quick summary logic
      const result = await geminiService.classifyNote(text);
      setAiSummary(result.summary);
    } catch (e) {
      setAiSummary("Unable to generate AI summary at this time. Please try again later.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleVote = (contentId: string, vote: 'up' | 'down' | null) => {
    const updated = interactionService.voteContent(contentId, vote);
    setInteractions(prev => new Map(prev).set(contentId, updated));
  };

  const handleCommentSubmit = (contentId: string, text: string, parentId?: string) => {
    interactionService.addComment(contentId, text, parentId);
    const updated = interactionService.getContentInteractions(contentId);
    setInteractions(prev => new Map(prev).set(contentId, updated));
  };

  const handleCommentUpvote = (commentId: string) => {
    interactionService.upvoteComment(commentId);
  };

  const handleReviewSubmit = (contentId: string, review: any) => {
    interactionService.addReview(contentId, review);
    const updated = interactionService.getContentInteractions(contentId);
    setInteractions(prev => new Map(prev).set(contentId, updated));
  };

  const handleReviewHelpful = (reviewId: string, helpful: boolean) => {
    interactionService.markReviewHelpful(reviewId, helpful);
  };

  if (!subject || !topic || !subtopic) return <div className="p-20 text-center font-black text-2xl">Hierarchy Link Broken</div>;

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-24">
      <Breadcrumbs items={[
        { label: 'Hub', path: '/hub' },
        { label: subject.name, path: `/hub/subject/${subject.id}` },
        { label: topic.title, path: `/hub/subject/${subject.id}/topic/${topic.id}` },
        { label: subtopic.title, path: `/hub/subject/${subject.id}/topic/${topic.id}/subtopic/${subtopic.id}` }
      ]} />

      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4 text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">
          <span>{subject.name}</span>
          <ChevronRight size={12} className="text-gray-300" />
          <span>{topic.title}</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{subtopic.title}</h1>
        <p className="text-xl text-gray-500 mt-4 leading-relaxed font-medium">{subtopic.description}</p>
      </div>

      <div className="space-y-16">
        {content.length === 0 ? (
          <div className="bg-white p-20 rounded-[4rem] border border-gray-100 text-center shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <FileText size={48} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No Verified Explanations</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto mb-10 text-lg leading-relaxed">
              This niche subtopic hasn't been documented by our experts yet. Be the pioneer contributor for this path.
            </p>
            <div className="relative inline-block group">
              <button
                disabled={!canContribute}
                className={`px-12 py-5 rounded-[2rem] font-black transition-all shadow-2xl ${canContribute
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-gray-200'
                  }`}
              >
                {canContribute ? (
                  'Contribute First Guide'
                ) : (
                  <>
                    <Lock className="inline mr-2" size={20} />
                    {user?.role === 'community_contributor'
                      ? 'Locked - Silver+ Only'
                      : 'Verification Required'
                    }
                  </>
                )}
              </button>
              {!canContribute && user && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-3 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 font-medium whitespace-nowrap">
                  <div className="flex items-start space-x-2">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      {user?.role === 'community_contributor'
                        ? 'Bronze contributors cannot upload content. Reach Silver level (40+ trust score).'
                        : 'Complete your student verification to contribute content.'
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          content.map(item => {
            const itemInteraction = interactions.get(item.id);
            return (
              <article key={item.id} className="space-y-8">
                <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                  {/* Top Meta Bar */}
                  <div className="p-8 md:p-12 border-b border-gray-50 bg-gray-50/30 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100">
                        {item.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-black text-gray-900 text-xl leading-tight">{item.author}</h4>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Verified Expert • Updated {item.lastUpdated}</p>
                        </div>
                        {(() => {
                          const creator = subscriptionService.getCreatorByUploaderName(item.author);
                          return creator && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <FollowButton
                                creatorId={creator.id}
                                creatorName={creator.name}
                                variant="compact"
                              />
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {itemInteraction && (
                        <VoteButtons
                          contentId={item.id}
                          upvotes={itemInteraction.upvotes}
                          downvotes={itemInteraction.downvotes}
                          userVote={itemInteraction.userVote}
                          onVote={(vote) => handleVote(item.id, vote)}
                        />
                      )}
                      <button className="p-3.5 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-2xl transition-all border border-gray-100 shadow-sm">
                        <Share2 size={20} />
                      </button>
                      <button className="p-3.5 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-2xl transition-all border border-gray-100 shadow-sm">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Main Content Body */}
                  <div className="p-10 md:p-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-10 leading-[1.1] tracking-tight">{item.title}</h2>

                    {/* Video Widget */}
                    {item.videoUrl && (
                      <div className="mb-12 bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/20">
                        <div className="flex items-center px-8 py-4 bg-white/5 border-b border-white/10 space-x-3">
                          <Youtube size={20} className="text-red-500" />
                          <span className="text-gray-200 text-sm font-bold uppercase tracking-widest">Video Lesson</span>
                        </div>
                        <div className="aspect-video w-full">
                          <VideoPlayer
                            url={item.videoUrl}
                            title={item.title}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* AI Summary Widget */}
                    <div className="mb-16 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 p-8 md:p-10 relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
                            <Sparkles size={18} />
                          </div>
                          <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Gemini Study Guide</span>
                        </div>
                        {!aiSummary && !isSummarizing && (
                          <button
                            onClick={() => handleGenerateSummary(item.body)}
                            className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
                          >
                            Generate Summary
                          </button>
                        )}
                      </div>

                      {isSummarizing ? (
                        <div className="flex items-center space-x-3 text-blue-400 animate-pulse py-4">
                          <Loader2 className="animate-spin" size={20} />
                          <span className="font-bold text-sm">Distilling knowledge...</span>
                        </div>
                      ) : aiSummary ? (
                        <p className="text-blue-900/80 font-medium leading-relaxed italic border-l-4 border-blue-200 pl-6">
                          {aiSummary}
                        </p>
                      ) : (
                        <p className="text-blue-700/50 font-medium text-sm">Need a quick recap? Click generate to get an AI-powered summary of this guide.</p>
                      )}

                      <Sparkles size={80} className="absolute -bottom-6 -right-6 text-blue-600/5 group-hover:scale-125 transition-transform" />
                    </div>

                    <div className="prose prose-blue prose-xl max-w-none text-gray-700 font-medium leading-[1.8]">
                      {item.body.split('\n').map((line, i) => (
                        line.startsWith('##') ? <h2 key={i} className="text-3xl font-black mt-16 mb-8 text-gray-900 border-b-2 border-gray-50 pb-4">{line.replace('## ', '')}</h2> :
                          line.startsWith('###') ? <h3 key={i} className="text-2xl font-black mt-10 mb-6 text-gray-800">{line.replace('### ', '')}</h3> :
                            <p key={i} className="mb-8 opacity-90">{line}</p>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Sync Action Bar */}
                  <div className="p-10 bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 rounded-b-[4rem]">
                    <div className="flex items-center space-x-6">
                      <div className="p-5 bg-white/10 text-white rounded-[1.5rem] backdrop-blur-md border border-white/10">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <h4 className="font-black text-2xl tracking-tight">Verified Academic Resource</h4>
                        <p className="text-gray-400 font-medium text-sm mt-1">This content is synced with the Global Drive Hierarchy.</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 w-full md:w-auto">
                      <button
                        onClick={() => handleDownloadSync(item.title)}
                        className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                      >
                        <Download size={24} /> <span>Sync to Drive</span>
                      </button>
                      <button className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-white/5 text-white px-10 py-5 rounded-[2rem] font-black border border-white/10 hover:bg-white/10 transition-all">
                        <Edit3 size={20} /> <span>Suggest Edit</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                {itemInteraction && (
                  <ReviewSection
                    contentId={item.id}
                    reviews={itemInteraction.reviews}
                    averageRating={itemInteraction.averageRating}
                    onReviewSubmit={(review) => handleReviewSubmit(item.id, review)}
                    onReviewHelpful={handleReviewHelpful}
                  />
                )}

                {/* Comments Section */}
                {itemInteraction && (
                  <CommentSection
                    contentId={item.id}
                    comments={itemInteraction.comments}
                    onCommentSubmit={(text, parentId) => handleCommentSubmit(item.id, text, parentId)}
                    onCommentUpvote={handleCommentUpvote}
                  />
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
