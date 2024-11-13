import React, { useEffect, useState } from "react";

interface BlockSelectorProps {
  selectedBlock: string;
  onChange: (block: string) => void;
}

const CellBlockSelector: React.FC<BlockSelectorProps> = ({ selectedBlock, onChange }) => {
  const [blocks, setBlocks] = useState<string[] | undefined>(undefined); // Initialize as undefined
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const response = await fetch("/api/v1/cell_controls/blocks"); 
        const data = await response.json();
        setBlocks(data.data); // { blocks: ["A", "B", "C", "D"] }
        console.log(blocks)
      } catch (error) {
        setError("Error fetching blocks");
        console.error("Error fetching blocks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlocks();
  }, []);

  // Check if blocks is defined and has content before rendering
  if (loading) {
    return <p>Loading blocks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!blocks || blocks.length === 0) {
    return <p>No blocks available</p>;
  }

  return (
    <div>
      <label className="block font-semibold mb-2">Select Block:</label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={selectedBlock}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Block</option>
        {blocks.map((block) => (
          <option key={block} value={block}>{`Block ${block}`}</option>
        ))}
      </select>
    </div>
  );
};

export default CellBlockSelector;
