import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning';
}

export default function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    onConfirm,
    onCancel,
    variant = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center rounded-2xl animate-in fade-in zoom-in duration-200">
            <div className={`p-4 rounded-full mb-4 ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-75">
                {description}
            </p>
            <div className="flex gap-3 w-full justify-center">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-lg ${variant === 'danger'
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                        : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
                        }`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
    );
}
