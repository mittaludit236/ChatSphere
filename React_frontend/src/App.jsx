import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { AuthContext } from './context/AuthContext';
import Messenger from './messenger/messenger';
import SettingsModal from './components/settings/SettingsModal';
import CreateGroup from "./messenger/createGroup"
function App() {
  const { user } = useContext(AuthContext);
  console.log("user exiist kart bhi hai????",user);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/messenger" element={!user ? <Navigate to="/" /> : <Messenger />} />
        <Route path="/messenger/createGroup" element={user ?  <CreateGroup/> :<Register/>}/>
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/" element={user ? <Home /> : <Register />} />
        
        {/* Route for settings with SettingsModal component */}
        <Route path="/settings/:username" element={<SettingsModal />} />
      </Routes>
    </Router>
  );
}

export default App;
