import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Protected from "./routes/Protected";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import axios from "axios";
import useAuthStore from "./store/authStore";  // Zustand store to manage global state

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);  // Function to set user in global state
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn); // Function to manage login state

  // Check if the user is logged in when the app loads
  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/self`, {
          withCredentials: true
        });

        // If user is logged in, set user data in Zustand
        setUser(response.data.user);
        setIsLoggedIn(true);  // Set logged-in state to true
      } catch (error) {
        console.error("Not authenticated or session expired", error);
        setIsLoggedIn(false);  // Set logged-out state
      }
    };

    checkUserLogin(); // Call the function to check if the user is logged in
  }, [setUser, setIsLoggedIn]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard />
            // <Protected>
            // </Protected>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
