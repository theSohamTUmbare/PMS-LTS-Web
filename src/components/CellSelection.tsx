import React, { useState, useEffect } from "react";
import CellCard, { Cell } from "./CellCard";
import Modal from "./Modal";

const cellsData: Cell[] = [
  { cell_id: 1, block: "A", capacity: 4, current_occupants: 1, security_level: "High" },
  { cell_id: 2, block: "A", capacity: 3, current_occupants: 1, security_level: "Medium" },
  { cell_id: 3, block: "A", capacity: 5, current_occupants: 4, security_level: "Low" },
  { cell_id: 4, block: "B", capacity: 2, current_occupants: 1, security_level: "High" },
  { cell_id: 5, block: "B", capacity: 5, current_occupants: 3, security_level: "Medium" },
  { cell_id: 6, block: "B", capacity: 6, current_occupants: 2, security_level: "Low" },
  { cell_id: 7, block: "C", capacity: 4, current_occupants: 0, security_level: "High" },
  { cell_id: 8, block: "C", capacity: 3, current_occupants: 2, security_level: "Medium" },
  { cell_id: 9, block: "C", capacity: 6, current_occupants: 3, security_level: "Low" },
  { cell_id: 10, block: "D", capacity: 2, current_occupants: 1, security_level: "High" },
  { cell_id: 11, block: "D", capacity: 5, current_occupants: 3, security_level: "Medium" },
  { cell_id: 12, block: "D", capacity: 4, current_occupants: 4, security_level: "Low" },
];

const CellSelection: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [sortedCells, setSortedCells] = useState<Cell[]>([]);
  const [sortOption, setSortOption] = useState<"occupants" | "security">("occupants");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCells = () => {
    const data = cellsData.filter((cell) => cell.block === selectedBlock);
    setSortedCells(data);
  };

  useEffect(() => {
    if (selectedBlock) fetchCells();
  }, [selectedBlock]);

  useEffect(() => {
    const sorted = [...sortedCells].sort((a, b) => {
      if (sortOption === "occupants") {
        return -1*((a.capacity - a.current_occupants) - (b.capacity - b.current_occupants));
      } else if (sortOption === "security") {
        // Define securityOrder with explicit key types
        const securityOrder: { [key in Cell['security_level']]: number } = {
          High: 3,
          Medium: 2,
          Low: 1,
        };
        return securityOrder[b.security_level] - securityOrder[a.security_level];
      }
      return 0;
    });
    setSortedCells(sorted);
  }, [sortOption, sortedCells]);
  

  const handleAssign = (cellId: number) => {
    console.log(`Cell ${cellId} assigned!`);
    setModalOpen(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-50 shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Assign Cell to Prisoner</h2>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 mx-auto"
          onClick={() => setModalOpen(true)}
        >
          Assign Cell
        </button>
      </div>


      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4">Select Block and Cell</h3>

        <label className="block font-semibold mb-2">Select Block:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          value={selectedBlock}
          onChange={(e) => {
            setSelectedBlock(e.target.value);
          }}
        >
          <option value="">Select a Block</option>
          <option value="A">Block A</option>
          <option value="B">Block B</option>
          <option value="C">Block C</option>
          <option value="D">Block D</option>
        </select>

        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Sort By:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOption("occupants")}
              className={`px-4 py-2 rounded-md ${sortOption === "occupants" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Less Crowded
            </button>
            <button
              onClick={() => setSortOption("security")}
              className={`px-4 py-2 rounded-md ${sortOption === "security" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Higher Security
            </button>
          </div>
        </div>

        <div>
          {sortedCells.length > 0 ? (
            sortedCells.map((cell) => (
              <CellCard key={cell.cell_id} cell={cell} onAssign={handleAssign} />
            ))
          ) : (
            <p className="text-gray-500">No cells available in this block.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CellSelection;
