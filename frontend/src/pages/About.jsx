import React from 'react';
import { FaLeaf, FaSeedling, FaHeart } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16 space-y-4 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-4">
                        <FaLeaf className="text-3xl text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        About <span className="text-green-600">Green Journey</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        A digital sanctuary for documenting the quiet magic of plant growth.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-20 animate-slide-up">
                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                        <p>
                            Green Journey started as a simple idea: to slow down and appreciate the small, daily changes that often go unnoticed. In a fast-paced world, watching a plant grow teaches us patience, resilience, and the beauty of nature's timing.
                        </p>
                        <p>
                            This platform serves as a visual diary—a dedicated space to chronicle every new leaf, every blooming flower, and every milestone in your plant's life cycle.
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm">
                                    <FaSeedling className="text-2xl text-green-600" />
                                </div>
                                <span className="font-bold text-gray-800">Track Progress</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm">
                                    <FaHeart className="text-2xl text-red-500" />
                                </div>
                                <span className="font-bold text-gray-800">Share the Love</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-10 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Green Journey. Growing together.</p>
                </div>
            </div>
        </div>
    );
};

export default About;
