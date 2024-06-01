import { useState, useEffect } from 'react';
import { format } from 'timeago.js';
import axios from 'axios';

export default function Message({ message, own }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Function to fetch user data by senderId
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/users', {
          params: { userId: message.sender },
        });
        console.log(res);
        setUsername(res.data.username);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [message.sender]);

  return (
    <div className={`message ${own ? 'ml-40' : ''} flex flex-col mt-4`}>
      <div className="messageTop flex items-center">
        <img
          className="messageImg w-10 h-10 rounded-full shadow-lg mr-3"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        <div className="flex flex-col">
          <span className="username font-bold text-sm text-gray-700">{username}</span>
          <p className={`messageText p-3 rounded-xl shadow-md ${own ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'} max-w-xs`}>
            {message.text}
          </p>
        </div>
      </div>
      <div className="messageBottom text-xs text-gray-500 mt-2">{format(message.createdAt)}</div>
    </div>
  );
}
