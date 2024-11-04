import React from 'react';

interface SearchAndActionButtonsProps {
    selectedTab: 'prisoners' | 'police' | 'guards';
    filterVisible: boolean;
    setFilterVisible: (visible: boolean) => void;
}

const SearchAndActionButtons: React.FC<SearchAndActionButtonsProps> = ({ selectedTab, filterVisible, setFilterVisible }) => {
    const searchPlaceholders = {
        prisoners: "Search prisoner",
        police: "Search police officer",
        guards: "Search guard"
    };

    const createNewLabels = {
        prisoners: "Create New Prisoner",
        police: "Create New Police Officer",
        guards: "Create New Guard"
    };

    return (
        <div className="flex items-center space-x-4">
            <input
                type="text"
                placeholder={searchPlaceholders[selectedTab]}
                className="border border-gray-300 rounded-md px-4 py-2"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                {createNewLabels[selectedTab]}
            </button>
            <button
                className="bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={() => setFilterVisible(!filterVisible)}
            >
                Filter
            </button>
        </div>
    );
};

export default SearchAndActionButtons;
