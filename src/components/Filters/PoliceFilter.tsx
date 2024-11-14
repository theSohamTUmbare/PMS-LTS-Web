import React, { useState } from 'react';

interface PoliceFilterProps {
  onFilterChange: (filters: {
    firstName: string;
    lastName: string;
    rank: string;
    department: string;
  }) => void;
}

const PoliceFilter: React.FC<PoliceFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    rank: '',
    department: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      onFilterChange(updatedFilters); // Passing the updated filters to the parent
      return updatedFilters;
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      onFilterChange(updatedFilters); // Passing the updated filters to the parent
      return updatedFilters;
    });
  };

  return (
    <div className="p-4">
      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          name="firstName"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="First Name"
          value={filters.firstName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastName"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="Last Name"
          value={filters.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-gray-700">Rank</label>
        <input
          type="text"
          name="rank"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="Rank"
          value={filters.rank}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-gray-700">Department</label>
        <select
          name="department"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={filters.department}
          onChange={handleSelectChange}
        >
          <option value="">All</option>
          <option value="Homicide">Homicide</option>
          <option value="Narcotics">Narcotics</option>
          <option value="Patrol">Patrol</option>
          <option value="CID">CID</option>
          <option value="SWAT">SWAT</option>
          <option value="Forensics">Forensics</option>
        </select>
      </div>
    </div>
  );
};

export default PoliceFilter;
