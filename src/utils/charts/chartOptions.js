// At the top of your chart component or in a separate configuration file
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register all components, or individually pick the parts you need, such as the time scale
Chart.register(...registerables);


// Shared chart options for both RSI and MACD charts
export const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy-MM-dd',
          displayFormats: {
            day: 'yyyy-MM-dd',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxRotation: 0,
        },
      },
      // ... other scales for Y-axis if needed
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title', // This will be overridden in individual charts
      },
    },
    // ... other shared options
  };
  
// Shared chart options for both RSI and MACD charts
export const getChartOptions = (titleText) => {
  const options = JSON.parse(JSON.stringify(chartOptions)); // Deep copy the shared options
  options.plugins.title.text = titleText; // Customize the title
  // Add any other customizations here
  return options;
};
