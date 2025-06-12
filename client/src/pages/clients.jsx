import React, { useEffect, useState } from 'react';
import axios from 'axios';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

const Clients = () => {
  // State hooks
  const [deals, setDeals] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSurveys, setClientSurveys] = useState([]);

  // Fetch deals and surveys on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealsRes = await axios.get('/api/deals');
        const surveysRes = await axios.get('/api/surveys');

        const sortedDeals = dealsRes.data.deals.sort((a, b) =>
          a.organization_name.localeCompare(b.organization_name)
        );

        setDeals(sortedDeals);
        setSurveys(surveysRes.data);

        if (sortedDeals.length > 0) {
          setSelectedClient(sortedDeals[0]);
        }
      } catch (err) {
        console.error('Error loading clients or surveys:', err);
      }
    };

    fetchData();
  }, []);

  // Filter surveys based on selected client
  useEffect(() => {
    if (!selectedClient) {
      setClientSurveys([]);
      return;
    }

    const filtered = surveys.filter(
      (survey) => survey.clientName === selectedClient.organization_name
    );

    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    setClientSurveys(filtered);
  }, [selectedClient, surveys]);

  const latestSurvey = clientSurveys.length > 0 ? clientSurveys[0] : null;

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <aside className="w-64 bg-gray-100 p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-gray-100">Clients</h2>
        <ul>
          {deals.map((deal) => (
            <li
              key={deal.deal_id}
              className={`cursor-pointer py-2 px-3 rounded ${
                selectedClient && selectedClient.deal_id === deal.deal_id
                  ? 'bg-blue-400 text-white'
                  : 'hover:bg-blue-200'
              }`}
              onClick={() => setSelectedClient(deal)}
            >
              {deal.organization_name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Section */}
      <main className="flex-grow p-6 overflow-auto">
        {!selectedClient ? (
          <p>Select a client to see details.</p>
        ) : (
          <>
            {/* Client Header */}
            <h1 className="text-2xl font-bold mb-4">{selectedClient.organization_name}</h1>
            <p className="text-lg text-gray-600 mb-4">{selectedClient.person_name}</p>

            {/* Client Details Section */}
            <div className="mb-8 space-y-2">
              <p><strong>Email:</strong> {selectedClient.person_email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedClient.phone_number || 'N/A'}</p>
              <p>
                <strong>Last Survey Date:</strong>{' '}
                {latestSurvey ? formatDate(latestSurvey.submittedAt) : 'No surveys yet'}
              </p>
              <p>
                <strong>Latest Rating:</strong>{' '}
                {latestSurvey ? latestSurvey.rating : 'N/A'}
              </p>
              <p>
                <strong>Time Since Last Survey:</strong>{' '}
                {selectedClient.time_since_survey !== undefined && selectedClient.time_since_survey !== null
                  ? `${selectedClient.time_since_survey} days`
                  : 'N/A'}
              </p>
            </div>

            {/* Past Surveys Section */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Past Surveys</h2>
              {clientSurveys.length === 0 ? (
                <p>No surveys available for this client.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-auto">
                  {clientSurveys.map((survey, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded shadow">
                      <p><strong>Date:</strong> {formatDate(survey.submittedAt)}</p>
                      <p><strong>Rating:</strong> {survey.rating}</p>
                      <p><em>"{survey.comment || 'No comment'}"</em></p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Clients;
