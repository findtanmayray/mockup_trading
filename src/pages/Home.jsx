import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BROKERS = [
    { id: 'zerodha', name: 'Zerodha', icon: 'ZK' },
    { id: 'angel', name: 'Angel One', icon: 'A' },
    { id: 'fyers', name: 'Fyers', icon: 'F' },
    { id: 'dhan', name: 'Dhan', icon: 'D' },
];

const Home = () => {
    const navigate = useNavigate();
    const [selectedBrokers, setSelectedBrokers] = useState([]);

    const toggleBroker = (id) => {
        if (selectedBrokers.includes(id)) {
            setSelectedBrokers(selectedBrokers.filter(b => b !== id));
        } else {
            setSelectedBrokers([...selectedBrokers, id]);
        }
    };

    const handleContinue = () => {
        if (selectedBrokers.length > 0) {
            navigate('/positions');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Connect your Brokers
                </h2>
                <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '1.1rem' }}>
                    Select the brokers you want to trade with today.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                maxWidth: '800px',
                margin: '0 auto 3rem auto'
            }}>
                {BROKERS.map(broker => {
                    const isSelected = selectedBrokers.includes(broker.id);
                    return (
                        <div
                            key={broker.id}
                            onClick={() => toggleBroker(broker.id)}
                            className="glass-panel"
                            style={{
                                padding: '2rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                border: isSelected
                                    ? '1px solid hsl(var(--color-primary))'
                                    : '1px solid var(--glass-border)',
                                backgroundColor: isSelected
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : 'var(--glass-bg)',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                        >
                            {isSelected && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: 'hsl(var(--color-primary))',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Check size={14} />
                                </div>
                            )}

                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                backgroundColor: 'hsl(var(--color-bg-base))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'hsl(var(--color-text-secondary))'
                            }}>
                                {broker.icon}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{broker.name}</h3>
                        </div>
                    );
                })}
            </div>

            <div className="flex-center">
                <button
                    className="btn-primary"
                    onClick={handleContinue}
                    disabled={selectedBrokers.length === 0}
                    style={{
                        fontSize: '1.1rem',
                        padding: '1rem 3rem',
                        opacity: selectedBrokers.length === 0 ? 0.5 : 1,
                        cursor: selectedBrokers.length === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    Continue to Positions <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Home;
