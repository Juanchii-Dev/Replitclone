"use client"

import { useState } from "react"

type FileTab = {
  id: string
  name: string
  content: string
  language: string
  saved: boolean
}

export function CodeEditor() {
  const [activeTab, setActiveTab] = useState<string>("1")
  const [tabs, setTabs] = useState<FileTab[]>([
    { 
      id: "1", 
      name: "index.js", 
      content: `// Main entry point
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`, 
      language: "javascript",
      saved: true
    },
    { 
      id: "2", 
      name: "App.js", 
      content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Counter App</h1>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </header>
    </div>
  );
}

export default App;
`,
      language: "javascript",
      saved: true
    },
    { 
      id: "3", 
      name: "styles.css", 
      content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white
