import { Link } from "react-router-dom";

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; // URL for the alternate picture

  return (
    <li className="flex items-center mb-4">
      <img
        className="w-8 h-8 rounded-full object-cover mr-2"
        src={user.profilePicture ? (PF + user.profilePicture) :  PF + 'person/noadmin.webp'}
        alt={user.username}
      />
      <Link to={`/profile/${user.username}`} className="font-medium ml-2">{user.username}</Link>
    </li>
  );
}
