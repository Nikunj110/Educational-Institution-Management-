import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Container, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../../assets/designlogin.jpg"
import { LightPurpleButton } from '../../components/buttonStyles';
import { registerUser } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import Popup from '../../components/Popup';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
  },
});

const AdminRegisterPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);
    const role = "Admin"

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = event.target.adminName.value;
        const schoolName = event.target.schoolName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!name || !schoolName || !email || !password) {
            if (!name) setAdminNameError(true);
            if (!schoolName) setSchoolNameError(true);
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        const fields = { name, email, password, role, schoolName }
        setLoader(true)
        dispatch(registerUser(fields, role))
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'adminName') setAdminNameError(false);
        if (name === 'schoolName') setSchoolNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            console.log(error)
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <SplitGrid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} md={6}>
                    <LeftPanel>
                        <RegisterContainer>
                            <LogoArea>
                                <Logo>EM</Logo>
                                <div>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                                        Admin Registration
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#666' }}>
                                        Create your Educational Institution Management account and start managing your institution efficiently.
                                    </Typography>
                                </div>
                            </LogoArea>

                            <PaperStyled elevation={0}>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="adminName"
                                        label="Admin Name"
                                        name="adminName"
                                        autoComplete="name"
                                        autoFocus
                                        error={adminNameError}
                                        helperText={adminNameError && 'Admin name is required'}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        sx={textFieldStyles}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="schoolName"
                                        label="School Name"
                                        name="schoolName"
                                        autoComplete="off"
                                        error={schoolNameError}
                                        helperText={schoolNameError && 'School name is required'}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        sx={textFieldStyles}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        error={emailError}
                                        helperText={emailError && 'Email is required'}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        sx={textFieldStyles}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={toggle ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        error={passwordError}
                                        helperText={passwordError && 'Password is required'}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        sx={textFieldStyles}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton 
                                                        onClick={() => setToggle(!toggle)}
                                                        sx={{ color: '#1976d2' }}
                                                    >
                                                        {toggle ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                        sx={{ mt: 1, mb: 1 }}
                                    />
                                    
                                    <BlueButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={loader}
                                    >
                                        {loader ? <CircularProgress size={24} color="inherit"/> : "Create Account"}
                                    </BlueButton>
                                    
                                    <LoginLinkContainer>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            Already have an account?
                                        </Typography>
                                        <StyledLink to="/Adminlogin">
                                            Sign in here
                                        </StyledLink>
                                    </LoginLinkContainer>
                                </Box>
                            </PaperStyled>
                        </RegisterContainer>
                    </LeftPanel>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <RightPanel sx={{ backgroundImage: `url(${bgpic})` }}>
                        <Overlay>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                                EduNexus
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: '400px' }}>
                                Join hundreds of schools already managing their institutions efficiently with our platform
                            </Typography>
                        </Overlay>
                    </RightPanel>
                </Grid>
            </SplitGrid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
}

export default AdminRegisterPage;

/* ================= Styled Components ================= */

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

const RegisterContainer = styled(Container)`
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
  margin-top: 24px;
`;

const LogoArea = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`;

const Logo = styled.div`
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

const BlueButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: none;
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.25);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
    box-shadow: 0 8px 25px rgba(25, 118, 210, 0.35);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #ccc;
    box-shadow: none;
    transform: none;
  }
`;

const LoginLinkContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const StyledLink = styled(Link)`
  color: #1976d2;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
    color: #1565c0;
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
  '& .MuiFormHelperText-root.Mui-error': {
    color: '#d32f2f',
  }
};