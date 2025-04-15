import React, { useEffect,useState } from 'react';
import {fetchProfileFromServer} from '../../fetch/profile';
import { putUpvote,putDownvote } from '../../fetch/discussions';
import { Link } from 'react-router-dom';

const HeaderCard = (props) => {
    const [poster, setPoster] = useState({});
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [upvotes,setUpvotes] = useState((props.project.upvotes && props.project.upvotes.length) || 0);
    const [downvotes,setDownvotes] = useState((props.project.downvotes && props.project.downvotes.length) || 0);

    useEffect(() => {
        fetchProfileFromServer(sessionStorage.getItem('user')).then((res) => {
            console.log("PROPS: ",props);
            if(props.project.upvotes) {
                console.log(props.project.upvotes);
                setUpvotes(props.project.upvotes.length);
                if (props.project.upvotes.includes(res._id)) {
                    console.log('upvoted');
                    setUpvoted(true);
                }
                else{
                    console.log('not upvoted');
                    setUpvoted(false);
                }
            }
            if(props.project.downvotes) {
                console.log(props.project.downvotes);
                setDownvotes(props.project.downvotes.length);
                if (props.project.downvotes.includes(res._id)) {
                    console.log('downvoted');
                    setDownvoted(true);
                }
                else{
                    console.log('not downvoted');
                    setDownvoted(false);
                }
            }   
        }).catch(error => {
            console.error(error);
        });     
    }, [props.project]);    

    console.log('Project:', props.project);
    useEffect(() => {
        if(!props.project) return;
        if(!props.project.poster) return;
        fetchProfileFromServer(props.project.poster).then((response) => {
            setPoster(response);
            console.log('Poster:', response);
        }).catch((error) => {
            console.error('Error fetching poster:', error);
        });
    }, [props.project]);

    const formattedDate = new Date(props.project.postingTime).toLocaleDateString('en-UK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const handleLike = () => {
        putUpvote(props.project._id).then((response) => {
            console.log('Like:', response);
            if(downvoted) setDownvoted(!downvoted);
            setUpvoted(!upvoted);
            setUpvotes(response.data.upvotes.length);
            setDownvotes(response.data.downvotes.length);
        }).catch((error) => {
            console.error('Error liking:', error);
        });
    };

    const handleDislike = () => {
        console.log('Dislike:', props.project._id);
        putDownvote(props.project._id).then((response) => {
            console.log('Dislike:', response);
            if(upvoted) setUpvoted(!upvoted);
            setDownvoted(!downvoted);
            setUpvotes(response.data.upvotes.length);
            setDownvotes(response.data.downvotes.length);            
        }).catch((error) => {
            console.error('Error disliking:', error);
        });
    }

    return (
        <div className="mt-[16vh] flex flex-col w-[80vw] bg-white">
            <div className='relative bg-[#FFFFFF] w-[80vw] z-10 flex flex-col mx-auto px-[5vw] overflow-hidden rounded-l-xl rounded-t-xl'
            style={{boxShadow: '0px 0px 15px 0px #CCCCCC'}}>
                <img src="images/dots1.svg" className='absolute top-0 left-0 w-[25vw]' alt="dots" />
                <img src="images/dots2.svg" className='absolute bottom-0 right-0 w-[45.8vw] ' alt="dots" />
                <img src = "images/stars.svg" className='absolute ml-[5vw] bottom-0 left-0 w-[10vw] h-[10vh]' alt="stars" />
                <div className='pt-[12vh] pb-[15vh]'>
                    <div className = "w-full flex justify-end">

                    </div>
                    <div className='flex gap-2'>
                        <div>
                            {formattedDate}
                        </div>
                    </div>
                    <div className='text-[3rem] font-bold'>
                        {props.project.title}
                    </div>
                    <div className='flex mt-[3vh] gap-3'>
                        <Link to={`/profile/${poster && poster._id}`} className="flex items-center gap-2">
                            <div className='md:max-w-[60px] md:max-h-[60px] md:w-[4vw] md:h-[4vw] md:min-w-[32px] shadow md:min-h-[32px] h-[45px] w-[45px] rounded-full relative overflow-hidden'>
                                <img src={(poster && poster.thumbnail) ? poster.thumbnail : 'images/defaultThumbnail.jpeg'} className='md:max-w-[60px] md:max-h-[60px] md:w-[4vw] md:h-[4vw] md:min-w-[32px] md:min-h-[32px] h-[45px] w-[45px]' />
                            </div>
                        </Link>              
                    </div>
                </div>
            </div>
            <div className='relative ml-auto bg-[#FFFFFF] w-[30vw] h-[2.5rem] flex gap-8 px-[5vw] overflow-hidden rounded-b-xl'
            style={{boxShadow: '0px 0px 15px 0px #CCCCCC'}}>            
                <div className='flex justify-center items-center gap-1'>
                    <img src="images/view.svg" className='w-[2rem] h-[2rem]' alt="Project" />
                    <div className='text-[1rem]'>
                        {props.project.views || 0}
                    </div>                       
                </div>
                <div className='flex justify-center items-center gap-1'>
                    <img src={`images/${upvoted ? 'upvote' : 'emptyUpvote'}.svg`} 
                        className='w-[1.5rem] h-[1.5rem]' alt="star" 
                        onClick={handleLike}
                    />
                    <div className='text-[1rem]'>
                        {upvotes}
                    </div>
                </div>
                <div className='flex justify-center items-center gap-1'>
                    <img src={`images/${downvoted ? 'downvote' : 'emptyDownvote'}.svg`}  
                        className={`${downvoted ? 'w-[2rem] h-[2rem]}':'w-[2.4rem] h-[2.4rem]'}`} alt="star"
                        onClick={handleDislike}
                    />
                    <div className='text-[1rem]'>
                        {downvotes}
                    </div>
                </div>            
            </div>
        </div>
    );
};

export default HeaderCard;



