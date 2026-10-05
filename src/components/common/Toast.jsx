import React from 'react';
import { useStudyBuddy } from '../../context/StudyBuddyContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast, closeToast } = useStudyBuddy();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={18} color="var(--color-success)" />;
      case 'danger':
        return <AlertCircle size={18} color="var(--color-danger)" />;
      default:
        return <Info size={18} color="var(--accent-primary)" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'info'}`}>
        {getIcon()}
        <span>{toast.message}</span>
        <button className="btn-icon" onClick={closeToast} style={{ padding: '2px', marginLeft: '0.5rem' }}>
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
