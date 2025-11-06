import React, { useState, useRef, useEffect } from 'react';

function AIChatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiMessage = { role: 'model', text: data.reply || 'No response' };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'model', text: 'Error connecting to chatbot.' },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-page-container">
      <main className="chat-main">
        <header className="chat-header"><h2>MindShift AI</h2></header>
        <div className="message-list">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'peer-message'}`}>
              <span className="username">{msg.role === 'user' ? 'You' : 'MindShift AI'}</span>
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="message peer-message">
              <span className="username">MindShift AI</span>
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>
        <form onSubmit={handleSend} className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>Send</button>
        </form>
      </main>
    </div>
  );
}

export default AIChatbot;