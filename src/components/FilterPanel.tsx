import PrisonerFilter from "./Filters/PrisonerFilter";
import PoliceFilter from "./Filters/PoliceFilter";
import GuardFilter from "./Filters/GuardFilter";

interface FilterPanelProps {
    selectedTab: 'prisoners' | 'police' | 'guards';
}

const FilterPanel: React.FC<FilterPanelProps> = ({ selectedTab }) => {
    return (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
            <div className="grid grid-cols-2 gap-4">
                {selectedTab === 'prisoners' && (
                    <PrisonerFilter />
                )}
                {selectedTab === 'police' && (
                    <PoliceFilter />
                )}
                {selectedTab === 'guards' && (
                    <GuardFilter />
                )}
            </div>
            <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Apply Filters</button>
            </div>
        </div>
    );
};

export default FilterPanel;
