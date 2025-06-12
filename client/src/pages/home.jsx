// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FF4444', '#FFBB28', '#00C49F']; // Detractors, Neutrals, Promoters colors

function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Calculate NPS
function calculateNPS(surveys) {
  if (!surveys.length) return 0;

  let promoters = 0;
  let detractors = 0;

  surveys.forEach(({ rating }) => {
    if (rating >= 9) promoters++;
    else if (rating <= 6) detractors++;
  });

  const total = surveys.length;
  const nps = ((promoters - detractors) / total) * 100;
  return Math.round(nps);
}


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index, value,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealRes = await axios.get('/api/numDeals');
        const surveyRes = await axios.get('/api/surveys');

        setDeals(dealRes.data.deals);
        setSurveys(surveyRes.data);

        // NPS calculation
        let promoters = 0;
        let passives = 0;
        let detractors = 0;

        surveyRes.data.forEach(s => {
          const rating = s.rating;
          if (rating >= 9) {
            promoters++;
          } else if (rating >= 7) {
            passives++;
          } else {
            detractors++;
          }
        });

        const chartDataUnfiltered = [
          { name: 'Detractors', value: detractors },
          { name: 'Neutrals', value: passives },
          { name: 'Promoters', value: promoters },
        ];

        // Filter out zero-value slices
        const chartData = chartDataUnfiltered.filter(item => item.value > 0);

        setScoreData(chartData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  const today = formatDate(new Date());
  const latestSurvey = surveys.length > 0
    ? formatDate(surveys[surveys.length - 1].submittedAt)
    : 'No surveys yet';

  const latest5Surveys = [...surveys]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Top section */}
      <div className="flex justify-between items-start w-full" style={{ minWidth: '600px' }}>
      {/* Left - Info */}
      <div className="space-y-2 max-w-xs">
        <h2 className="text-xl font-semibold">Total Clients: {deals.length}</h2>
        <p>{today}</p>
        <p>Latest Survey: {latestSurvey}</p>
      </div>

      {/* Right - Doughnut Chart */}
      <div style={{ width: 280, height: 280, flexShrink: 0 }}>
        <h3 style={{ marginBottom: '1rem' }}>NPS Score: {calculateNPS(surveys)}%</h3>
        <PieChart width={250} height={250}>
          <Pie
            dataKey="value"
            data={scoreData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            label={renderCustomizedLabel}
            labelLine={false}
            isAnimationActive={true}
          >
            {scoreData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>

      {/* Bottom section - Latest 5 surveys */}
      {latest5Surveys.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Latest 5 Surveys</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 font-semibold">
                <th className="pb-2"></th>
                <th className="pb-2"></th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {latest5Surveys.map((survey, idx) => (
                <tr key={idx} className="border-t border-transparent hover:bg-gray-50">
                  <td className="py-2">{survey.clientName}</td>
                  <td className="py-2">{survey.rating}</td>
                  <td className="py-2 italic">{survey.comment || 'No comment'}</td>
                  <td className="py-2">{formatDate(survey.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
