import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import { getCurrectEpoch } from './utils/timeUtil.js';
import { useEffect } from 'react';
import { decodeToken } from './utils/decodeJwt.js';
import { logout } from './store/slices/authSlice.js';
import { resetVideos } from './store/slices/videoSlice.js';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './routes/index.jsx';

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, data: userData } = useSelector(state => state?.auth?.user);
  const currentTime = getCurrectEpoch();

  useEffect(() => {
    if (token) {
      try {
        // Decode token
        const decodedToken = decodeToken(token);

        // If token expired then dispatch the logout slice and log out the user
        if (decodedToken.exp < currentTime) {
          dispatch(logout());
          dispatch(resetVideos());
          navigate("/login");
        }
      } catch (error) {
        dispatch(logout());
        dispatch(resetVideos());
        navigate("/login")
      }
    }
  }, [])

  return <AppRoutes />
}

export default App;