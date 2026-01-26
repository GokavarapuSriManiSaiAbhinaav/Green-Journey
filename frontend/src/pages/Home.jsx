import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PlantCard from '../components/PlantCard';
import Hero from '../components/Hero';
import { FaSpinner, FaSeedling } from 'react-icons/fa';

const Home = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = async () => {
        try {
            const response = await api.get('/plants');
            setPlants(response.data);
        } catch (err) {
            setError('Failed to load plant data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex flex-col">
                <Hero />
                <div className="flex justify-center items-center py-20">
                    <FaSpinner className="animate-spin text-4xl text-green-500" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex flex-col">
                <Hero />
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg max-w-2xl mx-auto shadow-sm mt-10">
                    <p className="font-medium text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Hero />

            <div id="timeline" className="flex-grow bg-gray-50/30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16 space-y-4">
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

                    {plants.length === 0 ? (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
