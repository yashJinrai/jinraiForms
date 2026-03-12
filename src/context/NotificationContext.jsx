import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmState, setConfirmState] = useState(null);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfirmState({
                ...options,
                isOpen: true,
                onConfirm: () => {
                    setConfirmState(null);
                    resolve(true);
                },
                onClose: () => {
                    setConfirmState(null);
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ showToast, confirm }}>
            {children}
            
            {/* Render Toasts */}
            <div className="fixed bottom-0 right-0 p-8 space-y-4 z-[200]">
                {toasts.map(t => (
                    <Toast 
                        key={t.id} 
                        {...t} 
                        onClose={() => removeToast(t.id)} 
                    />
                ))}
            </div>

            {/* Render Global Confirmation Modal */}
            {confirmState && (
                <Modal
                    isOpen={confirmState.isOpen}
                    title={confirmState.title || 'Are you sure?'}
                    onClose={confirmState.onClose}
                    onConfirm={confirmState.onConfirm}
                    confirmText={confirmState.confirmText}
                    cancelText={confirmState.cancelText}
                    variant={confirmState.variant}
                    loading={confirmState.loading}
                >
                    {confirmState.message}
                </Modal>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
