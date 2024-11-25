import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const PoliceTable: React.FC = () => {
    const [police, setPolice] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [dropdown, setDropdown] = useState<number | null>(null);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [deleteMode, setDeleteMode] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // for displaying the error we have created a new state
    const [formData, setFormData] = useState<any>({});
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (id: number) => {
        setDropdown(dropdown === id ? null : id);
    };

    const fetchPolice = async (page = 1) => {
        try {
            const response = await axios.get(`/api/v1/staff/getbyRole/Police?page=${page}`);
            setPolice(response.data.staffMembers);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setErrorMessage(null);
        } catch (error) {
            console.error("Failed to fetch police", error)                                   ;
            setErrorMessage("Failed to fetch police data.");
        }
    };

    useEffect(() => {
        fetchPolice(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchPolice(page);
    };
    // const handleOutsideClick = (event: MouseEvent) => {
    //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //         setDropdown(null);
    //     }
    // };
    const handleEditClick = (officer: any) => {
        setEditMode(officer.staff_id);
        setFormData({ ...officer });
        setDropdown(null); // Close the dropdown when entering edit mode
    };

    // const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData: any) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };// the one below is to allow it to handle both the input type and the dropdown type
    const handleFormChange = (e: React.ChangeEvent<HTMLElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/v1/staff/update/${editMode}`, formData);
            setEditMode(null);
            fetchPolice(currentPage); // Refresh data
            setErrorMessage(null);
        } catch (error) {
            console.error("Error updating staff:", error);
            setErrorMessage("Failed to update staff. Please check your input.")
        }
    };
    const handleDeleteClick = (staffId: number) => {
        setDeleteMode(staffId);
        setDropdown(null);
    };
    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/v1/staff/delete/${deleteMode}`);
            setDeleteMode(null);
            fetchPolice(currentPage);
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    };
    return (
        <div className="p-4">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b border-gray-200 ">ID</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">First Name</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Last Name</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Role</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Badge Number</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Rank</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Department</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Contact-info</th>
                        <th className="py-2 px-4 border-b border-gray-200"></th>
                    </tr>
                </thead>
                <tbody>
                    {police.map((officer) => ( // mapping the id's with buttons
                        <tr key={officer.staff_id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b border-gray-200">{officer.staff_id}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{officer.first_name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{officer.last_name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{officer.role}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{officer.badge_number}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{officer.rank}</td>
                            <td className="py-2 px-4 border-b border-gray-200 bg-yellow">
                                <span className={`rounded-full px-2 py-1 text-xs ${officer.department === 'Patrol' ? 'bg-fuchsia-100 text-fuchsia-600'
                                    : officer.department === 'CID' ? 'bg-green-100 text-green-600'
                                        : officer.department === 'SWAT' ? 'bg-yellow-100 text-yellow-600'
                                            : officer.department === 'Forensics' ? 'bg-blue-100 text-blue-600'
                                                : 'bg-red-100 text-red-600'
                                    }`}>

                                    {officer.department}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">{officer.contact_info}</td>
                            <td className="py-2 px-4 border-b border-gray-200 relative">
                                <button onClick={() => toggleDropdown(officer.staff_id)} className="text-gray-600 hover:text-gray-900">
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </button>
                                {dropdown === officer.staff_id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleEditClick(officer)}>Edit</button>
                                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleDeleteClick(officer.staff_id)}>Delete</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editMode && (
                <div className="fixed inset-0 flex items-center justify-center px-8 bg-black bg-opacity-50">
                    <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded shadow-md w-full max-w-lg">
                        <h2 className="text-lg font-bold mb-4">Edit Officer Details</h2>

                        <div className="flex mb-2">
                            <label className="block w-1/3 mb-1 font-bold mt-2" htmlFor="first_name">First Name :</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name || ''}
                                onChange={handleFormChange}
                                placeholder="First Name"
                                className="w-2/3 p-2 border"
                            />
                        </div>

                        <div className="flex mb-2">
                            <label className="block w-1/3 mb-1 font-bold mt-2" htmlFor="last_name">Last Name :</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name || ''}
                                onChange={handleFormChange}
                                placeholder="Last Name"
                                className="w-2/3 p-2 border"
                            />
                        </div>

                        {/* <div className="flex mb-2">
                            <label className="block w-1/3 mb-1 font-bold mt-2" htmlFor="role">Role :</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role || ''}
                                onChange={handleFormChange}
                                placeholder="Role"
                                className="w-2/3 p-2 border"
                            />
                        </div> */}
                        <div className="flex mb-2">
                            <label className="block w-1/3 mb-1 font-bold mt-2 " htmlFor="role">Role :</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role || ''}
                                onChange={handleFormChange}
                                className="w-2/3 p-2 border"
                            >
                                <option value="">Select Role</option>
                                <option value="Police">Police</option>
                                <option value="Guard">Guard</option>
                              
                                
                            </select>
                        </div>

                        <div className="flex mb-2">
                            <label className="block w-1/3 mb-1 font-bold mt-2" htmlFor="badge_number">Badge Number :</label>
                            <input
                                type="text"
                                id="badge_number"
                                name="badge_number"
                                value={formData.badge_number || ''}
                                onChange={handleFormChange}
                                placeholder="Badge Number"
                                className="w-2/3 p-2 border"
                            />
                        </div>

                        <div className="flex mb-2">
                            <label className="block w-1/3 mb-1 font-bold mt-2" htmlFor="rank">Rank :</label>
                            <input
                                type="text"
                                id="rank"
                                name="rank"
                                value={formData.rank || ''}
                                onChange={handleFormChange}
                                placeholder="Rank"
                                className="w-2/3 p-2 border"
                            />
                        </div>

                        <div className="flex mb-2">
                            <label className="block w-1/3 mb-1 font-bold mt-2 " htmlFor="department">Department :</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department || ''}
                                onChange={handleFormChange}
                                className="w-2/3 p-2 border"
                            >
                                <option value="">Select Department</option>
                                <option value="Patrol">Patrol</option>
                                <option value="CID">CID</option>
                                <option value="SWAT">SWAT</option>
                                <option value="Forensics">Forensics</option>
                                
                            </select>
                        </div>

                    


                        <div className="block mt-4">
                            <button type="submit" className="mr-2 px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                            <button onClick={() => setEditMode(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                        </div>
                        {errorMessage && (
                            <div className="block mt-4 nmb-4 p-2 bg-red-200 text-red-800 rounded">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </div>
            )}
            {deleteMode && (
                <div className="fixed inset-0 flex items-center justify-center px-8 bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this staff member?</p>
                        <div className="flex mt-4">
                            <button onClick={confirmDelete} className="mr-2 px-4 py-2 bg-red-600 text-white rounded">Confirm</button>
                            <button onClick={() => setDeleteMode(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Pagination Controls */}
            {!editMode && !deleteMode && (    // else the prev and the next buttons will clash with the pop-up
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
            )}
        </div>
    );
};

export default PoliceTable;
