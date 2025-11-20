import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Card, Box, Grid, CircularProgress, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import SubjectIcon from '@mui/icons-material/Subject';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    return (
        <StyledContainer>
            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                        Loading teacher details...
                    </Typography>
                </LoadingContainer>
            ) : (
                <>
                    <HeaderSection>
                        <BackButton 
                            variant="outlined" 
                            onClick={() => navigate("/Admin/teachers")}
                            startIcon={<ArrowBackIcon />}
                        >
                            Back to Teachers
                        </BackButton>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                            Teacher Profile
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                            Detailed information about the teacher and their assignments
                        </Typography>
                    </HeaderSection>

                    <ContentGrid container spacing={3}>
                        {/* Teacher Basic Info Card */}
                        <Grid item xs={12} md={6}>
                            <InfoCard elevation={4}>
                                <CardHeader>
                                    <PersonIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Teacher Information
                                    </Typography>
                                </CardHeader>
                                
                                <InfoContent>
                                    <InfoItem>
                                        <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                            Full Name
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                            {teacherDetails?.name || 'N/A'}
                                        </Typography>
                                    </InfoItem>

                                    <InfoItem>
                                        <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                            Email Address
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                                            {teacherDetails?.email || 'N/A'}
                                        </Typography>
                                    </InfoItem>

                                    <InfoItem>
                                        <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                            Teacher ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#666', fontFamily: 'monospace' }}>
                                            {teacherDetails?._id || 'N/A'}
                                        </Typography>
                                    </InfoItem>
                                </InfoContent>
                            </InfoCard>
                        </Grid>

                        {/* Class Assignment Card */}
                        <Grid item xs={12} md={6}>
                            <AssignmentCard elevation={4}>
                                <CardHeader>
                                    <ClassIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Class Assignment
                                    </Typography>
                                </CardHeader>
                                
                                <InfoContent>
                                    <InfoItem>
                                        <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                            Assigned Class
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                            {teacherDetails?.teachSclass?.sclassName || 'Not Assigned'}
                                        </Typography>
                                    </InfoItem>

                                    <InfoItem>
                                        <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                            Class ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#666', fontFamily: 'monospace' }}>
                                            {teacherDetails?.teachSclass?._id || 'N/A'}
                                        </Typography>
                                    </InfoItem>
                                </InfoContent>
                            </AssignmentCard>
                        </Grid>

                        {/* Subject Assignment Card */}
                        <Grid item xs={12}>
                            <SubjectCard elevation={4}>
                                <CardHeader>
                                    <SubjectIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Subject Assignment
                                    </Typography>
                                </CardHeader>

                                {isSubjectNamePresent ? (
                                    <InfoContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={4}>
                                                <InfoItem>
                                                    <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                                                        Subject Name
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                        {teacherDetails?.teachSubject?.subName}
                                                    </Typography>
                                                </InfoItem>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <InfoItem>
                                                    <EventIcon sx={{ color: '#1976d2', mr: 1 }} />
                                                    <Typography variant="body2" sx={{ color: '#999', fontWeight: 500, display: 'inline' }}>
                                                        Sessions: 
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: '#333', fontWeight: 600, display: 'inline', ml: 1 }}>
                                                        {teacherDetails?.teachSubject?.sessions}
                                                    </Typography>
                                                </InfoItem>
                                            </Grid>
                                        </Grid>
                                    </InfoContent>
                                ) : (
                                    <EmptyState>
                                        <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                                            No Subject Assigned
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                                            This teacher doesn't have any subject assigned yet. Assign a subject to get started.
                                        </Typography>
                                        <AddSubjectButton 
                                            variant="contained" 
                                            onClick={handleAddSubject}
                                            startIcon={<AddIcon />}
                                        >
                                            Assign Subject
                                        </AddSubjectButton>
                                    </EmptyState>
                                )}
                            </SubjectCard>
                        </Grid>
                    </ContentGrid>
                </>
            )}
        </StyledContainer>
    );
};

export default TeacherDetails;

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
  position: relative;
`;

const ContentGrid = styled(Grid)`
  margin-bottom: 40px;
`;

const InfoCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(25, 118, 210, 0.15);
  }
`;

const AssignmentCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(25, 118, 210, 0.15);
  }
`;

const SubjectCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(25, 118, 210, 0.15);
  }
`;

const CardHeader = styled(Box)`
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const InfoContent = styled(Box)`
  margin-top: 16px;
`;

const InfoItem = styled(Box)`
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1976d2;
    background: #f0f7ff;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  background: #f8fbff;
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
`;

const BackButton = styled(Button)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
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
    transform: translateY(-50%) translateX(-4px);
  }
`;

const AddSubjectButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
    transform: translateY(-2px);
  }
`;