import './App.css';
import './sass/styles.scss';
import PromptInput from './components/prompt-input';
import React, { useEffect, useState } from 'react';

function App() {

  const [finalInput, setFinalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [openAIResponseText, setOpenAIResponseText] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="prompt-label">Video Subject</h2>
        <PromptInput label={"What do you want to learn about?"} />
        <h2 className="prompt-label">Additional Details</h2>
        <PromptInput label={"Is there anything specific it should cover?"} />
      </header>
    </div>
  );
}

function splitParagraphIntoSentences(paragraph) {
  return paragraph.split(/(?<=[.!?])\s+/);
}

export default App;
