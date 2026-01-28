import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import PlantCard from '../components/PlantCard';
import SkeletonPlantCard from '../components/SkeletonPlantCard';
import Hero from '../components/Hero';
import { FaSeedling, FaSync, FaExclamationTriangle } from 'react-icons/fa';

const Home = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isColdStart, setIsColdStart] = useState(false);
    const initLoadTimerRef = useRef(null);

    useEffect(() => {
        fetchPlants();
        return () => {
            if (initLoadTimerRef.current) clearTimeout(initLoadTimerRef.current);
        };
    }, []);

    const fetchPlants = async () => {
        setLoading(true);
        setError(null);
        setIsColdStart(false);

        // If loading takes more than 3s, show "Waking up" message
        initLoadTimerRef.current = setTimeout(() => {
            setIsColdStart(true);
        }, 3000);

        try {
            const response = await api.get('/plants');

            // Ensure data is an array
            if (Array.isArray(response.data)) {
                setPlants(response.data);
            } else {
                console.error("API did not return an array:", response.data);
                setPlants([]); // Fallback to empty
                // Don't show critical error for malformed data, just log it, 
                // but maybe we should let user know? simpler is empty state.
            }
        } catch (err) {
            console.error(err);
            if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                setError('The server is taking too long to respond. It might be waking up.');
            } else if (!err.response) {
                setError('Network error. Please check your connection.');
            } else {
                setError('Failed to load plant data. Please try again later.');
            }
        } finally {
            if (initLoadTimerRef.current) clearTimeout(initLoadTimerRef.current);
            setLoading(false);
            setIsColdStart(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Hero />

            <div id="timeline" className="flex-grow bg-gray-50/30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
                    <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-4">
                            <FaSeedling className="text-3xl text-green-600" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Latest Updates
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            A visual timeline of growth and care.
                        </p>
                    </div>

                    {/* Cold Start / Slow Connection Warning */}
                    {isColdStart && loading && (
                        <div className="mb-8 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center animate-pulse">
                            <FaSync className="animate-spin mr-3" />
                            <span>Waking up the backend server (this may take up to 30s)...</span>
                        </div>
                    )}

                    {error ? (
                        <div className="text-center py-10">
                            <div className="bg-red-50 text-red-600 p-6 rounded-lg inline-block max-w-md mx-auto shadow-sm border border-red-100">
                                <FaExclamationTriangle className="text-4xl mx-auto mb-4 opacity-80" />
                                <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
                                <p className="mb-6">{error}</p>
                                <button
                                    onClick={fetchPlants}
                                    className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-sm active:transform active:scale-95"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        </div>
                    ) : (
                        loading ? (
                            <div className="flex flex-col gap-16 relative">
                                {/* Vertical Timeline Line Placeholder */}
                                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-100 -translate-x-1/2 hidden md:block" />
                                {/* Render 3 Skeletons */}
                                <div className="relative z-10"><SkeletonPlantCard /></div>
                                <div className="relative z-10 hidden md:block"><SkeletonPlantCard /></div>
                                <div className="relative z-10 hidden md:block"><SkeletonPlantCard /></div>
                            </div>
                        ) : (
                            plants.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <p className="text-gray-500 text-lg">No updates yet. Check back soon!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-16 relative">
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />

                                    {plants.map((plant) => (
                                        <div key={plant._id} className="relative z-10">
                                            {/* Timeline Dot (Desktop only) */}
                                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 border-4 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 hidden md:block z-20" />

                                            <PlantCard plant={plant} refreshPlants={fetchPlants} />
                                        </div>
                                    ))}
                                </div>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
