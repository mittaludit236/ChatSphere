import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Profile() {
  return (
    <>
      <Topbar />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col flex-9">
          <div className="flex flex-col items-center">
            <div className="relative h-80">
              <img
                className="w-full h-full object-cover"
                src="assets/post/3.jpeg"
                alt=""
              />
              <img
                className="w-32 h-32 rounded-full absolute top-32 left-0 right-0 mx-auto border-4 border-white"
                src="assets/person/7.jpeg"
                alt=""
              />
            </div>
            <div className="text-center mt-4">
              <h4 className="text-2xl">Safak Kocaoglu</h4>
              <span className="text-gray-500">Hello my friends!</span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <Feed />
            <Rightbar profile />
          </div>
        </div>
      </div>
    </>
  );
}
