import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress, Card, Container } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from 'styled-components';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id
    const adminID = currentUser._id
    const address = "Subject"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl())
            setLoader(false)
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
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        Add Subjects
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        Add subjects to the class. You can add multiple subjects at once.
                    </Typography>
                </HeaderSection>

                <form onSubmit={submitHandler}>
                    <SubjectsContainer>
                        {subjects.map((subject, index) => (
                            <SubjectRow key={index}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Subject Name"
                                            variant="outlined"
                                            value={subject.subName}
                                            onChange={handleSubjectNameChange(index)}
                                            sx={textFieldStyles}
                                            required
                                            placeholder="e.g., Mathematics"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Subject Code"
                                            variant="outlined"
                                            value={subject.subCode}
                                            onChange={handleSubjectCodeChange(index)}
                                            sx={textFieldStyles}
                                            required
                                            placeholder="e.g., MATH101"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <TextField
                                            fullWidth
                                            label="Sessions"
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={subject.sessions}
                                            onChange={handleSessionsChange(index)}
                                            sx={textFieldStyles}
                                            required
                                            placeholder="0"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <ActionButtons>
                                            {index === 0 ? (
                                                <AddButton
                                                    variant="outlined"
                                                    onClick={handleAddSubject}
                                                    startIcon={<AddIcon />}
                                                >
                                                    Add Another
                                                </AddButton>
                                            ) : (
                                                <RemoveButton
                                                    variant="outlined"
                                                    onClick={handleRemoveSubject(index)}
                                                    startIcon={<RemoveIcon />}
                                                >
                                                    Remove
                                                </RemoveButton>
                                            )}
                                        </ActionButtons>
                                    </Grid>
                                </Grid>
                            </SubjectRow>
                        ))}
                    </SubjectsContainer>

                    <SubmitSection>
                        <SubmitButton 
                            variant="contained" 
                            type="submit" 
                            disabled={loader}
                            fullWidth
                        >
                            {loader ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                `Save ${subjects.length} Subject${subjects.length > 1 ? 's' : ''}`
                            )}
                        </SubmitButton>
                    </SubmitSection>
                </form>
            </FormCard>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
}

export default SubjectForm;

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
  max-width: 900px;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const SubjectsContainer = styled(Box)`
  margin-bottom: 32px;
`;

const SubjectRow = styled(Box)`
  padding: 20px;
  margin-bottom: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1976d2;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
  }
`;

const ActionButtons = styled(Box)`
  display: flex;
  justify-content: center;
  
  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`;

const SubmitSection = styled(Box)`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
`;

const AddButton = styled(Button)`
  border: 2px solid #1976d2;
  color: #1976d2;
  border-radius: 8px;
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

const RemoveButton = styled(Button)`
  border: 2px solid #d32f2f;
  color: #d32f2f;
  border-radius: 8px;
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