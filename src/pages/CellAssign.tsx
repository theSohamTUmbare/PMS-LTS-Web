import React from 'react';
import CellSelection from '../components/AddingPrisoner/CellSelection';

const CellAssign: React.FC = () => {
    return (
        <div className="mx-6 sm:mx-12 my-8">
            <h1 className="text-xl font-semibold mb-4">Assign cells</h1>
            <CellSelection />
        </div>
    );
};

export default CellAssign;
