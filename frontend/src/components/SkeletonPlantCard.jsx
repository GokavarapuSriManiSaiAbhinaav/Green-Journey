import React from 'react';

const SkeletonPlantCard = () => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col w-full mx-auto animate-pulse">
            {/* Title Placeholder */}
            <div className="p-4 flex justify-center border-b border-gray-50">
                <div className="h-7 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Image Placeholder */}
            <div className="aspect-[4/3] w-full bg-gray-200"></div>

            {/* Content Section */}
            <div className="p-5 md:p-8 flex flex-col items-center text-center relative z-10">

                {/* Date Badge Placeholder */}
                <div className="mb-4 w-32 h-6 bg-gray-200 rounded-full"></div>

                {/* Description Placeholder */}
                <div className="w-full space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>

            {/* Comment Section Placeholder */}
            <div className="bg-gray-50 p-6 border-t border-gray-100">
                <div className="w-40 h-4 bg-gray-200 rounded mb-4"></div>

                {/* Comment Placeholder */}
                <div className="space-y-3 mb-6">
                    <div className="h-16 bg-white rounded-lg border border-gray-100 p-3">
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>

                {/* Input Placeholder */}
                <div className="flex gap-2">
                    <div className="flex-grow h-10 bg-white border border-gray-200 rounded-lg"></div>
                    <div className="w-16 h-10 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonPlantCard;
