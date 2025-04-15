import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

function AddProject(props) {
  const [projectName, setProjectName] = useState('');
  const [linkToProject, setLinkToProject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleAddProject = () => {
    const formData = new FormData();
    formData.append('title', projectName);
    formData.append('githubLink', linkToProject);
    formData.append('description', description);
    formData.append('creatorId', localStorage.getItem('user'));
    for (let i = 0; i < selectedFile.length; i++) {
      formData.append('media', selectedFile[i]);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    };
    props.setIsAddProject(false);

    console.log(formData);

    axios.post('http://localhost:3001/projects/', formData, config)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Container component={Paper} maxWidth="sm">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Add a Project</Typography>
        <TextField
          label="Project Name *"
          variant="outlined"
          fullWidth
          size="small"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Link To Project *"
          variant="outlined"
          fullWidth
          size="small"
          value={linkToProject}
          onChange={(e) => setLinkToProject(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Description *"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <input type="file" multiple className="pt-4" onChange={handleFileChange} />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" onClick={handleAddProject} className=' disabled:bg-blue-200 bg-[#0016DA]'
          disabled={projectName===""||linkToProject===""||description===""||selectedFile.length===0}>Add</Button>
          <Button variant="contained"  onClick={() => props.setIsAddProject(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default AddProject;
