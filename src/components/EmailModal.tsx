import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CompanyInputs, CalculationResults } from '../types/calculator';
import { generatePDFReport } from '../utils/pdfGenerator';
import { submitResults } from '../utils/api';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CompanyInputs;
  results: CalculationResults;
}

export default function EmailModal({ isOpen, onClose, inputs, results }: EmailModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate PDF first
      const pdfBlob = await generatePDFReport(inputs, results, formData);
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Submit to Airtable
      const submitResponse = await submitResults(inputs, results, formData);

      if (!submitResponse.success) {
        // Always show the PDF in demo mode or error cases
        window.open(pdfUrl);

        if (submitResponse.error?.includes('Demo mode')) {
          alert('Your report has been generated and opened in a new tab! Email delivery is not available in demo mode.');
        } else {
          alert('Your report has been generated and opened in a new tab! However, there was an error sending it via email.');
        }
        onClose();
        return;
      }

      // Success case - both PDF and email sent
      window.open(pdfUrl);
      alert('Report has been sent to your email!');
      onClose();
    } catch (error) {
      console.error('Error processing submission:', error);
      alert('There was an error generating your report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1E293B] rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-white">
          Get Your ROI Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-indigo-200 mb-2">
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm text-indigo-200 mb-2">
              Organization
            </label>
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
              className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="Company Name"
            />
          </div>

          <div>
            <label className="block text-sm text-indigo-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="you@company.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Report'}
          </button>
        </form>
      </div>
    </div>
  );
}