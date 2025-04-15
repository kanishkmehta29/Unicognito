import React from 'react';

const SideBarProfile = () => {
    return(
        <div className='grid grid-cols-1 md:grid-cols-12 gap-1'>
            <div className='md:col-span-2 ml-[-0.5rem]'>
                <div className='bg-[#CCC] mx-auto w-[37px] h-[37px] rounded-full relative'>
                </div>
            </div>
            <div className='md:col-span-7 flex flex-col md:items-start md:justify-start items-center pt-0.5'>
                <div className='flex gap-2'>
                    <div className='text-[0.75rem] font-semibold'>
                        ABCD
                    </div>
                    <div className='flex items-center'>
                        <img src="images/verify.png" alt="Description" className="object-cover object-center w-[1.125rem] h-[1.125rem]" />
                    </div>
                </div>
                <div className='text-[0.5rem] align-bottom'>
                    @abcd
                </div>
            </div>
            <div className='md:col-span-3 flex flex-col items-end justify-end'>
                <div className='text-[0.5rem]'>
                    1hr ago
                </div>
            </div>     
        </div>        
    )
}

const ImgUnit = (props) => {
    return(
        <div className='relative'>
            <img src={props.src} alt="Description" className="object-cover object-center w-full" />
            <div className='absolute top-[3%] right-[3%] rounded-sm flex gap-1 px-1 bg-[#46D97E] text-white text-[0.75rem] items-center'>
                <img src="images/star.png" alt="Description" className="object-cover object-center w-3.5 h-3.5" />
                4.5
            </div>
        </div>
    )
}

function SkillsTiles(prop) {
    return (
      <div className="flex justify-center items-center mr-[0.3rem] bg-[#46D97E] rounded-xl">
        <span className="px-[0.3rem] text-xs font-semibold">{prop.value}</span>
      </div>
    );
  }

const SideBarUnit = (props) => {
    const img = props.img;
    return(
        <div className='p-4'>
            <SideBarProfile />
            <div className={img ? 
            'p-2 rounded-sm border border-[#1D90FF] mt-4':
            'py-2'}>
                {img ? <ImgUnit src={img} /> : '' }
                <div className='text-[0.9rem] font-bold py-2'>
                    WHY IS REACT PREFFERED BY ALL?
                </div>    
                <div className='flex justify-between'>
                        <div className='flex text-black'>
                            <SkillsTiles value="React" />
                            <SkillsTiles value="Web Dev" />
                        </div>
                        <div className='flex w-fit h-fit justify-end text-white items-center px-2 rounded-full border-[1px] border-white font-bold text-[0.75rem]'>
                                <img src="images/union.png" alt="Description" className="object-cover object-center w-[0.75rem] h-[0.75rem]" />
                                <img src="images/usersmall.png" alt="Description" className="object-cover object-center w-[0.75rem] h-[0.75rem]" />  
                                420  
                        </div>                
                </div>
            </div>           
        </div> 
    )
}

export {SideBarUnit}