import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';  // Importing Zustand store

const Protected = ({ children }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);  // Get login state from Zustand

    // If the user is not logged in, redirect to the login page
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If the user is logged in, render the protected content
    return children;
};

export default Protected;
