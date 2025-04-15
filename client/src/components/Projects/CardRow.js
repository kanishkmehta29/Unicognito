import React from 'react';
import Card from '../Projects/Card';
import UseMediaQuery from '../../hooks/useMediaQuery';

const CardRow = (props) => {
    const md = UseMediaQuery('(max-width: 768px)');
    let projects = props.projects;


    return (
        <div className='flex flex-col md:flex-row gap-0 justify-end mr-[4vw] items-center'>
            <Card project={projects[0]} />
            {projects.length ==2 ? <Card project ={projects[1]} /> : ''}
        </div>
    );
};

export default CardRow;
