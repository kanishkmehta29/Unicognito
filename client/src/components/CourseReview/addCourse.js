import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function AddCourse(props) {
  const [courseName, setcourseName] = useState('');
  const [linkToCourse, setLinkToCourse] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };

  const getUserId = () => {
    if (currentUser) {
      return currentUser.id;
    }
    
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error);
    }
    return null;
  };

  const handleAddCourse = () => {
    const formData = new FormData();
    formData.append('title', courseName);
    formData.append('courseLink', linkToCourse); // Changed from 'link' to 'courseLink' to match the schema
    formData.append('description', description);
    
    // Use the authenticated user from context or session storage
    const user = getUserId();
    if (user) {
      formData.append('userId', user.id || user);
    }

    // Make sure we're using the correct field name that matches the backend
    if (selectedFile.length > 0) {
      formData.append('thumbnail', selectedFile[0]);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true 
    };
    
    props.setIsAddCourse(false);

    console.log("Submitting course review:", {
      title: courseName,
      courseLink: linkToCourse, // Updated log to match the correct field name
      description
    });

    axios.post('http://localhost:3001/coursereview', formData, config)
      .then(response => {
        console.log("Course review created:", response.data);
        window.location.reload(); // Reload to show the new course review
      })
      .catch(error => {
        console.error("Error creating course review:", error, error.response?.data);
        alert("Failed to create course review: " + (error.response?.data?.message || "Please try again"));
      });
  };

  return (
    <Container component={Paper} maxWidth="sm">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Add a Review</Typography>
        <TextField
          label="Course Name *"
          variant="outlined"
          fullWidth
          size="small"
          value={courseName}
          onChange={(e) => setcourseName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Link To Course *"
          variant="outlined"
          fullWidth
          size="small"
          value={linkToCourse}
          onChange={(e) => setLinkToCourse(e.target.value)}
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
        <input type="file" className="pt-4" onChange={handleFileChange} />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" onClick={handleAddCourse} className=' disabled:bg-blue-200 bg-[#0016DA]'
           disabled={courseName===""||linkToCourse===""||description===""||selectedFile.length===0}>Add</Button>
          <Button variant="contained"  onClick={() => props.setIsAddCourse(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default AddCourse;
