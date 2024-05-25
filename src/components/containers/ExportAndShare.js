import React from 'react';

const ExportAndShare = ({ onExport, onGenerateLink }) => {
    return (
        <div className="export-and-share">
            <h2>Export and Share</h2>
            <button onClick={() => onExport('pdf')}>Export as PDF</button>
            <button onClick={() => onExport('csv')}>Export as CSV</button>
            <button onClick={onGenerateLink}>Generate Shareable Link</button>
        </div>
    );
};

export default ExportAndShare;
