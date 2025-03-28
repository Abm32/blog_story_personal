import React from 'react';
import { StoryReader } from '../components/StoryReader';
import { story } from '../data/story';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <StoryReader story={story} />
    </div>
  );
}; 