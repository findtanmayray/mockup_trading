import React from 'react';
import Modal from './Modal';
import { Clock, AlertCircle } from 'lucide-react';

const HistoryModal = ({ isOpen, onClose, position }) => {
    if (!position) return null;

    const history = position.history || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`History: ${position.symbol}`}>
            <div style={{ padding: '0.5rem 0' }}>
                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'hsl(var(--color-text-muted))', padding: '2rem' }}>
                        No history available for this position.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                gap: '1rem',
                                position: 'relative'
                            }}>
                                {/* Timeline Line */}
                                {index !== history.length - 1 && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '28px',
                                        bottom: '-16px',
                                        width: '2px',
                                        backgroundColor: 'hsl(var(--color-border))'
                                    }}></div>
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: 'hsl(var(--color-bg-elevated))',
                                    border: '1px solid hsl(var(--color-primary))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--color-primary))' }}></div>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, paddingBottom: index !== history.length - 1 ? '0.5rem' : 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.event}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-muted))', fontFamily: 'monospace' }}>{item.time}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))', marginTop: '0.25rem' }}>
                                        {item.details}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default HistoryModal;
