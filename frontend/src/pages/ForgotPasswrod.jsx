import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/forgot-password`, data);
            toast.success("Password reset link sent to your email.");
            navigate('/login');
        } catch (error) {
            console.error("Error during forgot password:", error);
            if (error.status === 400) {
                toast.error("No account found with this email");
            } else {
                toast.error("Failed to send reset link. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-semibold text-center text-primary mb-6">Forgot Password</h2>
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

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full py-3 rounded-md transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:bg-primary'}`}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="loader border-t-4 border-white w-6 h-6 rounded-full border-t-transparent animate-spin mx-auto"></span>
                    ) : (
                        "Send Reset Link"
                    )}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-primary">
                    Remembered your password?
                    <Link to="/login" className="text-accent hover:underline"> Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
