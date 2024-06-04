import React, { useContext, useRef, useState, useEffect } from 'react';
import { BiImage } from 'react-icons/bi';
import { HiTag } from 'react-icons/hi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the necessary CSS
import { IoHappyOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${user._id}`);
        setCurrentUser(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [user._id]);

  const submitHandler = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  

const handlePost = async (closeFriendSelected) => {
  const newPost = {
    userId: user._id,
    desc: desc.current.value,
    closeFriend: closeFriendSelected
  };

  if (file) {
    const data = new FormData();
    const fileName = Date.now() + file.name;
    data.append("name", fileName);
    data.append("file", file);
    newPost.img = fileName;
    try {
      await axios.post("/upload", data);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    await axios.post("/posts", newPost);
    toast.success("Post shared successfully"); // Toast notification for success
    setShowModal(false);
    // window.location.reload(); // Reload the window after the toast
  } catch (err) {
    console.error(err);
  }
   
  setTimeout(() => {
    window.location.reload();
  }, 500);

};

  return (
    <div className="share w-full h-48 rounded-lg shadow-md">
      <div className="shareWrapper p-4">
        <div className="shareTop flex items-center">
          <img
            className="shareProfileImg w-12 h-12 rounded-full object-cover mr-4"
            src={
              currentUser.profilePicture
                ? PF + currentUser.profilePicture
                : PF + "person/noadmin.webp"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + currentUser.username + "?"}
            className="shareInput border-none w-full focus:outline-none"
            ref={desc}
          />
        </div>
        <hr className="shareHr my-4" />
        {file && (
          <div className="shareImgContainer relative w-16 h-16">
            <img className="shareImg w-full h-full object-cover rounded-md" src={URL.createObjectURL(file)} alt="" />
            <AiOutlineCloseCircle className="shareCancelImg absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 cursor-pointer" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom flex items-center justify-between" onSubmit={submitHandler}>
          <div className="shareOptions flex">
            <label htmlFor="file" className="shareOption flex items-center mr-6 cursor-pointer">
              <BiImage className="shareIcon text-red-500 mr-1" />
              <span className="shareOptionText text-gray-700">Photo or Video</span>
              <input style={{ display: "none" }} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])}></input>
            </label>
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
          <button type="submit" className="shareButton py-2 px-4 rounded-lg bg-green-500 text-white font-medium focus:outline-none">
            Share
          </button>
        </form>
      </div>
      {showModal && (
        <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="modalContent bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Who can see your post?</h2>
            <div className="flex justify-around">
              <button
                className="py-2 px-4 rounded-lg bg-blue-500 text-white mr-4"
                onClick={() => handlePost(true)}
              >
                Close Friend
              </button>
              <button
                className="py-2 px-4 rounded-lg bg-gray-300 text-black"
                onClick={() => handlePost(false)}
              >
                Everyone
              </button>
            </div>
            <button
              className="mt-4 py-2 px-4 rounded-lg bg-red-500 text-white"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
