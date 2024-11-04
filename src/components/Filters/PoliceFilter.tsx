const PoliceFilter: React.FC = () => {
    return (
        <>
        <div>
            <label className="block text-gray-700">Badge Number</label>
            <input type="text" className="border border-gray-300 rounded-md px-4 py-2 w-full"/>
        </div>
        <div>
            <label className="block text-gray-700">Rank</label>
            <select className="border border-gray-300 rounded-md px-4 py-2 w-full">
                <option value="">All</option>
                <option value="Officer">Officer</option>
                <option value="Sergeant">Sergeant</option>
            </select>
        </div>
    </>
    );
  };
  
  
  export default PoliceFilter;