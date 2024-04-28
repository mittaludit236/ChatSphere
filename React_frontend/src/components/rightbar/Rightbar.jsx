import React, { useContext, useState, useEffect } from 'react';
import { IoGiftOutline } from 'react-icons/io5';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Online from '../online/Online';
import { Users } from '../../dummyData';

export default function Rightbar({ user }) {
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false); // Initialize followed as false

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (user && user._id) {
          const friendList = await axios.get('/users/friends/' + user._id);
          setFriends(friendList.data);

          // Check if the user is in the followings list
          setFollowed(currentUser.followings.includes(user._id));
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user, currentUser]);

  const handleClick = async () => {
    try {
      console.log("before", followed)
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, { userId: currentUser._id });
        dispatch({ type: 'UNFOLLOW', payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id });
        dispatch({ type: 'FOLLOW', payload: user._id });

      }
      setFollowed(!followed);
      console.log("after", followed)
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <IoGiftOutline className="w-10 h-10 mr-2" />
          <span className="font-light text-sm">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img className="w-full rounded-lg my-6" src="/assets/ad.png" alt="" />
        <h4 className="text-lg font-semibold mb-4">Online Friends</h4>
        <ul className="p-0 m-0 list-none">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </div>
    );
  };

  const ProfileRightbar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
      <div className="rightbar-profile">
        {user.username !== currentUser.username && (
        <button
        className={`follow-button mt-4 mb-2 rounded-full border-none bg-${followed ? 'red' : 'green'}-500 text-white flex items-center cursor-pointer hover:bg-${followed ? 'red' : 'green'}-600 transition duration-300 ease-in-out shadow-md py-2 px-4`}
        onClick={handleClick}
      > 
        {followed ? 'Unfollow' : 'Follow'}
        {followed ? <AiOutlineMinus className="icon ml-2" /> : <AiOutlinePlus className="icon ml-2" />}
      </button>
      
       
        )}
        <div className="user-info-section">
          <h4 className="text-lg font-semibold mb-4">User Information</h4>
          <div className="mb-6">
            <div className="flex mb-4">
              <span className="font-semibold mr-2">City:</span>
              <span>{user.city}</span>
            </div>
            <div className="flex mb-4">
              <span className="font-semibold mr-2">From:</span>
              <span>{user.from}</span>
            </div>
            <div className="flex mb-4">
              <span className="font-semibold mr-2">Relationship:</span>
              <span>{user.relationship}</span>
            </div>
          </div>
        </div>
        <h4 className="text-lg font-semibold mb-4">User Friends</h4>
        <div className="friends-list overflow-y-auto border border-gray-300 rounded-lg p-2">
          {friends.map((friend) => (
            <Link to={'/profile/' + friend.username} className="friend-link" key={friend._id}>
              <div className="friend-item flex items-center border-b py-2">
                <img
                  src={friend.profilePicture ? PF + friend.profilePicture : PF + 'person/noadmin.webp'}
                  alt=""
                  className="friend-image rounded-full w-8 h-8 mr-2"
                />
                <span className="friend-username font-medium">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  
  
  return (
    <div className="hidden md:flex md:flex-1.5 md:flex-col md:justify-center md:items-center">
      <div className="p-4 rightbar">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
