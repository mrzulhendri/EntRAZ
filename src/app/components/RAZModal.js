'use client';

import { useEffect } from 'react';
import '../RAZModal.css';

export default function RAZModal({ isOpen, onClose, title, children, footer }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="raz-modal-overlay" onClick={onClose}>
            <div className="raz-modal-container" onClick={e => e.stopPropagation()}>
                <div className="raz-modal-header">
                    <h3 className="raz-modal-title">{title}</h3>
                    <button className="raz-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="raz-modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="raz-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
