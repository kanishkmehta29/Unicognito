import React from 'react';
import { SideBarUnit } from './SideBarUnit';

const SideBar = (props) => {
    return(
        <div className='md:w-1/4 pt-12 text-white md:min-w-[25vh] min-w-[35vh]'>
            <div className='rounded-lg bg-[#1A1E29] min-h-[60vh] md:h-fit md:pb-[1rem] mb-[2rem] flex flex-col'>
                <SideBarHeader title={props.title}/>
                <SideBarUnit />
                <hr className='mt-[0.5rem] border-white' />
                <SideBarUnit />
                <hr className='mt-[0.5rem] border-white' />
                <SideBarUnit />
            </div>            
        </div>
    )
}

const SideBarHeader = (props) => {
    return(
        <div className='p-2'>
            <div className='flex flex-col justify-between items-center pb-3 pl-2 sm:flex-row'>
                <div className='text-xl text-white text-center sm:text-left font-semibold mb-2 sm:mb-0'>
                    {props.title}
                </div>
            </div>
            <hr className='border-white border-[0.0625rem]' />
        </div>        
    )
}

export {SideBar}