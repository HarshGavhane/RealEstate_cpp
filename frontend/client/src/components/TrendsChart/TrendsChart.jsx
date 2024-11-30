import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register necessary chart elements
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const TrendsChart = ({ data }) => {
  // Prepare data for the chart
  const chartData = {
    labels: data.map(item => item.Date),  // Dates for x-axis
    datasets: [
      {
        label: "Average Price",
        data: data.map(item => item.AveragePrice),  // Prices for y-axis
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,  // Add smooth curves to the lines
        pointRadius: 4, // Add points at data values
        pointHoverRadius: 6, // Increase point size on hover
        borderWidth: 2,  // Line thickness
        hoverBackgroundColor: 'rgba(75,192,192,0.4)', // Highlight the point on hover
      },
      {
        label: "Demand",
        data: data.map(item => item.Demand),  // Demand for y-axis
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
        tension: 0.4,  // Add smooth curves to the lines
        pointRadius: 4, // Add points at data values
        pointHoverRadius: 6, // Increase point size on hover
        borderWidth: 2,  // Line thickness
        hoverBackgroundColor: 'rgba(255,99,132,0.4)', // Highlight the point on hover
      },
    ],
  };

  // Define chart options for customization
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Market Price and Demand Trends',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem) {
            if (tooltipItem.datasetIndex === 0) {
              return 'Price: $' + tooltipItem.raw.toLocaleString();
            } else {
              return 'Demand: ' + tooltipItem.raw;
            }
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: { weight: 'bold', size: 14 },
          color: '#333',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Limit number of x-axis ticks to avoid overcrowding
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price / Demand',
          font: { weight: 'bold', size: 14 },
          color: '#333',
        },
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            if (typeof value === 'number') {
              return '$' + value.toLocaleString(); // Format price with dollar sign
            }
            return value;
          }
        }
      }
    },
    animation: {
      duration: 1000, // Smooth chart animation
    },
    elements: {
      point: {
        radius: 5, // Point size for the data points
      }
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default TrendsChart;
