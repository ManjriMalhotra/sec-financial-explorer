# SEC Financial Explorer

This is a web application that allows users to search for public companies and view their reported financial data.

## Known Limitations

This application fetches data directly from the SEC EDGAR API. As such, there are a few known limitations:

1.  **Rate Limiting**: The SEC API has strict rate limits (currently 10 requests per second). Rapid, repeated searches may result in temporary blocks or errors.
2.  **Missing Metrics**: Financial data is parsed from XBRL tags (US GAAP). Companies sometimes use custom or non-standard tags for certain metrics, meaning some data points (like Revenue or Net Income) may appear as "N/A" even if the company reported them.
3.  **Search Accuracy**: The company name search relies on a local snapshot of `company_tickers.json`. Very newly listed companies might not be found by name until this file is updated. Using the 10-digit CIK is always the most accurate method.
4.  **Single Data Point**: Currently, the application extracts and displays only the most recent reported value for each metric, rather than providing a historical multi-year trend.

## Running Locally

To run the application locally:
1. `npm install`
2. `npm run dev` (or `npx netlify dev` to run with serverless functions)
