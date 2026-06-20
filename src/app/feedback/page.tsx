import React from 'react';

export default function FeedbackPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Course Feedback</h1>
      <p>Welcome to the SkillForge LMS feedback page. Please leave your review below.</p>
      <textarea 
        placeholder="Type your feedback here..." 
        rows={5} 
        style={{ width: '100%', maxWidth: '500px', padding: '10px', marginTop: '10px' }}
      />
      <br />
      <button style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>
        Submit Feedback
      </button>
    </div>
  );
}