
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Source, CaseDetails, GeminiFilePart } from '../types';
import { SendIcon, BotIcon, UserIcon, SearchIcon, LoadingIcon, PaperclipIcon, FileIcon, TrashIcon } from './icons';
import { GenerateContentResponse } from '@google/genai';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatInterfaceProps {
  sendMessage: (prompt: string, caseDetails: CaseDetails, files: GeminiFilePart[]) => Promise<GenerateContentResponse>;
  initialMessage: { text: string; sources?: Source[] };
  placeholder: string;
  chatTitle: string;
  caseDetails: CaseDetails;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ sendMessage, initialMessage, placeholder, chatTitle, caseDetails }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', role: 'model', ...initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && files.length === 0) || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const fileParts: GeminiFilePart[] = await Promise.all(
          files.map(async file => {
              const data = await fileToBase64(file);
              return {
                  inlineData: {
                      data,
                      mimeType: file.type,
                  },
              };
          })
      );
      
      setFiles([]); // Clear files after preparing them

      const response = await sendMessage(input, caseDetails, fileParts);
      const modelText = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      const sources: Source[] = groundingChunks
        ? groundingChunks.map((chunk: any) => ({
            uri: chunk.web?.uri || '',
            title: chunk.web?.title || 'Untitled',
        })).filter((source:Source) => source.uri)
        : [];
        
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: modelText,
        sources: sources.length > 0 ? sources : undefined
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold">{chatTitle}</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-cyan-400" /></div>}
              <div className={`flex flex-col max-w-xl ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700/80 rounded-bl-none'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm text-white whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="text-sm text-white whitespace-pre-wrap">
                      <MarkdownRenderer content={msg.text} sources={msg.sources} />
                    </div>
                  )}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs text-slate-400 w-full">
                     <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                        <SearchIcon className="w-3 h-3" />
                        <span>Sources</span>
                     </div>
                    <ul className="space-y-1">
                      {msg.sources.map((source, idx) => (
                        <li key={idx} className="truncate">
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                            {idx + 1}. {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5 text-slate-300" /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-cyan-400" /></div>
              <div className="px-4 py-3 rounded-2xl bg-slate-700/80 rounded-bl-none">
                <LoadingIcon className="w-5 h-5 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-700">
        {files.length > 0 && (
          <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {files.map((file, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileIcon className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{file.name}</span>
                </div>
                <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-white transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-center gap-3">
           <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="text-slate-400 hover:text-cyan-400 p-2 rounded-full transition-colors disabled:opacity-50">
            <PaperclipIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-grow bg-slate-700/50 border border-slate-600 rounded-full py-2 px-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-50 transition-all"
          />
          <button type="submit" disabled={isLoading || (!input.trim() && files.length === 0)} className="bg-cyan-500 text-white rounded-full p-2.5 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
