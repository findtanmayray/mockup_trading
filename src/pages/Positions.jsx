import React, { useState, useMemo } from 'react';
import { RefreshCcw, Filter, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Layers, FileText, History } from 'lucide-react';
import { MOCK_POSITIONS } from '../data/mockPositions';
import RiskModal from '../components/RiskModal';
import Modal from '../components/Modal';
import NoteModal from '../components/NoteModal';
import HistoryModal from '../components/HistoryModal';

const Positions = ({ strategies = [] }) => {
    const [positions, setPositions] = useState(MOCK_POSITIONS);
    const [groups, setGroups] = useState([]); // Array of { id, name, positionIds, note: '' }
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterBroker, setFilterBroker] = useState('all');

    // Modals
    const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [activeNotePosition, setActiveNotePosition] = useState(null);
    const [activeHistoryPosition, setActiveHistoryPosition] = useState(null);

    const [newGroupName, setNewGroupName] = useState('');
    const [expandedGroups, setExpandedGroups] = useState([]);

    // Stats
    const stats = useMemo(() => {
        const unrealized = positions.filter(p => p.status === 'OPEN').reduce((a, b) => a + b.pnl, 0);
        const realized = positions.filter(p => p.status === 'CLOSED').reduce((a, b) => a + (b.realized || 0), 0);
        return { unrealized, realized };
    }, [positions]);

    const handleUpdateNote = (id, newNote) => {
        // Check if it's a group
        if (id.startsWith('g-')) {
            setGroups(prev => prev.map(g => g.id === id ? { ...g, note: newNote } : g));
        } else {
            setPositions(prev => prev.map(p => p.id === id ? { ...p, note: newNote } : p));
        }
    };

    const handleUpdateStrategy = (id, newStrat) => {
        setPositions(prev => prev.map(p => p.id === id ? { ...p, strategy: newStrat } : p));
    };

    // Handle Selection
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // Grouping Logic
    const handleGroup = () => {
        if (!newGroupName) return;
        const newGroup = {
            id: `g-${Date.now()}`,
            name: newGroupName,
            positionIds: selectedIds,
            note: ''
        };
        setGroups([...groups, newGroup]);
        setSelectedIds([]);
        setNewGroupName('');
        setIsGroupModalOpen(false);
    };

    // Render Helpers
    const formatCurrency = (val) => val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    const PnLColor = (val) => val >= 0 ? 'hsl(var(--color-success))' : 'hsl(var(--color-danger))';

    // Merged List for Display (Groups replace individual items)
    const displayPositions = useMemo(() => {
        let list = [...positions];
        if (filterBroker !== 'all') {
            list = list.filter(p => p.broker === filterBroker);
        }

        // Remove grouped items and inject groups
        const groupedItemIds = groups.flatMap(g => g.positionIds);
        const standalone = list.filter(p => !groupedItemIds.includes(p.id) && p.status === 'OPEN');
        const closed = list.filter(p => p.status === 'CLOSED');

        const groupItems = groups.map(g => {
            const children = list.filter(p => g.positionIds.includes(p.id));
            if (children.length === 0) return null; // Filter logic might hide all children
            const totalPnl = children.reduce((a, b) => a + b.pnl, 0);
            return {
                ...g,
                isGroup: true,
                children,
                pnl: totalPnl
            };
        }).filter(g => g !== null);

        return {
            open: [...groupItems, ...standalone],
            closed
        };
    }, [positions, groups, filterBroker]);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>

            {/* Top Stats Bar */}
            <div className="glass-panel" style={{ margin: '1.5rem 0', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div>
                        <div style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Unrealised P&L</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: PnLColor(stats.unrealized) }}>
                            {formatCurrency(stats.unrealized)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Realised P&L</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: PnLColor(stats.realized) }}>
                            {formatCurrency(stats.realized)}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        className="glass-panel"
                        value={filterBroker}
                        onChange={e => setFilterBroker(e.target.value)}
                        style={{ padding: '0.5rem 1rem', color: 'inherit', outline: 'none' }}
                    >
                        <option value="all">All Brokers</option>
                        <option value="zerodha">Zerodha</option>
                        <option value="angel">Angel One</option>
                        <option value="fyers">Fyers</option>
                        <option value="dhan">Dhan</option>
                    </select>
                    <button className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <RefreshCcw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {/* Action Bar (Contextual) */}
            <div style={{
                height: '50px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: selectedIds.length > 0 ? 1 : 0.5,
                pointerEvents: selectedIds.length > 0 ? 'auto' : 'none',
                transition: 'opacity 0.2s'
            }}>
                <div style={{ background: 'hsl(var(--color-primary))', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {selectedIds.length} Selected
                </div>
                <button className="btn-outline" onClick={() => setIsGroupModalOpen(true)} style={{ display: 'flex', gap: '0.5rem' }}>
                    <Layers size={16} /> Group Positions
                </button>
                <button className="btn-outline" onClick={() => setIsRiskModalOpen(true)} style={{ display: 'flex', gap: '0.5rem' }}>
                    <Shield size={16} /> Define Risk
                </button>
                <div style={{ flex: 1 }}></div>
                <button className="btn-primary" style={{ backgroundColor: 'hsl(var(--color-danger))' }}>
                    Exit All Selected
                </button>
            </div>

            {/* OPEN POSITIONS */}
            <div className="section-title">Open Positions</div>
            <div className="table-container glass-panel">
                <table className="positions-table">
                    <thead>
                        <tr>
                            <th width="40"><input type="checkbox" onChange={() => { }} disabled /></th>
                            <th>Instrument</th>
                            <th>Type</th>
                            <th>Qty</th>
                            <th>Avg.</th>
                            <th>LTP</th>
                            <th>Strategy</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                            <th style={{ textAlign: 'right' }}>P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayPositions.open.length === 0 ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--color-text-muted))' }}>No open positions</td></tr>
                        ) : displayPositions.open.map(item => {
                            if (item.isGroup) {
                                const isExpanded = expandedGroups.includes(item.id);
                                return (
                                    <React.Fragment key={item.id}>
                                        <tr className="group-row" style={{ backgroundColor: 'hsl(var(--color-bg-elevated))' }}>
                                            <td>
                                                <button onClick={() => setExpandedGroups(prev => isExpanded ? prev.filter(x => x !== item.id) : [...prev, item.id])}>
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            </td>
                                            <td style={{ fontWeight: 600, color: 'hsl(var(--color-primary))' }}>{item.name} (Group)</td>
                                            <td colSpan="4" style={{ textAlign: 'center', color: 'hsl(var(--color-text-muted))', fontSize: '0.85rem' }}>
                                                {item.children.length} Positions
                                            </td>
                                            <td>
                                                <select
                                                    value={item.children[0]?.strategy || 'Default Strategy'}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => {
                                                        const newStrat = e.target.value;
                                                        item.children.forEach(child => handleUpdateStrategy(child.id, newStrat));
                                                    }}
                                                    style={{
                                                        background: 'transparent',
                                                        color: 'hsl(var(--color-text-primary))',
                                                        border: '1px solid hsl(var(--color-divider))',
                                                        borderRadius: '4px',
                                                        padding: '0.25rem',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    {strategies.map(s => (
                                                        <option key={s} value={s} style={{ color: 'black' }}>{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className="btn-icon"
                                                    title="Notes"
                                                    onClick={() => setActiveNotePosition(item)}
                                                    style={{ color: item.note ? 'hsl(var(--color-primary))' : 'hsl(var(--color-text-muted))' }}
                                                >
                                                    <FileText size={16} />
                                                </button>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: PnLColor(item.pnl) }}>
                                                {formatCurrency(item.pnl)}
                                            </td>
                                        </tr>
                                        {isExpanded && item.children.map(child => (
                                            <PositionRow
                                                key={child.id}
                                                item={child}
                                                selected={selectedIds.includes(child.id)}
                                                onSelect={() => toggleSelect(child.id)}
                                                onNote={() => setActiveNotePosition(child)}
                                                onHistory={() => setActiveHistoryPosition(child)}
                                                strategies={strategies}
                                                onStrategyChange={handleUpdateStrategy}
                                                isChild
                                            />
                                        ))}
                                    </React.Fragment>
                                );
                            }
                            return (
                                <PositionRow
                                    key={item.id}
                                    item={item}
                                    selected={selectedIds.includes(item.id)}
                                    onSelect={() => toggleSelect(item.id)}
                                    onNote={() => setActiveNotePosition(item)}
                                    onHistory={() => setActiveHistoryPosition(item)}
                                    strategies={strategies}
                                    onStrategyChange={handleUpdateStrategy}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* CLOSED POSITIONS */}
            <div className="section-title" style={{ marginTop: '2rem' }}>Closed Positions</div>
            <div className="table-container glass-panel" style={{ opacity: 0.8 }}>
                <table className="positions-table">
                    <thead>
                        <tr>
                            <th width="40"></th>
                            <th>Instrument</th>
                            <th>Type</th>
                            <th>Qty</th>
                            <th>Avg.</th>
                            <th>Closing Price</th>
                            <th>Strategy</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                            <th style={{ textAlign: 'right' }}>Realised P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayPositions.closed.map(item => (
                            <PositionRow
                                key={item.id}
                                item={item}
                                selected={false}
                                onSelect={() => { }}
                                onNote={() => setActiveNotePosition(item)}
                                onHistory={() => setActiveHistoryPosition(item)}
                                strategies={strategies}
                                onStrategyChange={handleUpdateStrategy}
                                isClosed
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODALS */}
            <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title="Name this Group">
                <input
                    autoFocus
                    className="input"
                    placeholder="e.g. Nifty Hedging"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid hsl(var(--color-border))', background: 'hsl(var(--color-bg-base))', color: 'white' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-primary" onClick={handleGroup}>Create Group</button>
                </div>
            </Modal>

            <RiskModal
                isOpen={isRiskModalOpen}
                onClose={() => setIsRiskModalOpen(false)}
                selectedCount={selectedIds.length}
            />

            <NoteModal
                isOpen={!!activeNotePosition}
                onClose={() => setActiveNotePosition(null)}
                position={activeNotePosition}
                onSave={handleUpdateNote}
            />

            <HistoryModal
                isOpen={!!activeHistoryPosition}
                onClose={() => setActiveHistoryPosition(null)}
                position={activeHistoryPosition}
            />

            <style>{`
        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: hsl(var(--color-text-secondary));
        }
        .table-container {
          overflow-x: auto;
          border-radius: 8px;
        }
        .positions-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        .positions-table th {
          text-align: left;
          padding: 1rem;
          background-color: rgba(255,255,255,0.03);
          color: hsl(var(--color-text-secondary));
          font-weight: 500;
          font-size: 0.85rem;
        }
        .positions-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--color-divider);
        }
        .positions-table tr:last-child td {
          border-bottom: none;
        }
        .badge {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .badge-buy { background: rgba(34, 197, 94, 0.2); color: hsl(var(--color-success)); }
        .badge-sell { background: rgba(239, 68, 68, 0.2); color: hsl(var(--color-danger)); }
      `}</style>
        </div>
    );
};

const PositionRow = ({ item, selected, onSelect, onNote, onHistory, isChild, isClosed, strategies, onStrategyChange }) => {
    const PnLColor = (val) => val >= 0 ? 'hsl(var(--color-success))' : 'hsl(var(--color-danger))';
    const formatCurrency = (val) => val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    return (
        <tr style={{ backgroundColor: isChild ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
            <td>
                {!isClosed && (
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={onSelect}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'hsl(var(--color-primary))' }}
                    />
                )}
            </td>
            <td style={{ paddingLeft: isChild ? '2rem' : '1rem' }}>
                <div style={{ fontWeight: 500 }}>{item.symbol}</div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))', textTransform: 'uppercase' }}>{item.broker}</div>
            </td>
            <td><span className={`badge ${item.type === 'BUY' ? 'badge-buy' : 'badge-sell'}`}>{item.type}</span></td>
            <td>{item.qty}</td>
            <td>{item.avg.toFixed(2)}</td>
            <td>{item.ltp.toFixed(2)}</td>
            <td>
                <select
                    value={item.strategy || 'Default Strategy'}
                    onChange={(e) => onStrategyChange(item.id, e.target.value)}
                    style={{
                        background: 'transparent',
                        color: 'hsl(var(--color-text-primary))',
                        border: '1px solid hsl(var(--color-divider))',
                        borderRadius: '4px',
                        padding: '0.25rem',
                        fontSize: '0.85rem'
                    }}
                >
                    {strategies.map(s => (
                        <option key={s} value={s} style={{ color: 'black' }}>{s}</option>
                    ))}
                </select>
            </td>
            <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                        className="btn-icon"
                        title="Notes"
                        onClick={(e) => { e.stopPropagation(); onNote(); }}
                        style={{ color: item.note ? 'hsl(var(--color-primary))' : 'hsl(var(--color-text-muted))' }}
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        className="btn-icon"
                        title="History"
                        onClick={(e) => { e.stopPropagation(); onHistory(); }}
                        style={{ color: 'hsl(var(--color-text-muted))' }}
                    >
                        <History size={16} />
                    </button>
                </div>
            </td>
            <td style={{ textAlign: 'right', fontWeight: 600, color: PnLColor(item.pnl || item.realized) }}>
                {formatCurrency(item.pnl || item.realized)}
            </td>
            <style>{`
        .btn-icon {
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          background-color: hsl(var(--color-bg-elevated));
          color: white !important;
        }
      `}</style>
        </tr>
    );
}

export default Positions;
