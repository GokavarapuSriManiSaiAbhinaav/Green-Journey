import React, { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';

const GlobalLoading = () => {
    const [isWaking, setIsWaking] = useState(false);

    useEffect(() => {
        const handleWaking = () => setIsWaking(true);
        const handleReady = () => setIsWaking(false);

        window.addEventListener('backend-waking', handleWaking);
        window.addEventListener('backend-ready', handleReady);

        return () => {
            window.removeEventListener('backend-waking', handleWaking);
            window.removeEventListener('backend-ready', handleReady);
        };
    }, []);

    if (!isWaking) return null;

    return (
        <div className="fixed top-0 left-0 w-full z-[200] bg-blue-50 text-blue-700 py-3 shadow-sm flex items-center justify-center animate-pulse border-b border-blue-100">
            <FaSync className="animate-spin mr-3 text-lg" />
            <span className="text-sm sm:text-base font-medium">Waking backend server... This might take up to 30 seconds.</span>
        </div>
    );
};

export default GlobalLoading;
