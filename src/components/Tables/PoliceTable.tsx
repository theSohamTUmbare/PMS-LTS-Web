import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const PoliceTable: React.FC = () => {
  const [police, setPolice] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  const toggleDropdown = (id: number) => {
    setDropdown(dropdown === id ? null : id);
  };

  const fetchPolice = async (page = 1) => {
    try {
      const response = await axios.get(`/api/v1/staff/getbyRole/Police?page=${page}`);
      setPolice(response.data.staffMembers);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch police", error);
    }
  };

  useEffect(() => {
    fetchPolice(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPolice(page);
  };

  return (
    <div className="p-4">
     

      {filterVisible && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          {/* Add filter inputs here if needed */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Apply Filters</button>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b border-gray-200">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">First Name</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">Last Name</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">Role</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">Badge Number</th>
            <th className="py-2 px-4 border-b border-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          {police.map((officer) => (
            <tr key={officer.staff_id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b border-gray-200">{officer.staff_id}</td>
              <td className="py-2 px–4 border-b border-gray–200">{officer.first_name}</td>
              <td className="py–2 px–4 border-b border-gray–200">{officer.last_name}</td>
              <td className="py–2 px–4 border-b border-gray–200">{officer.role}</td>
              <td className="py–2 px–4 border-b border-gray–200">{officer.badge_number}</td>
              <td className="py–2 px–4 border-b border-gray–200 relative">
                <button onClick={() => toggleDropdown(officer.staff_id)} className="text-gray–600 hover:text-gray–900">
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
                {dropdown === officer.staff_id && (
                  <div className="absolute right–0 mt–2 w–40 bg-white border border-gray–200 rounded-md shadow-lg z–10">
                    <button className="block w-full text-left px–4 py–2 text-gray–700 hover:bg-gray–100">Edit</button>
                    <button className="block w-full text-left px–4 py–2 text-gray–700 hover:bg-gray–100">Delete</button>
                    <button className="block w-full text-left px–4 py–2 text-gray–700 hover:bg-gray–100">More Details</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-500">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
    </div>
  );
};

export default PoliceTable;