import { Users } from "../../dummyData";
import Online from "../online/Online";
import { IoGiftOutline } from 'react-icons/io5';

export default function Rightbar({ user }) {

  const HomeRightbar = () => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <IoGiftOutline className="w-10 h-10 mr-2" />
          <span className="font-light text-sm">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img className="w-full rounded-lg my-6" src="/assets/ad.png" alt="" />
        <h4 className="text-lg font-semibold mb-4">Online Friends</h4>
        <ul className="p-0 m-0 list-none">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </div>
    );
  };

  const ProfileRightbar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold mb-4">User information</h4>
        <div className="mb-6">
          <div className="flex mb-4">
            <span className="font-semibold mr-2">City:</span>
            <span>{user.city}</span>
          </div>
          <div className="flex mb-4">
            <span className="font-semibold mr-2">From:</span>
            <span>{user.from}</span>
          </div>
          <div className="flex mb-4">
            <span className="font-semibold mr-2">Relationship:</span>
            <span>{user.relationship}</span>
          </div>
        </div>
        <h4 className="text-lg font-semibold mb-4">User friends</h4>
        <div className="flex flex-wrap -mx-2 mb-8">
          {Users.slice(0, 6).map((user) => (
            <div key={user.id} className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-2 mb-4">
              <div className="flex flex-col items-center">
                <img
                  src={PF+ user.profilePicture}
                  alt=""
                  className="w-20 h-20 object-cover rounded-full mb-2"
                />
                <span>{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="hidden md:flex md:flex-1.5 md:flex-col md:justify-center md:items-center">
      <div className="p-4 rightbar">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
