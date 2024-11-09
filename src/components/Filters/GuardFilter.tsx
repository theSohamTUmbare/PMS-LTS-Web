import React from 'react';

const GuardFilter: React.FC = () => {
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
        <label className="block text-gray-700">Badge Number</label>
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="Badge Number"
        />
      </div>
      <div>
        <label className="block text-gray-700">Role</label>
        <select className="border border-gray-300 rounded-md px-4 py-2 w-full">
          <option value="">All</option>
          <option value="Security">Security</option>
          <option value="Supervisor">Supervisor</option>
        </select>
      </div>
    </div>
  );
};

export default GuardFilter;
