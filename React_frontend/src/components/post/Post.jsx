import { AiOutlineEllipsis } from "react-icons/ai"; // Using Material Design icons
import React, { useState } from 'react';
import { Users } from "../../dummyData";

export default function Post({ post }) {
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="w-full rounded-md shadow-md my-8">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              className="w-8 h-8 rounded-full object-cover mr-2"
              src={Users.find((u) => u.id === post?.userId)?.profilePicture}
              alt=""
            />
            <span className="text-base font-medium">
              {Users.find((u) => u.id === post?.userId)?.username}
            </span>
            <span className="text-sm text-gray-500 ml-2">{post.date}</span>
          </div>
          <div className="text-gray-500">
            <AiOutlineEllipsis/>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-base">{post?.desc}</span>
          <img className="mt-4 w-full max-h-96 object-contain" src={post.photo} alt="" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <img
              className="w-6 h-6 mr-1 cursor-pointer"
              src="assets/like.png"
              onClick={likeHandler}
              alt=""
            />
            <img
              className="w-6 h-6 mr-1 cursor-pointer"
              src="assets/heart.png"
              onClick={likeHandler}
              alt=""
            />
            <span className="text-sm">{like} people like it</span>
          </div>
          <div>
            <span className="text-sm cursor-pointer border-b border-gray-400"> 
              {post.comment} comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
