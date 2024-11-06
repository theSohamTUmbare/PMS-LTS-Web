import { useState } from 'react';
import PrisonerTable from './Tables/PrisonerTable';
import PoliceTable from './Tables/PoliceTable';
import GuardTable from './Tables/GuardTable';
import TabControls from './TabControl';
import SearchAndActionButtons from './SeachAndActionButtons';
import FilterPanel from './FilterPanel';

const Dashboard: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'prisoners' | 'police' | 'guards'>('prisoners');
    const [filterVisible, setFilterVisible] = useState(false);

    return (
        <div className="p-4 mt-3">
            {/* Tab Controls */}
            <div className="flex items-center justify-between">
                <TabControls selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

                {/* Search, Action, and Filter Buttons */}
                <SearchAndActionButtons 
                    selectedTab={selectedTab} 
                    filterVisible={filterVisible} 
                    setFilterVisible={setFilterVisible} 
                />
            </div>

            {/* Filter Panel */}
            {filterVisible && <FilterPanel selectedTab={selectedTab} />}

            {/* Conditional Table Rendering */}
            {selectedTab === 'prisoners' && <PrisonerTable />}
            {selectedTab === 'police' && <PoliceTable />}
            {selectedTab === 'guards' && <GuardTable />}
        </div>
    );
};

export default Dashboard;
