export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="flex items-center mb-4">
      <img
        className="w-8 h-8 rounded-full object-cover mr-2"
        src={PF+ user.profilePicture}
        alt={user.username}
      />
      <span className="font-medium">{user.username}</span>
    </li>
  );
}
