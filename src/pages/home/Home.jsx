import React from 'react';
import Topbar from "../../components/topbar/Topbar"
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from  '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';

export default function Home() {
    return (
        <div style={{ height: 'calc(100vh - 70px)' }} className="flex">
            <Topbar/>
            <div className='flex flex-1 h-full'>
                <div className='w-3/12 h-full'> 
                    <Sidebar/>
                </div>
                <div className='w-5/12 h-full'> 
                    <Feed/>
                </div>
                <div className='w-4/12 h-full flex justify-end'> 
                    <Rightbar/>
                </div>
            </div>
        </div>
    );
}
