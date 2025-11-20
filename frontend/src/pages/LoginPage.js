import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
  Container,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../assets/designlogin.jpg";
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const LoginPage = ({ role = 'Admin' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, currentUser, response, error, currentRole } = useSelector((state) => state.user);

  const [showPass, setShowPass] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({ email: false, password: false, rollNumber: false, studentName: false });

  useEffect(() => {
    if ((status === 'success' || currentUser !== null) && currentRole) {
      if (currentRole === 'Admin') navigate('/Admin/dashboard');
      else if (currentRole === 'Student') navigate('/Student/dashboard');
      else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
    } else if (status === 'failed') {
      setMessage(response || 'Login failed');
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    } else if (status === 'error') {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, response, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    if (role === 'Student') {
      const rollNum = data.get('rollNumber')?.toString() || '';
      const studentName = data.get('studentName')?.toString() || '';
      const password = data.get('password')?.toString() || '';

      const nextErrors = { ...errors };
      if (!rollNum) nextErrors.rollNumber = true;
      if (!studentName) nextErrors.studentName = true;
      if (!password) nextErrors.password = true;
      setErrors(nextErrors);
      if (!rollNum || !studentName || !password) return;

      setLoader(true);
      dispatch(loginUser({ rollNum, studentName, password }, role));
    } else {
      const email = data.get('email')?.toString() || '';
      const password = data.get('password')?.toString() || '';

      const nextErrors = { ...errors };
      if (!email) nextErrors.email = true;
      if (!password) nextErrors.password = true;
      setErrors(nextErrors);
      if (!email || !password) return;

      setLoader(true);
      dispatch(loginUser({ email, password }, role));
    }
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const guestModeHandler = () => {
    const password = 'zxc';
    setGuestLoader(true);
    if (role === 'Admin') {
      dispatch(loginUser({ email: 'yogendra@12', password }, role));
    } else if (role === 'Student') {
      dispatch(loginUser({ rollNum: '1', studentName: 'Dipesh Awasthi', password }, role));
    } else if (role === 'Teacher') {
      dispatch(loginUser({ email: 'tony@12', password }, role));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <SplitGrid container component="main" sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6}>
          <LeftPanel>
            <LoginContainer>
              <LogoArea>
                <LogoMark>EM</LogoMark>
                <div>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    {role} Login
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Welcome back! Please enter your credentials to continue.
                  </Typography>
                </div>
              </LogoArea>

              <PaperStyled elevation={0}>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  {role === 'Student' ? (
                    <>
                      <TextField
                        fullWidth
                        margin="normal"
                        id="rollNumber"
                        label="Roll Number"
                        name="rollNumber"
                        type="number"
                        error={errors.rollNumber}
                        helperText={errors.rollNumber ? 'Roll Number is required' : ''}
                        onChange={handleInputChange}
                        autoComplete="off"
                        variant="outlined"
                        sx={textFieldStyles}
                      />

                      <TextField
                        fullWidth
                        margin="normal"
                        id="studentName"
                        label="Student Name"
                        name="studentName"
                        error={errors.studentName}
                        helperText={errors.studentName ? 'Student name is required' : ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={textFieldStyles}
                      />
                    </>
                  ) : (
                    <TextField
                      fullWidth
                      margin="normal"
                      id="email"
                      label="Email Address"
                      name="email"
                      error={errors.email}
                      helperText={errors.email ? 'Email is required' : ''}
                      onChange={handleInputChange}
                      autoComplete="email"
                      variant="outlined"
                      sx={textFieldStyles}
                    />
                  )}

                  <TextField
                    fullWidth
                    margin="normal"
                    id="password"
                    name="password"
                    label="Password"
                    type={showPass ? 'text' : 'password'}
                    error={errors.password}
                    helperText={errors.password ? 'Password is required' : ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={textFieldStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={() => setShowPass((s) => !s)} 
                            edge="end"
                            sx={{ color: '#1976d2' }}
                          >
                            {showPass ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Row sx={{ mt: 2, mb: 2 }}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          sx={{ 
                            color: '#1976d2',
                            '&.Mui-checked': { color: '#1976d2' }
                          }} 
                        />
                      } 
                      label="Remember me" 
                    />
                    <StyledAnchor href="#">Forgot password?</StyledAnchor>
                  </Row>

                  <BlueButton 
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loader}
                  >
                    {loader ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </BlueButton>

                  {role === 'Admin' && (
                    <FooterLinks>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Don't have an account?
                      </Typography>
                      <Link to="/Adminregister">
                        <SignUpLink>Sign up</SignUpLink>
                      </Link>
                    </FooterLinks>
                  )}
                </Box>
              </PaperStyled>
            </LoginContainer>
          </LeftPanel>
        </Grid>

        <Grid item xs={12} md={6}>
          <RightPanel sx={{ backgroundImage: `url(${bgpic})` }}>
            <Overlay>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                EduNexus
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Streamlining Education Management
              </Typography>
            </Overlay>
          </RightPanel>
        </Grid>
      </SplitGrid>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </ThemeProvider>
  );
};

export default LoginPage;

/* ================= Styled components ================= */
const SplitGrid = styled(Grid)`
  height: 100vh;
  overflow: hidden;
`;

const LeftPanel = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f8fbff;
  padding: 24px;
`;

const LoginContainer = styled(Container)`
  max-width: 500px !important;
  padding: 0 !important;
`;

const RightPanel = styled(Box)`
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.8) 0%, rgba(66, 165, 245, 0.6) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
`;

const PaperStyled = styled(Paper)`
  border-radius: 20px !important;
  padding: 40px 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1) !important;
  border: 1px solid #e0e0e0;
`;

const LogoArea = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 32px;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoMark = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: #fff;
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.3);
`;

const Row = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledAnchor = styled.a`
  color: #1976d2;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  &:hover {
    text-decoration: underline;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const SignUpLink = styled.span`
  color: #1976d2;
  font-weight: 700;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const BlueButton = styled(Button)`
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
  
  &:disabled {
    background: #ccc;
    box-shadow: none;
    transform: none;
  }
`;

const GuestButton = styled(Button)`
  border: 2px solid #1976d2;
  color: #1976d2;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.1);
    border: 2px solid #1565c0;
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
};