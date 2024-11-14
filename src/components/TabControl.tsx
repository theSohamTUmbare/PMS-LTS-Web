import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TabControlsProps {
    selectedTab: 'prisoners' | 'police' | 'guards';
    setSelectedTab: (tab: 'prisoners' | 'police' | 'guards') => void;
}

interface StaffResponse {
    totalStaff: number;
}

const TabControls: React.FC<TabControlsProps> = ({ selectedTab, setSelectedTab }) => {
    const [totalPrisoners, setTotalPrisoners] = useState<number>(0);
    const [totalGuards, setTotalGuards] = useState<number>(0);
    const [totalPolice, setTotalPolice] = useState<number>(0);

    const fetchCount = async () => {
        try {
            const prisonerResponse = await axios.get<{ totalPrisoners: number }>('/api/v1/prisoner/all');
            setTotalPrisoners(prisonerResponse.data.totalPrisoners);

            const guardResponse = await axios.get<StaffResponse>('/api/v1/staff/getbyRole/Guard');
            setTotalGuards(guardResponse.data.totalStaff);

            const policeResponse = await axios.get<StaffResponse>('/api/v1/staff/getbyRole/Police');
            setTotalPolice(policeResponse.data.totalStaff);
        } catch (error) {
            console.error("Failed to fetch count", error);
        }
    };

    useEffect(() => {
        fetchCount();
    }, []);

    return (
        <div className="flex items-center space-x-8 mb-1 pt-5 pl-6">

            <div
                className={`flex items-center space-x-4 cursor-pointer ${selectedTab === 'prisoners' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('prisoners')}
            >
                <span>Prisoners</span>
                <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">{totalPrisoners}</span>
            </div>


            <div
                className={`flex items-center space-x-4 cursor-pointer ${selectedTab === 'police' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('police')}
            >
                <span>Police</span>
                <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">{totalPolice}</span>
            </div>


            <div
                className={`flex items-center space-x-4 cursor-pointer ${selectedTab === 'guards' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('guards')}
            >
                <span>Guards</span>
                <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">{totalGuards}</span>
            </div>
        </div>
    );
};

export default TabControls;
