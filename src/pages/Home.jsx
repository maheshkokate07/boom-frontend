// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchVideos } from "../store/slices/videoSlice";

// function Home() {
//     const dispatch = useDispatch();
//     const { videos, loading } = useSelector((state) => state.videos);

//     useEffect(() => {
//         dispatch(fetchVideos());
//     }, [dispatch]);

//     return (
//         <div className="px-4 py-1 w-full overflow-auto flex justify-center">
//             <div className="max-w-5xl w-full">
//                 {loading && (
//                     <div className="text-center text-md mt-3 mb-5 w-full font-semibold">
//                         Fetching latest videos...
//                     </div>
//                 )}

//                 {!loading && videos?.length > 0 ? (
//                     <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mt-1 lg:grid-cols-3 xl:grid-cols-4">
//                         {
//                             videos.map((video) => {
//                                 return <p>{video.title}</p>
//                             })
//                         }
//                     </div>
//                 ) : (
//                     !loading && (
//                         <div className="text-center text-md mt-3 mb-5 w-full font-semibold">
//                             No videos found
//                         </div>
//                     )
//                 )
//                 }
//             </div>
//         </div>
//     );
// }

// export default Home;







import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../store/slices/videoSlice";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { MdInsertComment } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import VideoCard from "../components/VideoCard";

function Home() {
    const dispatch = useDispatch();
    const { videos, loading } = useSelector((state) => state.videos);
    const { userId } = useSelector(state => state.auth.user.data);
    const videoRefs = useRef([]);
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch videos on mount
    useEffect(() => {
        dispatch(fetchVideos());
    }, [dispatch]);

    // Auto play/pause videos in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.7 }
        );

        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [videos]);

    // Scroll to video at currentIndex when it changes
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const videoHeight = container.clientHeight; // height of visible container

        container.scrollTo({
            top: currentIndex * videoHeight,
            behavior: "smooth",
        });
    }, [currentIndex]);

    // Handle button clicks
    const handleUp = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleDown = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));
    };

    if (loading) {
        return (
            <div className="text-center text-md mt-3 mb-5 w-full font-semibold">
                Fetching latest videos...
            </div>
        );
    }

    const isLiked = true;

    return (
        <>
            <div
                ref={containerRef}
                className="overflow-y-scroll snap-y snap-mandatory hide-scrollbar bg-black"
                style={{
                    height: "calc(100vh - 56px)",
                    paddingBottom: "56px",
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {videos.map((video, index) => (
                    <VideoCard
                        key={video._id}
                        video={video}
                        index={index}
                        videoRef={(el) => (videoRefs.current[index] = el)}
                        userId={userId}
                    />
                ))}
            </div>


            {/* Up / Down buttons */}
            <div className="fixed right-10 top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col space-y-4 z-20 " >
                <button
                    onClick={handleUp}
                    disabled={currentIndex === 0}
                    className="flex justify-center items-center bg-[#272727] hover:bg-[#555555] bg-opacity-70 text-white p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <FaArrowUp size={20} />
                </button>
                <button
                    onClick={handleDown}
                    disabled={currentIndex === videos.length - 1}
                    className="flex justify-center items-center bg-[#272727] hover:bg-[#555555] bg-opacity-70 text-white p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <FaArrowDown size={20} />
                </button>
            </div>
        </>
    );
}

export default Home;
