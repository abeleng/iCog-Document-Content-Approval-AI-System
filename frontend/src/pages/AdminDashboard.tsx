import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, AlertTriangle, Search, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTasks, getAuditTrail } from '../api/tasks';
// embeddingsIndexMock no longer needed after API integration
import { keywordSearch } from '../api/analysis';
import SkeletonLoader from '../components/SkeletonLoader';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [auditEntries, setAuditEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const [tasksData, auditData] = await Promise.all([
            getTasks(user.id, user.role),
            Promise.all(['marketing-newsletter-2025-01', 'marketing-campaign-2025-q1', 'marketing-brand-guide-2025']
              .map(taskId => getAuditTrail(taskId)))
          ]);
          
          setTasks(tasksData);
          setAuditEntries(auditData.flat());
        } catch (error) {
          console.error('Failed to load admin data:', error);
        }
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  const getKPIs = () => {
    const totalTasks = tasks.length;
    const avgScore = tasks.reduce((sum, task) => sum + task.score, 0) / totalTasks || 0;
    
    // Mock time calculation
    const avgTimeToApproval = 3.2; // days
    
    // Mock anomalies
    const anomalies = auditEntries.filter(entry => 
      entry.action === 'reviewer_scored' && entry.reviewTime && entry.reviewTime < 10
    );

    return {
      totalTasks,
      avgTimeToApproval,
      avgScore: Math.round(avgScore),
      anomaliesCount: anomalies.length
    };
  };

  const performKeywordSearch = async (query: string) => {
    if (!query.trim()) { setSearchResults([]); return; }
    try {
      const results = await keywordSearch(query, tasks);
      setSearchResults(results);
    } catch (e) {
      console.error('Admin keyword search failed', e);
    }
  };

  const exportAuditTrail = () => {
    // Mock CSV export
    const csvData = auditEntries.map(entry => 
      `${entry.timestamp},${entry.actorName},${entry.action},${entry.details}`
    ).join('\n');
    
    const csvHeader = 'Timestamp,Actor,Action,Details\n';
    const csvContent = csvHeader + csvData;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_trail.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const kpis = getKPIs();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          System overview and audit management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.avgScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Time</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.avgTimeToApproval}d</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Anomalies</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.anomaliesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => alert('Demo: This would show user management interface')}
            className="flex items-center justify-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all hover:scale-105 font-medium"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </button>
          
          <button
            onClick={() => alert('Demo: This would show system configuration settings')}
            className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-medium"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            System Config
          </button>
          
          <button
            onClick={() => alert('Demo: This would show detailed analytics dashboard')}
            className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:scale-105 font-medium"
          >
            <FileText className="h-4 w-4 mr-2" />
            Analytics
          </button>
          
          <button
            onClick={() => alert('Demo: This would show backup and maintenance options')}
            className="flex items-center justify-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all hover:scale-105 font-medium"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Maintenance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Keyword Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyword Search</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                performKeywordSearch(e.target.value);
              }}
              placeholder="Search tasks by keywords..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Clear Search
            </button>
            <button
              onClick={() => alert('Demo: This would show advanced search options')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Advanced Search
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{result.title}</p>
                  <div className="text-xs text-gray-600 mt-1">
                    <div dangerouslySetInnerHTML={{ __html: result.description }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Task ID: {result.taskId}
                  </p>
                </div>
              ))
            ) : searchQuery ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No keyword matches found</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Enter keywords to search through tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Anomaly Detection</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-900">Fast Review Alert</p>
                  <p className="text-sm text-red-800 mt-1">
                    Reviewer "Miriam Reviewer" scored task 100% in 5 minutes
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Flagged for review - unusually fast for document size
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Score Pattern</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Reviewer consistently scores 85-87% across different task types
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    May indicate scoring bias - review recommended
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Integration Note:</strong> Connect this panel to your anomaly detection system 
              to identify unusual patterns in review times, scoring consistency, and submission patterns.
            </p>
          </div>
           
           <div className="mt-4 flex justify-between">
             <button
               onClick={() => alert('Demo: This would show anomaly detection settings')}
               className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
             >
               Configure Alerts
             </button>
             <button
               onClick={() => alert('Demo: This would export anomaly report')}
               className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
             >
               Export Report
             </button>
           </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Audit Trail</h2>
          <button
            onClick={exportAuditTrail}
            className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert('Demo: This would show audit trail filters')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Filter Audit
            </button>
            <button
              onClick={() => alert('Demo: This would show date range picker')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Date Range
            </button>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Actor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Action</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Details</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Task</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditEntries.slice(0, 10).map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {entry.actorName}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.action === 'task_approved' ? 'bg-green-100 text-green-800' :
                      entry.action === 'reviewer_scored' ? 'bg-blue-100 text-blue-800' :
                      entry.action === 'draft_submitted' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {entry.details}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {entry.taskId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;