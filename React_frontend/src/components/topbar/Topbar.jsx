import { FaSearch, FaUser, FaComment, FaBell } from 'react-icons/fa';
import {Link} from "react-router-dom"
export default function Topbar() {
  return (
    <div className="bg-blue-500 h-16 w-full flex items-center sticky top-0 z-999">
      <div className="flex-3 pl-4 mr-4">
        <Link to ="/" >
        <span className="text-white text-xl font-bold cursor-pointer ml-10 mr-20">ChatSphere</span>
        </Link>
      </div>
      <div className="w-full flex-5 mr-4">
        <div className="w-full h-8 bg-white rounded-full flex items-center">
          <FaSearch className="text-gray-400 ml-2 " />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput ml-2 focus:outline-none w-5/6"
          />
        </div>
      </div>
      <div className="flex-4 flex items-center justify-around text-white mr-20 ml-20">
        <div className="mr-4">
          <span className="cursor-pointer ml-10">Homepage</span>
          <span className="ml-2 cursor-pointer ml-10">Timeline</span>
        </div>
        <div className="flex ml-20">
          <div className="mr-3 relative ml-5">
            <FaUser />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="mr-3 relative ml-3">
            <FaComment />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="mr-3 relative ml-3">
            <FaBell />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <img src="/assets/person/1.jpeg" alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer ml-10"/>
      </div>
    </div>
  );
}
