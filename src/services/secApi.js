/**
 * Fetch company facts from the SEC EDGAR API
 * @param {string} cik - 10-digit CIK number (with leading zeros)
 * @returns {Promise<object>} - Raw company facts JSON from SEC
 */
export async function fetchCompanyFacts(cik) {
  const response = await fetch(`/api/sec-facts?cik=${cik}`)
  console.log("response is", response)
  // headers: {
  //   'User-Agent': 'Mozilla/5.0 (compatible; FinancialExplorer/1.0)',
  // },


  if (!response.ok) {
    throw new Error(`SEC API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch company tickers and CIKs from local file
 * @returns {Promise<object>} - JSON mapping of company tickers
 */
export async function fetchCompanyTickers() {
  const url = '/company_tickers.json';
  const response = await fetch(url);
  console.log("response is", response)

  if (!response.ok) {
    throw new Error(`Tickers file error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Resolve a company input string into a valid 10-digit CIK.
 * Supports numeric CIK input, ticker symbols, or company names.
 * @param {string} input
 * @returns {Promise<string>}
 */
export async function resolveCompanyInput(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Enter a company name, ticker, or CIK.');
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length) {
    return digits.padStart(10, '0');
  }

  // Fetch tickers from local file
  const tickers = await fetchCompanyTickers();

  // Search by ticker (exact match, case insensitive)
  const tickerMatch = Object.values(tickers).find(company =>
    company.ticker.toLowerCase() === trimmed.toLowerCase()
  );

  if (tickerMatch) {
    return String(tickerMatch.cik_str).padStart(10, '0');
  }

  // Search by company name (contains, case insensitive)
  const nameMatch = Object.values(tickers).find(company =>
    company.title.toLowerCase().includes(trimmed.toLowerCase())
  );

  if (nameMatch) {
    return String(nameMatch.cik_str).padStart(10, '0');
  }

  throw new Error(
    'Company not found. Try a ticker symbol, company name, or 10-digit CIK.'
  );
}

/**
 * Extract key financial metrics from SEC company facts
 * @param {object} companyData - Raw data from fetchCompanyFacts
 * @returns {object} - Extracted financials { entityName, filings, metrics }
 */
export function extractFinancials(companyData) {
  if (!companyData || !companyData.facts) {
    return { entityName: 'Unknown', metrics: null };
  }

  const { cik, entityName } = companyData;
  const facts = companyData.facts['us-gaap'] || {};

  // Extract common financial metrics
  const metrics = {
    revenues: extractMetric(facts.Revenues),
    assets: extractMetric(facts.Assets),
    liabilities: extractMetric(facts.Liabilities),
    stockholders_equity: extractMetric(facts.StockholdersEquity),
    net_income: extractMetric(facts.NetIncomeLoss),
  };

  return {
    cik: cik || 'Unknown',
    entityName: entityName || 'Unknown',
    metrics,
    rawFacts: companyData.facts,
  };
}

/**
 * Helper: extract most recent value from a metric across filings
 * @param {object} metric - A fact object with units and values
 * @returns {object|null} - { value, date, unit } or null if not found
 */
function extractMetric(metric) {
  if (!metric || !metric.units) return null;

  // Prefer USD values; fall back to other units
  const units = metric.units.USD || Object.values(metric.units)[0];
  if (!units || !units.length) return null;

  // Get the most recent filing entry
  const latest = units[units.length - 1];
  return {
    value: latest.val,
    date: latest.end,
    unit: 'USD',
  };
}
