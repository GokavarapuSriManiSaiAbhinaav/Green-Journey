import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-4 text-white bg-black/50 hover:bg-red-600 rounded-full transition-all duration-200 z-[110] backdrop-blur-md shadow-2xl border border-white/20 group"
                aria-label="Close image viewer"
            >
                <FaTimes size={28} className="group-hover:scale-110 transition-transform" />
            </button>

            <div
                className="relative max-w-7xl max-h-screen w-full flex items-center justify-center p-2"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking image area
            >
                <img
                    src={imageSrc}
                    alt={altText || "Full screen view"}
                    className="max-h-[85vh] w-auto max-w-full object-contain shadow-2xl rounded-lg select-none"
                    draggable="false"
                />
            </div>
        </div>,
        document.body
    );
};

export default ImageModal;
