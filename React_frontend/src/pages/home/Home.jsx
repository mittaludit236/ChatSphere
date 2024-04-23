import React from 'react';
import Topbar from "../../components/topbar/Topbar"
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';

export default function Home() {
    return (
        <div>
            <Topbar />
            <div className="flex">
                <div className="w-1/5">
                    <Sidebar />
                </div>
                <div className="w-3/5">
                    <Feed />
                </div>
                <div className="w-1/5">
                    <Rightbar />
                </div>
            </div>
        </div>
    );
}
