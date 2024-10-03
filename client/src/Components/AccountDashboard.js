import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Image, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API call
import { logoutUser } from '../store/actions/userActions';
import { uploadUserImage, deleteUserImage } from '../api/imageApi';

import {
  FaPaperPlane,
  FaInbox,
  FaFileInvoiceDollar,
  FaEllipsisH,
  FaCamera,
  FaTrash,
} from 'react-icons/fa';
import '../css/accountDashboard.css';

const AccountDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); 
  const [imageLoading, setImageLoading] = useState(true);
  const [userImageSrc, setUserImageSrc] = useState(''); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo = {}, isAuthenticated = false } = useSelector((state) => state.user || {});
  const user = useMemo(() => userInfo || {}, [userInfo]);

  // Fetch user image from the database when component mounts
  useEffect(() => {

    const fetchUserImage = async () => {
      try {
        console.log(`Fetching image for user with ID: ${user._id}`);
    
        const response = await axios.get(`/api/users/${user._id}/image`, {
          responseType: 'blob'  // This tells Axios to expect binary data
        });
        console.log('Server response:', response);
    
        if (response.data) {
          const imageUrl = URL.createObjectURL(response.data);
          setUserImageSrc(imageUrl);
        } else {
          setUserImageSrc('/uploads/placeholder/placeholder.jpg');
        }
        setImageLoading(false);
      } catch (error) {
        console.error('Error fetching user image:', error);
        setErrorMessage('Failed to load user image.');
        setUserImageSrc('/uploads/placeholder/placeholder.jpg');
        setImageLoading(false);
      }
    };
  
    if (user._id) {
      fetchUserImage();
    }
  }, [user._id]);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (uploadStatus || errorMessage) {
      const timer = setTimeout(() => {
        setUploadStatus(null);
        setErrorMessage(null);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [uploadStatus, errorMessage]);

  // Handle file selection for image upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log('Selected File Here:', selectedFile);
  
    if (file && user._id) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user._id);
  
      try {
        const response = await uploadUserImage(formData);
        console.log('Upload Response:', response);
        setUserImageSrc(response.imagePath);
        setUploadStatus('success');
      } catch (error) {
        console.error('Image upload failed:', error);
        setErrorMessage(error.response?.data?.error || 'Image upload failed. Please try again.');
        setUploadStatus('error');
      }
    }
  };

  // Handle image deletion
  const handleDelete = async () => {
    if (user._id) {
      try {
        await deleteUserImage(user._id);  // Use the API function here
        setUserImageSrc('/uploads/placeholder/placeholder.jpg');
        setUploadStatus('success');
        console.log('Unmasked:', user._id);
      } catch (error) {
        console.error('Failed to delete image:', error);
        setErrorMessage('Failed to delete image. Please try again.');
        setUploadStatus('error');
      }
    }
  };


  const redirectToLogin = () => {
    navigate('/login-dropdown');
  };

  const logoutAndRedirect = () => {
    dispatch(logoutUser());
    navigate('/login-dropdown');
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return 'Operation Successful';
      case 'error':
        return 'Operation Failed';
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-5 text-center clickable-card" onClick={redirectToLogin}>
          <h5>Please log in to view your dashboard.</h5>
        </Card>
      </Container>
    );
  }

  const features = [
    {
      icon: <FaPaperPlane size={30} />,
      title: 'Send Money',
      description: 'Transfer funds to others',
      link: '/send-money',
    },
    {
      icon: <FaInbox size={30} />,
      title: 'Inbox',
      description: 'Check your recent messages',
      link: '/inbox',
    },
    {
      icon: <FaFileInvoiceDollar size={30} />,
      title: 'Transactions',
      description: 'View recent transactions',
      link: '/transaction-card',
    },
    {
      icon: <FaEllipsisH size={30} />,
      title: 'More',
      description: 'Explore more features',
      link: '/more',
    },
  ];

  return (
    <>
    <Container fluid className="account-dashboard" >

      <div className='account-grid'>

<Row className="feature-cards-div g-3">
        {features.map((feature, index) => (
          <Col key={index} lg={3} md={6} sm={12}>
            <Link to={feature.link} className="text-decoration-none">
              <Card className="h-100 feature-card">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <div className="feature-icon mb-3">{feature.icon}</div>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Card className="user-info-card mt-4 mx-auto">
        <Card.Body className="d-flex flex-column align-items-center">
          {imageLoading && <Spinner animation="border" />}
          <Image
            src={userImageSrc || '/uploads/placeholder/placeholder.jpg'}
            roundedCircle
            className="user-image"
            alt="User profile"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          <div className="image-upload-controls">
            <label htmlFor="file-input" className="camera-icon">
              <FaCamera size={24} />
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <FaTrash size={24} className="trash-icon" onClick={handleDelete} />
          </div>
          {uploadStatus && <p className="upload-status">{getStatusText()}</p>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <div className="text-center">
            <h3 className="user-name">{user.fullname || 'Account Holder Name'}</h3>
            <p className="account-number">Account Number: {user.accountNumber || '***786'}</p>
            <p className="account-balance">Current Balance: ₦{user.currentBalance || '--,--'}</p>
          </div>
        </Card.Body>
      </Card>
      </div>
    </Container>

<button type="button" className="btn btn-danger mt-3" onClick={logoutAndRedirect}>
Log Out
</button>
</>
  );
};

export default AccountDashboard;
