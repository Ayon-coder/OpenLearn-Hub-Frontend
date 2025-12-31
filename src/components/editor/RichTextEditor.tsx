import React, { useRef, useEffect, useState } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Code,
    Quote
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Start typing your notes...'
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const ToolbarButton: React.FC<{
        icon: React.ReactNode;
        command: string;
        value?: string;
        title: string;
    }> = ({ icon, command, value, title }) => (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                execCommand(command, value);
            }}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-700 hover:text-blue-600"
            title={title}
        >
            {icon}
        </button>
    );

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-3 flex flex-wrap gap-2">
                {/* Text Formatting */}
                <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
                    <ToolbarButton icon={<Bold size={18} />} command="bold" title="Bold (Ctrl+B)" />
                    <ToolbarButton icon={<Italic size={18} />} command="italic" title="Italic (Ctrl+I)" />
                    <ToolbarButton icon={<Underline size={18} />} command="underline" title="Underline (Ctrl+U)" />
                </div>

                {/* Headings */}
                <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
                    <ToolbarButton icon={<Heading1 size={18} />} command="formatBlock" value="h1" title="Heading 1" />
                    <ToolbarButton icon={<Heading2 size={18} />} command="formatBlock" value="h2" title="Heading 2" />
                </div>

                {/* Lists */}
                <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
                    <ToolbarButton icon={<List size={18} />} command="insertUnorderedList" title="Bullet List" />
                    <ToolbarButton icon={<ListOrdered size={18} />} command="insertOrderedList" title="Numbered List" />
                </div>

                {/* Alignment */}
                <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
                    <ToolbarButton icon={<AlignLeft size={18} />} command="justifyLeft" title="Align Left" />
                    <ToolbarButton icon={<AlignCenter size={18} />} command="justifyCenter" title="Align Center" />
                    <ToolbarButton icon={<AlignRight size={18} />} command="justifyRight" title="Align Right" />
                </div>

                {/* Special */}
                <div className="flex items-center space-x-1">
                    <ToolbarButton icon={<Code size={18} />} command="formatBlock" value="pre" title="Code Block" />
                    <ToolbarButton icon={<Quote size={18} />} command="formatBlock" value="blockquote" title="Quote" />
                </div>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
          min-h-[400px] px-6 py-5 rounded-3xl bg-gray-900 text-white 
          border-none outline-none font-medium text-sm leading-relaxed
          transition-all
          ${isFocused ? 'ring-4 ring-blue-200' : ''}
        `}
                style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
                data-placeholder={placeholder}
            />

            <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          font-style: italic;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] li {
          margin: 0.5em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          opacity: 0.9;
        }
        
        [contenteditable] pre {
          background: rgba(255, 255, 255, 0.1);
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          font-family: monospace;
        }
        
        [contenteditable] strong {
          font-weight: bold;
        }
        
        [contenteditable] em {
          font-style: italic;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
};
