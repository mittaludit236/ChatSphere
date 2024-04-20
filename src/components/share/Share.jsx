import React from 'react';
import { BsFillImageFill } from 'react-icons/bs';
import { HiTag } from 'react-icons/hi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoHappyOutline } from 'react-icons/io5';

export default function Share() {
  return (
    <div className="share w-full h-48 rounded-lg shadow-md">
      <div className="shareWrapper p-4">
        <div className="shareTop flex items-center">
          <img
            className="shareProfileImg w-12 h-12 rounded-full object-cover mr-4"
            src="/assets/person/1.jpeg"
            alt=""
          />
          <input
            placeholder="What's in your mind Safak?"
            className="shareInput border-none w-full focus:outline-none"
          />
        </div>
        <hr className="shareHr my-4" />
        <div className="shareBottom flex items-center justify-between">
          <div className="shareOptions flex">
            <div className="shareOption flex items-center mr-6 cursor-pointer">
              <BsFillImageFill className="shareIcon text-red-500 mr-1" />
              <span className="shareOptionText text-gray-700">Photo or Video</span>
            </div>
            <div className="shareOption flex items-center mr-6 cursor-pointer">
              <HiTag className="shareIcon text-blue-500 mr-1" />
              <span className="shareOptionText text-gray-700">Tag</span>
            </div>
            <div className="shareOption flex items-center mr-6 cursor-pointer">
              <FaMapMarkerAlt className="shareIcon text-green-500 mr-1" />
              <span className="shareOptionText text-gray-700">Location</span>
            </div>
            <div className="shareOption flex items-center cursor-pointer">
              <IoHappyOutline className="shareIcon text-yellow-500 mr-1" />
              <span className="shareOptionText text-gray-700">Feelings</span>
            </div>
          </div>
          <button className="shareButton py-2 px-4 rounded-lg bg-green-500 text-white font-medium focus:outline-none">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
