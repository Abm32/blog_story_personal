import React from 'react';
import { StoryReader } from './components/StoryReader';
import { story } from './data/story';

function App() {
  return <StoryReader story={story} />;
}

export default App;