import React, { useState } from "react";
import AIChatbot from "./components/AICHATBOT";
import AIDetect from "./components/AIDetect";

function App() {
  const [activeComponent, setActiveComponent] = useState("chatbot");

  return (
    <div className="App">
      {activeComponent === "chatbot" ? <AIChatbot /> : <AIDetect />}
      
      <nav className="navigation">
        <button onClick={() => setActiveComponent("chatbot")}>
          AI Chatbot
        </button>
        <button onClick={() => setActiveComponent("detect")}>
          AI Detect
        </button>
      </nav>

      <style jsx>{`
        .navigation {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        button {
          padding: 10px 20px;
          margin: 5px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 5px;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default App;
