import React from 'react';
import CommunityCard from './CommunityCard';
import UseMediaQuery from '../../hooks/useMediaQuery';

const CommunityRow = (props) => {
    const md = UseMediaQuery('(max-width: 768px)');
    let communities = props.communities;

    return (
        <div className='flex flex-col md:flex-row gap-0 justify-end mr-[4vw] items-center'>
            <CommunityCard community={communities[0]} />
            {communities.length === 2 ? <CommunityCard community={communities[1]} /> : ''}
        </div>
    );
};

export default CommunityRow;