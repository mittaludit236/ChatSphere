import React, { useState, useEffect, useRef, useContext } from 'react';
import Topbar from "../components/topbar/Topbar";
import Conversation from "../components/conversations/Conversations";
import Message from "../components/message/Message";
import ChatOnline from "../components/chatOnline/chatOnline";
import { AuthContext } from "../context/AuthContext";
import Modal from './Modal';
import CreateGroup from './createGroup';
import axios from "axios";
import { io } from "socket.io-client";
import ChatTop from "./chatTop";
import { RiEmotionLine } from 'react-icons/ri';
import EmojiPicker from "emoji-picker-react";
import { BiDotsVertical, BiSearch } from 'react-icons/bi';

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
    const [searchResults, setSearchResults] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        axios.post('/messages/search', { find_prof: e.target.value, userId: user._id })
            .then((response) => {
                setSearchResults(response.data);
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
                conversationId: data.conversationId,
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?._id === arrivalMessage.conversationId &&
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
                console.log("conversations", res);
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
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
        if (currentChat) {
            socket.current.emit("joinRoom", currentChat._id);
        }
    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        socket.current.emit("sendMessage", {
            senderId: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        });
        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleConversationClick = (conversationId) => {
        const selectedConversation = conversations.find((c) => c._id === conversationId);
        setCurrentChat(selectedConversation);
    };

    const [open, setOpen] = useState(false);

    const handleEmoji = e => {
        setNewMessage((prev) => prev + e.emoji);
        setOpen(false);
    };

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
        <div className="h-screen flex flex-col relative bg-gradient-to-br from-yellow-400 to-purple-400">
            <Topbar sticky />
            {showCreateGroupDiv && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <CreateGroup closeModal={closeCreateGroupDiv} />
                </div>
            )}
            <div className="flex-grow flex">
                <div className="w-1/4 border-r border-gray-300 relative z-10 overflow-y-auto bg-white shadow-lg mask-custom">
                    <div className="p-4 flex justify-between items-center relative border-b border-gray-200">
                        <div className="text-gray-400 text-xl cursor-pointer hover:text-gray-600 transition duration-300" onClick={toggleSearchBar}>
                            <BiSearch />
                        </div>
                        <div className="text-gray-400 cursor-pointer hover:text-gray-600 transition duration-300" onClick={toggleDropdown}>
                            <BiDotsVertical />
                        </div>
                        {showDropdown && (
                            <div className="absolute top-full right-0 bg-white shadow-md rounded-md mt-2 z-10 animate-fadeIn">
                                <ul className="py-1">
                                    <button className="block py-2 px-4 hover:bg-gray-100 transition duration-300" onClick={toggleCreateGroupDiv}>Create Group</button>
                                    <li className="block py-2 px-4 hover:bg-gray-100 transition duration-300">Settings</li>
                                    <li className="block py-2 px-4 hover:bg-gray-100 transition duration-300">Block User</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    {showSearchBar && (
                        <div className="p-4 relative">
                            <input
                                type="text"
                                placeholder="Search for friends"
                                className="w-full py-2 px-4 rounded border border-gray-400 focus:outline-none focus:border-teal-500 transition duration-300"
                                value={searchInput}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-40 animate-fadeIn">
                            {searchResults.map((userData) => (
                                <Modal key={userData._id} currentUser={user} clickedUser={userData} />
                            ))}
                        </div>
                    )}
                    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                        {conversations.map((c) => (
                            <div key={c._id} onClick={() => handleConversationClick(c._id)} className="cursor-pointer text-black hover:bg-gray-100 transition duration-300 p-2">
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-grow flex relative z-0">
                    <div className="flex-grow border-b border-r border-gray-300 relative z-0 flex flex-col bg-white shadow-lg mask-custom">
                        {currentChat ? (
                            currentChat.removed && currentChat.removed.includes(user._id) ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-center p-6 bg-white shadow-lg rounded-lg">
                                        <h2 className="text-xl font-semibold mb-4">You are not part of this group</h2>
                                        <p className="text-gray-500">You have been removed from this group. You cannot send or receive messages here.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <ChatTop 
                                        user={user} 
                                        senderId={currentChat.members.find(member => member !== user._id)} 
                                        selected={currentChat} 
                                    />
                                    <div className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                                        <div>
                                            {messages.map((m, index) => (
                                                <div key={index} ref={scrollRef} className={m.sender === user._id ? 'flex justify-end' : 'flex justify-start'}>
                                                    <Message message={m} own={m.sender === user._id} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <textarea
                                                className="chatMessageInput flex-grow h-24 px-4 py-2 resize-none border rounded-md mr-2 focus:outline-none focus:border-teal-500 transition duration-300"
                                                placeholder="Write something..."
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                value={newMessage}
                                            ></textarea>
                                            <div className="relative">
                                                <RiEmotionLine className="text-gray-500 text-2xl mr-2 cursor-pointer hover:text-teal-500 transition duration-300" onClick={() => setOpen(!open)} />
                                                {open && (
                                                    <div className="absolute bottom-full left-0 z-10 animate-fadeIn">
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
                            )
                        ) : (
                            <div className="flex justify-center items-center h-full bg-gradient-to-br from-blue-200 to-purple-300">
                                <span className="noConversationText text-6xl text-white font-bold text-center shadow-lg p-6 rounded-lg animate-fadeIn">
                                    Open a conversation <br /> to start a chat.
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="w-1/4 border-l border-gray-300 overflow-y-auto bg-white shadow-lg mask-custom">
                        <div className="p-4">
                            <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
