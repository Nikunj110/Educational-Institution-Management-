import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { 
  CircularProgress, 
  TextField, 
  Card, 
  Container, 
  Typography, 
  Box, 
  Grid,
  Paper,
  Button
} from '@mui/material';
import styled from 'styled-components';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SubjectIcon from '@mui/icons-material/Subject';
import ClassIcon from '@mui/icons-material/Class';

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id

  const { status, response, error } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const role = "Teacher"
  const school = subjectDetails && subjectDetails.school
  const teachSubject = subjectDetails && subjectDetails._id
  const teachSclass = subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id

  const fields = { name, email, password, role, school, teachSubject, teachSclass }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate("/Admin/teachers")
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
    <StyledContainer>
      <FormCard elevation={4}>
        <HeaderSection>
          <PersonAddIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
            Add Teacher
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Assign a teacher to this subject
          </Typography>
        </HeaderSection>

        <SubjectInfo elevation={1}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <InfoItem>
                <SubjectIcon sx={{ color: '#1976d2', mr: 1 }} />
                <div>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    Subject
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {subjectDetails?.subName || 'Loading...'}
                  </Typography>
                </div>
              </InfoItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem>
                <ClassIcon sx={{ color: '#1976d2', mr: 1 }} />
                <div>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    Class
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {subjectDetails?.sclassName?.sclassName || 'Loading...'}
                  </Typography>
                </div>
              </InfoItem>
            </Grid>
          </Grid>
        </SubjectInfo>

        <FormSection>
          <form onSubmit={submitHandler}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teacher's Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  sx={textFieldStyles}
                  placeholder="Enter teacher's full name"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  sx={textFieldStyles}
                  placeholder="Enter teacher's email address"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  sx={textFieldStyles}
                  placeholder="Create a secure password"
                />
              </Grid>
              
              <Grid item xs={12}>
                <SubmitButton 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  disabled={loader}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <PersonAddIcon sx={{ mr: 1 }} />
                      Register Teacher
                    </>
                  )}
                </SubmitButton>
              </Grid>
            </Grid>
          </form>
        </FormSection>
      </FormCard>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  )
}

export default AddTeacher;

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormCard = styled(Card)`
  border-radius: 20px;
  padding: 40px 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 600px;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const SubjectInfo = styled(Paper)`
  border-radius: 12px;
  padding: 24px;
  background: #f8fbff;
  border: 1px solid #e0e0e0;
  margin-bottom: 32px;
`;

const InfoItem = styled(Box)`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;

const FormSection = styled(Box)`
  margin-top: 24px;
`;

const SubmitButton = styled(Button)`
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