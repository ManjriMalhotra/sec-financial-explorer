import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function CompanyChart({ metrics }) {
  if (!metrics || Object.keys(metrics).length === 0) return null;

  const labels = [];
  const dataValues = [];

  const formatMetricLabel = (key) => {
    const labelsDict = {
      revenues: 'Revenues',
      assets: 'Total Assets',
      liabilities: 'Total Liabilities',
      stockholders_equity: "Stockholders' Equity",
      net_income: 'Net Income',
    };
    return labelsDict[key] || key.replace(/_/g, ' ').toUpperCase();
  };

  Object.entries(metrics).forEach(([key, metric]) => {
    labels.push(formatMetricLabel(key));
    dataValues.push(metric ? metric.value : 0);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Value',
        data: dataValues,
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)', // Indigo
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(244, 63, 94, 0.8)',  // Rose
          'rgba(245, 158, 11, 0.8)', // Amber
          'rgba(59, 130, 246, 0.8)', // Blue
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Latest Financial Metrics',
        color: '#475569',
        font: {
          size: 16,
          weight: '600'
        },
        padding: { top: 0, bottom: 20 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.parsed.y !== null) {
              return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            if (value >= 1e9 || value <= -1e9) {
              return '$' + (value / 1e9).toFixed(1) + 'B';
            }
            if (value >= 1e6 || value <= -1e6) {
              return '$' + (value / 1e6).toFixed(1) + 'M';
            }
            return '$' + value;
          }
        }
      }
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 h-[250px] sm:h-[350px] md:h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
}
