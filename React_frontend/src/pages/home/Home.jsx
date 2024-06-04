import React from 'react';
import Topbar from "../../components/topbar/Topbar"
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';

export default function Home() {
    return (
        <div> {}
            <Topbar sticky />
            <div className="flex z-0">
                <div className="w-1/5">
                    <Sidebar sticky />
                </div>
                <div className="w-3/5">
                    <Feed />
                </div>
                <div className="w-1/5">
                    <Rightbar sticky />
                </div>
            </div>
        </div>
    );
}
