import { createContext, useContext, useState, useCallback } from 'react';
import { fetchCompanyFacts, resolveCompanyInput, extractFinancials } from '../services/secApi';

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const [query, setQuery] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const fetchCompanyData = useCallback(async (cikOrName) => {
    setQuery(cikOrName);
    setStatus('loading');
    setError(null);
    setCompanyData(null);
    setFinancials(null);

    try {
      // Resolve Company input to a valid CIK value
      const cik = await resolveCompanyInput(cikOrName);

      // Fetch raw data from SEC EDGAR API
      const data = await fetchCompanyFacts(cik);

      // Extract clean financials
      const extracted = extractFinancials(data);

      setCompanyData(data);
      setFinancials(extracted);
      setStatus('success');
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load company data');
      setStatus('error');
    }
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        query,
        companyData,
        financials,
        status,
        error,
        fetchCompanyData,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
