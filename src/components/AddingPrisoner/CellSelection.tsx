import React, { useState, useEffect } from "react";
import CellBlockSelector from "./CellBlockSelector";
import SortCells from "./SortCells";
import CellList from "./CellList";
import { Cell } from "./CellCard";
import Modal from "../Modal";

// const cellsData: Cell[] = [
//   { cell_id: 1, block: "A", capacity: 4, current_occupants: 1, security_level: "High" },
//   { cell_id: 2, block: "A", capacity: 3, current_occupants: 1, security_level: "Medium" },
//   { cell_id: 3, block: "A", capacity: 5, current_occupants: 4, security_level: "Low" },
//   { cell_id: 4, block: "B", capacity: 2, current_occupants: 1, security_level: "High" },
//   { cell_id: 5, block: "B", capacity: 5, current_occupants: 3, security_level: "Medium" },
//   { cell_id: 6, block: "B", capacity: 6, current_occupants: 2, security_level: "Low" },
//   { cell_id: 7, block: "C", capacity: 4, current_occupants: 0, security_level: "High" },
//   { cell_id: 8, block: "C", capacity: 3, current_occupants: 2, security_level: "Medium" },
//   { cell_id: 9, block: "C", capacity: 6, current_occupants: 3, security_level: "Low" },
//   { cell_id: 10, block: "D", capacity: 2, current_occupants: 1, security_level: "High" },
//   { cell_id: 11, block: "D", capacity: 5, current_occupants: 3, security_level: "Medium" },
//   { cell_id: 12, block: "D", capacity: 4, current_occupants: 4, security_level: "Low" },
// ];

// Define the props interface for CellSelection
interface CellSelectionProps {
  onAssign: (cellId: number) => void;
  onClose: () => void;
}


const CellSelection: React.FC<CellSelectionProps> = ({ onAssign, onClose }) => {
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [sortedCells, setSortedCells] = useState<Cell[]>([]);
  const [sortOption, setSortOption] = useState<"occupants" | "security">("occupants");
  const [modalOpen, setModalOpen] = useState(true);

  const fetchCells = async () => {
    try {
      console.log("Selected block:", selectedBlock, "Type:", typeof selectedBlock);
      const response = await fetch(`/api/v1/cell_controls/block?block=${selectedBlock}`);
      const data = await response.json();
      console.log(data)
      setSortedCells(data.data); // Assuming response is { cells: [...] }
    } catch (error) {
      console.error("Error fetching cells:", error);
    }
  };

  useEffect(() => {
    if (selectedBlock) fetchCells();
  }, [selectedBlock]);

  useEffect(() => {
    const sorted = [...sortedCells].sort((a, b) => {
      if (sortOption === "occupants") {
        return (a.current_occupants / a.capacity) - (b.current_occupants / b.capacity);
      }
  
      // Custom sorting for security levels
      const securityLevelOrder = { High: 1, Medium: 2, Low: 3 };
  
      // Use type assertion to ensure `security_level` is a valid key
      return securityLevelOrder[a.security_level as "High" | "Medium" | "Low"] - 
             securityLevelOrder[b.security_level as "High" | "Medium" | "Low"];
    });
  
    setSortedCells(sorted);
  }, [sortOption, selectedBlock]);
  
  
  const handleAssign = (cellId: number) => {
    onAssign(cellId); // Use the onAssign prop to pass cellId back
    setModalOpen(false);
    onClose(); // Close the modal
  };
  console.log(sortedCells)
  return (
    <>
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => setModalOpen(true)}
      >
        Open Cell Recommendation
      </button> */}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4">Select Block and Cell</h3>

        <CellBlockSelector selectedBlock={selectedBlock} onChange={setSelectedBlock} />
        <SortCells sortOption={sortOption} setSortOption={setSortOption} />
        <CellList cells={sortedCells} onAssign={handleAssign} />
      </Modal>
    </>
  );
};

export default CellSelection;