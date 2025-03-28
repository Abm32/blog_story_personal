import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoryReader } from './components/StoryReader';
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
      <StoryReader story={story} />
    </QueryClientProvider>
  );
}

export default App;