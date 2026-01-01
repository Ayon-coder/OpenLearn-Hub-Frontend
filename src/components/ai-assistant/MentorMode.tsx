import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sendMentorMessage, Message } from '@/services/ai/aiAssistantService';
import { Send, RefreshCw, GraduationCap, User, Sparkles } from 'lucide-react';

const POPULAR_TOPICS = [
    { name: 'Data Structures', icon: '📊', description: 'Arrays, lists, trees, graphs' },
    { name: 'Algorithms', icon: '⚡', description: 'Sorting, searching, recursion' },
    { name: 'Web Development', icon: '🌐', description: 'HTML, CSS, JavaScript, React' },
    { name: 'Python Basics', icon: '🐍', description: 'Variables, functions, loops' },
    { name: 'Machine Learning', icon: '🤖', description: 'Models, training, prediction' },
    { name: 'Database Design', icon: '💾', description: 'SQL, normalization, queries' },
];

export const MentorMode: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleTopicSelect = async (selectedTopic: string) => {
        setTopic(selectedTopic);
        const userMessage: Message = { role: 'user', content: `I want to learn about ${selectedTopic}` };
        setMessages([userMessage]);
        setIsLoading(true);

        try {
            const response = await sendMentorMessage([userMessage], selectedTopic);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: inputValue.trim() };

        // If no topic yet, use the message as the topic
        if (!topic) {
            setTopic(inputValue.trim());
        }

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const allMessages = [...messages, userMessage];
            const response = await sendMentorMessage(allMessages, topic || inputValue.trim());
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setTopic('');
        setMessages([]);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Render welcome screen if no topic selected
    if (!topic && messages.length === 0) {
        return (
            <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50 overflow-hidden relative">
                <div className="flex-1 flex flex-col items-center justify-start pt-12 p-8 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar pb-32">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm flex-shrink-0">
                        <span className="text-4xl">🎓</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">AI Mentor</h1>
                    <p className="text-gray-500 text-center max-w-md mb-10 text-lg">
                        Choose a topic to start your personalized learning journey using our advanced AI.
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl w-full">
                        {POPULAR_TOPICS.map((t) => (
                            <button
                                key={t.name}
                                className="group flex flex-col items-center p-5 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-white rounded-2xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                                onClick={() => handleTopicSelect(t.name)}
                            >
                                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{t.icon}</div>
                                <div className="font-semibold text-gray-900 text-sm mb-1">{t.name}</div>
                                <div className="text-xs text-gray-500 text-center line-clamp-1">{t.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-white/90 backdrop-blur-md border-t border-gray-100 absolute bottom-0 left-0 right-0 z-10 shadow-lg shadow-gray-100/50">
                    <form className="flex gap-3 max-w-2xl mx-auto" onSubmit={handleSendMessage}>
                        <div className="relative flex-1 group">
                            <textarea
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                placeholder="Or type any topic you want to learn..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all duration-300 transform active:scale-95"
                            disabled={!inputValue.trim()}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Render chat interface
    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100/50 rounded-xl flex items-center justify-center text-xl">
                        📚
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">{topic}</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Session Active
                        </div>
                    </div>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    onClick={handleClearChat}
                >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">New Topic</span>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 sm:px-6 custom-scrollbar pb-32">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}
                    >
                        <div className={`flex gap-4 max-w-[85%] lg:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm mt-1
                                ${message.role === 'assistant'
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                    : 'bg-gradient-to-br from-gray-700 to-gray-900 text-white'
                                }`}>
                                {message.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`px-6 py-4 rounded-2xl shadow-sm ${message.role === 'user'
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none prose prose-blue prose-sm max-w-none'
                                }`}>
                                {message.role === 'assistant' ? (
                                    <ReactMarkdown
                                        components={{
                                            code({ className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                const isInline = !match;
                                                return !isInline ? (
                                                    <div className="rounded-xl overflow-hidden my-4 shadow-sm border border-gray-200">
                                                        <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 flex justify-between items-center">
                                                            <span>{match[1]}</span>
                                                        </div>
                                                        <SyntaxHighlighter
                                                            style={vscDarkPlus}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{ margin: 0, borderRadius: 0 }}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="flex gap-4 max-w-[80%]">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-sm mt-1">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="px-6 py-4 rounded-2xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center gap-2">
                                <span className="text-gray-500 text-sm font-medium">Thinking</span>
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Floating Bar */}
            <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 absolute bottom-0 left-0 right-0 z-10 shadow-lg shadow-gray-100/50">
                <form
                    className="flex gap-3 max-w-4xl mx-auto relative bg-white rounded-[24px] shadow-xl shadow-blue-900/5 border border-gray-100 p-2 pl-6 items-center"
                    onSubmit={handleSendMessage}
                >
                    <textarea
                        className="flex-1 py-3 bg-transparent border-none focus:ring-0 resize-none max-h-32 text-gray-800 placeholder:text-gray-400"
                        placeholder="Ask a follow-up question..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all duration-200"
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">AI can make mistakes</span>
                </div>
            </div>
        </div>
    );
};

export default MentorMode;
