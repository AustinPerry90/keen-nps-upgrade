import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SurveyPage = () => {
  const { dealID } = useParams();  // Get dealID from URL param
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!dealID) return;

    // Fetch client info by deal ID
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Client Survey</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label><strong>Client Name:</strong></label>
          <p>{clientName || 'Loading...'}</p>
        </div>

        <div>
          <label><strong>Rating (1 to 10):</strong></label>
          <div>
            {[...Array(10)].map((_, i) => (
              <label key={i + 1} style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  value={i + 1}
                  checked={rating === i + 1}
                  onChange={() => setRating(i + 1)}
                  required
                />
                {i + 1}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label><strong>Additional Comment:</strong></label><br />
          <textarea
            maxLength="500"
            rows="4"
            cols="50"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your feedback..."
            required
          />
          <div style={{ fontSize: '0.8em', color: '#666' }}>
            {comment.length}/500 characters
          </div>
        </div>

        {/* Hidden dealID field */}
        <input type="hidden" value={dealID || ''} name="dealID" />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  );
};

export default SurveyPage;
