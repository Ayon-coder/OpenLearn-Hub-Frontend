import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { SubjectPath } from '@/types';
import { INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_SUBTOPICS } from '@/constants';

interface SubjectPathFormProps {
    initialData?: SubjectPath;
    onPathChange: (path: SubjectPath | null) => void;
}

export const SubjectPathForm: React.FC<SubjectPathFormProps> = ({
    initialData,
    onPathChange
}) => {
    const [subject, setSubject] = useState(initialData?.subject || '');
    const [coreTopic, setCoreTopic] = useState(initialData?.coreTopic || '');
    const [subtopic, setSubtopic] = useState(initialData?.subtopic || '');
    const [resourceTitle, setResourceTitle] = useState(initialData?.resourceTitle || '');

    const [filteredTopics, setFilteredTopics] = useState(INITIAL_TOPICS);
    const [filteredSubtopics, setFilteredSubtopics] = useState(INITIAL_SUBTOPICS);

    // Filter topics when subject changes
    useEffect(() => {
        if (subject) {
            const topics = INITIAL_TOPICS.filter(t => t.subjectId === subject);
            setFilteredTopics(topics);
            if (!topics.find(t => t.id === coreTopic)) {
                setCoreTopic('');
            }
        }
    }, [subject]);

    // Filter subtopics when topic changes
    useEffect(() => {
        if (coreTopic) {
            const subtopics = INITIAL_SUBTOPICS.filter(s => s.topicId === coreTopic);
            setFilteredSubtopics(subtopics);
            if (!subtopics.find(s => s.id === subtopic)) {
                setSubtopic('');
            }
        }
    }, [coreTopic]);

    // Update parent when any field changes
    useEffect(() => {
        if (subject && coreTopic && subtopic && resourceTitle) {
            const selectedSubject = INITIAL_SUBJECTS.find(s => s.id === subject);
            const selectedTopic = INITIAL_TOPICS.find(t => t.id === coreTopic);
            const selectedSubtopic = INITIAL_SUBTOPICS.find(s => s.id === subtopic);

            onPathChange({
                subject: selectedSubject?.name || subject,
                coreTopic: selectedTopic?.title || coreTopic,
                subtopic: selectedSubtopic?.title || subtopic,
                resourceTitle
            });
        } else {
            onPathChange(null);
        }
    }, [subject, coreTopic, subtopic, resourceTitle]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                    <h3 className="font-black text-gray-900 text-lg">Subject-Based Organization</h3>
                    <p className="text-sm text-gray-600">Academic subject hierarchy</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Subject */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Subject *
                    </label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium"
                    >
                        <option value="">Select subject...</option>
                        {INITIAL_SUBJECTS.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Core Topic */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Core Topic *
                    </label>
                    <select
                        value={coreTopic}
                        onChange={(e) => setCoreTopic(e.target.value)}
                        disabled={!subject}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Select topic...</option>
                        {filteredTopics.map((t) => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                    </select>
                </div>

                {/* Subtopic */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Subtopic *
                    </label>
                    <select
                        value={subtopic}
                        onChange={(e) => setSubtopic(e.target.value)}
                        disabled={!coreTopic}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Select subtopic...</option>
                        {filteredSubtopics.map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </select>
                </div>

                {/* Resource Title */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Resource Title *
                    </label>
                    <input
                        type="text"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        placeholder="e.g., Array Implementation in C"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium"
                    />
                </div>
            </div>

            {/* Preview */}
            {subject && coreTopic && subtopic && resourceTitle && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-3">Path Preview:</p>
                    <div className="flex items-center space-x-2 text-sm font-bold text-blue-900">
                        <span>{INITIAL_SUBJECTS.find(s => s.id === subject)?.name}</span>
                        <span className="text-blue-400">›</span>
                        <span>{INITIAL_TOPICS.find(t => t.id === coreTopic)?.title}</span>
                        <span className="text-blue-400">›</span>
                        <span>{INITIAL_SUBTOPICS.find(s => s.id === subtopic)?.title}</span>
                        <span className="text-blue-400">›</span>
                        <span>{resourceTitle}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
