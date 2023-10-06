import axios from 'axios';

export const fetchData = async (stockId, startDate, endDate) => {
  try {
    const payload = {
      data_fetcher_name: "yfinance_fetcher",
      args: [],
      kwargs: {
        stock_id: stockId,
        start_date: startDate,
        end_date: endDate,
      },
    };

    const response = await axios.post('http://localhost:8000/dataio_manager/fetch_data_from_source', payload);

    const payloadForDataframe = {
      data_fetcher_name: "yfinance_fetcher",
      args: [],
      kwargs: {},
    };

    const dataFrameResponse = await axios.post('http://localhost:8000/dataio_manager/get_as_dataframe', payloadForDataframe);

    const dataString = dataFrameResponse.data;
    const listDataParsed = JSON.parse(dataString);
    const closePrices = listDataParsed.map((item) => item.Close);
    const xData = closePrices.map((_, index) => index + 1);

    const plotData = [{
      type: 'scatter',
      mode: 'lines',
      x: xData,
      y: closePrices,
      line: {
        color: 'red',
      },
    }];

    return plotData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchMaChartData = async (stockId, startDate, endDate) => {
  try {
    const BASE_URL = 'http://localhost:8000';
    const fullAnalysisPayload = {
      stock_id: stockId,
      start_date: startDate,
      end_date: endDate,
      window_sizes: [5, 10, 20],
    };

    const response = await axios.post(`${BASE_URL}/stock_analyzer/full_analysis`, fullAnalysisPayload);

    const rawData = response.data;
    const sanitizedData = rawData.replace(/NaN/g, 'null');
    const maListDataParsed = JSON.parse(sanitizedData);

    if (!Array.isArray(maListDataParsed)) {
      console.error("Unexpected data format:", maListDataParsed);
      throw new Error("Unexpected data format");
    }

    const xData = maListDataParsed.map((_, index) => index + 1);

    const ma5PlotData = {
      type: 'scatter',
      mode: 'lines',
      name: 'MA 5 days',
      x: xData,
      y: maListDataParsed.map(item => item.MA_5_days),
      line: {
        color: '#42bb9f',
        dash: 'dash',
      },
    };

    const ma10PlotData = {
      type: 'scatter',
      mode: 'lines',
      name: 'MA 10 days',
      x: xData,
      y: maListDataParsed.map(item => item.MA_10_days),
      line: {
        color: '#1996aa',
        dash: 'dash',
      },
    };

    const ma20PlotData = {
      type: 'scatter',
      mode: 'lines',
      name: 'MA 20 days',
      x: xData,
      y: maListDataParsed.map(item => item.MA_20_days),
      line: {
        color: '#0737d6',
        dash: 'dash',
      },
    };

    return [ma5PlotData, ma10PlotData, ma20PlotData];
  } catch (error) {
    console.error("Error fetching or calculating MA data:", error);
    throw error;
  }
};
