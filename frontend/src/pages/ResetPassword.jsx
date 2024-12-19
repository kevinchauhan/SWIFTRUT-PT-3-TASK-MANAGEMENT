import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm(); // Destructure getValues here
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    useEffect(() => {
        if (!token) {
            setValidToken(false);
        }
    }, [token]);

    const onSubmit = async (data) => {
        if (!validToken) return;

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/reset-password`, { token, ...data });
            toast.success("Password reset successfully.");
            navigate('/login');
        } catch (error) {
            console.error("Error during password reset:", error);
            if (error.status === 400) {
                toast.error("Invalid or expired link.Please try to forgot password again");
                navigate('/forgot-password');
            } else {
                toast.error("Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!validToken) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-md">
                <h2 className="text-2xl font-semibold text-center text-primary mb-6">Invalid or Expired Token</h2>
                <p className="text-center text-sm text-red-500">The password reset token is invalid or has expired. Please request a new one.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-semibold text-center text-primary mb-6">Reset Password</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* New Password Input */}
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-primary">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        {...register("newPassword", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        className="mt-2 p-3 w-full border border-border rounded-md"
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                </div>

                {/* Confirm Password Input */}
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) => value === getValues("newPassword") || "Passwords do not match" // Using getValues here
                        })}
                        className="mt-2 p-3 w-full border border-border rounded-md"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
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
                        "Reset Password"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
