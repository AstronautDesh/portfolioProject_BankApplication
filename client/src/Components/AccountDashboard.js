import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Image, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaPaperPlane,
  FaInbox,
  FaFileInvoiceDollar,
  FaEllipsisH,
  FaCamera,
  FaTrash,
} from 'react-icons/fa';
import { logoutUser, uploadUserImage } from '../store/actions/userActions';

const AccountDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated } = useSelector((state) => state.user || {});
  //const user = userInfo?.user || {};
  const navigate = useNavigate();

   // Use useMemo to memoize the user object
   const user = useMemo(() => userInfo?.user || {}, [userInfo]);


  useEffect(() => {
    if (userInfo.accountNumber) {
      console.log('Account Number in AccountDashboard:', user.accountNumber);
    }
    console.log('Current user state:', user);
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log('Selectec File:', selectedFile);
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = (file) => {
    if (!file) return;
    if (!user._id) {
      console.error('User ID is undefined');
      setUploadStatus('error');
      return;
    }
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', user._id);
    console.log('Uploading for user ID:', user._id);
    dispatch(uploadUserImage(formData))
      .then(() => {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);
      })
      .catch((error) => {
        console.error('Upload error:', error);
        setUploadStatus('error');
        setTimeout(() => setUploadStatus(null), 3000);
      });
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete functionality not yet implemented');
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
        return 'Upload Successful';
      case 'error':
        return 'Upload Failed';
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-5 text-center clickable-card" onClick={redirectToLogin}>
          <h5>Please log in to view your dashboard.</h5>
          <p className="text-muted">Click here to log in.</p>
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

  const getUserImageSrc = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';

    // Replace backslashes with forward slashes for URLs
    const formattedPath = imagePath.replace(/\\/g, '/');
    return formattedPath.startsWith('uploads/') ? formattedPath : `uploads/${formattedPath}`;
  };


  const userImageSrc = getUserImageSrc(userInfo.image);
  console.log('Path Defined:', userImageSrc);


  return (
    <Container className="py-5 account-dashboard" style={{ height: '100vh', overflowY: 'auto' }}>
      <Row className="mb-4 g-3">
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
            src={user.image || 'https://via.placeholder.com/150'}
            roundedCircle
            className="user-image"
            alt="User profile"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              console.error('Error loading image:', user.image);
            }}
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
          <div className="text-center">
            <h3 className="user-name">{userInfo.fullname || 'Account Holder Name'}</h3>
            <p className="account-number">Account Number: {userInfo.accountNumber || '***786'}</p>
            <p className="account-balance">Current Balance: ₦{userInfo.currentBalance || '--,--'}</p>
          </div>
        </Card.Body>
      </Card>

      <div className="back-link-container">
        <Link to="/account" className="linktag">
          <h3 className="back">Go Back To Accounts</h3>
        </Link>
      </div>

      <button type="button" className="btn btn-danger mt-3" onClick={logoutAndRedirect}>
        Log Out
      </button>
    </Container>
  );
};

export default AccountDashboard;
