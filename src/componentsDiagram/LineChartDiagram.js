import React from 'react';
import Plot from 'react-plotly.js';

class LineChartDiagram extends React.Component {
    render() {
        // Dummy data for plotly chart
        const data = [{
            x: [1, 2, 3, 4, 5],
            y: [1, 6, 3, 6, 1],
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'red'},
        }];

        const layout = {
            title: 'A Simple Plotly Chart',
        };

        return (
            <div className="chartDisplay">
                {/* 圖表呈現區塊 */}
                <Plot data={data} layout={layout} />
            </div>
        );
    }
}

export default LineChartDiagram;
