
import React, { useState, useRef } from 'react';
import { analyzeEvidence } from '../services/geminiService';
import { LoadingIcon, PaperclipIcon, FileIcon, TrashIcon } from './icons';
import { CaseDetails, GeminiFilePart } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface EvidenceAnalysisTabProps {
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

const EvidenceAnalysisTab: React.FC<EvidenceAnalysisTabProps> = ({ caseDetails }) => {
  const [evidenceText, setEvidenceText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!evidenceText.trim() && files.length === 0) {
      setError('Please enter evidence text or upload files to analyze.');
      return;
    }
    setError('');
    setIsLoading(true);
    setAnalysisResult('');

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
      const response = await analyzeEvidence(evidenceText, caseDetails, fileParts);
      setAnalysisResult(response.text);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
       <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold">Evidence Analysis</h2>
      </div>
      <div className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-y-auto">
        {/* Input */}
        <div className="flex flex-col lg:w-1/2">
            <label htmlFor="evidence-text" className="mb-2 font-semibold text-slate-300">
                Paste Evidence Text
            </label>
            <textarea
                id="evidence-text"
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                placeholder="Paste witness testimony, police reports, or other documents here..."
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y"
                disabled={isLoading}
            ></textarea>
            
            <div className="mt-4">
              <label className="font-semibold text-slate-300">Upload Files</label>
               <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-700/50 border border-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                  <PaperclipIcon className="w-5 h-5" />
                  Attach Files
              </button>
            </div>
             {files.length > 0 && (
                <div className="mt-3 space-y-2">
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


            <button
                onClick={handleAnalyze}
                disabled={isLoading || (!evidenceText.trim() && files.length === 0)}
                className="mt-4 w-full bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                {isLoading ? <LoadingIcon className="w-5 h-5 animate-spin" /> : 'Analyze Evidence'}
            </button>
             {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
        
        {/* Output */}
        <div className="flex flex-col lg:w-1/2">
            <h3 className="mb-2 font-semibold text-slate-300">
                Analysis Result
            </h3>
            <div className="w-full h-full min-h-[200px] flex-grow bg-slate-900 border border-slate-700 rounded-md p-4 overflow-y-auto">
              {isLoading && (
                  <div className="flex items-center justify-center h-full text-slate-400">
                      <LoadingIcon className="w-8 h-8 animate-spin" />
                  </div>
              )}
              {analysisResult && !isLoading && (
                <div className="text-sm text-white whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                    <MarkdownRenderer content={analysisResult} />
                </div>
              )}
               {!analysisResult && !isLoading && (
                 <div className="flex items-center justify-center h-full text-slate-500">
                    Your analysis will appear here.
                 </div>
               )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceAnalysisTab;
