export const MOCK_JOURNAL_DATA = {
    // Format: YYYY-MM-DD: { pnl, trades: count }
    '2025-01-01': { pnl: 5000, trades: 2 },
    '2025-01-02': { pnl: -1200, trades: 1 },
    '2025-01-03': { pnl: 8500, trades: 3 },
    '2025-01-06': { pnl: -2000, trades: 2 },
    '2025-01-07': { pnl: 1500, trades: 1 },
    '2025-01-08': { pnl: 0, trades: 0 },
    '2025-01-09': { pnl: 12000, trades: 4 },
    '2025-01-10': { pnl: -4500, trades: 2 },
};

export const getJournalDayDetails = (date) => {
    // Generate deterministic mock data based on the date
    if (MOCK_JOURNAL_DATA[date]) {
        if (MOCK_JOURNAL_DATA[date].trades === 0) return [];

        const details = [];
        const pnl = MOCK_JOURNAL_DATA[date].pnl;
        const count = MOCK_JOURNAL_DATA[date].trades;

        // Split total P&L roughly among trades
        const basePnl = Math.floor(pnl / count);

        for (let i = 0; i < count; i++) {
            details.push({
                id: `${date}-${i}`,
                symbol: i % 2 === 0 ? 'NIFTY' : 'BANKNIFTY',
                type: i % 2 === 0 ? 'BUY' : 'SELL',
                pnl: i === count - 1 ? pnl - (basePnl * (count - 1)) : basePnl, // Adjust last one to match total
                note: i === 0 ? 'Opening range break' : 'Mean reversion',
                strategy: i % 2 === 0 ? 'Trend Following' : 'Scalping'
            });
        }
        return details;
    }
    return [];
};
