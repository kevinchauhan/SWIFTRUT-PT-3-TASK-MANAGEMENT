import { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);  // State to track loading status
    const { setUser, isLoggedIn, setIsLoggedIn } = useAuthStore();
    const navigate = useNavigate();


    useLayoutEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn])

    const onSubmit = async (data) => {
        setLoading(true);  // Set loading to true when API call starts
        try {
            // API Call to login the user
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`, data, { withCredentials: true });
            console.log(response.data)
            // Set the user data in global state
            setUser(response.data.user);
            setIsLoggedIn(true)
            // Show success toast
            toast.success("Login Successful!",);

            // Redirect to dashboard after successful login
            navigate('/dashboard');
        } catch (error) {
            console.error("Error during login:", error);

            if (error.status === 401) {
                toast.error("Invalid credentials");
            } else {
                toast.error("Login Failed. Please try again.");
            }
        } finally {
            setLoading(false);  // Set loading to false after API call ends
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-semibold text-center text-primary mb-6">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-primary">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                message: "Invalid email format"
                            }
                        })}
                        className="mt-2 p-3 w-full border border-border rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-primary">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", {
                            required: "Password is required"
                        })}
                        className="mt-2 p-3 w-full border border-border rounded-md"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full py-3 rounded-md transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:bg-primary'}`}
                    disabled={loading}  // Disable button during API call
                >
                    {loading ? (
                        <span className="loader border-t-4 border-white w-6 h-6 rounded-full border-t-transparent animate-spin mx-auto"></span>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            {/* Link to Signup */}
            <div className="mt-4 text-center">
                <p className="text-sm text-primary">
                    Dont have an account?
                    <Link to="/signup" className="text-accent hover:underline"> Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
