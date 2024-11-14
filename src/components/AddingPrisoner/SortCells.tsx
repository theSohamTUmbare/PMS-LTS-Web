interface SortButtonsProps {
  sortOption: "occupants" | "security";
  setSortOption: (option: "occupants" | "security") => void;
}

const SortCells: React.FC<SortButtonsProps> = ({ sortOption, setSortOption }) => (
  <div className="flexjustify-between items-center mb-4">
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
);

export default SortCells;
