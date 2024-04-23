import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";


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
          <div className="flex flex-col items-center">
            <div className="relative h-80">
              <img
                className="w-full h-full object-cover"
                src={user.coverPicture || PF+"person/2.jpeg"}
                alt=""
              />
              <img
                className="w-32 h-32 rounded-full absolute top-32 left-0 right-0 mx-auto border-4 border-white"
                src={user.profilePicture || PF+"person/1.jpeg"}
                alt=""
              />
            </div>
            <div className="text-center mt-4">
              <h4 className="text-2xl">{user.username}</h4>
              <span className="text-gray-500">{user.desc}</span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
          <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
