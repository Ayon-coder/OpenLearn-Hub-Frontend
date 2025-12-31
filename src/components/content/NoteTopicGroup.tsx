import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Lock, ChevronRight } from 'lucide-react';
import { CreatorNotesGroup } from '@/types';

interface NoteTopicGroupProps {
    group: CreatorNotesGroup;
    maxVisible?: number;
    showViewAll?: boolean;
    onCourseNoteClick?: (noteId: string) => void; // Optional callback for course notes
}

export const NoteTopicGroup: React.FC<NoteTopicGroupProps> = ({
    group,
    maxVisible = 3,
    showViewAll = true,
    onCourseNoteClick
}) => {
    const navigate = useNavigate();
    const visibleNotes = group.notes.slice(0, maxVisible);
    const hasMore = group.notes.length > maxVisible;

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    };

    const handleNoteClick = (note: typeof visibleNotes[0]) => {
        if (note.isCourseNote) {
            if (onCourseNoteClick) {
                // Use callback if provided (for gatekeeper modal)
                onCourseNoteClick(note.id);
            } else {
                // Default behavior
                navigate(`/course/access/${note.id}`);
            }
        } else {
            navigate(`/note/${note.id}`);
        }
    };

    return (
        <div className="space-y-2">
            {/* Topic Header */}
            <div className="flex items-center space-x-2 mb-3">
                <div className="text-xl">📂</div>
                <h4 className="font-black text-gray-900 text-sm">{group.topic}</h4>
                <span className="text-xs text-gray-400 font-bold">
                    {group.notes.length} note{group.notes.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Note List */}
            <div className="space-y-1.5 ml-7">
                {visibleNotes.map(note => (
                    <div
                        key={note.id}
                        onClick={() => handleNoteClick(note)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {note.isCourseNote && (
                                <Lock size={14} className="text-amber-600 flex-shrink-0" />
                            )}
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors truncate">
                                {note.title}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                            <div className="flex items-center space-x-1 text-xs text-gray-400 font-medium">
                                <Clock size={12} />
                                <span>{formatTimeAgo(note.uploadedAt)}</span>
                            </div>
                            <ChevronRight
                                size={14}
                                className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Link */}
            {showViewAll && hasMore && (
                <div className="ml-7 pt-2">
                    <button
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 hover:underline"
                    >
                        <span>View all {group.notes.length} notes</span>
                        <ChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};
