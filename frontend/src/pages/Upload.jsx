import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaCloudUploadAlt, FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !description) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('description', description);

        try {
            await api.post('/plants', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Success State handling
            setSuccess(true);
            setFile(null);
            setDescription('');
            setPreview(null);

            // Navigate after short delay to show success message
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto mt-20 px-4 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl border border-green-100 flex flex-col items-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <FaCheckCircle className="text-5xl text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
                    <p className="text-gray-500 mb-6">Your plant growth update has been posted.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Return to Timeline
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4 mb-20">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaCloudUploadAlt className="mr-3 text-green-600" />
                    New Growth Update
                </h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Plant Photo</label>

                        {!preview ? (
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors cursor-pointer relative bg-gray-50 group">
                                <div className="space-y-1 text-center">
                                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={preview} alt="Preview" className="w-full h-80 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={clearFile}
                                        className="p-3 bg-white rounded-full shadow-lg text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                            placeholder="How is the plant doing today?"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !file || !description}
                            className={`w-full sm:w-auto px-8 py-4 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${(loading || !file || !description) ? 'opacity-60 cursor-not-allowed transform-none' : 'hover:-translate-y-0.5'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Uploading...
                                </>
                            ) : (
                                'Post Update'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;

