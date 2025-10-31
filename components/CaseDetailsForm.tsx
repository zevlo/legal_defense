
import React from 'react';
import type { CaseDetails } from '../types';

interface CaseDetailsFormProps {
  caseDetails: CaseDetails;
  setCaseDetails: React.Dispatch<React.SetStateAction<CaseDetails>>;
}

const CaseDetailsForm: React.FC<CaseDetailsFormProps> = ({ caseDetails, setCaseDetails }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCaseDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formFields: { key: keyof CaseDetails; label: string; placeholder: string }[] = [
    { key: 'jurisdiction', label: 'Jurisdiction', placeholder: 'e.g., State of California, County of Los Angeles' },
    { key: 'charges', label: 'Charges', placeholder: 'e.g., Penal Code § 459 - Burglary' },
    { key: 'sentenceGuidelines', label: 'Sentence Guidelines', placeholder: 'e.g., 2, 4, or 6 years in state prison' },
    { key: 'pleaOffer', label: 'Plea Offer', placeholder: 'e.g., Plead to a lesser charge of PC 484 (petty theft), 3 years probation' },
    { key: 'immigrationStatus', label: 'Immigration Status', placeholder: 'e.g., Lawful Permanent Resident, Visa holder, etc.' },
    { key: 'criminalRecord', label: 'Criminal Record', placeholder: 'e.g., Prior misdemeanor conviction for DUI in 2019' },
  ];

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 sticky top-24">
      <h2 className="text-lg font-semibold mb-4 text-white">Case Details</h2>
      <div className="space-y-4">
        {formFields.map(field => (
          <div key={field.key}>
            <label htmlFor={field.key} className="block text-sm font-medium text-slate-300 mb-1">
              {field.label}
            </label>
            <textarea
              id={field.key}
              name={field.key}
              value={caseDetails[field.key]}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={3}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseDetailsForm;
