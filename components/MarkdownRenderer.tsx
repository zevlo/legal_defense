import React from 'react';
import type { Source } from '../types';

interface MarkdownRendererProps {
  content: string;
  sources?: Source[];
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, sources }) => {
  // Regex to match markdown links [text](url) or source citations [1]
  const pattern = /(\[.*?\]\(.*?\)|\[\d+\])/g;
  
  const parts = content.split(pattern);
  
  const renderedParts = parts.map((part, index) => {
    if (!part) return null;

    // Check if the part is a source citation like [1]
    const citationMatch = part.match(/^\[(\d+)\]$/);
    if (citationMatch && sources) {
      const sourceIndex = parseInt(citationMatch[1], 10) - 1;
      if (sourceIndex >= 0 && sourceIndex < sources.length) {
        const source = sources[sourceIndex];
        return (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-semibold"
            title={source.title}
          >
            [{citationMatch[1]}]
          </a>
        );
      }
    }
    
    // Check if the part is a markdown link like [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const text = linkMatch[1];
      const url = linkMatch[2];
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:underline"
        >
          {text}
        </a>
      );
    }
    
    // Otherwise, it's just a text part
    return <span key={index}>{part}</span>;
  });
  
  return <>{renderedParts}</>;
};

export default MarkdownRenderer;