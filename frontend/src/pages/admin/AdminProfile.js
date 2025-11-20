import React, { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';
import { Button, Collapse, Card, CardContent, Typography, Box, TextField, Grid, IconButton } from '@mui/material';
import styled from 'styled-components';

const AdminProfile = () => {
    const [showTab, setShowTab] = useState(false);
    const buttonText = showTab ? 'Cancel' : 'Edit Profile';

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const address = "Admin";

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName };

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, currentUser._id, address));
        setShowTab(false);
    };

    const deleteHandler = () => {
        try {
            dispatch(deleteUser(currentUser._id, "Students"));
            dispatch(deleteUser(currentUser._id, address));
            dispatch(authLogout());
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='display: flex; justify-content: center;margin: auto;    '>
            <ProfileContainer>
            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    Admin Profile
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage your account information and settings
                </Typography>
            </HeaderSection>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <ProfileCard elevation={4}>
                        <CardContent>
                            <ProfileHeader>
                                <AvatarSection>
                                    <Avatar>
                                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                                    </Avatar>
                                    <UserInfo>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                            {currentUser.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            Administrator
                                        </Typography>
                                    </UserInfo>
                                </AvatarSection>
                            </ProfileHeader>

                            <DetailsSection>
                                <DetailItem>
                                    <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                                        {currentUser.email}
                                    </Typography>
                                </DetailItem>

                                <DetailItem>
                                    <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                        School Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                                        {currentUser.schoolName}
                                    </Typography>
                                </DetailItem>

                                <DetailItem>
                                    <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                        User ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333', fontWeight: 500, fontFamily: 'monospace' }}>
                                        {currentUser._id}
                                    </Typography>
                                </DetailItem>
                            </DetailsSection>
                        </CardContent>
                    </ProfileCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Collapse in={showTab} timeout="auto" unmountOnExit>
                        <EditCard elevation={4}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 3 }}>
                                    Edit Profile Information
                                </Typography>
                                
                                <EditForm onSubmit={submitHandler}>
                                    <TextField
                                        fullWidth
                                        label="Admin Name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        margin="normal"
                                        variant="outlined"
                                        sx={textFieldStyles}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="School Name"
                                        value={schoolName}
                                        onChange={(event) => setSchoolName(event.target.value)}
                                        margin="normal"
                                        variant="outlined"
                                        sx={textFieldStyles}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        margin="normal"
                                        variant="outlined"
                                        sx={textFieldStyles}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        margin="normal"
                                        variant="outlined"
                                        placeholder="Leave blank to keep current password"
                                        sx={textFieldStyles}
                                    />

                                    <UpdateButton
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 3 }}
                                    >
                                        Update Profile
                                    </UpdateButton>
                                </EditForm>
                            </CardContent>
                        </EditCard>
                    </Collapse>
                </Grid>
            </Grid>
        </ProfileContainer>
        </div>
    );
};

export default AdminProfile;

const ProfileContainer = styled.div`
    padding: 24px;
    background: #f8fbff;
    min-height: 100vh;
`;

const HeaderSection = styled(Box)`
    margin-bottom: 32px;
    text-align: center;
`;

const ProfileCard = styled(Card)`
    border-radius: 16px;
    background: white;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 20px rgba(25, 118, 210, 0.1);
`;

const EditCard = styled(Card)`
    border-radius: 16px;
    background: white;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 20px rgba(25, 118, 210, 0.1);
`;

const ProfileHeader = styled(Box)`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
`;

const AvatarSection = styled(Box)`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const Avatar = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
`;

const UserInfo = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const DetailsSection = styled(Box)`
    margin-bottom: 24px;
`;

const DetailItem = styled(Box)`
    margin-bottom: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
`;

const ActionSection = styled(Box)`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
`;

const EditButton = styled(Button)`
    border: 2px solid #1976d2;
    color: #1976d2;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    padding: 8px 16px;
    transition: all 0.3s ease;
    
    &:hover {
        background: rgba(25, 118, 210, 0.1);
        border: 2px solid #1565c0;
        transform: translateY(-2px);
    }
`;

const DeleteButton = styled(Button)`
    border: 2px solid #d32f2f;
    color: #d32f2f;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    padding: 8px 16px;
    transition: all 0.3s ease;
    
    &:hover {
        background: rgba(211, 47, 47, 0.1);
        border: 2px solid #c62828;
        transform: translateY(-2px);
    }
`;

const UpdateButton = styled(Button)`
    background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    text-transform: none;
    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
        background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
        box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
        transform: translateY(-2px);
    }
`;

const EditForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        '&:hover fieldset': {
            borderColor: '#1976d2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#1976d2',
    },
};