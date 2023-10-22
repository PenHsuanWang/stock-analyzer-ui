// src/components/Charts/CandlestickDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

function CandlestickDiagram({ data }) {
    const trace = {
        x: data.dates,
        close: data.close,
        high: data.high,
        low: data.low,
        open: data.open,
        type: 'candlestick',
        name: 'Candlestick Chart'
    };

    const layout = {
        title: 'Candlestick Chart Example',
        xaxis: {
            title: 'Date',
            rangeslider: { visible: false }
        },
        yaxis: {
            title: 'Price'
        }
    };

    return (
        <Plot
            data={[trace]}
            layout={layout}
            style={{ width: '100%', height: '400px' }}
        />
    );
}

export default CandlestickDiagram;
