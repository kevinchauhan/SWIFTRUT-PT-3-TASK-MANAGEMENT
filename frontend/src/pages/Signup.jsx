import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);  // State to track loading status
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);  // Set loading to true when API call starts
        try {
            // API Call to register the user
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/signup`, data);

            // Set the user data in global state
            setUser(response.data.user);

            // Redirect to dashboard after successful signup
            navigate('/login');
            toast.success('Signup successful, now you can login')
        } catch (error) {
            toast.error(error.message)
            console.error("Error during signup:", error);
        } finally {
            setLoading(false);  // Set loading to false after API call ends
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-semibold text-center text-primary mb-6">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-primary">Name</label>
                    <input
                        type="name"
                        id="name"
                        {...register("name", {
                            required: "Name is required",
                        })}
                        className="mt-2 p-3 w-full border border-border rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

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

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-primary">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters long"
                            }
                        })}
                        className="mt-2 p-3 w-full border border-border rounded-md"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 rounded-md transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:bg-primary'}`}
                    disabled={loading}  // Disable button during API call
                >
                    {loading ? (
                        <span className="loader border-t-4 border-white w-6 h-6 rounded-full border-t-transparent animate-spin mx-auto"></span>
                    ) : (
                        "Sign Up"
                    )}
                </button>
            </form>

            {/* Link to Login */}
            <div className="mt-4 text-center">
                <p className="text-sm text-primary">
                    Already have an account?
                    <a href="/login" className="text-accent hover:underline"> Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
