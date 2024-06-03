import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // import useNavigate
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Settings.css";

export default function Settings() {
    const navigate = useNavigate(); // initialize useNavigate
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const username = useParams().username;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users?username=${username}`);
                setUser(res.data);
                setName(res.data.name);
                setCity(res.data.city);
               
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, [username]); 

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleSaveChanges = async () => {
        if (!name || !city) {
            alert("Please provide values for name and city.");
            return;
        }

        try {
            const res = await axios.put(`/users?username=${username}`, { name, city });
            setUser(res.data);
            // Redirect to profile with updated name and city
            navigate(`/profile/${username}`);
        } catch (error) {
            console.error("Error updating user information:", error);
        }
    };

    return (
        <>
         <Topbar sticky />
        <div className="flex z-0">
               
                    <Sidebar />
            
                <div className="flex flex-col flex-9 ">
                    <section className="relative lg:mt-24 mt-[74px] pb-16">
                        <div className="lg:container container-fluid">
                            <div className="profile-banner relative text-transparent">
                                <input id="pro-banner" name="profile-banner" type="file" className="hidden" onChange="loadFile(event)" />
                                <div className="relative shrink-0">
                                    <img src={user.coverPicture ? PF + user.coverPicture : PF + "person/noadmin.webp"} className="h-64 w-full object-cover lg:rounded-xl shadow dark:shadow-gray-700" id="profile-banner" alt="" />
                                    <label className="absolute inset-0 cursor-pointer" htmlFor="pro-banner"></label>
                                </div>
                            </div>
                            <div className="md:flex mx-4 -mt-12">
                                <div className="md:w-full">
                                    <div className="relative flex items-end">
                                        <div className="profile-pic text-center">
                                            <input id="pro-img" name="profile-image" type="file" className="hidden" onChange="loadFile(event)" />
                                            <div>
                                                <div className="relative h-28 w-28 max-w-[112px] max-h-[112px] mx-auto">
                                                    <img src={user.profilePicture ? PF + user.profilePicture : PF + "person/1.jpeg"} className="rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800" id="profile-image" alt="" />
                                                    <label className="absolute inset-0 cursor-pointer" htmlFor="pro-img"></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ms-4">
                                            <h5 className="text-lg font-semibold">{user.username}</h5>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>{/* end container */}

                        <div className="container mt-16">
                            <div className="grid grid-cols-1 gap-[30px]">
                                <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white ">
                                    <h5 className="text-lg font-semibold mb-4">Personal Detail :</h5>
                                    <form>
                                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">

                                            <div>
                                                <label className="form-label font-medium"> Name : <span className="text-red-600">*</span></label>
                                                <input type="text" className="form-input border border-slate-100 dark:border-slate-800 mt-2" placeholder="Name:" id="name" name="name" value={name} onChange={handleNameChange} required />
                                            </div>

                                            <div>
                                                <label className="form-label font-medium"> City : <span className="text-red-600">*</span></label>
                                                <input type="text" className="form-input border border-slate-100 dark:border-slate-800 mt-2" placeholder="City:" id="city" name="city" value={city} onChange={handleCityChange} required />
                                            </div>


                                        </div>

                                        <div className="grid grid-cols-1">
                                            <div className="mt-3">
                                                <label className="form-label font-medium">Intro : </label>
                                                <textarea name="comments" id="comments" className="form-input border border-slate-100 dark:border-slate-800 mt-2 textarea" placeholder="Intro :"></textarea>
                                            </div>
                                        </div>{/* end row */}

                                        <div>
                                            <div className="mb-4 text-center">
                                                <button type="button" className="btn bg-emerald-600 hover-bg-emerald-700 border-emerald-600 hover-border-emerald-700 text-white rounded-md butreq" onClick={handleSaveChanges}>Save Changes</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
