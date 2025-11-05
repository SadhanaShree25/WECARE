// src/Pages/SelfCare.jsx
import React, { useState } from 'react';

const emotions = ['Sad', 'Angry', 'Anxious', 'Calm', 'Happy'];

function SelfCare() {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [videos, setVideos] = useState([]);

  const fetchVideos = async (emotion) => {
    setSelectedEmotion(emotion);
    // Replace with actual API or video list
    const emotionVideos = {
      Sad: [
        { title: 'Coping with Sadness', url: 'https://www.youtube.com/embed/65snrWJTNDU' },
        { title: 'Self-Compassion for Sad Days', url: 'https://www.youtube.com/embed/WZu-TisfAsQ' },
      ],
      Angry: [
        { title: 'Managing Anger Mindfully', url: 'https://www.youtube.com/embed/7raH7EUXH_8' },
      ],
      Anxious: [
        { title: 'Calm Your Anxiety', url: 'https://www.youtube.com/embed/kIZnR5gZKvY' },
      ],
      Calm: [
        { title: 'Daily Calm Routine', url: 'https://www.youtube.com/embed/qTjo_Jh9h_c' },
      ],
      Happy: [
        { title: 'Boosting Joy with Gratitude', url: 'https://www.youtube.com/embed/OgLrYFM9tRc' },
      ],
    };

    setVideos(emotionVideos[emotion] || []);
  };

  return (
    <div className="selfcare-container">
      <h2>How are you feeling today?</h2>
      <div className="emotion-buttons">
        {emotions.map((emotion) => (
          <button
            key={emotion}
            onClick={() => fetchVideos(emotion)}
            className="emotion-btn"
          >
            {emotion}
          </button>
        ))}
      </div>

      {selectedEmotion && (
        <div className="video-section">
          <h3>Videos for {selectedEmotion}</h3>
          {videos.map((video, index) => (
            <div key={index} className="video-card">
              <h4>{video.title}</h4>
              <iframe
                width="100%"
                height="315"
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelfCare;