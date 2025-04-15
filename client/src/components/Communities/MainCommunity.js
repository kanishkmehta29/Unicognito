import React, { useEffect } from 'react';
import Row from './CommunityRow';

const MainCommunity = (props) => {
    let communities = props.communities;

    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        const rows = [];
        for (let i = 0; i < communities.length-1; i += 2) {
            const community1 = communities[i];
            const community2 = communities[i + 1];
            const row = (
                <Row key={i} communities={[community1, community2]} />
            );
            rows.push(row);
        }
        if (communities.length % 2 !== 0) {
            const lastCommunity = communities[communities.length - 1];
            const row = (
                <Row key={communities.length} communities={[lastCommunity]} />
            );
            rows.push(row);
        }
        setRows(rows);
    }, [communities]);

    return (
        <div className='md:ml-[25vw] flex flex-col w-full' style={{marginLeft: 'auto'}}>
            {rows}
        </div>
    );
};

export default MainCommunity;