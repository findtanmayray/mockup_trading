import React from 'react';

const MonthGrid = ({ year, month, data, onDayClick }) => {
    const date = new Date(year, month, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const dayCells = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
        dayCells.push(<div key={`pad-${i}`} className="mini-cell empty"></div>);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayData = data[dateStr];

        // Color logic
        let bg = 'hsl(var(--color-bg-base))'; // Default empty
        if (dayData) {
            if (dayData.pnl > 0) bg = 'rgba(34, 197, 94, 0.4)'; // Green
            else if (dayData.pnl < 0) bg = 'rgba(239, 68, 68, 0.4)'; // Red
            else bg = 'hsl(var(--color-bg-elevated))'; // Neutral
        }

        dayCells.push(
            <div
                key={d}
                className="mini-cell"
                onClick={() => dayData && onDayClick(dateStr, dayData)}
                style={{
                    backgroundColor: bg,
                    cursor: dayData ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: dayData ? 'white' : 'rgba(255,255,255,0.3)'
                }}
                title={dayData ? `${dateStr}\nTotal P&L: ${dayData.pnl}` : dateStr}
            >
                {d}
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'hsl(var(--color-text-secondary))' }}>{monthName}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} style={{ fontSize: '0.6rem', textAlign: 'center', color: 'hsl(var(--color-text-muted))' }}>{d}</div>
                ))}
                {dayCells}
            </div>
        </div>
    );
};

export default MonthGrid;
