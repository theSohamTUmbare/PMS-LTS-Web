const PrisonerFilter: React.FC = () => {
  return (
    <>
      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Status</label>
        <select className="border border-gray-300 rounded-md px-4 py-2 w-full">
          <option value="">All</option>
          <option value="Incarcerated">Incarcerated</option>
          <option value="Released">Released</option>
        </select>
      </div>
    </>
  );
};


export default PrisonerFilter;