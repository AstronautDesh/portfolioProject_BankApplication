//client/src/api/imageApi.js
import axios from 'axios';

// Upload user image
export const uploadUserImage = async (formData) => {
  try {
    const response = await axios.post('/api/users/upload-image', formData);
    return response.data;  // This will contain the image path
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Upload failed');
    } else {
      throw new Error('Network error or server is down');
    }
  }
};

// Delete user image
export const deleteUserImage = async (userId) => {
  try {
    const response = await axios.delete(`/api/users/delete-image/${userId}`);
    return response.data;  // Success or error message
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Delete failed');
    } else {
      throw new Error('Network error or server is down');
    }
  }
};


