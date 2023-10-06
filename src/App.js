import React, { useState } from 'react';
import './App.css';
import Plot from 'react-plotly.js';
import axios from 'axios';

function App() {
  const [chartData, setChartData] = useState([]);
  const [maChartData, setMaChartData] = useState([]);
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchChartData = () => {
    return new Promise((resolve, reject) => {
      const payload = {
        data_fetcher_name: "yfinance_fetcher",
        args: [],
        kwargs: {
          stock_id: stockId,
          start_date: startDate,
          end_date: endDate
        }
      };
  
      axios.post('http://localhost:8000/dataio_manager/fetch_data_from_source', payload)
        .then(() => {
          const payloadForDataframe = {
            data_fetcher_name: "yfinance_fetcher",
            args: [],
            kwargs: {}
          };
  
          return axios.post('http://localhost:8000/dataio_manager/get_as_dataframe', payloadForDataframe);
        })
        .then(response => {
          const dataString = response.data;
          const listDataParsed = JSON.parse(dataString);
          const closePrices = listDataParsed.map(item => item.Close);
          const xData = closePrices.map((_, index) => index + 1);
  
          const plotData = [{
            type: 'scatter',
            mode: 'lines',
            x: xData,
            y: closePrices,
            line: { 
              color: 'red' 
            }
          }];
  
          // Instead of setting state directly, resolve the promise
          resolve(plotData);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          reject(error);
        });
    });
  };  

  const fetchMaChartData = () => {
    return new Promise((resolve, reject) => {
      const BASE_URL = 'http://localhost:8000';
      const fullAnalysisPayload = {
        stock_id: stockId,
        start_date: startDate,
        end_date: endDate,
        window_sizes: [5, 10, 20]
      };
    
      axios.post(`${BASE_URL}/stock_analyzer/full_analysis`, fullAnalysisPayload)
        .then(response => {
          const rawData = response.data;
          const sanitizedData = rawData.replace(/NaN/g, 'null');
          const maListDataParsed = JSON.parse(sanitizedData);
    
          if (!Array.isArray(maListDataParsed)) {
            console.error("Unexpected data format:", maListDataParsed);
            reject(new Error("Unexpected data format"));
            return;
          }
    
          const xData = maListDataParsed.map((_, index) => index + 1);
    
          const ma5PlotData = {
            type: 'scatter',
            mode: 'lines',
            name: 'MA 5 days',
            x: xData,
            y: maListDataParsed.map(item => item.MA_5_days),
            line: { 
              color: '#42bb9f', // red color using color code
              dash: 'dash'  // dashed line
            }
          };
          
          const ma10PlotData = {
            type: 'scatter',
            mode: 'lines',
            name: 'MA 10 days',
            x: xData,
            y: maListDataParsed.map(item => item.MA_10_days),
            line: { 
              color: '#1996aa', // red color using color code
              dash: 'dash'  // dashed line
            }
          };
    
          const ma20PlotData = {
            type: 'scatter',
            mode: 'lines',
            name: 'MA 20 days',
            x: xData,
            y: maListDataParsed.map(item => item.MA_20_days),
            line: { 
              color: '#0737d6', // red color using color code
              dash: 'dash'  // dashed line
            }
          };
  
          resolve([ma5PlotData, ma10PlotData, ma20PlotData]);
        })
        .catch(error => {
          console.error("Error fetching or calculating MA data:", error);
          reject(error);
        });
    });
  };

  const fetchData = () => {
    Promise.all([fetchChartData(), fetchMaChartData()])
      .then((results) => {
        setChartData([...results[0], ...results[1]]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  

  const layout = {
    title: 'Basic Plotly Line Chart',
    xaxis: {
      title: 'X Axis Label'
    },
    yaxis: {
      title: 'Y Axis Label'
    }
  };

  return (
    <div className="App">
      <header className="App-header">Website Logo & Navigation</header>
      <nav>Navigation Bar / Menu</nav>
      
      <div className="App-content">
        <aside>
          Sidebar Content (e.g., related links, ads)
        </aside>
        <main className="Main-content">
          <div>
            <input
              type="text"
              value={stockId}
              onChange={(e) => setStockId(e.target.value)}
              placeholder="Stock ID (e.g., AAPL)"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <button onClick={fetchData}>Search</button>
          </div>

          <Plot
            data={chartData}
            layout={layout}
            style={{ width: '80%', height: '400px' }}
          />

          {/* <Plot
            data={chartData}
            layout={layout}
            style={{ width: '80%', height: '400px' }}
          />
          <Plot
            data={maChartData}
            layout={{...layout, title: 'Moving Average Chart'}}
            style={{ width: '80%', height: '400px', marginTop: '20px' }}
          /> */}


        </main>
      </div>
      
      <footer>
        Footer Content
      </footer>
    </div>
  );
}

export default App;
