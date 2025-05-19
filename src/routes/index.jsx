import { useSelector } from "react-redux";
import Home from "../pages/Home";
import Upload from "../pages/Upload";
import Login from "../pages/Login";
import Layout from "../components/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Register from "../pages/Register";

const AppRoutes = () => {

    const { isAuthenticated } = useSelector(state => state.auth.user);

    return (
        <Layout>
            <Routes>
                <Route
                    path="/login"
                    element={!isAuthenticated ? <Login /> : <Navigate to="/home" />}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <Register /> : <Navigate to="/home" />}
                />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/upload" element={<Upload />} />
                </Route>
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Layout>
    )

}

export default AppRoutes;