import React, { useContext, useRef ,useState } from 'react';
import { BiImage } from 'react-icons/bi';
import { HiTag } from 'react-icons/hi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoHappyOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai'; // Alternative for cancel icon
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
        window.location.reload();
      } catch (err) {}
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {}
  };

  return (
    <div className="share w-full h-48 rounded-lg shadow-md">
      <div className="shareWrapper p-4">
        <div className="shareTop flex items-center">
          <img
            className="shareProfileImg w-12 h-12 rounded-full object-cover mr-4"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noadmin.webp"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind "+user.username+ "?"}
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
              <BiImage className="shareIcon text-red-500 mr-1" /> {/* React Icon for image */}
              <span className="shareOptionText text-gray-700">Photo or Video</span>
              <input style={{display:"none"}} type="file" id="file" accept=",png,.jpeg,.jpg" onChange={(e)=>setFile(e.target.files[0])}></input>
            </label>
            <div className="shareOption flex items-center mr-6 cursor-pointer">
              <HiTag className="shareIcon text-blue-500 mr-1" /> {/* React Icon for tag */}
              <span className="shareOptionText text-gray-700">Tag</span>
            </div>
            <div className="shareOption flex items-center mr-6 cursor-pointer">
              <FaMapMarkerAlt className="shareIcon text-green-500 mr-1" /> {/* React Icon for location */}
              <span className="shareOptionText text-gray-700">Location</span>
            </div>
            <div className="shareOption flex items-center cursor-pointer">
              <IoHappyOutline className="shareIcon text-yellow-500 mr-1" /> {/* React Icon for feelings */}
              <span className="shareOptionText text-gray-700">Feelings</span>
            </div>
          </div>
          <button type="submit" className="shareButton py-2 px-4 rounded-lg bg-green-500 text-white font-medium focus:outline-none">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
