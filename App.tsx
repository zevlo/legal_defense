
import React, { useState } from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import Tabs from './components/Tabs';
import CaseOverviewTab from './components/CaseOverviewTab';
import MotionDrafterTab from './components/MotionDrafterTab';
import EvidenceAnalysisTab from './components/EvidenceAnalysisTab';
import CollateralConsequencesTab from './components/CollateralConsequencesTab';
import CaseDetailsForm from './components/CaseDetailsForm';
import type { CaseDetails } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Case Overview');
  const [caseDetails, setCaseDetails] = useState<CaseDetails>({
    jurisdiction: '',
    charges: '',
    sentenceGuidelines: '',
    pleaOffer: '',
    immigrationStatus: '',
    criminalRecord: '',
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Case Overview':
        return <CaseOverviewTab caseDetails={caseDetails} />;
      case 'Motion Drafter':
        return <MotionDrafterTab caseDetails={caseDetails} />;
      case 'Evidence Analysis':
        return <EvidenceAnalysisTab caseDetails={caseDetails} />;
      case 'Collateral Consequences':
        return <CollateralConsequencesTab caseDetails={caseDetails} />;
      default:
        return <CaseOverviewTab caseDetails={caseDetails} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Disclaimer />
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
          <aside className="lg:col-span-1 mb-6 lg:mb-0">
            <CaseDetailsForm caseDetails={caseDetails} setCaseDetails={setCaseDetails} />
          </aside>
          <div className="lg:col-span-2 flex flex-col">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6 flex-grow flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 shadow-2xl overflow-hidden min-h-[70vh]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
