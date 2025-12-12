import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Save } from 'lucide-react';

const NoteModal = ({ isOpen, onClose, position, onSave }) => {
    const [note, setNote] = useState('');

    useEffect(() => {
        if (position) {
            setNote(position.note || '');
        }
    }, [position]);

    const handleSave = () => {
        onSave(position.id, note);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Note: ${position?.symbol}`}>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter your trade notes here..."
                style={{
                    width: '100%',
                    height: '150px',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: 'hsl(var(--color-bg-base))',
                    border: '1px solid hsl(var(--color-border))',
                    color: 'white',
                    resize: 'vertical',
                    fontSize: '1rem',
                    marginBottom: '1rem'
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={16} /> Save Note
                </button>
            </div>
        </Modal>
    );
};

export default NoteModal;
