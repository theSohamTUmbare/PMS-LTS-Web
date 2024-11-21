import React, { useState } from "react";
import AddPrisonerForm from "./AddingPrisoner/AddPrisonerForm";
import axios from "axios";

interface SearchAndActionButtonsProps {
  selectedTab: "prisoners" | "police" | "guards";
  filterVisible: boolean;
  setFilterVisible: (visible: boolean) => void;
}

const SearchAndActionButtons: React.FC<SearchAndActionButtonsProps> = ({
  selectedTab,
  filterVisible,
  setFilterVisible,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchPlaceholders = {
    prisoners: "Search prisoner",
    police: "Search police officer",
    guards: "Search guard",
  };

  const createNewLabels = {
    prisoners: "Create New Prisoner",
    police: "Create New Police Officer",
    guards: "Create New Guard",
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePrisonerSubmit = async (prisonerData: any) => {
    try {
      // First, create the prisoner
      const prisonerResponse = await axios.post(
        "/api/v1/prisoner/add",
        prisonerData
      );

      if (prisonerResponse.status === 200) {
        alert("Prisoner created successfully!");

        // Extract the cell ID from prisonerData
        const cellId = prisonerData.cell_id;
        console.log(prisonerData);

        // Now, call the second API to update the cell occupant
        const cellResponse = await axios.get(
          `/api/v1/cell_controls/addOccupant/${cellId}`
        );

        if (cellResponse.status === 200) {
          alert("Cell occupant updated successfully!");
        } else {
          console.error(
            "Error updating cell occupant:",
            cellResponse.statusText
          );
        }
      } else {
        console.error("Error creating prisoner:", prisonerResponse.statusText);
      }
    } catch (error) {
      console.error("Error in handlePrisonerSubmit:", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder={searchPlaceholders[selectedTab]}
        className="border border-gray-300 rounded-md px-4 py-2"
      />

      {/* Create New Button */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={openModal}
      >
        {createNewLabels[selectedTab]}
      </button>

      {/* Filter Button */}
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded-md"
        onClick={() => setFilterVisible(!filterVisible)}
      >
        Filter
      </button>

      {/* Modal for Adding New Prisoner */}
      <AddPrisonerForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handlePrisonerSubmit}
      />
    </div>
  );
};

export default SearchAndActionButtons;
