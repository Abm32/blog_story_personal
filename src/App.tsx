import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoryReader } from './components/StoryReader';
import { AdminDashboard } from './components/AdminDashboard';
import { story } from './data/story';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<StoryReader story={story} />} />
          <Route path="/admin/dashboard3" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;