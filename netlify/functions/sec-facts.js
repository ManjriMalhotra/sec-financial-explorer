export default async (req, context) => {
    const url = new URL(req.url);
    const cik = url.searchParams.get("cik");

    const response = await fetch(
        `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`,
        {
            headers: {
                "User-Agent": "manjri manjrimalhotra99@gmail.com" // SEC requires this
            }
        }
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};

export const config = {
    path: "/api/sec-facts"
};