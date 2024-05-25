import React, { useState } from 'react';

const InteractiveAnalysis = ({ onFilter, onSort, onAdjustParameters }) => {
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const [parameters, setParameters] = useState({ learningRate: 0.01, batchSize: 32 });

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        onFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        onSort(e.target.value);
    };

    const handleParameterChange = (e) => {
        setParameters({ ...parameters, [e.target.name]: e.target.value });
        onAdjustParameters({ ...parameters, [e.target.name]: e.target.value });
    };

    return (
        <div className="interactive-analysis">
            <h2>Interactive Analysis</h2>
            <div>
                <label>Filter Models:</label>
                <input type="text" value={filter} onChange={handleFilterChange} />
            </div>
            <div>
                <label>Sort By:</label>
                <input type="text" value={sort} onChange={handleSortChange} />
            </div>
            <div>
                <label>Learning Rate:</label>
                <input type="number" name="learningRate" value={parameters.learningRate} onChange={handleParameterChange} />
            </div>
            <div>
                <label>Batch Size:</label>
                <input type="number" name="batchSize" value={parameters.batchSize} onChange={handleParameterChange} />
            </div>
        </div>
    );
};

export default InteractiveAnalysis;
