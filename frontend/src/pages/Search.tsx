import React, { useState } from 'react';
import { Search as SearchIcon, FileText } from 'lucide-react';
import { tasks } from '../mock/tasks';
import { keywordSearch } from '../api/analysis';
// removed embeddingsIndexMock (not used after API integration)
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Search: React.FC = () => {
  const [keywordQuery, setKeywordQuery] = useState('');
  const [keywordResults, setKeywordResults] = useState<any[]>([]);

  interface KeywordResult { taskId: string; title: string; description: string; matchType: string; task?: any }
  const performKeywordSearch = async (query: string) => {
    if (!query.trim()) {
      setKeywordResults([]);
      return;
    }
    try {
      const results: KeywordResult[] = await keywordSearch(query, tasks);
      const enriched: KeywordResult[] = results.map((r: KeywordResult) => ({
        ...r,
        task: tasks.find((t: any) => t.id === r.taskId)
      }));
      setKeywordResults(enriched);
    } catch (e) {
      console.error('Keyword search failed', e);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-2">
          Find tasks and content using keyword or semantic search
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
        <div className="flex border-b border-gray-200">
          <div className="flex-1 px-6 py-4 text-sm font-medium text-black border-b-2 border-black">
            <SearchIcon className="h-4 w-4 inline mr-2" />
            Keyword Search
          </div>
        </div>

        <div className="p-6">
          <div>

            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={keywordQuery}
                onChange={(e) => {
                  setKeywordQuery(e.target.value);
                  performKeywordSearch(e.target.value);
                }}
                placeholder="Search tasks by keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              {keywordResults.length > 0 ? (
                keywordResults.map((result, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-gray-900">Keyword Match</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Task ID: {result.taskId}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {result.title}
                    </h3>


                    <p className="text-sm text-gray-700 mb-3">
                      <div dangerouslySetInnerHTML={{ __html: result.description }} />
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Created: {format(new Date(result.task.createdAt), 'MMM d, yyyy')}</span>
                        {result.task && (
                          <>
                            <span className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(result.task.priority)}`}></div>
                              {result.task.priority} priority
                            </span>
                            <span>Score: {result.task.score}%</span>
                          </>
                        )}
                      </div>
                      {result.task && (
                        <Link
                          to={`/task/${result.taskId}`}
                          className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
                        >
                          View Task
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : keywordQuery ? (
                <div className="text-center py-12 text-gray-500">
                  <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No keyword matches found for "{keywordQuery}"</p>
                  <p className="text-sm mt-2">Try using different keywords</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter keywords to search through tasks</p>
                  <p className="text-sm mt-2">Example: "newsletter", "budget", "marketing", "brand"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;