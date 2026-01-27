import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaEdit, FaTrash, FaExpand } from 'react-icons/fa';
import api from '../api/axios';
import EditPlantModal from './EditPlantModal';
import ImageModal from './ImageModal';

const PlantCard = ({ plant, refreshPlants }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const longPressTimer = useRef(null);
    const isAdmin = !!localStorage.getItem('token');

    // Close delete menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveCommentId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this update?')) {
            try {
                await api.delete(`/plants/${plant._id}`);
                refreshPlants();
            } catch (err) {
                console.error('Failed to delete', err);
                alert('Failed to delete plant update.');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Delete this comment permanently?')) {
            try {
                // Optimistic update
                const updatedComments = plant.comments.filter(c => c._id !== commentId);
                // Call API
                await api.delete(`/plants/${plant._id}/comments/${commentId}`);
                refreshPlants();
            } catch (err) {
                console.error('Failed to delete comment', err);
                // If 403, might be permission issue
                if (err.response && err.response.status === 403) {
                    alert("You don't have permission to delete this comment.");
                } else {
                    alert('Failed to delete comment.');
                }
                refreshPlants(); // Revert on fail
            }
        }
    };

    // Long press handlers for Mobile
    const handleTouchStart = (commentId) => {
        longPressTimer.current = setTimeout(() => {
            setActiveCommentId(commentId);
            // Vibrate if supported
            if (navigator.vibrate) navigator.vibrate(50);
        }, 800); // 800ms for long press
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    // Right click handler for Desktop
    const handleContextMenu = (e, commentId) => {
        e.preventDefault();
        setActiveCommentId(commentId);
    };

    return (
        <>
            {/* Card Container */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group w-full mx-auto relative">

                {/* Admin Controls - Floating Top Right */}
                {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="p-2.5 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full shadow-lg border border-gray-100 transition-all transform hover:scale-105"
                            title="Edit Update"
                        >
                            <FaEdit size={14} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2.5 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full shadow-lg border border-gray-100 transition-all transform hover:scale-105"
                            title="Delete Update"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                )}

                {/* Image Section - Click to Open Lightbox */}
                <div
                    className="relative aspect-[4/3] w-full overflow-hidden cursor-zoom-in group"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <img
                        src={plant.image}
                        alt="Plant update"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700 flex items-center">
                            <FaExpand className="mr-2" size={12} /> View Full Size
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col items-center text-center bg-white relative z-10">

                    {/* Date Badge */}
                    <div className="mb-4 inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider shadow-sm border border-green-100">
                        <FaCalendarAlt className="mr-2" />
                        <time dateTime={plant.date}>
                            {format(new Date(plant.date), 'MMMM d, yyyy')}
                        </time>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-lg leading-relaxed max-w-prose">
                        {plant.description}
                    </p>
                </div>

                {/* Comment Section */}
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Community Suggestions</h4>

                    {/* Comment List */}
                    {plant.comments && plant.comments.length > 0 && (
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {plant.comments.map((comment, index) => (
                                <div
                                    key={comment._id || index}
                                    className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm relative group select-none ${activeCommentId === comment._id ? 'bg-red-50 border-red-200' : ''}`}
                                    onContextMenu={(e) => handleContextMenu(e, comment._id)}
                                    onTouchStart={() => handleTouchStart(comment._id)}
                                    onTouchEnd={handleTouchEnd}
                                    onTouchMove={handleTouchEnd} // Cancel on scroll
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-gray-700">{comment.text}</p>
                                            <span className="text-xs text-gray-400 mt-1 block">
                                                {format(new Date(comment.date), 'MMM d, yyyy')}
                                            </span>
                                        </div>

                                        {/* Delete Button (Visible on Active) */}
                                        {activeCommentId === comment._id && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteComment(comment._id);
                                                }}
                                                className="ml-2 text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors animate-fade-in"
                                                title="Delete Comment"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comment Form */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const text = e.target.elements.comment.value;
                        if (!text.trim()) return;

                        // Optimistic UI update or refresh
                        api.post(`/plants/${plant._id}/comments`, { text })
                            .then(() => {
                                e.target.reset();
                                refreshPlants(); // Refresh to show new comment
                            })
                            .catch(err => {
                                console.error(err);
                                alert('Failed to post comment. Please try again.');
                            });
                    }} className="flex gap-2">
                        <input
                            name="comment"
                            type="text"
                            placeholder="Add a suggestion..."
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>

            {/* Modals */}
            <EditPlantModal
                plant={plant}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onUpdate={refreshPlants}
            />

            <ImageModal
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                imageSrc={plant.image}
                altText={`Update from ${format(new Date(plant.date), 'MMMM d, yyyy')}`}
            />
        </>
    );
};

export default PlantCard;
