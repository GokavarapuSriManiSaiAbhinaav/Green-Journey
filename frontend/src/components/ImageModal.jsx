import React, { useEffect } from 'react';
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

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 text-white bg-black/60 hover:bg-black/90 rounded-full transition-all duration-200 z-[70] backdrop-blur-md shadow-lg border border-white/10"
                aria-label="Close image viewer"
            >
                <FaTimes size={24} />
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
        </div>
    );
};

export default ImageModal;
