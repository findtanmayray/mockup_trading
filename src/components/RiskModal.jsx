import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/global.css';

const RiskModal = ({ isOpen, onClose, selectedCount }) => {
    const [activeTab, setActiveTab] = useState('price'); // price, percent, amount
    const [data, setData] = useState({
        profitTarget: '',
        stopLoss: '',
        trailingValue: '',
        target1: '', t1Qty: '',
        target2: '', t2Qty: '',
        target3: '', t3Qty: '',
    });

    const handleChange = (f, v) => setData({ ...data, [f]: v });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Define Risk (${selectedCount} positions)`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Main SL/Target */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Profit Target</label>
                        <input type="number" className="input" placeholder="Price" value={data.profitTarget} onChange={e => handleChange('profitTarget', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="label">Stop Loss</label>
                        <input type="number" className="input" placeholder="Price" value={data.stopLoss} onChange={e => handleChange('stopLoss', e.target.value)} />
                    </div>
                </div>

                {/* Trailing SL */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                    <label className="label" style={{ marginBottom: '0.75rem', display: 'block' }}>Trailing Stop Loss</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {['price', 'percent', 'amount'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={activeTab === t ? 'btn-primary' : 'btn-outline'}
                                style={{ flex: 1, textTransform: 'capitalize', fontSize: '0.9rem' }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <input type="number" className="input" placeholder={`Trailing by ${activeTab}`} value={data.trailingValue} onChange={e => handleChange('trailingValue', e.target.value)} />
                </div>

                {/* Partial Targets */}
                <div>
                    <label className="label" style={{ marginBottom: '0.5rem', display: 'block' }}>Partial Booking Targets</label>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                            <input type="number" className="input" placeholder={`Target ${i} Price`} value={data[`target${i}`]} onChange={e => handleChange(`target${i}`, e.target.value)} />
                            <input type="number" className="input" placeholder="% Qty" value={data[`t${i}Qty`]} onChange={e => handleChange(`t${i}Qty`, e.target.value)} />
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button className="btn-primary" onClick={onClose}>Save Risk Rules</button>
                </div>
            </div>
            <style>{`
        .label { font-size: 0.85rem; color: hsl(var(--color-text-secondary)); font-weight: 500; }
        .input {
          width: 100%;
          padding: 0.6rem;
          border-radius: 6px;
          background-color: hsl(var(--color-bg-base));
          border: 1px solid hsl(var(--color-border));
          color: white;
          font-size: 0.95rem;
        }
        .input:focus { outline: none; border-color: hsl(var(--color-primary)); }
      `}</style>
        </Modal>
    );
};

export default RiskModal;
