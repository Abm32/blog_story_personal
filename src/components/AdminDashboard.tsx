import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SpaceBackground } from './SpaceBackground';
import { useNavigate } from 'react-router-dom';

interface PageView {
  id: string;
  user_id: string | null;
  chapter_index: number;
  sub_chapter_index: number;
  is_logged_in: boolean;
  time_spent: number;
  created_at: string;
  updated_at: string;
}

interface AnalyticsSummary {
  totalViews: number;
  uniqueReaders: number;
  averageTimeSpent: number;
  loggedInUsers: number;
  anonymousUsers: number;
}

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalViews: 0,
    uniqueReaders: 0,
    averageTimeSpent: 0,
    loggedInUsers: 0,
    anonymousUsers: 0,
  });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'adminabhi@gmail.com' && password === 'iamimproving123') {
      setIsAuthenticated(true);
      fetchAnalytics();
    } else {
      setError('Invalid credentials');
    }
  };

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from('page_views')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analytics:', error);
      return;
    }

    setPageViews(data || []);

    // Calculate summary
    const uniqueUserIds = new Set(data?.map(view => view.user_id).filter(Boolean));
    const totalTimeSpent = data?.reduce((acc, view) => acc + (view.time_spent || 0), 0) || 0;
    const loggedInCount = data?.filter(view => view.is_logged_in).length || 0;

    setSummary({
      totalViews: data?.length || 0,
      uniqueReaders: uniqueUserIds.size,
      averageTimeSpent: Math.round(totalTimeSpent / (data?.length || 1)),
      loggedInUsers: loggedInCount,
      anonymousUsers: (data?.length || 0) - loggedInCount,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] text-gray-200 relative flex items-center justify-center">
        <SpaceBackground />
        <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md relative z-10">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-gray-200 relative">
      <SpaceBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Total Views</h3>
            <p className="text-2xl font-bold">{summary.totalViews}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Unique Readers</h3>
            <p className="text-2xl font-bold">{summary.uniqueReaders}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Avg. Time Spent (s)</h3>
            <p className="text-2xl font-bold">{summary.averageTimeSpent}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Logged In Users</h3>
            <p className="text-2xl font-bold">{summary.loggedInUsers}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Anonymous Users</h3>
            <p className="text-2xl font-bold">{summary.anonymousUsers}</p>
          </div>
        </div>

        {/* Page Views Table */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Chapter</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Sub-Chapter</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">User Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Time Spent (s)</th>
              </tr>
            </thead>
            <tbody>
              {pageViews.map((view) => (
                <tr key={view.id} className="border-b border-gray-800">
                  <td className="px-6 py-4 text-sm">
                    {new Date(view.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{view.chapter_index}</td>
                  <td className="px-6 py-4 text-sm">{view.sub_chapter_index}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      view.is_logged_in
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {view.is_logged_in ? 'Logged In' : 'Anonymous'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{view.time_spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 