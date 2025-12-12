import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Modal from './components/Modal';
import Home from './pages/Home';
import './styles/global.css';

import Positions from './pages/Positions';
import Journal from './pages/Journal';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    refreshRate: 5,
    stopLossWait: 0
  });

  const [strategies, setStrategies] = useState(['Default Strategy', 'Trend Following', 'Mean Reversion', 'Scalping']);
  const [newStrategy, setNewStrategy] = useState('');

  const handleAddStrategy = () => {
    if (newStrategy && !strategies.includes(newStrategy)) {
      setStrategies([...strategies, newStrategy]);
      setNewStrategy('');
    }
  };

  const handleDeleteStrategy = (s) => {
    setStrategies(strategies.filter(strat => strat !== s));
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />

        <main style={{ flex: 1, position: 'relative' }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '400px',
            background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1
          }}></div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/positions" element={<Positions strategies={strategies} />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Modal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          title="Application Settings"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))' }}>
                Position Refresh Rate (seconds)
              </label>
              <input
                type="number"
                value={settings.refreshRate}
                onChange={(e) => setSettings({ ...settings, refreshRate: parseInt(e.target.value) })}
                className="input-std"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))' }}>
                Wait time after Stop Loss (seconds)
              </label>
              <input
                type="number"
                value={settings.stopLossWait}
                onChange={(e) => setSettings({ ...settings, stopLossWait: parseInt(e.target.value) })}
                className="input-std"
              />
            </div>

            <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>
                Strategies
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  value={newStrategy}
                  onChange={(e) => setNewStrategy(e.target.value)}
                  placeholder="New Strategy Name"
                  className="input-std"
                />
                <button className="btn-primary" onClick={handleAddStrategy}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {strategies.map(s => (
                  <div key={s} style={{
                    backgroundColor: 'hsl(var(--color-bg-elevated))',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {s}
                    {s !== 'Default Strategy' && (
                      <button onClick={() => handleDeleteStrategy(s)} style={{ color: 'hsl(var(--color-text-muted))' }}>&times;</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn-primary" onClick={() => setIsSettingsOpen(false)}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
        <style>{`
          .input-std {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            background-color: hsl(var(--color-bg-base));
            border: 1px solid hsl(var(--color-border));
            color: white;
            font-size: 1rem;
          }
        `}</style>
      </div>
    </BrowserRouter>
  );
}

export default App;
