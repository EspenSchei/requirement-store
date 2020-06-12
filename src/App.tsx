import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');

  return (
    <div id='wrapper'>
      <div className='webflow-style-input'>
        <input
          type='text'
          value={question}
          placeholder='What are you looking for?'
          onChange={(event) => setQuestion(event.target.value)}
        />
      </div>
    </div>
  );
}

export default App;
