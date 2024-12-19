import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="max-w-2xl text-center p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold text-primary mb-4">
                    Welcome to Task Management App
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    Stay organized and on top of your tasks with our intuitive task management system. Sign up or log in to get started!
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/login">
                        <button className="py-2 px-6 bg-primary text-white rounded-lg hover:bg-accent">
                            Log In
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button className="py-2 px-6 bg-gray-200 text-primary rounded-lg hover:bg-gray-300">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
