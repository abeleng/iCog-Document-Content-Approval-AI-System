import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createTask } from '../api/tasks';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    requirements: [] as string[]
  });
  
  const [newRequirement, setNewRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonRequirements = [
    'Executive summary',
    'Budget justification',
    'Legal compliance review',
    'Performance metrics',
    'Stakeholder approval',
    'Risk assessment',
    'Timeline and milestones'
  ];

  const dosAndDonts = {
    dos: [
      'Include specific, measurable requirements',
      'Set realistic deadlines with buffer time',
      'Define clear success criteria',
      'Specify required document formats',
      'Include all necessary stakeholder reviews'
    ],
    donts: [
      'Use vague or ambiguous language',
      'Set unrealistic tight deadlines',
      'Add requirements after task creation',
      'Forget to specify compliance needs',
      'Skip stakeholder consultation'
    ]
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }
    
    if (formData.requirements.length === 0) {
      newErrors.requirements = 'At least one requirement must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const taskData = {
        ...formData,
        createdBy: user?.id,
        department: user?.department || 'Marketing',
        dosAndDonts
      };
      
      const newTask = await createTask(taskData);
      navigate(`/task/${newTask.id}`);
    } catch (error) {
      console.error('Failed to create task:', error);
      setErrors({ submit: 'Failed to create task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
  };

  const addCommonRequirement = (requirement: string) => {
    if (!formData.requirements.includes(requirement)) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement]
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><a href="/dash/department" className="hover:text-gray-700">Dashboard</a></li>
          <li className="before:content-['/'] before:mx-2">Create Task</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
              <p className="text-gray-600 mt-2">
                Set up a new document approval workflow
              </p>
            </div>

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., February 2025 Marketing Newsletter"
                  aria-invalid={errors.title ? 'true' : 'false'}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <ReactQuill
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                  placeholder="Describe the task, its purpose, and any specific requirements..."
                  className={errors.description ? 'border-red-500 rounded-lg' : ''}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>
                )}
              </div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.dueDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-invalid={errors.dueDate ? 'true' : 'false'}
                    />
                    <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.dueDate}</p>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements Checklist *
                </label>
                
                {/* Common Requirements */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Common requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonRequirements.map((req) => (
                      <button
                        key={req}
                        type="button"
                        onClick={() => addCommonRequirement(req)}
                        disabled={formData.requirements.includes(req)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          formData.requirements.includes(req)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {formData.requirements.includes(req) ? '✓ ' : '+ '}{req}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Requirement Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add custom requirement..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Selected Requirements */}
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in"
                    >
                      <span className="text-sm text-gray-900">{requirement}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(requirement)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Remove requirement: ${requirement}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.requirements}</p>
                )}
              </div>

              {/* File Upload Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">File Upload Requirements</h4>
                    <p className="text-blue-800 text-sm">
                      Only PDF, DOCX, and DOC files are accepted for document submissions. 
                      Code files, videos, and images are not permitted as attachments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dash/department')}
                  className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Do's and Don'ts Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Do's & Don'ts</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Do's
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {dosAndDonts.dos.map((item, index) => (
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
                  {dosAndDonts.donts.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;