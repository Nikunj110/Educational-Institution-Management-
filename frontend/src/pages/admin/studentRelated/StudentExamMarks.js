import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl, Container, Card, Button
} from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import styled from 'styled-components';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            const stdID = params.id
            dispatch(getUserDetails(stdID, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const fields = { subName: chosenSubName, marksObtained }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"))
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <StyledContainer>
            <ContentWrapper>
                {loading ? (
                    <LoadingContainer>
                        <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                            Loading student details...
                        </Typography>
                    </LoadingContainer>
                ) : (
                    <>
                        <HeaderSection>
                            <BackButton 
                                variant="outlined" 
                                onClick={() => navigate(-1)}
                                startIcon={<KeyboardArrowLeft />}
                            >
                                Go Back
                            </BackButton>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                                Update Exam Marks
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#666' }}>
                                Enter examination marks for student
                            </Typography>
                        </HeaderSection>

                        <FormContainer>
                            <FormCard elevation={4}>
                                <CardContent>
                                    <StudentInfoSection>
                                        <InfoItem>
                                            <InfoLabel>Student Name:</InfoLabel>
                                            <InfoValue>{userDetails.name}</InfoValue>
                                        </InfoItem>
                                        {currentUser.teachSubject && (
                                            <InfoItem>
                                                <InfoLabel>Subject:</InfoLabel>
                                                <InfoValue>{currentUser.teachSubject?.subName}</InfoValue>
                                            </InfoItem>
                                        )}
                                        <InfoItem>
                                            <InfoLabel>Roll Number:</InfoLabel>
                                            <InfoValue>{userDetails.rollNum}</InfoValue>
                                        </InfoItem>
                                        {userDetails.sclassName && (
                                            <InfoItem>
                                                <InfoLabel>Class:</InfoLabel>
                                                <InfoValue>{userDetails.sclassName.sclassName}</InfoValue>
                                            </InfoItem>
                                        )}
                                    </StudentInfoSection>

                                    <FormDivider />

                                    <form onSubmit={submitHandler}>
                                        <Stack spacing={3}>
                                            {situation === "Student" && (
                                                <FormControl fullWidth>
                                                    <InputLabel 
                                                        id="subject-select-label"
                                                        sx={labelStyles}
                                                    >
                                                        Select Subject
                                                    </InputLabel>
                                                    <Select
                                                        labelId="subject-select-label"
                                                        id="subject-select"
                                                        value={subjectName}
                                                        label="Select Subject"
                                                        onChange={changeHandler}
                                                        required
                                                        sx={selectStyles}
                                                    >
                                                        {subjectsList ? (
                                                            subjectsList.map((subject, index) => (
                                                                <MenuItem 
                                                                    key={index} 
                                                                    value={subject.subName}
                                                                    sx={menuItemStyles}
                                                                >
                                                                    {subject.subName}
                                                                </MenuItem>
                                                            ))
                                                        ) : (
                                                            <MenuItem value="Select Subject" sx={menuItemStyles}>
                                                                Add Subjects For Marks
                                                            </MenuItem>
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            )}
                                            
                                            <FormControl fullWidth>
                                                <TextField
                                                    type="number"
                                                    label="Enter Marks"
                                                    value={marksObtained}
                                                    onChange={(e) => setMarksObtained(e.target.value)}
                                                    required
                                                    InputLabelProps={{
                                                        shrink: true,
                                                        sx: labelStyles
                                                    }}
                                                    sx={textFieldStyles}
                                                    placeholder="Enter marks obtained"
                                                    inputProps={{
                                                        min: 0,
                                                        max: 100,
                                                        step: 0.5
                                                    }}
                                                />
                                            </FormControl>

                                            {marksObtained && (
                                                <MarksPreview>
                                                    <MarksLabel>Marks to be updated:</MarksLabel>
                                                    <MarksValue>{marksObtained}</MarksValue>
                                                    <MarksOutOf>/100</MarksOutOf>
                                                </MarksPreview>
                                            )}
                                        </Stack>

                                        <SubmitButton
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            type="submit"
                                            disabled={loader}
                                        >
                                            {loader ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                'Update Marks'
                                            )}
                                        </SubmitButton>
                                    </form>
                                </CardContent>
                            </FormCard>
                        </FormContainer>
                    </>
                )}
            </ContentWrapper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    )
}

export default StudentExamMarks

const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const ContentWrapper = styled(Box)`
  width: 100%;
  max-width: 800px;
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
  display: flex;
  justify-content: center;
`;

const FormCard = styled(Card)`
  border-radius: 20px;
  padding: 0;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 600px;
`;

const CardContent = styled(Box)`
  padding: 40px;
`;

const StudentInfoSection = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled(Typography)`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

const FormDivider = styled(Box)`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 32px 0;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
`;

const MarksPreview = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(25, 118, 210, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(25, 118, 210, 0.1);
  margin-top: 8px;
`;

const MarksLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const MarksValue = styled(Typography)`
  font-size: 18px;
  color: #1976d2;
  font-weight: 700;
`;

const MarksOutOf = styled(Typography)`
  font-size: 14px;
  color: #999;
  font-weight: 500;
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
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

const labelStyles = {
  color: '#666',
  '&.Mui-focused': {
    color: '#1976d2',
  },
};

const selectStyles = {
  borderRadius: '12px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
    borderWidth: '2px',
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
    },
  },
  '& input[type=number]': {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '-moz-appearance': 'textfield',
  },
};

const menuItemStyles = {
  borderRadius: '8px',
  margin: '4px 8px',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.16)',
    }
  }
};