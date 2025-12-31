
import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Info,
  Terminal,
  History,
  MessageSquare,
  // Removed unused Cpu, Layers, Globe imports
  CheckCircle2,
  Paperclip,
  X
} from 'lucide-react';
import { geminiService } from '@/services/ai/geminiService';
import { authService } from '@/services/auth/authService';
import { ChatMessage, ChatContext } from '@/types';
import { INITIAL_SUBJECTS } from '@/constants';

interface SelectedFile {
  file: File;
  preview: string;
  base64: string;
}

export const AIChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({});
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, selectedFile]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please upload files smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedFile({
        file,
        preview: base64String, // For images, this works as preview
        base64: base64String.split(',')[1] // Remove data URL prefix for API
      });
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userParts: any[] = [];
    if (input.trim()) {
      userParts.push({ text: input });
    }
    if (selectedFile) {
      userParts.push({
        inlineData: {
          mimeType: selectedFile.file.type,
          data: selectedFile.base64
        }
      });
    }

    const userMessage: ChatMessage = {
      role: 'user',
      parts: userParts
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentFile = selectedFile; // Store ref for cleanup
    setSelectedFile(null); // Clear optimistic UI
    setIsLoading(true);

    try {
      const user = authService.getUser();
      const userRole = user?.role || 'student';

      let response = await geminiService.chatWithAI([...messages, userMessage], context, userRole);

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'changeContext') {
            const { subjectName, topicName, subtopicName } = fc.args as any;
            const validation = geminiService.validateContext(subjectName, topicName, subtopicName);

            if (validation.valid) {
              const newContext: ChatContext = {
                subject: validation.subject?.name,
                topic: validation.topic?.title,
                subtopic: validation.subtopic?.title
              };
              setContext(newContext);

              setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: `Context switched to ${newContext.subject}${newContext.topic ? ` → ${newContext.topic}` : ''}${newContext.subtopic ? ` → ${newContext.subtopic}` : ''}. How can I help you with this topic?` }]
              }]);
            } else {
              setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: `⚠️ **Error**: ${validation.message} \n\nPlease select a valid subject, topic, or subtopic from the Hub to continue.` }]
              }]);
            }
          }
        }
      } else {
        const text = response.text || "I'm sorry, I couldn't process that. Please try again.";
        setMessages(prev => [...prev, { role: 'model', parts: [{ text }] }]);
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);

      // Check if it's a rate limit error
      const isRateLimitError =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.toLowerCase().includes('rate limit') ||
        error?.message?.toLowerCase().includes('quota exceeded');

      let errorMessage: string;

      if (isRateLimitError) {
        errorMessage = "⏳ **Rate Limit Reached**: The AI service is currently busy. We attempted to retry your request but the service is still unavailable. Please wait a few moments and try again.";
      } else if (error?.message?.includes('API Key')) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message || "An error occurred while connecting to the AI assistant. Please check your connection or try again.";
      }

      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: `⚠️ ${errorMessage}` }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Chat Sidebar */}
      <aside className="w-80 border-r border-gray-50 bg-gray-50/30 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-black text-gray-900 tracking-tight">AI Assistant</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Knowledge Engine v3.1</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Active Context</label>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <RefreshCw size={14} className="text-blue-600 animate-spin-slow" />
                  <span className="text-xs font-bold text-gray-900">{context.subject || 'Global Hub'}</span>
                </div>
                {context.topic && (
                  <div className="flex items-center space-x-2 pl-6 border-l-2 border-blue-100 mb-2">
                    <ChevronRight size={12} className="text-gray-300" />
                    <span className="text-[11px] font-medium text-gray-500">{context.topic}</span>
                  </div>
                )}
                {context.subtopic && (
                  <div className="flex items-center space-x-2 pl-10 border-l-2 border-indigo-100">
                    <ChevronRight size={12} className="text-gray-300" />
                    <span className="text-[10px] font-medium text-gray-400">{context.subtopic}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Available Subjects</label>
              <div className="space-y-2">
                {INITIAL_SUBJECTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setInput(`Switch subject to ${s.name}`)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-xs font-bold text-gray-500 flex items-center space-x-3 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-blue-600 transition-colors"></div>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-gray-50 bg-white">
          <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <Info size={16} className="flex-shrink-0" />
            <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">Strict context switching enabled. Ask to change subject to move focus.</p>
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8 border border-dashed border-gray-200">
                <Bot size={48} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Academic Partner.</h3>
              <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                I am strictly bound to the Hub's curriculum. I can provide verified explanations, analyze your notes, and guide your learning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setInput("Explain Operating Systems Process Scheduling")}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-bold text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all text-left flex items-center"
                >
                  <MessageSquare size={14} className="mr-3 text-blue-400" /> Explain Process Scheduling
                </button>
                <button
                  onClick={() => setInput("Switch context to Data Structures")}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-bold text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-left flex items-center"
                >
                  <RefreshCw size={14} className="mr-3 text-indigo-400" /> Switch to Data Structures
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                <div className={`flex flex-col space-y-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-8 py-6 rounded-[2.5rem] text-base font-medium leading-[1.7] shadow-sm ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-100'
                    : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100 prose prose-sm max-w-none prose-blue'
                    }`}>
                    {msg.parts.map((part, i) => (
                      <div key={i}>
                        {'text' in part && part.text.split('\n').map((line, j) => (
                          <p key={j} className={line.trim() === '' ? 'h-4' : ''}>{line}</p>
                        ))}
                        {'inlineData' in part && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-white/20">
                            {part.inlineData.mimeType.startsWith('image/') ? (
                              <img
                                src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
                                alt="Uploaded content"
                                className="max-w-full h-auto max-h-64 object-contain bg-black/10"
                              />
                            ) : (
                              <div className="p-4 bg-white/10 flex items-center space-x-2">
                                <Paperclip size={16} />
                                <span className="text-xs">Attached File</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4">
                    {msg.role === 'user' ? 'Student' : 'Smart Brain'}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 px-8 py-6 rounded-[2.5rem] rounded-tl-none border border-gray-100 flex flex-col items-start space-y-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Synthesizing verified knowledge...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-8 md:p-12 border-t border-gray-50 bg-white">
          {selectedFile && (
            <div className="mb-4 flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl w-fit border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden relative">
                {selectedFile.file.type.startsWith('image/') ? (
                  <img src={selectedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Paperclip size={18} className="text-gray-500" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700 max-w-[150px] truncate">{selectedFile.file.name}</span>
                <span className="text-[10px] text-gray-400">Ready to upload</span>
              </div>
              <button
                onClick={clearFile}
                className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
            <div className="relative flex items-center bg-gray-900 rounded-[2.5rem] pr-4">
              <div className="pl-6 text-gray-400">
                <Terminal size={18} />
              </div>

              <input
                type="text"
                className="flex-1 px-4 py-7 bg-transparent text-white border-none focus:ring-0 outline-none font-medium text-lg placeholder:text-gray-600"
                placeholder="Message or upload notes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />

              <div className="flex items-center space-x-2 mr-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,text/*,application/pdf"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                  title="Upload Image or Document"
                >
                  <Paperclip size={20} />
                </button>

                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !selectedFile) || isLoading}
                  className="w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all group/btn"
                >
                  <Send size={24} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto flex items-center justify-between mt-6 px-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <History size={14} /> <span>Strict Memory</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <CheckCircle2 size={14} className="text-emerald-500" /> <span>Verified Sourcing</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Gemini 2.5 Flash • {context.subject || 'Universal Hub'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
