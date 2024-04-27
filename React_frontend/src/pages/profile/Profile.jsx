import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col flex-9">
          <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md mb-8">
            <div className="relative h-60 w-full mb-6 rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={user.coverPicture ? PF + user.coverPicture : PF + "person/noadmin.webp"}
                alt=""
              />
              <img
                className="w-32 h-32 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 right-0 mx-auto border-4 border-white"
                src={user.profilePicture ? PF + user.profilePicture : PF + "person/1.jpeg"}
                alt=""
              />
            </div>
            <h2 className="text-3xl font-semibold mb-2">{user.username}</h2>
            <p className="text-gray-600">{user.desc}</p>
            <Link
              to={`/settings/${username}`}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </Link>
          </div>
          <div className="flex flex-row flex-1">
            <Feed username={username} />
          </div>
        </div>
        <div className="flex-1">
          <div className="sticky top-0  h-screen">
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
