import { MdDelete } from "react-icons/md";
import React, { useContext, useState, useEffect } from 'react';
import { format } from "timeago.js";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CommentModal from "../comment/Comments";
import { FaRegCommentAlt } from "react-icons/fa";

import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the necessary CSS

export default function Post({ post, onDelete }) {
  const { closeFriend, userId } = post;
  const [isCloseFriend, setIsCloseFriend] = useState(false);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchCloseFriends = async () => {
      try {
        const res = await axios.get(`/users/cfriends/${userId}`);
        const closeFriends = res.data;
        const closeFriendIds = closeFriends.map(friend => friend._id);
        setIsCloseFriend(closeFriendIds.includes(currentUser._id));
        if (userId === currentUser._id) {
          setIsCloseFriend(true);
        }
      } catch (error) {
        console.error("Error fetching close friends:", error);
      }
    };

    fetchCloseFriends();
  }, [userId, currentUser._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [post.userId]);

  const handleLike = async () => {
    try {
      await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };
  const handleDeletePost = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
      toast.success("Post deleted successfully");
      console.log("Deleting post successful, reloading window...");
      setShowDeleteConfirmation(false);
      
     
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      // Ensure the window reloads even if there's an error (not recommended)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };
  
  

  const toggleCommentsModal = () => {
    setShowComments(!showComments);
  };

  if (!closeFriend || (closeFriend && isCloseFriend)) {
    return (
      <div className="w-full rounded-md shadow-md my-8">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to={`/profile/${user.username}`}>
                <img
                  className="w-8 h-8 rounded-full object-cover mr-2"
                  src={user.profilePicture ? PF + user.profilePicture : PF + "person/noadmin.webp"}
                  alt=""
                />
              </Link>
              <span className="text-base font-medium">{user.username}</span>
              <span className="text-sm text-gray-500 ml-2">{format(post.createdAt)}</span>
            </div>
            {post.userId === currentUser._id && (
              <div className="text-gray-500 cursor-pointer hover:text-blue-500">
                <MdDelete onClick={handleDeleteConfirmation} />
              </div>
            )}
          </div>
          <div className="mt-4">
            <span className="text-base">{post?.desc}</span>
            <img className="mt-4 w-full max-h-96 object-contain" src={PF + post.img} alt="" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <img
                className="w-6 h-6 mr-1 cursor-pointer"
                src={`${PF}like.png`}
                onClick={handleLike}
                alt=""
              />
              <img
                className="w-6 h-6 mr-1 cursor-pointer"
                src={`${PF}heart.png`}
                onClick={handleLike}
                alt=""
              />
              <span className="text-sm">{like} people like it</span>
            </div>
            <div>
              <span className="text-sm cursor-pointer border-gray-400 flex items-center" onClick={toggleCommentsModal}>
                <FaRegCommentAlt className="mr-2 text-gray-600" />
                {post.comments.length !== 0 && (
                  <span className="text-black-600">{post.comments.length}</span>
                )}
              </span>
            </div>
          </div>
        </div>
        {showComments && <CommentModal postId={post._id} closeModal={toggleCommentsModal} />}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md">
              <p>Are you sure you want to delete this post?</p>
              <div className="flex justify-end mt-4">
                <button onClick={handleDeletePost} className="px-4 py-2 bg-red-500 text-white rounded-md mr-2">Delete</button>
                <button onClick={() => setShowDeleteConfirmation(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
              </div>
            </div>
          </div>
          
        )}
         <ToastContainer /> 
      </div>
    );
  } else {
    return null; 
  }
}
