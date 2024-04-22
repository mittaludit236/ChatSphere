import React from 'react';

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 h-3/4 flex">
        <div className="flex-1 flex flex-col justify-center px-10">
          <h3 className="text-5xl font-bold text-blue-600">Lamasocial</h3>
          <p className="text-2xl text-gray-500 mt-2">Connect with friends and the world around you on Lamasocial.</p>
        </div>
        <div className="flex-1 flex flex-col justify-center px-10">
          <div className="h-96 p-8 bg-white rounded-lg flex flex-col justify-between">
            <input placeholder="Username" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" />
            <input placeholder="Email" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" />
            <input placeholder="Password" type="password" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" />
            <input placeholder="Confirm Password" type="password" className="h-12 rounded-lg border-gray-300 border px-4 text-lg mb-4 focus:outline-none focus:ring focus:border-blue-400" />
        
            <button className="h-12 rounded-lg bg-blue-500 text-white px-6 text-lg font-medium">Sign Up</button>
            <button className="h-12 rounded-lg bg-green-500 text-white px-6 text-lg font-medium mt-4">Log into Account</button>
         
           
         </div>
        </div>
      </div>
    </div>
  );
}