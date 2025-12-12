export const MOCK_POSITIONS = [
    {
        id: '1', broker: 'zerodha', symbol: 'NIFTY 18000 CE', type: 'BUY', qty: 50, avg: 120.5, ltp: 135.0, pnl: 725.0, status: 'OPEN',
        note: 'Looks bullish on 15m timeframe.',
        strategy: 'Trend Following',
        history: [
            { time: '09:15:00', event: 'Entry', details: 'Bought at 120.5' },
            { time: '10:30:00', event: 'Alert', details: 'Crossed VWAP' }
        ]
    },
    {
        id: '2', broker: 'zerodha', symbol: 'BANKNIFTY 42000 PE', type: 'SELL', qty: 25, avg: 340.0, ltp: 310.0, pnl: 750.0, status: 'OPEN',
        history: [
            { time: '09:20:00', event: 'Entry', details: 'Sold at 340.0' }
        ]
    },
    {
        id: '3', broker: 'angel', symbol: 'RELIANCE', type: 'BUY', qty: 100, avg: 2450.0, ltp: 2445.0, pnl: -500.0, status: 'OPEN',
        history: [
            { time: '09:15:23', event: 'Entry', details: 'Bought at 2450.0' },
            { time: '11:00:00', event: 'SL Update', details: 'Modified SL to 2440' }
        ]
    },
    {
        id: '4', broker: 'fyers', symbol: 'TATASTEEL', type: 'BUY', qty: 1000, avg: 110.0, ltp: 112.5, pnl: 2500.0, status: 'CLOSED', realized: 2500.0,
        note: 'Good breakout trade. Booked at resistance.',
        history: [
            { time: '09:30:00', event: 'Entry', details: 'Bought at 110.0' },
            { time: '13:15:00', event: 'Exit', details: 'Target Hit at 112.5' }
        ]
    },
    {
        id: '5', broker: 'dhan', symbol: 'INFY', type: 'SELL', qty: 200, avg: 1500.0, ltp: 1480.0, pnl: 4000.0, status: 'OPEN',
        history: [{ time: '10:00:00', event: 'Entry', details: 'Short at 1500' }],
        strategy: 'Default Strategy'
    },
    {
        id: '6', broker: 'zerodha', symbol: 'CRUDEOIL 6000 PE', type: 'BUY', qty: 100, avg: 50.0, ltp: 45.0, pnl: -500.0, status: 'OPEN',
        history: [
            { time: '16:00:00', event: 'Entry', details: 'Bought at 50.0' },
            { time: '16:15:00', event: 'SL Hit', details: 'Price touched 45.0' },
            { time: '16:15:05', event: 'Wait Time', details: 'Waiting 60s before re-entry' }
        ],
        strategy: 'Default Strategy'
    },
];
