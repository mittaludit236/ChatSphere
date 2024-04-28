import React from "react";
import Topbar from "../components/topbar/Topbar";
import Conversation from "../components/conversations/Conversations";
import Message from "../components/message/Message";
import ChatOnline from "../components/chatOnline/chatOnline";
import { AuthContext } from "../context/AuthContext";
import { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import Modal from './Modal';
import axios from "axios";
import { io } from "socket.io-client";
import ChatTop from "./chatTop";
import { RiEmotionLine } from 'react-icons/ri';
import EmojiPicker from "emoji-picker-react"
import { BiDotsVertical } from 'react-icons/bi';
import { BiSearch } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';

export default function Messenger() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const { user } = useContext(AuthContext);
    const scrollRef = useRef();
    const [searchInput, setSearchInput] = useState('');
    // State for search input value
    const [searchResults, setSearchResults] = useState([]); // State for storing search results
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    // const sender = messages[0].sender; 
    const handleChange = (e) => {
        setSearchInput(e.target.value);
        // Make a request to the backend when search input changes
        axios.post('/messages/search', { find_prof: e.target.value, userId: user._id })
            .then((response) => {
                // console.log("friend",response);
                setSearchResults(response.data);
                console.log("fornr", searchResults) // Set search results state with data from the backend
            })
            .catch((error) => {
                console.error('Error searching:', error);
            });
    };

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
                user.followings.filter((f) => users.some((u) => u.userId === f))
            );
        });
    }, [user]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("welcome", message => {
                console.log(message);
            });
        }
    }, [socket.current]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id);
                console.log("res", res);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });
        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleConversationClick = (conversationId) => {
        // Find the conversation with the selected ID
        const selectedConversation = conversations.find((c) => c._id === conversationId);
        // Set the current chat to the selected conversation
        setCurrentChat(selectedConversation);
    };
    const [open, setOpen] = useState(false);

    const handleEmoji = e => {
        setNewMessage((prev) => prev + e.emoji);
        setOpen(false);
    }
    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
    };
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };
    const [showCreateGroupDiv, setShowCreateGroupDiv] = useState(false);
    const toggleCreateGroupDiv = () => {
        setShowCreateGroupDiv((prev) => !prev);
    };
    const closeCreateGroupDiv = () => {
        setShowCreateGroupDiv(false);
        setShowDropdown(false);
    };
    return (
        <div className="h-screen bg-gray-100 flex flex-col relative">
            <Topbar />
            {showCreateGroupDiv && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-blue-300 shadow-md rounded-md mt-2">
                    <div className="absolute top-0 right-0 p-2">
                        <AiOutlineClose className="text-gray-600 cursor-pointer" onClick={closeCreateGroupDiv} />
                    </div>
                    {/* Your content for creating a group */}
                    {/* You can add inputs, buttons, etc. */}
                    <div>Create Group</div>
                </div>
            )}
            <div className="flex-grow flex">
                {/* Conversations on the left */}
                <div className="w-1/4 border-r border-gray-300 relative z-10">
                    <div className="p-4 flex justify-between items-center relative">
                        {/* Search icon */}
                        <div className="text-gray-400 text-xl cursor-pointer" onClick={toggleSearchBar}>
                            <BiSearch />
                        </div>
                        {/* Three dots icon */}
                        <div className="text-gray-400 cursor-pointer" onClick={toggleDropdown}>
                            <BiDotsVertical />
                        </div>
                        {showDropdown && (
                            <div className="absolute top-full right-0 bg-white shadow-md rounded-md mt-2 z-10">
                                <ul>
                                    <button className="py-2 px-4" onClick={toggleCreateGroupDiv}>Create Group</button>
                                    <li className="py-2 px-4">Settings</li>
                                    <li className="py-2 px-4">Block User</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    {showSearchBar && (
                        <div className="p-4 relative">
                            <input
                                type="text"
                                placeholder="Search for friends"
                                className="w-full py-2 px-4 rounded border border-gray-400 focus:outline-none focus:border-teal-500"
                                value={searchInput}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-40">
                            {searchResults.map((userData) => (
                                <Modal key={userData._id} currentUser={user} clickedUser={userData} />
                            ))}
                        </div>
                    )}
                    <div className="overflow-y-auto">
                        {conversations.map((c) => (
                            <div key={c._id} ref={scrollRef} onClick={() => handleConversationClick(c._id)} className="cursor-pointer text-black">
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Messages and Chat Online section */}
                <div className="flex-grow flex relative z-0">
                    {/* Messages section */}
                    <div className="flex-grow border-b border-r border-gray-300 relative z-0">
                        {currentChat ? (
                            <div className="flex flex-col">
                                <div>
                                    <ChatTop currentUser={user} clickedUser={currentChat} />
                                </div>
                                <div className="p-4 overflow-y-auto">
                                    <div className="chatBoxTop flex-1 overflow-y-auto pr-10" style={{ maxHeight: "calc(100vh - 200px)" }}>
                                        {messages.map((m, index) => (
                                            <div key={index} ref={scrollRef} className={m.sender === user._id ? 'flex justify-end' : 'flex justify-start'}>
                                                <Message message={m} own={m.sender === user._id} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 absolute bottom-0 left-0 w-full">
                                    <div className="flex items-center justify-between">
                                        <textarea
                                            className="chatMessageInput flex-grow h-24 px-4 py-2 resize-none border rounded-md mr-2"
                                            placeholder="Write something..."
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        ></textarea>
                                        <div className="relative">
                                            <div>
                                                <RiEmotionLine className="text-gray-500 text-2xl mr-2 cursor-pointer" onClick={() => setOpen(!open)} />
                                            </div>
                                            {open && (
                                                <div className="absolute bottom-full left-0 z-10">
                                                    <EmojiPicker onEmojiClick={handleEmoji} />
                                                </div>
                                            )}
                                        </div>
                                        <button className="px-6 py-2 rounded bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleSubmit}>
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 to-purple-300">
                                <span className="noConversationText text-6xl text-white font-bold text-center shadow-lg p-6 rounded-lg">
                                    Open a conversation <br /> to start a chat.
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Chat Online section on the right */}
                    <div className="w-1/4 border-l border-gray-300">
                        <div className="p-4">
                            <ChatOnline
                                onlineUsers={onlineUsers}
                                currentId={user._id}
                                setCurrentChat={setCurrentChat}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );

}
