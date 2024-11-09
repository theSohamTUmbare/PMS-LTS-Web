import React from 'react';

const PoliceFilter: React.FC = () => {
  return (
    <div>
      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="First Name"
        />
      </div>
      <div>
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="Last Name"
        />
      </div>
      <div>
        <label className="block text-gray-700">Rank</label>
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="Rank"
        />
      </div>
      <div>
        <label className="block text-gray-700">Department</label>
        <select className="border border-gray-300 rounded-md px-4 py-2 w-full">
          <option value="">All</option>
          <option value="Homicide">Homicide</option>
          <option value="Narcotics">Narcotics</option>
        </select>
      </div>
    </div>
  );
};

export default PoliceFilter;
