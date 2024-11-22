import { useState, useEffect } from 'react';
import { Prisoner } from '../../utils/prisonerApi';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const PrisonerTable: React.FC = () => {
    const navigate = useNavigate();
    const [prisoners, setPrisoners] = useState<Prisoner[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [dropdown, setDropdown] = useState<number | null>(null);
    const toggleDropdown = (id: number) => {
        setDropdown(dropdown === id ? null : id);
    };


    const fetchPrisoners = async (page = 1) => {
        try {
            const response = await axios.get(`/api/v1/prisoner/all?page=${page}`);
            setPrisoners(response.data.prisoners);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch prisoners", error);
        }
    };

    useEffect(() => {
        fetchPrisoners(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchPrisoners(page);
    };

    const goToDetailsPage = (id: number) => {
        navigate(`/prisoner-details/${id}`);
    };

    const handleDeletePrisoner = async (prisonerId) => {
        if (window.confirm("Are you sure you want to delete this prisoner?")) {
          try {
            await axios.delete(`/api/v1/prisoner/delete/${prisonerId}`);
            alert("Prisoner deleted successfully.");
            window.location.reload();
          } catch (error) {
            alert(
              error.response?.data?.message || "Failed to delete prisoner. Please try again."
            );
          }
        }
      };

    return (
        <div className="p-4">
           
                    
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b border-gray-200">ID</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">First Name</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Last Name</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Date of Birth</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Gender</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">National ID</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Entry Date</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
                        <th className="py-2 px-4 border-b border-gray-200"></th>
                    </tr>
                </thead>
                <tbody>
                    {prisoners.map((prisoner) => (
                        <tr key={prisoner.prisoner_id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b border-gray-200">{prisoner.prisoner_id}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{prisoner.first_name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{prisoner.last_name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{new Date(prisoner.date_of_birth).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{prisoner.gender}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{prisoner.national_id}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{new Date(prisoner.entry_date).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <span className={`rounded-full px-2 py-1 text-xs ${prisoner.status === 'Incarcerated' ? 'bg-red-100 text-red-600' : prisoner.status === 'Released' ? 'bg-green-100 text-green-600' : prisoner.status === 'On Trial' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {prisoner.status}
                                </span>
                            </td>
                        
                            <td className="py-2 px-4 border-b border-gray-200 relative">
                                <button onClick={() => toggleDropdown(prisoner.prisoner_id)} className="text-gray-600 hover:text-gray-900">
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </button>
                                {dropdown === prisoner.prisoner_id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <button onClick={() => goToDetailsPage(prisoner.prisoner_id)} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Edit</button>
                                        <button onClick={() => handleDeletePrisoner(prisoner.prisoner_id)} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Delete</button>
                                        <button onClick={() => goToDetailsPage(prisoner.prisoner_id)}  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">More Details</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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

export default PrisonerTable;
