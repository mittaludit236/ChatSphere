import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaComment, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Modal from './Modal'; // Importing the Modal component
import { AuthContext } from '../../context/AuthContext';

const Topbar = () => {
  const [searchInput, setSearchInput] = useState(''); // State for search input value
  const [searchResults, setSearchResults] = useState([]); // State for storing search results
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    // Make a request to the backend when search input changes
    axios.post('/users/search', { find_prof: e.target.value })
      .then((response) => {
        setSearchResults(response.data); // Set search results state with data from the backend
      })
      .catch((error) => {
        console.error('Error searching:', error);
      });
  };

  return (
    <div className="bg-blue-500 h-16 w-full flex items-center sticky top-0 z-10000000">
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
        {/* Display search results */}
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
          <span className="cursor-pointer ml-10">Homepage</span>
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
        {/* Link to user profile */}
        <Link to={`/profile/${user.username}`}>
          <img src={user.profilePicture ? PF + user.profilePicture : PF + "person/noadmin.webp"} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer ml-10" />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
