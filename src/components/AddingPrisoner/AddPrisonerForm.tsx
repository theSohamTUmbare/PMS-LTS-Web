import React, { useState } from "react";
import CellSelection from "./CellSelection"; 
import CountrySelector from "./CountrySelector";

interface PrisonerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prisonerData: any) => void;
  existingPrisonerData?: { 
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    national_id: string;
    entry_date: string;
    status: string;
    cell_id: number;
  };
}

const AddPrisonerForm: React.FC<PrisonerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingPrisonerData,
}) => {
  const [formData, setFormData] = useState({
    first_name: existingPrisonerData?.first_name || "",
    last_name: existingPrisonerData?.last_name || "",
    date_of_birth: existingPrisonerData?.date_of_birth || "",
    gender: existingPrisonerData?.gender || "",
    national_id: existingPrisonerData?.national_id || "",
    entry_date: existingPrisonerData?.entry_date || "",
    status: existingPrisonerData?.status || "",
    cell_id: existingPrisonerData?.cell_id || "",
  });


  const [cellSelectionOpen, setCellSelectionOpen] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: { target: { name: string; value: string } }  
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleCellAssign = (cellId: number) => {
    setFormData({ ...formData, cell_id: cellId.toString() });
    setCellSelectionOpen(false); // Close the cell selection modal after choosing
  };

  const handleSubmit = () => {
    onSubmit(formData); // Call the parent onSubmit function with formData
    onClose();
  };

  return (
    <div className="fixed top-[-10px] right-[-10px] bottom-[-10px] left-[-20px] bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          Create New Prisoner
        </h2>

        <form className="space-y-3 md:space-y-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />

          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />

          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Gender
          </label>
          <select
            name="gender"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* <label className="block text-gray-700 text-sm font-semibold mb-1">
            Nationality
          </label>
          <select
            name="national_id"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Nationality</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="India">India</option>
            Add more countries as needed 
          </select> */}

          <CountrySelector handleChange={handleChange} />

          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Date of Entry
          </label>
          <input
            type="date"
            name="entry_date"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
{/* 
          <input
            type="text"
            name="status"
            placeholder="Status"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          /> */}

          <select
            name="status"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Status</option>
            <option value="On Trial">On Trial</option>
            <option value="Incarcerated">Incarcerated</option>
            <option value="Transferred">Transferred</option>
            <option value="Released">Released</option>
          </select>

          <div>
            <button
              type="button"
              onClick={() => setCellSelectionOpen(true)}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {formData.cell_id
                ? `Cell ID: ${formData.cell_id}`
                : "Select Cell ID"}
            </button>
          </div>

          <div className="flex justify-end space-x-3 md:space-x-4 mt-4 md:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 md:px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-3 md:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
        {/* Cell Selection Modal */}
        {cellSelectionOpen && (
          <CellSelection
            onAssign={handleCellAssign}
            onClose={() => setCellSelectionOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AddPrisonerForm;
