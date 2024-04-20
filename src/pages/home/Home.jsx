import React from 'react';
import Topbar from "../../components/topbar/Topbar"
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from  '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';

export default function Home() {
    return (
        <div style={{ height: 'calc(100vh - 70px)' }}>
            <Topbar/>
            <div className='flex h-full'>
                <div className='w-3/12 h-full'> 
                    <Sidebar/>
                </div>
                <div className='w-5/12 h-full'> 
                    <Feed/>
                </div>
                <div className='w-4/12 h-full'> 
                    <Rightbar/>
                </div>
            </div>
        </div>
    );
}
