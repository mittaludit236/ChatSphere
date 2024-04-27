import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Post from "../../components/post/Post";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [usern, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const username = useParams().username;
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if (username) {
          res = await axios.get("/posts/profile/" + username);
        } else if (usern && usern._id) {
          res = await axios.get("/posts/timeline/" + usern._id);
        }
        setPosts(res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (usern || username) {
      fetchPosts();
    }
  }, [username, usern]);
  let x = true;
  return (
    <div className="flex-col">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col flex-9">
          <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md mb-8">
            <div className="relative h-60 w-full mb-6 rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={usern.coverPicture ? PF + usern.coverPicture : PF + "person/noadmin.webp"}
                alt=""
              />
              <img
                className="w-32 h-32 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 right-0 mx-auto border-4 border-white"
                src={usern.profilePicture ? PF + usern.profilePicture : PF + "person/1.jpeg"}
                alt=""
              />
            </div>
            <h2 className="text-3xl font-semibold mb-2">{usern.username}</h2>
            <p className="text-gray-600">{usern.desc}</p>
               {
                user.username===usern.username && (
                  <Link
                  to={`/settings/${username}`}
                  className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${username === usern.username ? 'block' : 'hidden'}`}
                >
                  Edit Profile
                </Link>
                )
               }

          </div>
          <div className="flex flex-col flex-1">
            {posts.map((p) => (
              <Post key={p._id} post={p} x={x} />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="sticky top-0 h-screen">
            <Rightbar user={usern} />
          </div>
        </div>
      </div>
    </div>
  );
}
