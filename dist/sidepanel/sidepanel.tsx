// side panel opens when user clicks on extension icon
chrome.sidePanel
.setPanelBehavior({ openPanelOnActionClick: true })
.catch((error) => console.error(error));

console.log("sidePanel opened");
chrome.runtime.sendMessage({type: "sp_Opened"});

window.addEventListener('beforeunload', () => {
    chrome.runtime.sendMessage({type: 'sp_Closed'});
});


import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './sidepanel.css';

function SidePanel() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Smart Notes 📝
        </h1>
        
        <p className="text-gray-600 mb-6">
          Testing React + Tailwind!
        </p>

        {/* React state test */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-lg mb-2">Counter: <span className="font-bold text-blue-600">{count}</span></p>
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Click me!
          </button>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
}
