import React, { useState } from 'react';
import { Settings, BookOpen, LogOut, User, ChevronDown } from 'lucide-react';
import '../styles/global.css';

import { useNavigate } from 'react-router-dom';

const Header = ({ onOpenSettings }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="glass-panel" style={{
      borderRadius: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Trade<span style={{ color: 'hsl(var(--color-primary))' }}>Flow</span>
        </h1>

        <div style={{ position: 'relative' }}>
          <button
            className="flex-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ gap: '0.5rem', padding: '0.5rem', borderRadius: '6px', transition: 'background-color 0.2s' }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'hsl(var(--color-bg-elevated))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={18} />
            </div>
            <span style={{ fontWeight: 500 }}>Tanmay Ray</span>
            <ChevronDown size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {isDropdownOpen && (
            <div className="glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '120%',
              width: '200px',
              padding: '0.5rem',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'hsl(var(--color-bg-card))' /* solid fallback */
            }}>
              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/journal'); }}>
                <BookOpen size={16} /> Journal
              </button>
              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); onOpenSettings(); }}>
                <Settings size={16} /> Settings
              </button>
              <div style={{ height: '1px', backgroundColor: 'hsl(var(--color-divider))', margin: '0.5rem 0' }}></div>
              <button className="dropdown-item text-danger">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: 6px;
          text-align: left;
          font-size: 0.9rem;
          transition: background-color 0.15s;
        }
        .dropdown-item:hover {
          background-color: hsl(var(--color-bg-elevated));
        }
        .text-danger {
          color: hsl(var(--color-danger));
        }
        .text-danger:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </header>
  );
};

export default Header;
