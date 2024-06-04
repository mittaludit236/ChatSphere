import React from 'react'

export default function online({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="flex items-center mb-4">
    <div className="rightbarprofile relative z-10000000">
        <img
            className="w-10 h-10 rounded-full"
            src={PF+ user.profilePicture}
            alt="Profile"
        />
        <span className="w-3 h-3 rounded-full bg-green-500 absolute top-0 right-0 border-2 border-white"></span>
    </div>
    <span className="font-medium ml-2">{user.username}</span>
</li>
  )
}
