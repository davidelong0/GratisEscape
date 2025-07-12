
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LOGIN_SUCCESS } from '../redux/actions/authActions';
import jwtDecode from 'jwt-decode';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token,
          user: {
            email: decoded.sub,
            ruolo: decoded.ruolo
          }
        }
      });
      navigate("/");
    }
  }, [token]);

  return <div className="container mt-5">Login con Google in corso...</div>;
};

export default OAuthSuccess;
