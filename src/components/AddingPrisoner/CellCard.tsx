import React from "react";

export type Cell = {
  cell_id: number;
  block: string;
  capacity: number;
  current_occupants: number;
  security_level: string;
};

type CellCardProps = {
  cell: Cell;
  onAssign: (cellId: number) => void;
};

const CellCard: React.FC<CellCardProps> = ({ cell, onAssign }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-3">
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold">Cell ID: {cell.cell_id}</h4>
          <p>Capacity: {cell.capacity}</p>
          <p>Current Occupants: {cell.current_occupants}</p>
          <p>Security Level: {cell.security_level}</p>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded-md"
          onClick={() => onAssign(cell.cell_id)}
        >
          Assign
        </button>
      </div>
    </div>
  );
};

export default CellCard;
