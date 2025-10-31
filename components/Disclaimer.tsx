
import React from 'react';
import { AlertTriangleIcon } from './icons';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-6 text-sm" role="alert">
      <div className="flex items-start">
        <AlertTriangleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <strong className="font-bold">Disclaimer: </strong>
          <span className="block sm:inline">
            This is an AI-powered tool and is not a substitute for professional legal advice. Always consult with a qualified attorney. Information may be inaccurate or incomplete.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
