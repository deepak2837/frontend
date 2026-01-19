"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const NeetUGPredictor = () => {
  const [formData, setFormData] = useState({
    rank: '',
    program: 'MBBS',
    gender: 'Open',
    category: 'Open',
    religion: 'other',
    nationality: 'indian',
    region: 'other',
    defence_war: 'No',
    seat_type: 'Any'
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filterData = (data) => {
    const { rank, program, gender, category, religion, nationality, region, defence_war, seat_type } = formData;
    
    return data.filter(item => {
      // Program filter
      if (program && item["Academic Program Name"]?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() !== 
          program.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()) {
        return false;
      }

      // Gender filter
      if (gender === 'Open') {
        if (item.Gender !== 'Open') return false;
      } else if (gender === 'Female') {
        if (item.Gender !== 'Female' && item.Gender !== 'Open') return false;
      }

      // Category filter
      if (category && item.Category !== category) return false;

      // Religion filter (Seat Type)
      if (religion !== 'other' && item["Seat Type"] !== religion) return false;

      // Seat Type filter
      if (seat_type && seat_type !== 'Any') {
        const seatTypeMap = {
          'All India/Open Seat': 'Open Seat',
          'Deemed/Paid': 'Deemed/Paid',
          'Non-Resident Indian': 'Non-Resident Indian',
          'Foreign National': 'Foreign National',
          'Aligarh Muslim University': 'Aligarh Muslim University',
          'Employees State Insurance': 'Employees State Insurance',
          'Jamia': 'Jamia',
          'Delhi University': 'Delhi University'
        };
        const dbValue = seatTypeMap[seat_type] || seat_type;
        if (dbValue === 'Open Seat') {
          if (item["Seat Type"] !== 'Open Seat' && item["Seat Type"] !== 'All India') return false;
        } else if (item["Seat Type"] !== dbValue) {
          return false;
        }
      }

      // Rank filter (0.9 coefficient)
      if (rank) {
        const closingRank = parseInt(item["Closing Rank"], 10);
        const userRank = parseInt(rank, 10);
        if (!isNaN(closingRank) && !isNaN(userRank)) {
          if (closingRank < 0.9 * userRank) return false;
        }
      }

      return true;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rank) {
      toast.error('Please enter your rank');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/data/neetug/neetug.json');
      const data = await response.json();
      
      const filtered = filterData(data);
      const sorted = filtered.sort((a, b) => a["Closing Rank"] - b["Closing Rank"]);
      
      setResults(sorted);
      if (sorted.length === 0) {
        toast.error('No colleges found matching your criteria');
      } else {
        toast.success(`Found ${sorted.length} colleges`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch college data');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(item => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.Institute?.toLowerCase().includes(search) ||
      item.State?.toLowerCase().includes(search) ||
      item["Academic Program Name"]?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">NEET UG College Predictor</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">NEET UG Rank *</label>
              <input
                type="number"
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your rank"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Program</label>
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="MBBS">MBBS</option>
                <option value="BDS">BDS</option>
                <option value="BSC Nursing">BSC Nursing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="EWS">EWS</option>
                <option value="EWS PwD">EWS PwD</option>
                <option value="Open PwD">Open PwD</option>
                <option value="OBC">OBC</option>
                <option value="OBC PwD">OBC PwD</option>
                <option value="SC">SC</option>
                <option value="SC PwD">SC PwD</option>
                <option value="ST">ST</option>
                <option value="ST PwD">ST PwD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Religion</label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="other">Other</option>
                <option value="jain">Jain</option>
                <option value="muslim">Muslim</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Seat Type</label>
              <select
                name="seat_type"
                value={formData.seat_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Any">Any</option>
                <option value="All India/Open Seat">All India/Open Seat</option>
                <option value="Deemed/Paid">Deemed/Paid</option>
                <option value="Non-Resident Indian">Non-Resident Indian</option>
                <option value="Foreign National">Foreign National</option>
                <option value="Aligarh Muslim University">Aligarh Muslim University</option>
                <option value="Employees State Insurance">Employees State Insurance</option>
                <option value="Jamia">Jamia</option>
                <option value="Delhi University">Delhi University</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Predict Colleges'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by college name, state, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Found {filteredResults.length} College{filteredResults.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Institute</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">State</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Program</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Seat Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Closing Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{item.Institute}</td>
                      <td className="px-4 py-3 text-sm">{item.State}</td>
                      <td className="px-4 py-3 text-sm">{item["Academic Program Name"]}</td>
                      <td className="px-4 py-3 text-sm">{item["Seat Type"]}</td>
                      <td className="px-4 py-3 text-sm">{item.Category}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{item["Closing Rank"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeetUGPredictor;
