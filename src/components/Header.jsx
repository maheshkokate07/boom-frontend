import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const Header = () => {
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(state => state.auth.user);

    const location = useLocation();
    const currentPath = location.pathname;

    console.log(currentPath);

    const isActive = (path) => currentPath === path;

    return (
        <header className="fixed top-0 left-0 w-full h-[56px] bg-[#242424] shadow z-50 flex items-center ">
            <div className="mx-auto px-4 flex items-center justify-between w-full max-w-5xl">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-gray-100 hover:text-blue-400 transition">
                    BoomApp
                </Link>

                {/* Navigation Links */}
                {
                    isAuthenticated && <nav className="space-x-6 text-sm font-medium flex items-center">
                        <Link to="/home" className={`${isActive("/home") ? "text-blue-400" : "text-gray-100"} hover:text-blue-400 transition`}>
                            Home
                        </Link>
                        <Link to="/upload" className={`${isActive("/upload") ? "text-blue-400" : "text-gray-100"} hover:text-blue-400 transition`}>
                            Upload
                        </Link>
                        <button
                            className="text-gray-100 hover:text-red-500 transition cursor-pointer"
                            onClick={() => dispatch(logout())}
                        >
                            Logout
                        </button>
                    </nav>
                }
            </div>
        </header>
    );
};

export default Header;
