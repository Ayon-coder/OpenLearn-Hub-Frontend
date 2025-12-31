import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { UniversityPath } from '@/types';
import { UNIVERSITIES, SEMESTERS, DEPARTMENTS } from '@/constants';

interface UniversityPathFormProps {
    initialData?: UniversityPath;
    onPathChange: (path: UniversityPath | null) => void;
}

export const UniversityPathForm: React.FC<UniversityPathFormProps> = ({
    initialData,
    onPathChange
}) => {
    const [university, setUniversity] = useState(initialData?.university || '');
    const [semester, setSemester] = useState(initialData?.semester || '');
    const [department, setDepartment] = useState(initialData?.department || '');
    const [subject, setSubject] = useState(initialData?.subject || '');
    const [topic, setTopic] = useState(initialData?.topic || '');

    // Update parent when any field changes
    useEffect(() => {
        if (university && semester && department && subject && topic) {
            onPathChange({
                university,
                semester,
                department,
                subject,
                topic
            });
        } else {
            onPathChange(null);
        }
    }, [university, semester, department, subject, topic]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="text-purple-600" size={24} />
                </div>
                <div>
                    <h3 className="font-black text-gray-900 text-lg">University-Based Organization</h3>
                    <p className="text-sm text-gray-600">Curriculum structure hierarchy</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* University */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        University / Institution *
                    </label>
                    <select
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none font-medium"
                    >
                        <option value="">Select university...</option>
                        {UNIVERSITIES.map((u) => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                    {university === 'Other' && (
                        <input
                            type="text"
                            placeholder="Enter university name"
                            onChange={(e) => setUniversity(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none font-medium mt-2"
                        />
                    )}
                </div>

                {/* Semester */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Semester *
                    </label>
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none font-medium"
                    >
                        <option value="">Select semester...</option>
                        {SEMESTERS.map((s) => (
                            <option key={s} value={s}>Semester {s}</option>
                        ))}
                    </select>
                </div>

                {/* Department */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Department *
                    </label>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none font-medium"
                    >
                        <option value="">Select department...</option>
                        {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    {department === 'Other' && (
                        <input
                            type="text"
                            placeholder="Enter department name"
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none font-medium mt-2"
                        />
                    )}
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Subject *
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Data Structures and Algorithms"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none font-medium"
                    />
                </div>

                {/* Topic */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Topic *
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Arrays and Linked Lists"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none font-medium"
                    />
                </div>
            </div>

            {/* Preview */}
            {university && semester && department && subject && topic && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                    <p className="text-xs font-black text-purple-700 uppercase tracking-widest mb-3">Path Preview:</p>
                    <div className="flex items-center space-x-2 text-sm font-bold text-purple-900 flex-wrap">
                        <span>{university}</span>
                        <span className="text-purple-400">›</span>
                        <span>Semester {semester}</span>
                        <span className="text-purple-400">›</span>
                        <span>{department}</span>
                        <span className="text-purple-400">›</span>
                        <span>{subject}</span>
                        <span className="text-purple-400">›</span>
                        <span>{topic}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
