import React, { useState, useEffect, useCallback } from "react";
import { FaPhoneAlt, FaVideo, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import axios from "axios";

const ChatTop = ({ user, selected }) => {
  const [senderUsername, setSenderUsername] = useState(null);
  const isGroupChat = selected?.isGroupChat || false;
  const isAdmin = selected?.groupAdmin?.includes(user._id);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [changeAdminSelected, setChangeAdminSelected] = useState(false);
  const [members, setMembers] = useState([]);
  const [groupAdmin, setGroupAdmin] = useState([]);
  const [memberUsers, setMemberUsers] = useState([]);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false); // State for video call modal
  const [videoCallName, setVideoCallName] = useState("");
  const [videoCallRoom, setVideoCallRoom] = useState("");
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    if (!isGroupChat) {
      setSenderUsername(selected);
    }
    if (selected && selected.members && selected.groupAdmin) {
      setMembers(selected.members);
      setGroupAdmin(selected.groupAdmin);
    }

    const fetchUsernames = async () => {
      try {
        const promises = selected.members.map(async (memberId) => {
          const response = await axios.get("/users", {
            params: { userId: memberId },
          });
          return response.data;
        });
        const users = await Promise.all(promises);
        setMemberUsers(users);
      } catch (error) {
        console.error("Error fetching member information:", error);
      }
    };

    fetchUsernames();
  }, [selected, isGroupChat]);

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleAdminClick = () => {
    setChangeAdminSelected(true);
  };

  const handleCloseModal = () => {
    setShowSettingsModal(false);
    setShowSearch(false);
    setChangeAdminSelected(false);
    setSearchInput("");
    setSearchResults([]);
  };

  const handleAddUser = () => {
    setShowSearch(true);
  };

  const handleRemoveUser = () => {
    setShowSearch(true);
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    axios
      .post("/users/search", { find_prof: e.target.value })
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
  };

  const handleAddSelectedUsers = () => {
    axios
      .post("/conversations/addM", {
        members: selectedUsers.map((user) => user._id),
        conversationId: selected._id,
      })
      .then((response) => {
        console.log("Members added successfully:", response.data);
        setSelectedUsers([]);
        setShowSettingsModal(false);
        setShowSearch(false);
      })
      .catch((error) => {
        console.error("Error adding members:", error);
      });
  };

  const handleRemoveSelectedUsers = () => {
    axios
      .post("/conversations/removeM", {
        members: selectedUsers.map((user) => user._id),
        conversationId: selected._id,
      })
      .then((response) => {
        console.log("Members removed successfully:", response.data);
        setSelectedUsers([]);
        setShowSettingsModal(false);
        setShowSearch(false);
      })
      .catch((error) => {
        console.error("Error removing members:", error);
      });
  };

  const handleRemoveAdmin = (adminId) => {
    axios
      .post("/conversations/removeAd", {
        curId: user._id,
        memberId: adminId,
        conversationId: selected._id,
      })
      .then((response) => {
        console.log("Admin removed successfully:", response.data);
        // Fetch updated members and admin status
        if (response.data.members && response.data.groupAdmin) {
          setMembers(response.data.members);
          setGroupAdmin(response.data.groupAdmin);
        }
      })
      .catch((error) => {
        console.error("Error removing admin:", error);
      });
  };

  const handleAddAdmin = (adminId) => {
    axios
      .post("/conversations/makeAd", {
        curId: user._id,
        memberId: adminId,
        conversationId: selected._id,
      })
      .then((response) => {
        console.log("Admin added successfully:", response.data);
        // Fetch updated members and admin status
        if (response.data.members && response.data.groupAdmin) {
          setMembers(response.data.members);
          setGroupAdmin(response.data.groupAdmin);
        }
      })
      .catch((error) => {
        console.error("Error adding admin:", error);
      });
  };

  const handleVideoCallClick = () => {
    setShowVideoCallModal(true);
  };

  const handleVideoCallJoin = () => {
    console.log("Joining video call with:", videoCallName, videoCallRoom);
    // Logic to join the video call
    setShowVideoCallModal(false);
    setVideoCallName("");
    setVideoCallRoom("");
  };

  const handleCloseVideoCallModal = () => {
    setShowVideoCallModal(false);
    setVideoCallName("");
    setVideoCallRoom("");
  };
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);
  return (
    <div className="flex justify-between items-center bg-gray-200 px-8 py-6 rounded-t-lg">
      <div className="flex items-center">
        {senderUsername && senderUsername.profilePicture && (
          <img
            src={senderUsername.profilePicture}
            alt="Profile"
            className="rounded-full h-8 w-8 mr-2"
          />
        )}
        <h2 className="text-lg font-semibold text-black">
          {isGroupChat
            ? selected?.chatName
            : senderUsername?.username || selected?.title || "Chat"}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        {isAdmin && (
          <FaEllipsisV
            className="text-gray-600 cursor-pointer"
            onClick={handleSettingsClick}
          />
        )}
        <FaPhoneAlt className="text-gray-600 cursor-pointer" />
        <FaVideo
          className="text-gray-600 cursor-pointer"
          onClick={handleVideoCallClick}
        />
      </div>
      {showSettingsModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button className="text-gray-700" onClick={handleCloseModal}>
                X
              </button>
            </div>
            {showSearch && (
              <div className="mb-4 overflow-y-auto max-h-40">
                <input
                  type="text"
                  placeholder="Search users"
                  className="border rounded-lg px-2 py-1 w-full"
                  value={searchInput}
                  onChange={handleChange}
                />
                <ul>
                  {searchResults.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => setSelectedUsers([...selectedUsers, user])}
                      className="search-result flex items-center cursor-pointer"
                    >
                      <img
                        src={
                          user.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/noadmin.webp"
                        }
                        alt="Profile"
                        className="rounded-full h-8 w-8 mr-2"
                      />
                      {user.username}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700">Selected Members</label>
              <div className="flex flex-wrap">
                {selectedUsers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center mr-2 mb-2 selected-member"
                  >
                    <img
                      src={
                        member.profilePicture
                          ? PF + member.profilePicture
                          : PF + "person/noadmin.webp"
                      }
                      alt="Profile"
                      className="rounded-full h-8 w-8 mr-2"
                    />
                    <span>{member.username}</span>
                    <button
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs"
                      onClick={() =>
                        setSelectedUsers(
                          selectedUsers.filter((u) => u._id !== member._id)
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {changeAdminSelected && members.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Members:</h3>
                <ul>
                  {memberUsers.map((user) => (
                    <li key={user._id} className="flex items-center mb-2">
                      <img
                        src={
                          user.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/noadmin.webp"
                        }
                        alt="Profile"
                        className="rounded-full h-8 w-8 mr-2"
                      />
                      <span>{user.username}</span>
                      {groupAdmin.includes(user._id) ? (
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => handleRemoveAdmin(user._id)}
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          className="ml-2 text-green-500"
                          onClick={() => handleAddAdmin(user._id)}
                        >
                          Add Admin
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
              onClick={showSearch ? handleAddSelectedUsers : handleAddUser}
            >
              {showSearch ? "Add Selected Users" : "Add User"}
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2"
              onClick={
                showSearch ? handleRemoveSelectedUsers : handleRemoveUser
              }
            >
              {showSearch ? "Remove Selected Users" : "Remove User"}
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
              onClick={handleAdminClick}
            >
              Members
            </button>
          </div>
        </div>
      )}
      {showVideoCallModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Join Video Call</h2>
              <button
                className="text-gray-700"
                onClick={handleCloseVideoCallModal}
              >
                X
              </button>
            </div>
            <form onSubmit={handleSubmitForm}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="border rounded-lg px-2 py-1 w-full"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="room">
                Room Number
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="border rounded-lg px-2 py-1 w-full"
                id="room"
                placeholder="Enter room number"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Join
            </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTop;
