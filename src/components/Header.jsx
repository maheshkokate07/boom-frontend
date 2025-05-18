import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const Header = () => {

    const dispatch = useDispatch();

    return (
        <header className="fixed top-0 left-0 w-full h-[56px] bg-white shadow z-50">
            <div className="container mx-auto flex items-center justify-between max-w-5xl">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-600">
                    BoomApp
                </Link>

                {/* Navigation Links */}
                <nav className="space-x-6 text-sm font-medium">
                    <Link to="/account" className="hover:text-blue-500">Account</Link>
                    <Link to="/upload" className="hover:text-blue-500">Upload</Link>
                    <button className="hover:text-red-500 cursor-pointer" onClick={() => { dispatch(logout()) }}>
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
