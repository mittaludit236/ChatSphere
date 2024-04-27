// import "./sidebar.css";
import {
//   RiRssFeedLine,
  RiChat1Line,
  RiPlayCircleFill,
  RiGroupLine,
  RiBookmarkLine,
  RiQuestionLine,
  RiBriefcaseLine,
  RiCalendarEventLine,
  RiBook2Line,
} from 'react-icons/ri';
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";

export default function Sidebar() {
  return (
<div className="flex-3 h-full overflow-y-scroll sticky top-16 z-0">

      <div className="p-5">
        <ul className="p-0 m-0 list-none">
          <li className="flex items-center mb-8">
            <RiPlayCircleFill className="mr-3" />
            <span className="font-medium">Feed</span>
          </li>
          <li className="flex items-center mb-8">
            <RiChat1Line className="mr-3" />
            <span className="font-medium">Chats</span>
          </li>
          <li className="flex items-center mb-8">
            <RiPlayCircleFill className="mr-3" />
            <span className="font-medium">Videos</span>
          </li>
          <li className="flex items-center mb-8">
            <RiGroupLine className="mr-3" />
            <span className="font-medium">Groups</span>
          </li>
          <li className="flex items-center mb-8">
            <RiBookmarkLine className="mr-3" />
            <span className="font-medium">Bookmarks</span>
          </li>
          <li className="flex items-center mb-8">
            <RiQuestionLine className="mr-3" />
            <span className="font-medium">Questions</span>
          </li>
          <li className="flex items-center mb-8">
            <RiBriefcaseLine className="mr-3" />
            <span className="font-medium">Jobs</span>
          </li>
          <li className="flex items-center mb-8">
            <RiCalendarEventLine className="mr-3" />
            <span className="font-medium">Events</span>
          </li>
          <li className="flex items-center mb-8">
            <RiBook2Line className="mr-3" />
            <span className="font-medium">Courses</span>
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
