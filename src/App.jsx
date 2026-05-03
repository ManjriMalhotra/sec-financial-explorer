
import { CompanyProvider } from './state/CompanyContext';
import { CompanySearch } from './components/CompanySearch';
import { CompanySummary } from './components/CompanySummary';

function App() {
  return (
    <CompanyProvider>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block">
              SEC EDGAR Explorer
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Financial Data Explorer
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Search by company name or CIK to load SEC financial facts and reveal key metrics.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <CompanySearch />
            <CompanySummary />
          </div>
        </div>
      </main>
    </CompanyProvider>
  );
}

export default App;

