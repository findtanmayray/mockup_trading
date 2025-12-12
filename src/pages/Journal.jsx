import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MOCK_JOURNAL_DATA, getJournalDayDetails } from '../data/mockJournal';
import Modal from '../components/Modal';
import MonthGrid from '../components/MonthGrid';

const Journal = () => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dayDetails, setDayDetails] = useState([]);

    // Calculate Year Stats
    const yearStats = useMemo(() => {
        let realized = 0;
        let unrealized = 601344; // Mock value from screenshot
        let tradeCount = 0;

        Object.entries(MOCK_JOURNAL_DATA).forEach(([date, data]) => {
            if (date.startsWith(selectedYear.toString())) {
                realized += data.pnl;
                tradeCount += data.trades;
            }
        });
        return { realized, unrealized, tradeCount };
    }, [selectedYear]);

    const handleDayClick = (dateStr, data) => {
        const details = getJournalDayDetails(dateStr);
        setDayDetails(details);
        setSelectedDay({ date: dateStr, ...data });
    };

    const formatCurrency = (val) => val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    const PnLColor = (val) => val >= 0 ? 'hsl(var(--color-success))' : 'hsl(var(--color-danger))';

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{selectedYear}-{selectedYear + 1}</h1>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-icon" onClick={() => setSelectedYear(selectedYear - 1)}><ChevronLeft size={20} /></button>
                        <button className="btn-icon" onClick={() => setSelectedYear(selectedYear + 1)}><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))' }}>
                        Gross Realized P&L: <span style={{ fontWeight: 600, color: PnLColor(yearStats.realized) }}>{formatCurrency(yearStats.realized)}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))' }}>
                        Unrealized P&L: <span style={{ fontWeight: 600, color: PnLColor(yearStats.unrealized) }}>{formatCurrency(yearStats.unrealized)}</span>
                    </div>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={16} /> Add Note
                    </button>
                </div>
            </div>

            {/* Year Grid */}
            <div className="year-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                    <MonthGrid
                        key={i}
                        year={selectedYear}
                        month={i}
                        data={MOCK_JOURNAL_DATA}
                        onDayClick={handleDayClick}
                    />
                ))}
            </div>

            {/* Day Details Modal */}
            <Modal isOpen={!!selectedDay} onClose={() => setSelectedDay(null)} title={`Details: ${selectedDay?.date}`}>
                {dayDetails.length === 0 ? (
                    <p>No detailed records found for this day.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-divider)' }}>
                                <th style={{ padding: '0.5rem' }}>Symbol</th>
                                <th style={{ padding: '0.5rem' }}>Type</th>
                                <th style={{ padding: '0.5rem' }}>Strategy</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dayDetails.map((t, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                                    <td style={{ padding: '0.5rem' }}>
                                        <div style={{ fontWeight: 500 }}>{t.symbol}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-muted))' }}>{t.note}</div>
                                    </td>
                                    <td style={{ padding: '0.5rem' }}><span style={{ fontSize: '0.8rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: t.type === 'BUY' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>{t.type}</span></td>
                                    <td style={{ padding: '0.5rem', fontSize: '0.9rem' }}>{t.strategy || '-'}</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600, color: PnLColor(t.pnl) }}>
                                        {t.pnl}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Modal>

            <style>{`
        .year-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .mini-cell {
          aspect-ratio: 1;
          border-radius: 2px;
          transition: transform 0.1s;
        }
        .mini-cell:not(.empty):hover {
          transform: scale(1.2);
          z-index: 10;
          border: 1px solid white;
        }
        .btn-icon {
          padding: 0.25rem;
          border-radius: 4px;
          background: hsl(var(--color-bg-elevated));
          color: hsl(var(--color-text-secondary));
        }
        .btn-icon:hover {
          background: hsl(var(--color-bg-card));
          color: white;
        }
      `}</style>
        </div>
    );
};

export default Journal;
