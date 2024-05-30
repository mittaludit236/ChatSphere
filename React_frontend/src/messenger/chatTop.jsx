import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV } from 'react-icons/fa';
import axios from 'axios'; // Import axios for making HTTP requests

const ChatTop = ({ user,senderId, selected}) => {
    console.log("current->",selected)
    const [senderUsername, setSenderUsername] = useState(''); // State to store sender's username

    useEffect(() => {
        // Function to fetch sender's username based on senderId
        const fetchSenderUsername = async () => {
            try {
                // const res = await axios.get(`/users/${senderId}`); 
                // console.log("usernaeme",res)// Assuming you have an endpoint to fetch user data by ID
                // setSenderUsername(res.data.username); // Assuming the response contains the username field
            } catch (error) {
                console.error('Error fetching sender username:', error);
            }
        };

        fetchSenderUsername(); // Call the function when the component mounts or senderId changes
    }, [senderId]);

    return (
        <div className="flex justify-between items-center bg-gray-200 px-8 py-6 rounded-t-lg">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold text-black">{senderUsername}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <FaPhoneAlt className="text-gray-600 cursor-pointer" />
                <FaVideo className="text-gray-600 cursor-pointer" />
                <FaEllipsisV className="text-gray-600 cursor-pointer" />
            </div>
        </div>
    );
};

export default ChatTop;
