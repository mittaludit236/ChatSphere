import React, { useState, useContext, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the necessary CSS


const CreateGroup = ({ closeModal }) => {
    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [searchInput, setSearchInput] = useState(''); // State for search input value
    const [searchResults, setSearchResults] = useState([]); // State for storing search results
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const handleCreateGroup = async () => {
        try {
            // Make a request to create the group with the groupName and groupMembers
            const res = await axios.post('/conversations/groups', {
                groupName,
                members: groupMembers.map(member => member._id), // Send only member IDs
                userId: user._id,
            });
            console.log('Group Created:', res.data);
            toast.success('Group created successfully');
            closeModal();console.log('Group Created:', res.data);
   

        } catch (err) {
            console.error('Error creating group:', err);
        }
        
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

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

    const addMember = (member) => {
        if (!groupMembers.find(m => m._id === member._id)) {
            setGroupMembers([...groupMembers, member]);
        }
    };

    return (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[500px] h-auto bg-white shadow-md rounded-md p-4 z-50">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-xl font-bold">Create Group</h2>
                <AiOutlineClose className="text-gray-600 cursor-pointer" onClick={closeModal} />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Group Name</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Add Members</label>
                <input
                    type="text"
                    placeholder="Search for friends"
                    className="w-full px-4 py-2 border rounded-md"
                    value={searchInput}
                    onChange={handleChange}
                />
                {searchResults.length > 0 && (
                    <div className="bg-white border rounded-md mt-2 max-h-60 overflow-y-auto">
                        {searchResults.map((result) => (
                            <div
                                key={result._id}
                                className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => addMember(result)}
                            >
                                <img src={result.profilePicture ? PF + result.profilePicture : PF + "person/noadmin.webp"} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer ml-10" />
                                <span>{result.username}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Selected Members</label>
                <div className="flex flex-wrap">
                    {groupMembers.map((member) => (
                        <div key={member._id} className="flex items-center mr-2 mb-2">
                            <img src={member.profilePicture ? PF + member.profilePicture : PF + "person/noadmin.webp"} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer ml-10" />
                            <span>{member.username}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button
                className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition duration-300"
                onClick={handleCreateGroup}
            >
                Create Group
            </button>
        </div>
    );
};

export default CreateGroup;
