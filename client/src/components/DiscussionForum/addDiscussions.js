import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { postDiscussion } from '../../fetch/discussions';
import { AuthContext } from '../../context/AuthContext';

// Get backend URL from environment variable with fallback
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

function AddDiscussion(props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { currentUser } = useContext(AuthContext);

  // Helper function to get user ID safely
  const getUserId = () => {
    if (currentUser) {
      return currentUser.id;
    }
    
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData.id || userData;
      }
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error);
    }
    return null;
  };

  const handleAddDiscussion = () => {
    const config = {
      withCredentials: true
    };

    // Get the user ID using our helper function
    const userId = getUserId();

    if (!userId) {
      alert("You must be logged in to create a discussion");
      return;
    }

    let formData = {
      title: title,
      content: content,
      // Don't pass the entire user object, just the ID
      poster: userId
    };

    props.setIsAddDiscussion(false);
    console.log("Submitting discussion:", formData);

    // Use the API URL from environment variables
    axios.post(`${BACKEND_URL}/discussion/`, formData, config)
      .then(response => {
        console.log("Discussion created:", response.data);
        window.location.reload();
      })
      .catch(error => {
        console.error("Error creating discussion:", error);
        alert("Failed to create discussion. Please try again.");
      });
  };

  return (
    <Container component={Paper} maxWidth="sm">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Discuss</Typography>
        <TextField
          label="Title *"
          variant="outlined"
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Content *"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" onClick={handleAddDiscussion} className='disabled:bg-blue-200 bg-[#0016DA]'
          disabled={title===""||content===""}>Add</Button>
          <Button variant="contained" onClick={() => props.setIsAddDiscussion(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default AddDiscussion;
