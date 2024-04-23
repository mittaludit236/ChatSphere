import React, { useContext, useRef } from 'react';
import { loginCall } from '../../apicalls';
import { AuthContext } from '../../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
const Login = () => {
    const email = useRef(); // useRef for email input
    const password = useRef(); // useRef for password input
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        handleClick(); // Call handleClick function when form is submitted
    };

    // Function to handle click (placeholder function, replace with your logic)
    const handleClick = () => {
        loginCall(
            { email: email.current.value, password: password.current.value },
            dispatch
        );
    };

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
                    <form onSubmit={handleSubmit}> {/* Form element with onSubmit event handler */}
                        <div className="space-y-4">
                            <input
                                ref={email} // Attach emailRef to input element
                                type="email" // Set input type to 'email'
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                            />
                            <input
                                ref={password} // Attach passwordRef to input element
                                type="password" // Set input type to 'password'
                                placeholder="Password"
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                                {isFetching ? (
                                    <FaSpinner color="white" size="20px" />
                                ) : (
                                    "Log In"
                                )}
                            </button>
                            <div className="text-center text-blue-600 hover:underline">
                                Forgot Password?
                            </div>
                            <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
                            {isFetching ? (
                                    <FaSpinner color="white" size="20px" />
                                ) : (
                                    "Create a New Account"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
