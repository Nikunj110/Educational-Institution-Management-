import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { 
  CircularProgress, 
  TextField, 
  Card, 
  Container, 
  Typography, 
  Box, 
  Grid,
  Button
} from '@mui/material';
import Popup from '../../../components/Popup';
import styled from 'styled-components';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const adminID = currentUser._id

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "Notice"

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/notices');
      dispatch(underControl())
    } else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch]);

  // Set default date to today
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  return (
    <StyledContainer>
      <FormCard elevation={4}>
        <HeaderSection>
          <AnnouncementIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
            Create New Notice
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Share important announcements and updates with students and staff
          </Typography>
        </HeaderSection>

        <form onSubmit={submitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Title"
                variant="outlined"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                sx={textFieldStyles}
                placeholder="Enter a clear and concise title for the notice"
                InputProps={{
                  startAdornment: (
                    <TitleIcon sx={{ color: '#1976d2', mr: 1, fontSize: 20 }} />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Details"
                variant="outlined"
                multiline
                rows={4}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                required
                sx={textFieldStyles}
                placeholder="Provide detailed information about the notice"
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon sx={{ color: '#1976d2', mr: 1, fontSize: 20, alignSelf: 'flex-start', mt: 1 }} />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Notice Date"
                type="date"
                variant="outlined"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                sx={textFieldStyles}
                InputProps={{
                  startAdornment: (
                    <CalendarTodayIcon sx={{ color: '#1976d2', mr: 1, fontSize: 20 }} />
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <PreviewSection>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
                  Notice Preview
                </Typography>
                <PreviewCard elevation={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                    {title || "Notice Title"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    {details || "Notice details will appear here..."}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    Date: {date || new Date().toISOString().split('T')[0]}
                  </Typography>
                </PreviewCard>
              </PreviewSection>
            </Grid>
            
            <Grid item xs={12}>
              <ActionButtons>
                <CancelButton 
                  variant="outlined" 
                  onClick={() => navigate('/Admin/notices')}
                >
                  Cancel
                </CancelButton>
                <SubmitButton 
                  type="submit" 
                  variant="contained" 
                  disabled={loader}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <AnnouncementIcon sx={{ mr: 1 }} />
                      Publish Notice
                    </>
                  )}
                </SubmitButton>
              </ActionButtons>
            </Grid>
          </Grid>
        </form>
      </FormCard>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default AddNotice;

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
  max-width: 700px;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const PreviewSection = styled(Box)`
  margin-top: 16px;
  padding: 24px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

const PreviewCard = styled(Box)`
  padding: 20px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
`;

const ActionButtons = styled(Box)`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.25);
  transition: all 0.3s ease;
  min-width: 180px;
  
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

const CancelButton = styled(Button)`
  border: 2px solid #e0e0e0;
  color: #666;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  transition: all 0.3s ease;
  min-width: 120px;
  
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
  '& .MuiInputBase-input': {
    padding: '14px 14px',
  },
};