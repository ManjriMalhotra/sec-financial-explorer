import { useRef } from 'react';
import { useCompany } from '../state/CompanyContext';
import { CompanyChart } from './CompanyChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function CompanySummary() {
  const { financials, status, error } = useCompany();
  const reportRef = useRef(null);

  if (status === 'idle') {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-slate-600">Search for a company to view its financial data.</div>
      </section>
    );
  }

  if (status === 'loading') {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-slate-700">Loading financial data...</div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm text-center" role="alert">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Company Not Found</h3>
        <p className="text-slate-500 max-w-sm">
          We couldn't find any financial data for your search. Please check the name or CIK and try again.
        </p>
      </section>
    );
  }

  if (status === 'success' && financials) {
    const { entityName, metrics } = financials;

    const exportToCSV = () => {
      if (!metrics) return;
      const headers = ['Metric', 'Value (USD)', 'Date'];
      const rows = Object.entries(metrics).map(([key, metric]) => {
        return [formatMetricLabel(key), metric ? metric.value : 'N/A', metric ? metric.date : 'N/A'];
      });
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${entityName.replace(/\s+/g, '_')}_Financials.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const exportToPDF = async () => {
      if (!reportRef.current) return;
      
      const element = reportRef.current;
      const originalPadding = element.style.padding;
      element.style.padding = '20px'; // Add padding for the snapshot
      
      const canvas = await html2canvas(element, { scale: 2 });
      
      element.style.padding = originalPadding; // Restore padding
      
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(data, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`${entityName.replace(/\s+/g, '_')}_Financial_Report.pdf`);
    };

    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div ref={reportRef} className="bg-white">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Company</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">{entityName}</h2>
            </div>
            <div className="flex gap-2 self-start sm:self-auto">
              <button onClick={exportToCSV} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                Export CSV
              </button>
              <button onClick={exportToPDF} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors">
                Export PDF
              </button>
            </div>
          </div>

          {metrics && Object.keys(metrics).length > 0 ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {Object.entries(metrics).map(([key, metric]) => (
                <div key={key} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-bold text-slate-700">{formatMetricLabel(key)}</p>
                  {metric ? (
                    <div className="mt-3">
                      <p className="text-2xl font-semibold text-slate-950">${formatNumber(metric.value)}</p>
                      <p className="mt-2 text-sm text-slate-500">{metric.date}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">N/A</p>
                  )}
                </div>
              ))}
            </div>
            
            <CompanyChart metrics={metrics} />
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-600">No financial metrics available.</p>
        )}
        </div>
      </section>
    );
  }

  return null;
}

function formatMetricLabel(key) {
  const labels = {
    revenues: 'Revenues',
    assets: 'Total Assets',
    liabilities: 'Total Liabilities',
    stockholders_equity: "Stockholders' Equity",
    net_income: 'Net Income',
  };
  return labels[key] || key.replace(/_/g, ' ').toUpperCase();
}

function formatNumber(num) {
  if (num === null || num === undefined) return 'N/A';
  return Math.round(num).toLocaleString('en-US');
}
