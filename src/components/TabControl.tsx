import React from 'react';

interface TabControlsProps {
    selectedTab: 'prisoners' | 'police' | 'guards';
    setSelectedTab: (tab: 'prisoners' | 'police' | 'guards') => void;
}

const TabControls: React.FC<TabControlsProps> = ({ selectedTab, setSelectedTab }) => {
    return (
        <div className="flex items-center space-x-8 mb-1 pt-5 pl-6">
            {/* Prisoner Tab */}
            <div
                className={`flex items-center space-x-4 cursor-pointer ${selectedTab === 'prisoners' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('prisoners')}
            >
                <span>Prisoners</span>
                <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">10</span>
            </div>

            {/* Police Tab */}
            <div
                className={`flex items-center space-x-4 cursor-pointer ${selectedTab === 'police' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('police')}
            >
                <span>Police</span>
                <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">5</span>
            </div>

            {/* Guard Tab */}
            <div
                className={`flex items-center space-x-4 cursor-pointer ${selectedTab === 'guards' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('guards')}
            >
                <span>Guards</span>
                <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">7</span>
            </div>
        </div>
    );
};

export default TabControls;
