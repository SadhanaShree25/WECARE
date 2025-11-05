import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure this path is correct

//
// CORRECTED FIRESTORE PATH:
// This path (a subcollection) matches your firestore.rules
//
const supportRef = collection(db, 'public', 'data', 'supportContacts');

const mockContacts = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    type: 'hotline',
    url: 'https://988lifeline.org/',
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    type: 'text',
    url: 'https://www.crisistextline.org/',
  },
  {
    name: 'Your Campus Counseling (Example)',
    phone: '(123) 456-7890',
    type: 'local',
    url: '#',
  },
];

function SupportPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(supportRef);
        let loadedContacts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // This logic will run ONCE to populate your database with the mock contacts
        // if the collection is empty.
        if (loadedContacts.length === 0) {
          console.log("No contacts found, attempting to populate with mock data...");
          
          // IMPORTANT: This 'addDoc' part will only work if your security rules
          // temporarily allow writing. 
          // Your current rule is 'allow read: if true;'.
          // You may need to add these contacts manually in the Firebase Console.
          try {
            for (const contact of mockContacts) {
              await addDoc(supportRef, contact);
            }
            loadedContacts = mockContacts.map((c, i) => ({ ...c, id: `mock-${i}` }));
          } catch (writeError) {
             console.error("Could not write mock data. Check security rules.", writeError);
             console.log("Please add support contacts manually to the 'public/data/supportContacts' collection in your Firestore console.");
          }
        }

        setContacts(loadedContacts);
      } catch (error) {
        console.error('Error fetching support contacts:', error);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  return (
    <div className="support-container" style={{ padding: '2rem' }}>
      <h1>Get Support</h1>
      <p className="subtitle">You are not alone. Here are resources that can help.</p>

      {loading ? (
        <p>Loading resources...</p>
      ) : contacts.length === 0 ? (
        <p>No support contacts found. Please check the console for errors.</p>
      ) : (
        <div className="support-list" style={{ display: 'grid', gap: '1.5rem' }}>
          {contacts.map((contact) => (
            <div
              key={contact.id || contact.name}
              className="card resource-card"
              style={{
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div className="icon">
                {contact.type === 'hotline' ? '📞' : '🧑‍⚕️'}
              </div>
              <h3>{contact.name}</h3>
              <p className="support-phone">{contact.phone}</p>
              <a
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Visit Website
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SupportPage;