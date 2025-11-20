import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const password = "zxc"

  const { status, currentUser, currentRole } = useSelector(state => state.user);;

  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Adminlogin');
      }
    }

    else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1"
        const studentName = "Dipesh Awasthi"
        const fields = { rollNum, studentName, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Studentlogin');
      }
    }

    else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Teacherlogin');
      }
    }
  }

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      }
      else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    }
    else if (status === 'error') {
      setLoader(false)
      setMessage("Network Error")
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container maxWidth="lg">
        <HeaderBox>
          <MainTitle>
            Welcome to EduNexus
          </MainTitle>
          <SubTitle>
            Choose your role to continue
          </SubTitle>
        </HeaderBox>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Admin")}>
              <StyledPaper elevation={6}>
                <IconBox>
                  <AccountCircle fontSize="large" />
                </IconBox>
                <StyledTypography>
                  Admin
                </StyledTypography>
                <DescriptionText>
                  Login as an administrator to access the dashboard to manage app data.
                </DescriptionText>
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Student")}>
              <StyledPaper elevation={6}>
                <IconBox>
                  <School fontSize="large" />
                </IconBox>
                <StyledTypography>
                  Student
                </StyledTypography>
                <DescriptionText>
                  Login as a student to explore course materials and assignments.
                </DescriptionText>
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Teacher")}>
              <StyledPaper elevation={6}>
                <IconBox>
                  <Group fontSize="large" />
                </IconBox>
                <StyledTypography>
                  Teacher
                </StyledTypography>
                <DescriptionText>
                  Login as a teacher to create courses, assignments, and track student progress.
                </DescriptionText>
              </StyledPaper>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        <span style={{ marginLeft: '10px' }}>Please Wait</span>
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const HeaderBox = styled(Box)`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 0;
`;

const StyledPaper = styled(Paper)`
  padding: 2.5rem 1.5rem;
  text-align: center;
  background: white;
  color: #1976d2;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(25, 118, 210, 0.2);
    border-color: #1976d2;
    background: #f8fbff;
  }
`;

const IconBox = styled(Box)`
  margin-bottom: 1.5rem;
  color: #1976d2;
  
  & .MuiSvgIcon-root {
    font-size: 3.5rem;
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1976d2;
`;

const DescriptionText = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0;
`;