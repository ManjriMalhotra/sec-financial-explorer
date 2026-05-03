import { useState, useEffect } from 'react';
import { useCompany } from '../state/CompanyContext';

export function CompanySearch() {
  const [inputValue, setInputValue] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { fetchCompanyData, status, error } = useCompany();

  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchCompanyData(inputValue);
      setInputValue('');
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm relative">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
          Company search
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">Enter a company CIK or name</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Try Apple, Microsoft, or a 10-digit CIK like 0000320193.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="company-input" className="block text-sm font-medium text-slate-700">
          Company Name or CIK
        </label>
        <input
          id="company-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., Apple or 0000320193"
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          disabled={status === 'loading'}
        />

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-3xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          disabled={status === 'loading' || !inputValue.trim()}
        >
          {status === 'loading' ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-white shadow-2xl transition-all sm:bottom-10" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-base tracking-tight">Company not found</p>
            <p className="text-sm text-slate-300">{error}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-4 p-1 text-slate-400 hover:text-white transition-colors" aria-label="Close">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
