import { MdDelete } from "react-icons/md";
import React, { useContext, useState, useEffect } from 'react';
import { format } from "timeago.js";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CommentModal from "../comment/Comments";

export default function Post({ post ,x}) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for showing delete confirmation modal
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

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
      setShowDeleteConfirmation(false);
      window.location.reload(); // Reload the page
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCommentsModal = () => {
    setShowComments(!showComments);
  };

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
          {post.userId === currentUser._id && x && ( // Conditionally render delete icon
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
            <span className="text-sm cursor-pointer border-b border-gray-400" onClick={toggleCommentsModal}>
              {post.comment} comments
            </span>
          </div>
        </div>
      </div>
      {showComments && <CommentModal postId={post._id} closeModal={toggleCommentsModal} />}
      {/* Confirmation Modal */}
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
    </div>
  );
}
