import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTask, updateTask } from '../api/tasks';
import { aiPrecheck } from '../api/analysis';
import ScoreSlider from '../components/ScoreSlider';
import SkeletonLoader from '../components/SkeletonLoader';

const ReviewScoring: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [score, setScore] = useState(0);
  const [strengths, setStrengths] = useState('');
  const [issues, setIssues] = useState('');
  const [requiredChanges, setRequiredChanges] = useState('');
  const [useAIScore, setUseAIScore] = useState(false);
  const [resolvedSuggestions, setResolvedSuggestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) { setLoading(false); return; }
      try {
        const taskData = await getTask(taskId);
        if (!taskData.draftContent || !taskData.draftContent.trim()) {
          const html = taskData?.description || '';
          const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          taskData.draftContent = textOnly
            ? `Auto-generated draft from task description.\n\n${textOnly}`
            : 'Auto-generated empty draft placeholder';
        }
        setTask(taskData);
        setScore(taskData.score || 0);
      } catch (e) {
        console.error('Failed to load task', e);
        navigate('/dash/reviewer');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId, navigate]);

  const [precheck, setPrecheck] = useState<any | null>(null);
  useEffect(() => {
    const runPrecheck = async () => {
      if (!taskId || !task) return;
      const content = task.draftContent || '';
      if (!content.trim()) return;
      try {
        setAiLoading(true);
  const res = await aiPrecheck(taskId, content, task?.requirements);
        setPrecheck(res);
      } catch (e) {
        console.error('AI precheck failed', e);
      } finally {
        setAiLoading(false);
      }
    };
    runPrecheck();
  }, [taskId, task]);
  const aiScore = precheck ? Math.round(precheck.preScore * 100) : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        score: useAIScore ? aiScore : score,
        reviewFeedback: {
          strengths,
          issues,
          requiredChanges,
          reviewerId: user?.id,
          reviewedAt: new Date().toISOString()
        }
      };
      
      await updateTask(taskId!, updates);
      navigate('/dash/reviewer');
    } catch (error) {
      console.error('Failed to save review:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSuggestionResolved = (index: number) => {
    const newResolved = new Set(resolvedSuggestions);
    if (newResolved.has(index)) {
      newResolved.delete(index);
    } else {
      newResolved.add(index);
    }
    setResolvedSuggestions(newResolved);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Task not found</h2>
          <Link to="/dash/reviewer" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const finalScore = useAIScore ? aiScore : score;
  const canApprove = finalScore === 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/dash/reviewer" className="hover:text-gray-700">Dashboard</Link></li>
          <li className="before:content-['/'] before:mx-2">Review</li>
          <li className="before:content-['/'] before:mx-2 text-gray-900 font-medium truncate">
            {task.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Document Preview & AI Notes */}
        <div className="space-y-6">
          {/* Task Preview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Preview</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h3>
              <div className="prose max-w-none text-sm text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
              <div className="grid grid-cols-1 gap-2">
                {task.requirements.map((requirement: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {requirement}
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                {task.attachments.map((attachment: any) => (
                  <div key={attachment.id} className="flex items-center p-2 bg-gray-50 rounded text-sm">
                    <FileText className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{attachment.name}</span>
                    <span className="ml-auto text-gray-500">
                      {(attachment.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Notes */}
          {aiLoading && !precheck && (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 animate-pulse">
              <div className="h-4 w-40 bg-purple-100 rounded mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-purple-100 rounded w-full" />
                <div className="h-3 bg-purple-100 rounded w-5/6" />
                <div className="h-3 bg-purple-100 rounded w-3/4" />
              </div>
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-purple-100 rounded" />
                <div className="h-6 w-20 bg-purple-100 rounded" />
              </div>
            </div>
          )}
          {precheck && (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-purple-900">🤖 AI Analysis Notes</h2>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  Reference Only
                </span>
              </div>
              
              {/* AI Baseline Score */}
              <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">🤖 AI Baseline Score</h3>
                <div className="text-2xl font-bold text-purple-900">{aiScore}%</div>
                <p className="text-sm text-purple-700 mt-1">
                  ⚠️ Based on AI analysis - Use as reference only
                </p>
              </div>

              {/* AI Suggestions */}
              {precheck?.suggestions?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-purple-900 mb-3">🤖 AI Suggestions (Reference)</h4>
                  <div className="space-y-2">
                    {precheck?.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-purple-900">{suggestion}</p>
                        </div>
                        <button
                          onClick={() => toggleSuggestionResolved(index)}
                          className={`ml-2 p-1 rounded transition-colors ${
                            resolvedSuggestions.has(index)
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          aria-label={`Mark suggestion ${index + 1} as ${
                            resolvedSuggestions.has(index) ? 'unresolved' : 'resolved'
                          }`}
                        >
                          {resolvedSuggestions.has(index) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-purple-600 mt-2">
                    💡 These are AI suggestions for reference. Your professional judgment takes precedence.
                  </p>
                </div>
              )}

              {/* Missing Sections */}
              {precheck?.missingSections?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-purple-900 mb-2">🤖 AI Detected Missing Sections</h4>
                  <div className="flex flex-wrap gap-2">
                    {precheck?.missingSections.map((section: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Scoring Panel */}
        <div className="space-y-6">
          {/* Scoring */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Scoring</h2>
            
            {/* AI Score Option */}
            {aiScore > 0 && (
              <div className="mb-6 p-4 border border-purple-200 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={useAIScore}
                    onChange={(e) => setUseAIScore(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Use AI suggested score ({aiScore}%)
                  </span>
                </label>
                <p className="text-xs text-gray-600 mt-1 ml-7">
                  You can override this with your own score below
                </p>
              </div>
            )}

            {/* Manual Score */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Score (0-100) {useAIScore && '(overrides AI score)'}
              </label>
              <ScoreSlider
                value={score}
                onChange={setScore}
                disabled={useAIScore}
              />
            </div>

            {/* Current Score Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Final Score:</span>
                <span className="text-2xl font-bold text-gray-900">{finalScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    finalScore === 100 ? 'bg-green-500' :
                    finalScore >= 80 ? 'bg-blue-500' :
                    finalScore >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${finalScore}%` }}
                ></div>
              </div>
            </div>

            {/* Approval Checkbox */}
            {canApprove && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-green-900">
                    Approve this task for completion
                  </span>
                </label>
                <p className="text-xs text-green-700 mt-1 ml-7">
                  Task will be marked as approved and completed
                </p>
              </div>
            )}
          </div>

          {/* Structured Feedback */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Feedback</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-2">
                  Strengths
                </label>
                <textarea
                  id="strengths"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="What did the submitter do well?"
                />
              </div>

              <div>
                <label htmlFor="issues" className="block text-sm font-medium text-gray-700 mb-2">
                  Issues Identified
                </label>
                <textarea
                  id="issues"
                  value={issues}
                  onChange={(e) => setIssues(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="What issues or concerns did you identify?"
                />
              </div>

              <div>
                <label htmlFor="requiredChanges" className="block text-sm font-medium text-gray-700 mb-2">
                  Required Changes
                </label>
                <textarea
                  id="requiredChanges"
                  value={requiredChanges}
                  onChange={(e) => setRequiredChanges(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="What specific changes are needed before approval?"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Submit Review'}
            </button>
            
            <button
              onClick={() => navigate('/dash/reviewer')}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewScoring;