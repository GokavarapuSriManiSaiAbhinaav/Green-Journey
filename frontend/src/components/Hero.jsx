import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import heroPlantImage from '../assets/hero-image.png';
import heroPlantSvg from '../assets/hero-plant.svg'; // Keeping as backup/unused or remove? Removing usage below.

const Hero = () => {
    const scrollToTimeline = () => {
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-100/50 blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-100/40 blur-3xl opacity-60 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-28">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20 items-center">

                    {/* Left Column: Text Content */}
                    <div className="space-y-6 md:space-y-8 z-10 text-center md:text-left">
                        <h1 className="select-none text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                            Document the <br />
                            <span className="text-green-600 inline-block relative">
                                Journey
                                {/* Underline decoration */}
                                <svg className="absolute w-full h-2 md:h-3 bottom-1 left-0 text-green-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>{' '}
                            of{' '}
                            <span className="text-emerald-600">Growth</span>
                        </h1>

                        <p className="text-base md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0">
                            Capture plant growth day by day. Watch nature evolve from seed to harvest. A calm space to chronicle your green friends' progress.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full sm:w-auto">
                            <button
                                onClick={scrollToTimeline}
                                className="group w-full sm:w-auto px-6 py-3 md:px-8 md:py-3.5 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 hover:shadow-green-200/50 transition-all duration-300 flex items-center justify-center text-base"
                            >
                                Explore
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Hero Image - Animated/Vector Style */}
                    <div className="relative z-10 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg lg:max-w-xl aspect-square">
                            {/* Abstract organic background blob */}
                            <div className="absolute inset-0 bg-[#E8F5E9] rounded-full filter blur-[80px] opacity-70 animate-pulse-slow"></div>

                            {/* Vector Illustration */}
                            <img
                                src={heroPlantImage}
                                alt="Abstract growth illustration"
                                loading="eager"
                                className="w-full h-full object-contain animate-float drop-shadow-xl relative z-10"
                            />

                            {/* Floating decorative elements */}
                            <div className="absolute top-10 right-10 bg-white p-3 rounded-2xl shadow-lg animate-float-delayed hidden sm:block z-20">
                                <span className="text-2xl">🌿</span>
                            </div>
                            <div className="absolute bottom-20 left-10 bg-white p-3 rounded-2xl shadow-lg animate-float z-20 hidden sm:block">
                                <span className="text-2xl">💧</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
