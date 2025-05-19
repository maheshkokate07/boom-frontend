import { useState } from "react";
import axios from "axios";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { MdInsertComment } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import { useSelector } from "react-redux";

function VideoCard({ video, index, videoRef, userId }) {
    const [likes, setLikes] = useState(video.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(video.likes?.includes(userId));

    const { token } = useSelector(state => state.auth.user)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const handleLike = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/video/like/${video._id}`, {}, config);
            const updatedLikes = res.data.data.likes;

            setLikes(updatedLikes);
            setIsLiked(prev => !prev);
        } catch (error) {
            toast.error("Failed to like the video");
        }
    };

    return (
        <div className="h-[calc(100vh-56px)] snap-start p-2 flex justify-center items-center">
            <div className="relative max-w-[320px] h-full w-full flex justify-center items-center">
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="max-w-[320px] h-full object-cover rounded-lg"
                    loop
                    // muted
                    playsInline
                    controls={false}
                />

                <div className="absolute left-5 bottom-5 sm:left-0 text-white z-10 p-2 rounded-md">
                    <p className="font-semibold text-lg truncate">
                        @{video.uploader?.username || "unknown"}
                    </p>
                    <p className="text-sm truncate">{video.title}</p>
                </div>

                <div className="absolute sm:relative right-0 bottom-20 sm:bottom-15 h-[90%] p-4 flex flex-col items-center justify-end gap-4 text-white z-10">
                    <div
                        onClick={handleLike}
                        className={`${isLiked ? 'bg-white' : 'bg-[#272727]'} p-3 cursor-pointer hover:bg-[#555555] rounded-full flex items-center justify-center`}
                    >
                        <AiFillLike size={22} color={isLiked ? "black" : "white"} />
                    </div>
                    <div className="flex items-start justify-center font-semibold mt-[-12px]">{likes}</div>
                    <div className="bg-[#272727] p-3 cursor-pointer hover:bg-[#555555] rounded-full flex items-center justify-center">
                        <AiFillDislike size={22} />
                    </div>
                    <div className="bg-[#272727] p-3 cursor-pointer hover:bg-[#555555] rounded-full flex items-center justify-center">
                        <MdInsertComment size={22} />
                    </div>
                    <div className="bg-[#272727] p-3 cursor-pointer hover:bg-[#555555] rounded-full flex items-center justify-center">
                        <IoIosShareAlt size={22} />
                    </div>
                    <div className="bg-[#272727] p-3 cursor-pointer hover:bg-[#555555] rounded-full flex items-center justify-center">
                        <FiMoreVertical size={22} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
