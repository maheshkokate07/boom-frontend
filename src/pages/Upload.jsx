import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Upload() {
    const navigate = useNavigate();
    const { data: userData, token } = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [previewVideo, setPreviewVideo] = useState(null);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (e.target.name === "video") {
            setVideoFile(file);
            setPreviewVideo(URL.createObjectURL(file));
        } else if (e.target.name === "thumbnail") {
            setThumbnailFile(file);
            setPreviewThumbnail(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!videoFile || !title.trim() || !description.trim()) {
            toast.error("Please fill all required fields!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", videoFile);
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        const toastId = toast.loading("Uploading video... 0%");

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    // Show only up to 99% during upload
                    const displayPercent = percentCompleted >= 100 ? 99 : percentCompleted;

                    toast.loading(`Uploading video... ${displayPercent}%`, { id: toastId });
                },
            };

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/video/upload`,
                formData,
                config
            );

            toast.success("Video uploaded successfully! 100%", { id: toastId });
            navigate("/home");

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong. Try again!", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-[calc(100vh-56px)] overflow-auto bg-[#0f0f0f] pt-6 text-white p-4">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-[#1f1f1f] shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Upload Video</h2>
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Video File */}
                    <div>
                        <label className="block font-medium text-gray-200">Select Video *</label>
                        {previewVideo && (
                            <video className="mt-3 w-[200px] max-w-sm rounded-md" src={previewVideo} controls />
                        )}
                        <input
                            type="file"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="mt-2 bg-[#2a2a2a] text-white border border-gray-600 p-2 w-full rounded-md cursor-pointer file:text-white file:border-0 file:mr-4"
                            required
                        />
                    </div>

                    {/* Thumbnail File */}
                    <div>
                        <label className="block font-medium text-gray-200">Upload Thumbnail (Optional)</label>
                        {previewThumbnail && (
                            <img
                                className="mt-3 w-full max-w-sm object-cover rounded-md"
                                src={previewThumbnail}
                                alt="Thumbnail Preview"
                            />
                        )}
                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2 bg-[#2a2a2a] text-white border border-gray-600 p-2 w-full rounded-md cursor-pointer file:text-white file:border-0 file:mr-4"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block font-medium text-gray-200">Video Title *</label>
                        <input
                            type="text"
                            className="w-full mt-2 p-2 bg-[#2a2a2a] text-white border border-gray-600 rounded-md placeholder-gray-400"
                            placeholder="Enter video title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium text-gray-200">Video Description *</label>
                        <textarea
                            className="w-full mt-2 p-2 bg-[#2a2a2a] text-white border border-gray-600 rounded-md placeholder-gray-400"
                            placeholder="Enter video description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={loading}
                        type="submit"
                        className="cursor-pointer w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Uploading..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>

    );
}

export default Upload;