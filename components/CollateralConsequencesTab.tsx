
import React from 'react';
import ChatInterface from './ChatInterface';
import { generateWithSearch } from '../services/geminiService';
import { CaseDetails } from '../types';

interface CollateralConsequencesTabProps {
  caseDetails: CaseDetails;
}

const CollateralConsequencesTab: React.FC<CollateralConsequencesTabProps> = ({ caseDetails }) => {
  return (
    <ChatInterface
      sendMessage={generateWithSearch}
      chatTitle="Collateral Consequences"
      placeholder="Ask about consequences of a conviction..."
      initialMessage={{
        text: "I can provide information on the potential collateral consequences of a criminal conviction. Please specify the jurisdiction (e.g., California, Federal) and the type of conviction, and I will find relevant information using Google Search."
      }}
      caseDetails={caseDetails}
    />
  );
};

export default CollateralConsequencesTab;
