
import React from 'react';
import ChatInterface from './ChatInterface';
import { generateWithSearch } from '../services/geminiService';
import { CaseDetails } from '../types';

interface CaseOverviewTabProps {
  caseDetails: CaseDetails;
}

const CaseOverviewTab: React.FC<CaseOverviewTabProps> = ({ caseDetails }) => {
  return (
    <ChatInterface
      sendMessage={generateWithSearch}
      chatTitle="Case Overview"
      placeholder="Ask about case facts, precedents, or legal statutes..."
      initialMessage={{
        text: "Hello! I can help you understand the details of a legal case. Provide me with a case name, citation, or a summary of the facts, and I'll provide an overview using up-to-date information from Google Search."
      }}
      caseDetails={caseDetails}
    />
  );
};

export default CaseOverviewTab;
