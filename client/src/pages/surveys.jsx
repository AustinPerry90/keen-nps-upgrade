import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpcomingSurveys = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axios.get('/api/upcoming-surveys');
        setSurveys(res.data.upcomingSurveys);
      } catch (err) {
        console.error('Error fetching upcoming surveys:', err);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Surveys in the Next 7 Days</h2>
      {surveys.length === 0 ? (
        <p>No upcoming surveys.</p>
      ) : (
        <ul>
          {surveys.map((deal, idx) => (
            <li key={idx} className="mb-2 p-2 border rounded">
              <strong>{deal.person_name}</strong> ({deal.organization_name})<br />
              Deal ID: {deal.deal_id}<br />
              Time as Client: {deal.time_as_client} days<br />
              Stage: {deal.stage_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingSurveys;
