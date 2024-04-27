import { AiOutlineEllipsis } from "react-icons/ai"; // Using Material Design icons
import React, { useContext } from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CommentModal from "../comment/Comments"


export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext)
  const [showComments, setShowComments] = useState(false); 

   useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id))
   },[currentUser._id,post.likes])

  const likeHandler = () => {

    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id })
    } catch (err) {
      
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

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
            <span className="text-base font-medium">
              {user.username}
            </span>
            <span className="text-sm text-gray-500 ml-2">{format(post.createdAt)}</span>
          </div>
          <div className="text-gray-500">
            <AiOutlineEllipsis />
          </div>
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
              onClick={likeHandler}
              alt=""
            />
            <img
              className="w-6 h-6 mr-1 cursor-pointer"
              src={`${PF}heart.png`}
              onClick={likeHandler}
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
    </div>
  );
}
