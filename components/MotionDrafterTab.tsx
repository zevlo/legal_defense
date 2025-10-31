
import React from 'react';
import ChatInterface from './ChatInterface';
import { generateWithThinking } from '../services/geminiService';
import { CaseDetails } from '../types';

interface MotionDrafterTabProps {
  caseDetails: CaseDetails;
}

const MotionDrafterTab: React.FC<MotionDrafterTabProps> = ({ caseDetails }) => {
  return (
    <ChatInterface
      sendMessage={generateWithThinking}
      chatTitle="Motion Drafter (Thinking Mode)"
      placeholder="Describe the motion you need to draft..."
      initialMessage={{
        text: "Welcome to the Motion Drafter. I am configured in 'Thinking Mode' to handle complex legal reasoning and drafting tasks. Please describe the motion you want to draft, including the key arguments, relevant facts, and desired legal standard. The more detail you provide, the better I can assist you."
      }}
      caseDetails={caseDetails}
    />
  );
};

export default MotionDrafterTab;
