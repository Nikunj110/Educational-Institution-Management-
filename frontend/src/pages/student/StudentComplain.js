import { useEffect, useState } from 'react';
import { 
    Box, 
    CircularProgress, 
    Stack, 
    TextField, 
    Typography, 
    Container, 
    Card, 
    Button,
    Paper
} from '@mui/material';
import Popup from '../../components/Popup';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../redux/userRelated/userHandle';
import { styled } from '@mui/material/styles';
import { ArrowBack, Report, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id
    const school = currentUser.school._id
    const address = "Complain"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        user,
        date,
        complaint,
        school,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Complaint submitted successfully!")
            setComplaint("")
            setDate("")
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error")
        }
    }, [status, error])

    return (
        <StyledContainer>
            <ContentWrapper>
                <HeaderSection>
                    <BackButton 
                        variant="outlined" 
                        onClick={() => navigate(-1)}
                        startIcon={<ArrowBack />}
                    >
                        Go Back
                    </BackButton>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        Submit Complaint
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        Share your concerns or issues with the administration
                    </Typography>
                </HeaderSection>

                <FormContainer>
                    <FormCard elevation={4}>
                        <CardHeader>
                            <Report sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                File a Complaint
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                                Please provide details about your concern. Your complaint will be reviewed by the administration.
                            </Typography>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Select Date"
                                        type="date"
                                        value={date}
                                        onChange={(event) => setDate(event.target.value)} 
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                            sx: labelStyles
                                        }}
                                        sx={textFieldStyles}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Describe your complaint"
                                        variant="outlined"
                                        value={complaint}
                                        onChange={(event) => {
                                            setComplaint(event.target.value);
                                        }}
                                        required
                                        multiline
                                        rows={6}
                                        placeholder="Please provide detailed information about your complaint, including any relevant dates, people involved, and specific issues you're facing..."
                                        InputLabelProps={{
                                            sx: labelStyles
                                        }}
                                        sx={textFieldStyles}
                                    />

                                    {complaint && (
                                        <ComplaintPreview>
                                            <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                                                Complaint Preview:
                                            </Typography>
                                            <PreviewContent>
                                                {complaint}
                                            </PreviewContent>
                                            <Typography variant="caption" sx={{ color: '#999', mt: 1, display: 'block' }}>
                                                Character count: {complaint.length}
                                            </Typography>
                                        </ComplaintPreview>
                                    )}
                                </Stack>

                                <SubmitButton
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={loader || !complaint || !date}
                                    startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                >
                                    {loader ? 'Submitting...' : 'Submit Complaint'}
                                </SubmitButton>
                            </form>
                        </CardContent>
                    </FormCard>

                    <GuidelinesCard elevation={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
                            Complaint Guidelines
                        </Typography>
                        <GuidelinesList>
                            <GuidelineItem>
                                <Typography variant="body2">
                                    • Be clear and specific about the issue
                                </Typography>
                            </GuidelineItem>
                            <GuidelineItem>
                                <Typography variant="body2">
                                    • Include relevant dates and times
                                </Typography>
                            </GuidelineItem>
                            <GuidelineItem>
                                <Typography variant="body2">
                                    • Provide any supporting details or evidence
                                </Typography>
                            </GuidelineItem>
                            <GuidelineItem>
                                <Typography variant="body2">
                                    • Maintain respectful and professional language
                                </Typography>
                            </GuidelineItem>
                            <GuidelineItem>
                                <Typography variant="body2">
                                    • Allow 2-3 business days for a response
                                </Typography>
                            </GuidelineItem>
                        </GuidelinesList>
                    </GuidelinesCard>
                </FormContainer>
            </ContentWrapper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default StudentComplain;

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const ContentWrapper = styled(Box)`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 48px;
  position: relative;
`;

const BackButton = styled(Button)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border: 2px solid #e0e0e0;
  color: #666;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 8px 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #1976d2;
    color: #1976d2;
    background: rgba(25, 118, 210, 0.04);
    transform: translateY(-50%) translateX(-4px);
  }
`;

const FormContainer = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FormCard = styled(Card)`
  border-radius: 20px;
  padding: 0;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const GuidelinesCard = styled(Card)`
  border-radius: 20px;
  padding: 24px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const CardHeader = styled(Box)`
  padding: 40px 32px 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  text-align: center;
`;

const CardContent = styled(Box)`
  padding: 32px;
`;

const ComplaintPreview = styled(Paper)`
  padding: 20px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  margin-top: 16px;
`;

const PreviewContent = styled(Typography)`
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  max-height: 150px;
  overflow-y: auto;
`;

const GuidelinesList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GuidelineItem = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 14px 24px;
  font-size: 16px;
  margin-top: 24px;
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

// Style Objects
const labelStyles = {
  color: '#666',
  '&.Mui-focused': {
    color: '#1976d2',
  },
};

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1976d2',
  },
};