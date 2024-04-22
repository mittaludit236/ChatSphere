import React from 'react';

const Login = () => {
    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h3 className="text-3xl font-bold text-blue-600">Lamasocial</h3>
                        <p className="text-gray-500 mt-2">
                            Connect with friends and the world around you on Lamasocial.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <input
                            placeholder="Email"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                        />
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            Log In
                        </button>
                        <div className="text-center text-blue-600 hover:underline">
                            Forgot Password?
                        </div>
                        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
                            Create a New Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;