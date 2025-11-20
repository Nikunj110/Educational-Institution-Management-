import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress, Box, Card, Container, TextField, MenuItem, Typography, Button, Stack } from '@mui/material';
import styled from 'styled-components';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [className, setClassName] = useState('')
    const [sclassName, setSclassName] = useState('')

    const adminID = currentUser._id
    const role = "Student"
    const attendance = []

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    }

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance }

    const submitHandler = (event) => {
        event.preventDefault()
        if (sclassName === "") {
            setMessage("Please select a classname")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <StyledContainer>
                <ContentWrapper>
                    <HeaderSection>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                            Add New Student
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                            Register a new student to the system
                        </Typography>
                    </HeaderSection>

                    <FormSection>
                        <FormCard elevation={4}>
                            <CardContent>
                                <form onSubmit={submitHandler}>
                                    <Stack spacing={3}>
                                        <TextField
                                            label="Student Name"
                                            variant="outlined"
                                            value={name}
                                            onChange={(event) => setName(event.target.value)}
                                            required
                                            sx={textFieldStyles}
                                            placeholder="Enter student's full name"
                                            autoComplete="name"
                                        />

                                        {situation === "Student" && (
                                            <TextField
                                                select
                                                label="Select Class"
                                                value={className}
                                                onChange={changeHandler}
                                                required
                                                sx={textFieldStyles}
                                            >
                                                <MenuItem value="Select Class">
                                                    Select Class
                                                </MenuItem>
                                                {sclassesList.map((classItem, index) => (
                                                    <MenuItem key={index} value={classItem.sclassName}>
                                                        {classItem.sclassName}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}

                                        <TextField
                                            label="Roll Number"
                                            variant="outlined"
                                            type="number"
                                            value={rollNum}
                                            onChange={(event) => setRollNum(event.target.value)}
                                            required
                                            sx={textFieldStyles}
                                            placeholder="Enter roll number"
                                        />

                                        <TextField
                                            label="Password"
                                            variant="outlined"
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            required
                                            sx={textFieldStyles}
                                            placeholder="Set student password"
                                            autoComplete="new-password"
                                        />

                                        <ButtonStack spacing={2}>
                                            <BlueButton
                                                fullWidth
                                                size="large"
                                                variant="contained"
                                                type="submit"
                                                disabled={loader}
                                            >
                                                {loader ? <CircularProgress size={24} color="inherit" /> : "Add Student"}
                                            </BlueButton>
                                            <BackButton 
                                                variant="outlined" 
                                                fullWidth
                                                onClick={() => navigate(-1)}
                                            >
                                                Go Back
                                            </BackButton>
                                        </ButtonStack>
                                    </Stack>
                                </form>
                            </CardContent>
                        </FormCard>
                    </FormSection>
                </ContentWrapper>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddStudent

const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
  display: flex;
  align-items: center;
`;

const ContentWrapper = styled(Box)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 48px;
`;

const FormSection = styled(Box)`
  display: flex;
  justify-content: center;
`;

const FormCard = styled(Card)`
  border-radius: 20px;
  padding: 40px 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 500px;
`;

const CardContent = styled(Box)`
  padding: 0;
`;

const ButtonStack = styled(Stack)`
  margin-top: 24px;
`;

const BlueButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  font-size: 16px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #bdbdbd;
    box-shadow: none;
    transform: none;
  }
`;

const BackButton = styled(Button)`
  border: 2px solid #e0e0e0;
  color: #666;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #1976d2;
    color: #1976d2;
    background: rgba(25, 118, 210, 0.04);
    transform: translateY(-2px);
  }
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
  '& .MuiSelect-select': {
    padding: '12px 14px',
  },
};