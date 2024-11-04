const GuardFilter: React.FC = () => {
    return (
        <>
        <div>
            <label className="block text-gray-700">Shift</label>
            <select className="border border-gray-300 rounded-md px-4 py-2 w-full">
                <option value="">All</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
            </select>
        </div>
        <div>
            <label className="block text-gray-700">Experience</label>
            <input type="text" className="border border-gray-300 rounded-md px-4 py-2 w-full"/>
        </div>
    </>
    );
  };
  
  
  export default GuardFilter;