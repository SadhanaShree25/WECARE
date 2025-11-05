import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';

function HistoryPage() {
  const { currentUser } = useAuth();
  const [journalEntries, setJournalEntries] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    
    // Load Journal
    const journalRef = collection(db, "users", currentUser.uid, "journalEntries");
    const qJournal = query(journalRef, orderBy("timestamp", "desc"));
    const unsubJournal = onSnapshot(qJournal, (snapshot) => {
      setJournalEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Load Chat
    const chatRef = collection(db, "users", currentUser.uid, "aiChatHistory");
    const qChat = query(chatRef, orderBy("timestamp", "desc"));
    const unsubChat = onSnapshot(qChat, (snapshot) => {
      setChatHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false); // Set loading false after last fetch
    });

    return () => {
      unsubJournal();
      unsubChat();
    };
  }, [currentUser]);

  return (
    <div className="history-container">
      <h1>My History</h1>
      {loading && <p>Loading history...</p>}
      
      <h2>AI Chat History (Last 10)</h2>
      <div className="history-list">
        {chatHistory.slice(0, 10).map(msg => (
          <div key={msg.id} className="card history-entry">
            <p className={`history-text ${msg.role === 'user' ? 'user' : 'model'}`}>
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.text.substring(0, 100)}...
            </p>
          </div>
        ))}
      </div>

      <h2>Journal Entries (Last 5)</h2>
      <div className="history-list">
        {journalEntries.slice(0, 5).map(entry => (
          <div key={entry.id} className="card history-entry">
            <p className="history-text">
              {entry.text.substring(0, 150)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default History;