import { useState } from 'react';
import axiosInstance from './axiosInstance'; // Import the Axios instance
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css'; // Create your CSS file for additional styling

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
        email: '',
        profileImg: '',
        coverImg: '',
        bio: '',
        website: '',
        location: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const uploadPreset = 'y6dazgfn';            // Replace with your Cloudinary upload preset
        const cloudName = 'dyndmpls6';              // Replace with your Cloudinary cloud name

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );
            setImageUrl(response.data.secure_url);
            setFormData((prevData) => ({
                ...prevData,
                profileImg: response.data.secure_url,
            }));
        } catch (error) {
            setError('Failed to upload image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password length
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try {
            await axiosInstance.post('/signup', formData);
            setMessage('Sign up successful!');
            setTimeout(() => {
                navigate('/');              // Navigate to DashBoard after signup form is submitted.
            }, 1000);
        } catch (err) {
            setError('Failed to sign up.');
        }
    };

    return (
        <Container>
            <h2 className="my-4">Sign Up</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formProfileImg">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {imageUrl && (
                        <img src={imageUrl} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />
                    )}
                </Form.Group>
                <Form.Group controlId="formCoverImg">
                    <Form.Label>Cover Image</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </Form.Group>
                <Form.Group controlId="formBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formWebsite">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your website URL"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Sign Up
                </Button>
            </Form>
        </Container>
    );
};

export default SignUp;
