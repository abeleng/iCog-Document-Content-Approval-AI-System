import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Lightbulb, Copy } from 'lucide-react';

interface AIResultsCardProps {
  precheck: {
    taskId: string;
    missingSections: string[];
    flaggedPhrases: string[];
    suggestions: string[];
    preScore: number;
    checkedAt?: string;
    passedChecks: string[];
    failedChecks: string[];
  };
  onApplySuggestion: (suggestion: string) => void;
  onResubmit?: () => void;
}

const AIResultsCard: React.FC<AIResultsCardProps> = ({ precheck, onApplySuggestion, onResubmit }) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());

  const handleApplySuggestion = (suggestion: string, index: number) => {
    onApplySuggestion(suggestion);
    setAppliedSuggestions(prev => new Set(prev).add(index));
  };

  const baselineScore = Math.round(precheck.preScore * 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-purple-900">🤖 AI Pre-check Results</h3>
        </div>
        <div className="text-sm text-gray-500">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            AI Analysis
          </span>
        </div>
      </div>

      {/* Baseline Score */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-purple-900">🤖 AI Baseline Score</span>
          <span className="text-2xl font-bold text-purple-900">{baselineScore}%</span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${baselineScore}%` }}
          ></div>
        </div>
        <p className="text-sm text-purple-700 mt-2">
          ⚠️ AI suggestion only — Human reviewer will finalize the actual score
        </p>
      </div>

      {/* Passed Checks */}
      {precheck.passedChecks.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-green-700 mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Passed Checks
          </h4>
          <div className="space-y-1">
            {precheck.passedChecks.map((check, index) => (
              <div key={index} className="flex items-center text-sm text-green-700 bg-green-50 p-2 rounded">
                <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                {check}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed Checks */}
      {precheck.failedChecks.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-red-700 mb-2 flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            Failed Checks
          </h4>
          <div className="space-y-1">
            {precheck.failedChecks.map((check, index) => (
              <div key={index} className="flex items-center text-sm text-red-700 bg-red-50 p-2 rounded">
                <XCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                {check}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Sections */}
      {precheck.missingSections.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-orange-700 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Missing Sections
          </h4>
          <div className="flex flex-wrap gap-2">
            {precheck.missingSections.map((section, index) => (
              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {section}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flagged Phrases */}
      {precheck.flaggedPhrases.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-orange-700 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Flagged Phrases
          </h4>
          <div className="flex flex-wrap gap-2">
            {precheck.flaggedPhrases.map((phrase, index) => (
              <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {precheck.suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-blue-700 mb-3 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            AI Suggestions
          </h4>
          <div className="space-y-3">
            {precheck.suggestions.map((suggestion, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-900 mb-2">{suggestion}</p>
                <button
                  onClick={() => handleApplySuggestion(suggestion, index)}
                  disabled={appliedSuggestions.has(index)}
                  className={`flex items-center px-3 py-1 text-xs rounded transition-colors ${
                    appliedSuggestions.has(index)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {appliedSuggestions.has(index) ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Apply Suggestion
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button 
          onClick={() => alert('Demo: This would request a reviewer for this task')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Request Reviewer
        </button>
        <button 
          onClick={() => alert('Demo: Draft saved successfully')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Save Draft
        </button>
        <button 
          onClick={() => onResubmit && onResubmit()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Resubmit
        </button>
      </div>
    </div>
  );
};

export default AIResultsCard;