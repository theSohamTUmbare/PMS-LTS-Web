import { useState, useEffect } from 'react';
import { Prisoner } from '../../utils/prisonerApi';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const PrisonerTable: React.FC = () => {
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

    return (
        <div className="p-4">
            {/* <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-4">
                        <span className="text-blue-600 font-semibold">Prisoners</span>
                        <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">{prisoners.length}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-blue-600 font-semibold">Police</span>
                        <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">{prisoners.length}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-blue-600 font-semibold">Guards</span>
                        <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">{prisoners.length}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <input type="text" placeholder="Search prisoner" className="border border-gray-300 rounded-md px-4 py-2"/>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Create New Prisoner</button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => setFilterVisible(!filterVisible)}>Filter</button>
                </div>
            </div>
            {filterVisible && (
                <div className="mb-4 p-4 bg-gray-100 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">First Name</label>
                        <input type="text" className="border border-gray-300 rounded-md px-4 py-2 w-full"/>
                    </div>
                    <div>
                        <label className="block text-gray-700">Last Name</label>
                        <input type="text" className="border border-gray-300 rounded-md px-4 py-2 w-full"/>
                    </div>
                    <div>
                        <label className="block text-gray-700">Gender</label>
                        <select className="border border-gray-300 rounded-md px-4 py-2 w-full">
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Status</label>
                        <select className="border border-gray-300 rounded-md px-4 py-2 w-full">
                            <option value="">All</option>
                            <option value="Incarcerated">Incarcerated</option>
                            <option value="Released">Released</option>
                            <option value="On Trial">On Trial</option>
                            <option value="Transferred">Transferred</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Entry Date</label>
                        <input type="date" className="border border-gray-300 rounded-md px-4 py-2 w-full"/>
                    </div>
                </div>
                <div className="mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Apply Filters</button>
                </div>
            </div>
        )} */}
                    
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
                                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Edit</button>
                                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Delete</button>
                                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">More Details</button>
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
