import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

function AddFeed(props) {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };  

  const handleAddCourse = () => {
    const formData = new FormData();
    formData.append('creator', sessionStorage.getItem('user'));
    formData.append('caption', caption);
    for (let i = 0; i < selectedFile.length; i++) {
      formData.append('media', selectedFile[i]);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true // Add withCredentials option
    };    

    props.setIsAddFeed(false);

    axios.post('http://localhost:3001/posts/', formData, config)
    .then(response => {
      // Handle the response from the server
      console.log(response.data);
    })
    .catch(error => {
      // Handle any errors
      console.error(error);
    });
  };

  return (
    <Container component={Paper} maxWidth="sm">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Add a new Post</Typography>
        <TextField
          label={"Caption *"}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          margin="normal"
        />
        <input type="file" multiple accept='.png,.jpg,.mp4' className="pt-4" onChange={handleFileChange} />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" className='disabled:bg-blue-200 bg-[#0016DA]' onClick={handleAddCourse} 
          disabled={caption==="" ||selectedFile.length===0}>Add</Button>
          <Button variant="contained" onClick={() => props.setIsAddFeed(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default AddFeed;
