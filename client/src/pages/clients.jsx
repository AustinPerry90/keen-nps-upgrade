import React, { useEffect, useState } from 'react';
import axios from 'axios';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

const Clients = () => {
  const [deals, setDeals] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSurveys, setClientSurveys] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  // Fetch deals and surveys on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealsRes = await axios.get('/api/deals');
        const surveysRes = await axios.get('/api/surveys');
        const teamRes = await axios.get('/api/team');

        const sortedDeals = dealsRes.data.deals.sort((a, b) =>
          a.organization_name.localeCompare(b.organization_name)
        );
        const sortedTeam = teamRes.data.sort((a, b) => a.name.localeCompare(b.name));

        setDeals(sortedDeals);
        setSurveys(surveysRes.data);
        setTeamMembers(sortedTeam);

        if (sortedDeals.length > 0) {
          setSelectedClient(sortedDeals[0]);
        }
      } catch (err) {
        console.error('Error loading clients, surveys, or team members:', err);
      }
    };

    fetchData();
  }, []);

  // Filter surveys based on selected client
  useEffect(() => {
    if (!selectedClient) {
      setClientSurveys([]);
      setSelectedTechnician(null);
      return;
    }

    const filtered = surveys.filter(
      (survey) => survey.clientName === selectedClient.organization_name
    );

    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    setClientSurveys(filtered);

    // Set selected technician based on client data
    if (selectedClient.technician) {
      const techId = typeof selectedClient.technician === 'object' ? selectedClient.technician._id : selectedClient.technician;
      setSelectedTechnician(techId);
    } else {
      setSelectedTechnician(null);
    }
  }, [selectedClient, surveys]);

  // Handle technician assignment change
  const handleAssignTechnician = async (technicianId) => {
    if (!selectedClient) return;

    try {
      const res = await axios.patch(`/api/deals/${selectedClient.deal_id}/assign-technician`, {
        technicianId,
      });

      // Update selected client with updated deal info
      setSelectedClient(res.data);
      setSelectedTechnician(technicianId);
    } catch (err) {
      console.error('Failed to assign technician:', err);
      alert('Failed to assign technician. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <aside className="w-64 bg-gray-100 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Clients</h2>
        <ul className="overflow-auto flex-grow space-y-1 pr-1">
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
                {clientSurveys.length > 0 ? formatDate(clientSurveys[0].submittedAt) : 'No surveys yet'}
              </p>
              <p>
                <strong>Latest Rating:</strong>{' '}
                {clientSurveys.length > 0 ? clientSurveys[0].rating : 'N/A'}
              </p>
              <p>
                <strong>Time Since Last Survey:</strong>{' '}
                {selectedClient.time_since_survey !== undefined && selectedClient.time_since_survey !== null
                  ? `${selectedClient.time_since_survey} days`
                  : 'N/A'}
              </p>

              {/* Technician Assignment */}
              <div className="mt-6">
                <label className="font-semibold" htmlFor="technician-select">
                  Assign Technician:
                </label>
                <select
                  id="technician-select"
                  value={selectedTechnician || ''}
                  onChange={(e) => handleAssignTechnician(e.target.value)}
                  className="ml-2 p-1 border rounded"
                >
                  <option value="">-- Select Technician --</option>
                  {teamMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>

                {selectedTechnician && (
                  <p className="mt-2 text-gray-700">
                    Assigned Technician: {teamMembers.find((m) => m._id === selectedTechnician)?.name || 'N/A'}
                  </p>
                )}
              </div>
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
