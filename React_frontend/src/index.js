import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketProvider";
import { BrowserRouter } from "react-router-dom";
ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthContextProvider>
    <ToastContainer /> {}
  </React.StrictMode>,
  document.getElementById("root")
);
