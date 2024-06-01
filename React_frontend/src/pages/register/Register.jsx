import React, { useRef } from 'react';
// import { useHistory } from 'react-router-dom';
// import {Navigate} from "react"
import axios from 'axios';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  // const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        window.location.href = "/login";
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 h-3/4 flex">
        <div className="flex-1 flex flex-col justify-center px-10">
          <h3 className="text-5xl font-bold text-blue-600">ChatSphere</h3>
          <p className="text-2xl text-gray-500 mt-2">Connect with friends and the world around you on ChatSphere</p>
        </div>
        <div className="flex-1 flex flex-col justify-center px-10">
          <div className="h-96 p-8 bg-white rounded-lg flex flex-col justify-between">
            <input placeholder="Username" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" ref={username} />
            <input placeholder="Email" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" ref={email} />
            <input placeholder="Password" type="password" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" ref={password} />
            <input placeholder="Confirm Password" type="password" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" ref={passwordAgain} />
        
            <button className="h-12 rounded-lg bg-blue-500 text-white px-6 text-lg font-medium" onClick={handleClick}>Sign Up</button>
            <button className="h-12 rounded-lg bg-green-500 text-white px-6 text-lg font-medium mt-4"  onClick={() => window.location.href = "/login"}>Log into Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
