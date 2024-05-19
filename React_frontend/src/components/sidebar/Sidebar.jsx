import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  RiChat1Line,
  RiPlayCircleFill,
  RiGroupLine,
} from 'react-icons/ri';
import CloseFriend from "../closeFriend/CloseFriend";
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { user: currentUser } = useContext(AuthContext);
  const [followings, setFollowings] = useState([]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleCloseFriend = async (friendId, isCloseFriend) => {
    try {
      if (currentUser && currentUser._id) {
        if (isCloseFriend) {
          await axios.put(`/users/${friendId}/rclosef`, { userId: currentUser._id });
        } else {
          await axios.put(`/users/${friendId}/closef`, { userId: currentUser._id });
        }
        // After adding/removing friend, update the friend list
        getFriends();
      }
    } catch (error) {
      console.error('Error toggling close friend:', error);
    }
  };

  const getFriends = async () => {
    try {
      if (currentUser && currentUser._id) {
        const friendList = await axios.get('/users/cfriends/' + currentUser._id);
        setFriends(friendList.data);
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  useEffect(() => {
    getFriends();
  }, [currentUser]);

  useEffect(() => {
    const getFollowings = async () => {
      try {
        if (currentUser && currentUser._id) {
          const followingList = await axios.get('/users/friends/' + currentUser._id);
          setFollowings(followingList.data);
        }
      } catch (err) {
        console.error('Error fetching followings:', err);
      }
    };
    getFollowings();
  }, [currentUser]);

  return (
    <div className="flex-3 h-full overflow-y-scroll sticky top-16 z-0">
      <div className="flex-3 h-full overflow-y-scroll sticky top-16 z-999">
        <div className="p-5">
          
          <ul className="p-0 m-0 list-none">
            <li className="flex items-center mb-8">   
              <Link to="/messenger" className="flex items-center">
                <RiChat1Line className="mr-3" />
                <span className="font-medium">Chats</span>
              </Link>
            </li>
            <li className="flex items-center mb-8">
              <RiPlayCircleFill className="mr-3" />
              <span className="font-medium">Feed</span>
            </li>
            <li className="flex items-center mb-8">
              <RiPlayCircleFill className="mr-3" />
              <span className="font-medium">Videos</span>
            </li>
            <li className="flex items-center mb-8">
              <RiGroupLine className="mr-3" />
              <span className="font-medium">Groups</span>
            </li>
          </ul>
          <hr className="my-8" />
          <button onClick={openModal} className="w-32 py-2 bg-blue-500 text-white rounded-lg font-medium shadow hover:bg-blue-600">Add Close Friend</button>
          <ul className="p-0 m-0 list-none">
            {friends.map((friend) => (
              <div key={friend._id} className="flex items-center mb-4 mt-4">
                <CloseFriend user={friend} />
              </div>
            ))}
          </ul>
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-96 shadow-lg relative">
            <button onClick={closeModal} className="text-gray-600 hover:text-gray-800 focus:outline-none absolute top-2 right-2">
              &times;
            </button>
            <div className="p-4">
              <input type="text" placeholder="Search for a user..." className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              <div className="mb-4">
                <span className="font-bold block mb-2">Following:</span>
                <ul className="divide-y divide-gray-200">
                  {followings.map((following) => {
                    const isCloseFriend = friends.some((friend) => friend._id === following._id);
                    return (
                      <li key={following._id} className="py-2 flex justify-between items-center">
                        <Link to={`/profile/${following.username}`} className="text-blue-500 hover:underline">{following.username}</Link>
                        <button className={isCloseFriend ? "text-red-500 hover:text-red-700 focus:outline-none" : "text-green-500 hover:text-green-700 focus:outline-none"} onClick={() => toggleCloseFriend(following._id, isCloseFriend)}>
                          {isCloseFriend ? "Remove" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
