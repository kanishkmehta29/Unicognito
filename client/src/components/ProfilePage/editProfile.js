import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

function EditProfile(props) {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };  

  const handleAddCourse = () => {
    const formData = new FormData();
    formData.append('description', caption);
    formData.append('avatar', selectedFile[0]);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true // Add withCredentials option
    };    

    props.setIsEdit(false);

    axios.put('http://localhost:3001/profile/', formData, config)
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
        <Typography variant="h4" gutterBottom>Edit Profile</Typography>
        <TextField
            label={"Bio *"}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          margin="normal"
        />
        <input type="file" accept='.png,.jpg' className="pt-4" onChange={handleFileChange} />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" className='disabled:bg-[#0016DA] bg-[#0016DA]' onClick={handleAddCourse} 
          disabled={caption===""}>Add</Button>
          <Button variant="contained" onClick={() => props.setIsEdit(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default EditProfile;
