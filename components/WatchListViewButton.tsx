
import { useState } from 'react';
import Link from 'next/link';
import { IoBookmarks } from "react-icons/io5";

const WatchListBtn = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href="/watchlist">
            <div
                className={`fixed  bottom-16 right-10 lg:bottom-14 lg:right-16 z-50 flex items-center bg-gradient-to-r from-red-950 to-gray-900 text-white rounded-full shadow-xl shadow-gray-900 cursor-pointer p-3 lg:p-8 transition-all duration-300 ease-in-out ${isHovered ? 'w-52' : 'w-12 lg:w-24'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* <AiOutlineEye size={24} /> */}
                <div className='p-1 lg:pl-0'>
                    <IoBookmarks className='lg:size-7 size-4' />
                </div>
                <span className={`ml-3 overflow-hidden transition-all text-center duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                    Watchlist
                </span>
            </div>
        </Link>
    );
};

export default WatchListBtn;
