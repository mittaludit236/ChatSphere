import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaComment, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Modal from './Modal'; // Importing the Modal component
import { AuthContext } from '../../context/AuthContext'; // Import Logout action
import { Logout } from '../../context/AuthReducer';

const Topbar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { user, dispatch } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${user._id}`);
        setCurrentUser(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [user._id]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    axios.post('/users/search', { find_prof: e.target.value })
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error('Error searching:', error);
      });
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to close the modal

  return (
    <div className="bg-blue-500 h-16 w-full flex items-center sticky top-0 z-50">
      <div className="flex-3 pl-4 mr-4">
        <Link to="/">
          <span className="text-white text-xl font-bold cursor-pointer ml-10 mr-20">ChatSphere</span>
        </Link>
      </div>
      <div className="w-full flex-5 mr-4 relative">
        <div className="w-full h-8 bg-white rounded-full flex items-center">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput ml-2 focus:outline-none w-5/6"
            value={searchInput}
            onChange={handleChange}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg">
            {searchResults.map((user) => (
              <Modal key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
      <div className="flex-4 flex items-center justify-around text-white mr-20 ml-20">
        <div className="mr-4">
          <Link to='/'>
            <span className="cursor-pointer ml-10">Homepage</span>
          </Link>
          <span className="ml-2 cursor-pointer ml-10">Timeline</span>
        </div>
        <div className="flex ml-20">
          <div className="mr-3 relative ml-5">
            <FaUser />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="mr-3 relative ml-3">
            <FaComment />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="mr-3 relative ml-3">
            <FaBell />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <div>
          {isModalOpen && (
            <div className="absolute top-16 right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200">
              <button
                className="block w-full py-2 text-center bg-blue-500 text-white hover:bg-blue-600 rounded-t-lg focus:outline-none"
                onClick={() => { window.location.href = `/profile/${user.username}` }}
              >
                Profile
              </button>
              <button
                className="block w-full py-2 text-center bg-red-500 text-white hover:bg-red-600 rounded-b-lg focus:outline-none"
                onClick={() => { dispatch(Logout()); window.location.href = '/login'; }}
              >
                Logout
              </button>
            </div>
          )}

        </div>

        <img
          src={currentUser.profilePicture ? PF + currentUser.profilePicture : PF + "person/noadmin.webp"}
          alt=""
          className="w-8 h-8 rounded-full object-cover cursor-pointer ml-10"
          onClick={openModal}
        />
      </div>
    </div>
  );
};

export default Topbar;
