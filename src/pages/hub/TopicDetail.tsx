
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  History, 
  Share2, 
  Download, 
  ThumbsUp, 
  ThumbsDown,
  Info,
  ChevronDown,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_TOPICS } from '@/constants';

export const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const topic = INITIAL_TOPICS.find(t => t.id === id);
  const [showImproveMode, setShowImproveMode] = useState(false);

  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/hub" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Hub
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <header className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {topic.subjectId}
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full uppercase tracking-wider">
                  {topic.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><Share2 size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><History size={18} /></button>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all">
                  <Edit3 size={18} /> <span>Edit Content</span>
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{topic.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4 pb-6 border-b border-gray-100">
              <span className="flex items-center"><ThumbsUp size={16} className="mr-1" /> {topic.votes} upvotes</span>
              <span>Last updated: {topic.lastUpdated}</span>
              <span className="text-green-600 font-bold flex items-center">
                <CheckCircle2 size={16} className="mr-1" /> Peer Verified
              </span>
            </div>

            <article className="prose prose-blue max-w-none mt-8">
              {topic.content.split('\n').map((line, i) => (
                line.startsWith('##') ? <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-gray-800">{line.replace('## ', '')}</h2> :
                line.startsWith('###') ? <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-gray-700">{line.replace('### ', '')}</h3> :
                line.startsWith('-') ? <li key={i} className="ml-4 mb-2 text-gray-600 list-disc">{line.replace('- ', '')}</li> :
                <p key={i} className="mb-4 text-gray-600 leading-relaxed">{line}</p>
              ))}
            </article>
          </header>

          <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-3xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 text-white rounded-2xl">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">One-Click Exam Pack</h4>
                <p className="text-blue-700/70 text-sm">Download verified summary, key points, and formulas.</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-white text-blue-700 px-6 py-3 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all">
              <Download size={20} /> <span>Export PDF</span>
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-4 flex items-center justify-between">
              Exam Readiness <Info size={14} className="text-gray-400" />
            </h4>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-50">
                    Community Score
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold inline-block text-blue-600">
                    {topic.readiness}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-blue-50 border border-blue-100">
                <div style={{ width: `${topic.readiness}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 rounded-full transition-all duration-1000"></div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                This score reflects accuracy, clarity, and completeness as voted by users.
              </p>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-3xl text-white">
            <h4 className="font-bold mb-3 flex items-center">
              <Edit3 size={18} className="mr-2 text-indigo-300" /> Improve This Topic
            </h4>
            <p className="text-indigo-200 text-sm mb-4 leading-relaxed">
              Our AI detected missing sections: **Code Examples** and **Common Pitfalls**.
            </p>
            <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-sm font-bold transition-colors">
              Help Complete Topic
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-4">Related Topics</h4>
            <div className="space-y-3">
              {['Memory Allocation', 'Deadlock Avoidance', 'Interrupt Handling'].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{t}</span>
                  <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
