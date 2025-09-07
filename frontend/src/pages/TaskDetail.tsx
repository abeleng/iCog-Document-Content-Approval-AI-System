import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Edit, Upload, FileText, CheckCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getTask, getAuditTrail } from '../api/tasks';
import { aiPrecheck } from '../api/analysis';
import FileUploader from '../components/FileUploader';
import AIResultsCard from '../components/AIResultsCard';
import Timeline from '../components/Timeline';
import SkeletonLoader from '../components/SkeletonLoader';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<any>(null);
  const [auditEntries, setAuditEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  // AI precheck result (must be declared before any conditional return to keep hook order stable)
  const [precheck, setPrecheck] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        try {
          const [taskData, auditData] = await Promise.all([
            getTask(taskId),
            getAuditTrail(taskId)
          ]);
          
          setTask(taskData);
          setAuditEntries(auditData);
          // Seed draft content if empty so AI pre-check always has something meaningful.
          let baseDraft = taskData?.draftContent || '';
          if (!baseDraft || !baseDraft.trim()) {
            const html = taskData?.description || '';
            const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const attachmentRef = (taskData?.attachments && taskData.attachments.length)
              ? `\n\n[Assumed source: ${taskData.attachments[0].name}]`
              : '';
            baseDraft = textOnly
              ? `Auto-generated draft from task description.\n\n${textOnly}${attachmentRef}`
              : `Auto-generated empty draft placeholder${attachmentRef}`;
          }
          setDraftContent(baseDraft);
        } catch (error) {
          console.error('Failed to load task:', error);
          navigate('/dash/department');
        }
      }
      setLoading(false);
    };

    loadTask();
  }, [taskId, navigate]);

  // Trigger initial AI precheck once when dynamic draftContent (state) first becomes available
  const initialPrecheckDone = useRef(false);
  useEffect(() => {
    if (!initialPrecheckDone.current && taskId && draftContent && draftContent.trim()) {
      initialPrecheckDone.current = true;
      setAiLoading(true);
  aiPrecheck(taskId, draftContent, task?.requirements)
        .then((res: any) => {
          setPrecheck(res);
          console.log('Initial AI precheck contentLength', res?.debug?.contentLength, res?.debug?.sections);
        })
        .catch((e: unknown) => console.error('AI precheck failed', e))
        .finally(() => setAiLoading(false));
    }
  }, [taskId, draftContent]);

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
          <Link to="/dash/department" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'revisions_required': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ...existing hooks moved above; removed duplicate precheck hook/effect

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/dash/department" className="hover:text-gray-700">Dashboard</Link></li>
          <li className="before:content-['/'] before:mx-2">Task Detail</li>
          <li className="before:content-['/'] before:mx-2 text-gray-900 font-medium truncate">
            {task.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Task Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {task.priority} Priority
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </div>
                  {task.reviewerId && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Reviewer assigned
                    </div>
                  )}
                </div>
              </div>
              
              {user?.id === task.createdBy && (
                <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </button>
              )}
            </div>

            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: task.description }} />
            </div>
          </div>

          {/* Requirements & Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements Checklist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.requirements.map((requirement: string, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-900">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Attachments</h2>
              {user?.id === task.createdBy && (
                <button
                  onClick={() => setShowUploader(!showUploader)}
                  className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </button>
              )}
            </div>

            {showUploader && (
              <div className="mb-6">
                <FileUploader
                  onFileSelect={async (files) => {
                    if (!files.length) return;
                    setUploadProcessing(true);
                    try {
                      const file = files[0];
                      let text = '';
                      if (file.type === 'text/plain') {
                        text = await file.text();
                      } else if (file.name.toLowerCase().endsWith('.pdf')) {
                        // Placeholder: real PDF parsing would use a library client-side or send to backend
                        text = `[PDF FILE NAME: ${file.name}]`; 
                      } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
                        text = `[DOC FILE NAME: ${file.name}]`;
                      } else {
                        text = await file.text().catch(() => '[UNSUPPORTED FILE TYPE]');
                      }
                      if (text) {
                        const combined = (draftContent ? draftContent + '\n\n' : '') + text;
                        setDraftContent(combined);
                        if (taskId) {
                          const res = await aiPrecheck(taskId, combined, task?.requirements);
                          setPrecheck(res);
                          console.log('Upload AI precheck contentLength', res?.debug?.contentLength, res?.debug?.sections);
                        }
                      }
                    } catch (e) {
                      console.error('File processing failed', e);
                    } finally {
                      setUploadProcessing(false);
                      setShowUploader(false);
                    }
                  }}
                  acceptedTypes={['.pdf', '.docx', '.doc', '.txt']}
                  maxSize={10 * 1024 * 1024} // 10MB
                />
                {uploadProcessing && (
                  <p className="mt-2 text-sm text-gray-500">Processing file & running AI precheck...</p>
                )}
              </div>
            )}

            {task.attachments && task.attachments.length > 0 ? (
              <div className="space-y-3">
                {task.attachments.map((attachment: any) => (
                  <div key={attachment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-500">
                          {(attachment.size / 1024 / 1024).toFixed(1)} MB • 
                          {format(new Date(attachment.uploadedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No attachments uploaded yet</p>
              </div>
            )}
          </div>

          {/* Draft Content Editor */}
          {user?.id === task.createdBy && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Draft Content</h2>
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Paste your draft content here or upload a document above..."
              />
              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Save Draft
                </button>
                <button 
                  onClick={() => alert('Demo: This would request a reviewer for this task')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Reviewer
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Audit Trail</h2>
            <Timeline entries={auditEntries} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Score</span>
                <span className="text-lg font-bold text-gray-900">{task.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    task.score === 100 ? 'bg-green-500' :
                    task.score >= 80 ? 'bg-blue-500' :
                    task.score >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${task.score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* AI Pre-check Loading Skeleton */}
          {aiLoading && !precheck && (
            <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 animate-pulse">
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

          {/* AI Pre-check Results */}
          {precheck && (
            <AIResultsCard
              precheck={precheck}
              onApplySuggestion={(suggestion) => {
                setDraftContent(prev => prev + '\n\n' + suggestion);
              }}
              onResubmit={() => {
                const updated = draftContent + '\n\n(Revised at ' + new Date().toISOString() + ')';
                setDraftContent(updated);
                if (taskId) {
                  setAiLoading(true);
                  aiPrecheck(taskId, updated, task?.requirements)
                    .then((res: any) => {
                      setPrecheck(res);
                      console.log('Resubmit AI precheck contentLength', res?.debug?.contentLength, res?.debug?.sections);
                    })
                    .catch((e: unknown) => console.error('AI precheck failed', e))
                    .finally(() => setAiLoading(false));
                }
              }}
            />
          )}

          {/* Do's & Don'ts */}
          {task.dosAndDonts && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Do's & Don'ts</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Do's
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {task.dosAndDonts.dos.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-red-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Don'ts
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {task.dosAndDonts.donts.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;