import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SurveyPage = () => {
  const { dealID } = useParams();
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!dealID) return;

    axios.get(`/api/client-info?dealID=${dealID}`)
      .then(res => {
        setClientName(res.data.name);
      })
      .catch(err => {
        console.error('Error fetching client info:', err);
        setClientName('Unknown');
      });
  }, [dealID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await axios.post('/api/submit-survey', {
        clientName,
        rating,
        dealID
      });

      alert('Survey submitted successfully!');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('There was a problem submitting your response.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      background: '#000',
      backgroundImage: 'url("/images/blobby.svg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #888',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        maxWidth: '700px',
        width: '100%',
        overflowY: 'auto',
        maxHeight: '90vh',
      }}>
        {/* Replace with whatever image you prefer */}
          <img
            src="/images/logo.png"
            alt="Check-in Graphic"
            style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
          />
        <h1 style={{ marginBottom: '10px' }}>Just Checking In</h1>
        <p style={{ fontSize: '1.1em', marginBottom: '30px' }}>
          Let us know how we're doing — your feedback helps us improve!
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Client Name:</strong></label>
            <p>{clientName || 'Loading...'}</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label><strong>On a scale of 1-10, how satisfied are you with the services provided by Keen?</strong></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {[...Array(10)].map((_, i) => {
                const value = i + 1;
                const isSelected = rating === value;

                return (
                  <label
                    key={value}
                    style={{
                      cursor: 'pointer',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: `1px solid ${isSelected ? '#3b82f6' : '#555'}`,
                      backgroundColor: isSelected ? '#3b82f6' : '#1a1a1a',
                      color: isSelected ? '#fff' : '#ccc',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={isSelected}
                      onChange={() => setRating(value)}
                      style={{ display: 'none' }}
                    />
                    {value}
                  </label>
                );
              })}
            </div>
          </div>

          <input type="hidden" value={dealID || ''} name="dealID" />

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyPage;
