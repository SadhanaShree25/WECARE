import React, { useState, useEffect, useRef } from 'react';
// REMOVED: httpsCallable and 'functions'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  doc, // Import doc
} from 'firebase/firestore';
// REMOVED: 'functions' from firebase
import { db } from '../firebase'; 
import { useAuth } from '../AuthContext';

//
// NEW: Define the URL for your Python backend
//
const PYTHON_BACKEND_URL = "http://localhost:5000/chat";

//
// --- NEW HELPER COMPONENT ---
// This component will find and render Markdown (like **bold**)
//
function MarkdownRenderer({ text }) {
  // Split the text by newlines, then process each line for bold tags
  return text.split('\n').map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g); // Split by **bold** text
    return (
      <p key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // It's bold text! Render it with <strong>
            return (
              <strong key={partIndex}>
                {part.substring(2, part.length - 2)}
              </strong>
            );
          }
          // It's regular text
          return part;
        })}
      </p>
    );
  });
}


function AIChatbotPage() {
  const { currentUser } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  const [chatHistoryRef, setChatHistoryRef] = useState(null);
  useEffect(() => {
    if (currentUser) {
      setChatHistoryRef(
        collection(db, 'users', currentUser.uid, 'aiChatHistory')
      );
    }
  }, [currentUser]);

  // Load chat history (same as before)
  useEffect(() => {
    if (!chatHistoryRef) {
      setChatHistory([]);
      return;
    }
    const q = query(chatHistoryRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }));
        setChatHistory(messages);
      },
      (error) => {
        console.error('Error loading chat history:', error);
      }
    );
    return () => unsubscribe();
  }, [chatHistoryRef]);

  // Scroll to bottom (same as before)
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !currentUser || !chatHistoryRef) return;

    setLoading(true);

    // --- THIS IS THE FIX ---

    // 1. Create the message for the *database* (with the Timestamp)
    const userMessageForDb = {
      role: 'user',
      text: input,
      timestamp: Timestamp.now(),
    };
    
    // 2. Create a plain, simple object for the *API call* (no Timestamp)
    const userMessageForApi = {
      role: 'user',
      text: input,
    };
    setInput('');

    // 3. Prepare history for AI, using the simple API-safe object
    const currentHistory = [...chatHistory, userMessageForApi].map((msg) => ({
      role: msg.role,
      text: msg.text,
    }));
    
    // --- END OF FIX ---

    try {
      //
      // Call the Python backend using fetch()
      //
      const response = await fetch(PYTHON_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: currentHistory }) // This JSON is now clean
      });

      if (!response.ok) {
        // If the server returns an error,
        const err = await response.json();
        throw new Error(err.error || `Python server error: ${response.statusText}`);
      }

      const result = await response.json();
      const aiResponseText = result.responseText;

      const aiMessage = {
        role: 'model',
        text: aiResponseText,
        timestamp: Timestamp.now(),
      };

      // Save BOTH messages to Firestore (using the DB-safe message)
      const batch = writeBatch(db);
      const userDocRef = doc(chatHistoryRef);
      batch.set(userDocRef, userMessageForDb); // <-- Use the DB version
      const aiDocRef = doc(chatHistoryRef);
      batch.set(aiDocRef, aiMessage);
      
      await batch.commit();

    } catch (error) {
      console.error('Error calling AI backend:', error.message);
      
      // Save an error message to the chat
      await addDoc(chatHistoryRef, {
        role: 'model',
        text: `Sorry, I'm having trouble connecting. Error: ${error.message}`,
        timestamp: Timestamp.now(),
      });
    }

    setLoading(false);
  };

  // The return (JSX) part of this file is identical
  return (
    <div className="chat-page-container">
      <main className="chat-main">
        <header className="chat-header">
          <h2>WeCare AI</h2>
        </header>

        <div className="message-list">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.role === 'user' ? 'user-message' : 'peer-message'
              }`}
            >
              <span className="username">
                {msg.role === 'user' ? 'You' : 'MindShift AI'}
              </span>
              
              {/*
               // --- THIS IS THE CHANGE ---
               // We no longer just map <p> tags.
               // We use our new MarkdownRenderer component.
              */}
              <MarkdownRenderer text={msg.text} />
              
            </div>
          ))}

          {loading && (
            <div className="message peer-message">
              <span className="username">WeCare AI</span>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            //
            // --- THIS IS THE FIX ---
            //
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default AIChatbotPage;