import React, { useState, useEffect, useRef } from 'react';
import { httpsCallable } from 'firebase/functions';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { functions, db } from '../firebase';
import { useAuth } from '../AuthContext';

// Get a reference to the cloud function
const chatWithAI = httpsCallable(functions, 'chatWithAI');

function AIChatbot() {
  const { currentUser } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Firestore collection reference for this user's chat
  const chatHistoryRef = collection(db, "users", currentUser.uid, "aiChatHistory");

  // Load chat history from Firestore
  useEffect(() => {
    const q = query(chatHistoryRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Convert Firestore Timestamp to JS Date
        timestamp: doc.data().timestamp?.toDate()
      }));
      setChatHistory(messages);
    }, (error) => {
      console.error("Error listening to chat history:", error);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [currentUser]);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !currentUser) return;

    setLoading(true);
    
    const userMessage = { 
      role: 'user', 
      text: input, 
      timestamp: Timestamp.now() // Use Firestore Timestamp
    };
    
    // 1. Save user message to Firestore
    await addDoc(chatHistoryRef, userMessage);
    
    // Create a temporary history for the API call
    const currentHistory = [...chatHistory, userMessage].map(msg => ({
      role: msg.role,
      text: msg.text
    }));
    setInput(''); // Clear input immediately
    
    try {
      // 2. Call the Cloud Function
      const result = await chatWithAI({ history: currentHistory });
      
      const aiResponseText = result.data.responseText;
      
      // 3. Save model's response to Firestore
      const geminiMessage = { 
        role: 'model', 
        text: aiResponseText, 
        timestamp: Timestamp.now()
      };
      await addDoc(chatHistoryRef, geminiMessage);

    } catch (error) {
      console.error("Error calling AI function:", error);
      // Save an error message to chat
      await addDoc(chatHistoryRef, {
        role: 'model',
        text: `Sorry, I'm having trouble connecting. Error: ${error.message}`,
        timestamp: Timestamp.now()
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="chat-page-container">
      <main className="chat-main">
        <header className="chat-header"><h2>AI Chatbot</h2></header>
        <div className="message-list">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`message ${msg.role === 'user' ? 'user-message' : 'peer-message'}`}>
              <span className="username">{msg.role === 'user' ? 'You' : 'MindShift AI'}</span>
              {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
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