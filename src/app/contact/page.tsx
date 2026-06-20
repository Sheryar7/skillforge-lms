import React from 'react';

export default function ContactPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Contact SkillForge Support</h1>
      <p style={{ color: '#aaa', marginBottom: '20px' }}>
        Have questions about the LMS platform or need technical assistance? Drop us a message below and our team will get back to you.
      </p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="name" style={{ fontWeight: 'bold', fontSize: '14px' }}>Full Name</label>
          <input 
            type="text" 
            id="name"
            placeholder="Sherry Khan" 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#111', color: '#fff' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
          <label htmlFor="email" style={{ fontWeight: 'bold', fontSize: '14px' }}>Email Address</label>
          <input 
            type="email" 
            id="email"
            placeholder="developer@example.com" 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#111', color: '#fff' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
          <label htmlFor="message" style={{ fontWeight: 'bold', fontSize: '14px' }}>Your Message</label>
          <textarea 
            id="message"
            placeholder="How can we help you build today?" 
            rows={6} 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            marginTop: '20px', 
            padding: '12px 24px', 
            cursor: 'pointer', 
            background: '#0070f3', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '16px',
            alignSelf: 'flex-start'
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}