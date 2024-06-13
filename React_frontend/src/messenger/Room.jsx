import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { FaMicrophone, FaVideo, FaMicrophoneSlash, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const toggleMicrophone = () => {
    const audioTrack = myStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = myStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  };

  const endCall = () => {
    myStream.getTracks().forEach(track => track.stop());
    peer.peer.close();
    setMyStream(null);
    setRemoteStream(null);
    setRemoteSocketId(null);
    console.log("Call ended");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Room Page</h1>
      <h4 className="text-xl mb-8">
        {remoteSocketId ? "Connected" : "No one in room"}
      </h4>
      <div className="flex flex-col items-center space-y-4 mb-8">
        {myStream && (
          <button
            onClick={sendStreams}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Send Stream
          </button>
        )}
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          >
            CALL
          </button>
        )}
      </div>
      <div className="flex space-x-8">
        {myStream && (
          <div className="flex flex-col items-center p-4 bg-white border rounded shadow-lg relative">
            <h1 className="text-2xl font-semibold mb-4">My Stream</h1>
            <ReactPlayer
              playing
              height="200px"
              width="300px"
              url={myStream}
              className="border rounded"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={toggleMicrophone}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition duration-300"
              >
                {isMicOn ? (
                  <FaMicrophone className="text-xl text-gray-700" />
                ) : (
                  <FaMicrophoneSlash className="text-xl text-gray-700" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition duration-300"
              >
                {isVideoOn ? (
                  <FaVideo className="text-xl text-gray-700" />
                ) : (
                  <FaVideoSlash className="text-xl text-gray-700" />
                )}
              </button>
              <button
                onClick={endCall}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
              >
                <FaPhoneSlash className="text-xl" />
              </button>
            </div>
          </div>
        )}
        {remoteStream && (
          <div className="flex flex-col items-center p-4 bg-white border rounded shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Remote Stream</h1>
            <ReactPlayer
              playing
              height="300px" // Increased height
              width="400px"  // Increased width
              url={remoteStream}
              className="border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
