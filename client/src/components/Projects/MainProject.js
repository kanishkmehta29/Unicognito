import React, { useEffect } from 'react';
import Row from './CardRow';

const MainProject = (props) => {
    let projects = props.projects;

    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        const rows = [];
        for (let i = 0; i < projects.length-1; i += 2) {
            const project1 = projects[i];
            const project2 = projects[i + 1];
            const row = (
                <Row key={i} projects={[project1, project2]} />
            );
            rows.push(row);
        }
        if (projects.length % 2 !== 0) {
            const lastProject = projects[projects.length - 1];
            const row = (
                <Row key={projects.length} projects={[lastProject]} />
            );
            rows.push(row);
        }
        setRows(rows);
    }, [projects]);

    return (
        <div className='md:ml-[25vw]  flex flex-col w-full' style={{marginLeft: 'auto'}}>
            {rows}
        </div>
    );
};

export default MainProject;
