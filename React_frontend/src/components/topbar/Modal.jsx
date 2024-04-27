import React from 'react';
import { Link } from 'react-router-dom';

const Modal = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <Link to={`/profile/${user.username}`} className="hover:underline z-2">
      <div className="modal">
        <div className="modal-content flex items-center py-2 px-4">
          {user.profilePicture ? (
            <img src={PF + user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full object-cover mr-2" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
              <span className="text-gray-600">{user.username.charAt(0)}</span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{user.username}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Modal;
