
'use server';

export async function getExchangeRate(from: string, to: string): Promise<number | null> {
    try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!response.ok) {
            console.error('Failed to fetch exchange rate:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data.rates[to];
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
}
