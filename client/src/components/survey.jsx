import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SurveyPage = () => {
  const { dealID } = useParams();
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [extraFeedback, setExtraFeedback] = useState('');
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
    if (!rating || comment.length > 500) return;

    setSubmitting(true);

    try {
      await axios.post('/api/submit-survey', {
        clientName,
        rating,
        comment,
        extraFeedback,
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
      overflow: 'hidden',
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
        display: 'flex',
        gap: '20px',
        maxWidth: '1100px',
        width: '100%',
        height: '90vh',
      }}>
        {/* LEFT PANEL */}
        <div style={{
          flex: 1,
          backgroundColor: '#1a1a1a',
          color: '#fff',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #888',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          overflowY: 'auto',
        }}>
          {/* Replace with whatever image you prefer */}
          <img
            src="/images/logo.png"
            alt="Check-in Graphic"
            style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
          />
          <h1>Just Checking In</h1>
          <p style={{ fontSize: '1.1em', maxWidth: '300px' }}>
            Let us know how we're doing — your feedback helps us improve!
          </p>
        </div>

        {/* RIGHT PANEL (SURVEY) */}
        <div style={{
          flex: 1,
          backgroundColor: '#1a1a1a',
          color: '#fff',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #888',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          overflowY: 'auto',
        }}>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label><strong>Client Name:</strong></label>
              <p>{clientName || 'Loading...'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label><strong>On a scale of 1-10, how satisfied are you with the services provided by Keen?</strong></label>
              <div>
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
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label><strong>We always appreciate your feedback! Let us know what you think about our services.</strong></label><br />
              <textarea
                maxLength="500"
                rows="4"
                cols="50"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your feedback..."
                style={{ width: '100%', marginTop: '5px' }}
              />
              <div style={{ fontSize: '0.8em', color: '#ccc' }}>
                {comment.length}/500 characters
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label><strong>
                We pride ourselves on bringing value to our clients. What aspect of our service has served your organization the best?<br />
                Your insights are immensely valuable and may be used for marketing purposes on our website and other promotional materials.
              </strong></label><br />
              <textarea
                rows="3"
                cols="50"
                value={extraFeedback}
                onChange={(e) => setExtraFeedback(e.target.value)}
                placeholder="Anything else you'd like to share?"
                style={{ width: '100%', marginTop: '5px' }}
              />
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
    </div>
  );
};

export default SurveyPage;
