import React, { useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Modal = ({ currentUser, clickedUser }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // Function to handle clicking on the user
  const handleClick = async () => {
    try {
      // Make a POST request to your backend endpoint
      const response = await axios.post('/conversations', {
        senderId: currentUser._id,
        receiverId: clickedUser._id
      });
      
      // Handle the response if needed
      console.log(response.data);

      // Establish a socket connection
      const socket = io("ws://localhost:8900");

      // Emit an event to notify the server about the new conversation
      socket.emit("newConversation", {
        senderId: currentUser._id,
        receiverId: clickedUser._id
      });

      // Listen for messages from the server regarding the new conversation
      socket.on("conversationCreated", (data) => {
        console.log("New conversation created:", data);
        // You can perform further actions here, such as updating state or UI
      });
    } catch (error) {
      // Handle errors if any
      console.error('Error:', error);
    }
  };

  return (
    <div className="hover:underline z-2" onClick={handleClick}>
      <div className="modal">
        <div className="modal-content flex items-center py-2 px-4">
          {clickedUser.profilePicture ? (
            <img src={PF + clickedUser.profilePicture} alt={clickedUser.username} className="w-10 h-10 rounded-full object-cover mr-2" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
              <span className="text-gray-600">{clickedUser.username.charAt(0)}</span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{clickedUser.username}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
