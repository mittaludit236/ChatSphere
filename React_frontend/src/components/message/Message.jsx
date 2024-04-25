import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={`message ${own ? "ml-40" : ""} flex flex-col mt-4`}>
      <div className="messageTop flex">
        <img
          className="messageImg w-8 h-8 rounded-full mr-2"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        <p className={`messageText p-2 rounded-lg ${own ? "bg-gray-200 text-black " : "bg-blue-500 text-white"} max-w-xs`}>{message.text}</p>
      </div>
      <div className="messageBottom text-sm mt-2">{format(message.createdAt)}</div>
    </div>
  );
}
