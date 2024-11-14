import CellCard, { Cell } from "./CellCard";

interface CellListProps {
  cells: Cell[];
  onAssign: (cellId: number) => void;
}

const CellList: React.FC<CellListProps> = ({ cells, onAssign }) => (
  <div>
    {cells.length > 0 ? (
      cells.map((cell) => <CellCard key={cell.cell_id} cell={cell} onAssign={onAssign} />)
    ) : (
      <p className="text-gray-500">No cells available in this block.</p>
    )}
  </div>
);

export default CellList;
