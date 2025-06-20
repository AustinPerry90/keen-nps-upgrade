import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch team members
  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get('/api/team');
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setTeamMembers(sorted);
      if (sorted.length > 0) setSelectedMember(sorted[0]);
    } catch (err) {
      console.error('Error loading team:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!newName) {
      alert('Name is required');
      return;
    }

    try {
      await axios.post('/api/team', {
        name: newName,
        email: newEmail,
        phone: newPhone
      });

      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setShowForm(false);
      fetchTeam(); // refresh team list
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Could not add team member.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Team</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white text-sm px-2 py-1 rounded hover:bg-blue-600"
            title="Add team member"
          >
            {showForm ? '×' : '+'}
          </button>
        </div>

        {/* Add Member Form */}
        {showForm && (
          <form onSubmit={handleAddMember} className="mb-4 bg-white p-3 rounded shadow text-sm space-y-2">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-1 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-1 border rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full p-1 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
            >
              Add Member
            </button>
          </form>
        )}

        {/* Team List */}
        <ul className="overflow-auto flex-grow space-y-1 pr-1">
          {teamMembers.map((member) => (
            <li
              key={member._id}
              className={`cursor-pointer py-2 px-3 rounded ${
                selectedMember && selectedMember._id === member._id
                  ? 'bg-blue-400 text-white'
                  : 'hover:bg-blue-200'
              }`}
              onClick={() => setSelectedMember(member)}
            >
              {member.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 overflow-auto">
        {!selectedMember ? (
          <p>Select a team member to view details.</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{selectedMember.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{selectedMember.role || '—'}</p>

            <div className="space-y-2">
              <p><strong>Email:</strong> {selectedMember.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedMember.phone || 'N/A'}</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Team;
