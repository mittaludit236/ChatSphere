import React from 'react';
import { Link } from 'react-router-dom';
import {
  RiChat1Line,
  RiPlayCircleFill,
  RiGroupLine,
} from 'react-icons/ri';
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";

export default function Sidebar() {
  return (

<div className="flex-3 h-full overflow-y-scroll sticky top-16 z-0">


    <div className="flex-3 h-full overflow-y-scroll sticky top-16 z-999">

      <div className="p-5">
        <ul className="p-0 m-0 list-none">
          <li className="flex items-center mb-8">
            
            <Link to="/messenger" className="flex items-center">
              <RiChat1Line className="mr-3" />
              <span className="font-medium">Chats</span>
            </Link>
          </li>
          <li className="flex items-center mb-8">
            <RiPlayCircleFill className="mr-3" />
            <span className="font-medium">Feed</span>
          </li>
          <li className="flex items-center mb-8">
            <RiPlayCircleFill className="mr-3" />
            <span className="font-medium">Videos</span>
          </li>
          <li className="flex items-center mb-8">
            <RiGroupLine className="mr-3" />
            <span className="font-medium">Groups</span>
          </li>
        </ul>
        <button className="w-32 py-2 bg-blue-500 text-white rounded-lg font-medium shadow hover:bg-blue-600">Show More</button>
        <hr className="my-8" />
        <ul className="p-0 m-0 list-none">
          {Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
