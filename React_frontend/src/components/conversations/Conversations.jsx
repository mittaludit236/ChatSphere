import { useEffect, useState } from "react";
import axios from "axios";

export default function Conversation({ conversation, currentUser }) {
    const [user, setUser] = useState(null);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);

        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [currentUser, conversation]);
    return (
        <div className="flex items-center p-4 cursor-pointer mt-4 hover:bg-gray-100">
        <img
          className="w-10 h-10 rounded-full object-cover mr-4"
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noadmin.webp"
          }
          alt=""
        />
        <span className="font-medium">{user?.username}</span>
      </div>
    )
}