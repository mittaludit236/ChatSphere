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

export default function Messenger() {
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
                console.log(res);
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

    return (
        <div className="h-screen bg-gray-100 flex flex-col relative">
            <Topbar />
            <div className="flex-grow flex">
                {/* Conversations on the left */}
                <div className="w-1/4 border-r border-gray-300 relative z-10">
                    <div className="p-4">
                        <input
                            type="text"
                            placeholder="Search for friends"
                            className="w-full py-2 px-4 rounded border border-gray-400 focus:outline-none focus:border-teal-500"
                            value={searchInput}
                            onChange={handleChange}
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-20">
                            {searchResults.map((userData) => (
                                <Modal key={userData._id} currentUser={user} clickedUser={userData} />
                            ))}
                        </div>
                    )}
                    <div className="overflow-y-auto">
                        {conversations.map((c) => (
                            <div key={c._id} ref={scrollRef} onClick={() => setCurrentChat(c)} className="cursor-pointer text-black">
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Messages and Chat Online section */}
                <div className="flex-grow flex relative z-0">
                    {/* Messages section */}
                    <div className="flex-grow border-b border-r border-gray-300 relative z-0">
                        {
                            currentChat ?
                                <>
                                    <div className="p-4 overflow-y-auto">
                                        <div className="chatBoxTop flex-1 overflow-y-auto pr-10" style={{ maxHeight: "calc(100vh - 200px)" }}>
                                            {messages.map((m, index) => (
                                                <div key={index} ref={scrollRef} className={m.own ? 'flex justify-end ' : 'flex justify-start'}>
                                                    <Message message={m} own={m.sender === user._id} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                        <div className="p-4" style={{ position: 'absolute', bottom: '0', left: '0', width: '100%' }}>
                            <div className="flex items-center justify-between">
                                <textarea
                                    className="chatMessageInput flex-grow h-24 px-4 py-2 resize-none border rounded-md mr-2"
                                    placeholder="Write something..."
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    value={newMessage}
                                ></textarea>
                                <button className="px-6 py-2 rounded bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleSubmit}>
                                    Send
                                </button>
                            </div>
                        </div>


                    </> : <span className="noConversationText ">
                        Open a conversation to start a chat.
                    </span>}
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
