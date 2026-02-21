import React, { useRef } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isOpen) return;

        // Focus initial de la modale pour capturer l'utilisateur dès l'ouverture
        const initFocusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (initFocusableElements && initFocusableElements.length > 0) {
            setTimeout(() => {
                (initFocusableElements[0] as HTMLElement).focus();
            }, 10);
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
            // Focus trap simple
            if (e.key === 'Tab') {
                const focusableElements = modalRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements && focusableElements.length > 0) {
                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    // Si le focus actif n'est plus dans la modale, on le ramène au premier élément
                    if (!modalRef.current?.contains(document.activeElement)) {
                        firstElement.focus();
                        e.preventDefault();
                        return;
                    }

                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        };

        const scrollY = window.scrollY;

        document.addEventListener('keydown', handleKeyDown);

        // Bloque complètement le scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            // Restaure le scroll à la position initiale
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';

            window.scrollTo(0, scrollY);
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative z-10 rounded-2xl bg-white p-6 shadow-xl px-6 py-12 md:px-18 md:py-20 max-h-[90vh] overflow-y-auto max-w-[95vw] md:max-w-auto"
            >
                <button
                    className="absolute top-4 right-4 md:top-10 md:right-10 text-gray-500 hover:text-gray-800 transition-colors outline-none focus:ring-2 focus:ring-orange-200 rounded-full p-1"
                    onClick={onClose}
                    aria-label="Fermer la modale"
                >
                    <X size={32} />
                </button>
                {title && (
                    <h2 className="mb-4 text-lg font-semibold">{title}</h2>
                )}

                {children}
            </div>
        </div>
    );
}
