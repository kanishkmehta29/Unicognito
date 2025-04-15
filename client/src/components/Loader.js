import React from 'react';

function Loader() {
    return (
        <div className='fixed flex z-[9999] justify-center items-center w-screen h-screen left-0 top-0 bg-[#00000022]'>
                <img src="gif/loader.gif" alt="loader" className="m-auto w-[10vw] rounded-full h-[10vw] bg-blend-darken" />
        </div>
    );
}

export default Loader;
