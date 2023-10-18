import React from 'react';

class DataListComponent extends React.Component {
    render() {
        return (
            <div className="dataList">
                <ul style={{overflowY: 'scroll', maxHeight: '200px'}}>
                    {/* Example data list */}
                    <li>Data 1</li>
                    <li>Data 2</li>
                    <li>Data 3</li>
                    {/* ... */}
                </ul>
            </div>
        );
    }
}

export default DataListComponent;
