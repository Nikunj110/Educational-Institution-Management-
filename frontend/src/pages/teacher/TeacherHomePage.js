import { Container, Grid, Paper, Typography, Box, Card, CircularProgress } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { People, Subject, Schedule, School } from '@mui/icons-material';

const TeacherHomePage = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents, loading } = useSelector((state) => state.sclass);

    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const numberOfStudents = sclassStudents && sclassStudents.length;
    const numberOfSessions = subjectDetails && subjectDetails.sessions;

    return (
        <StyledContainer>
            <ContentWrapper>
                <HeaderSection>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        Teacher Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        Welcome back! Here's your teaching overview for {currentUser.teachSubject?.subName}
                    </Typography>
                </HeaderSection>

                {loading ? (
                    <LoadingContainer>
                        <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                            Loading classroom data...
                        </Typography>
                    </LoadingContainer>
                ) : (
                    <Grid container spacing={3}>
                        {/* Stats Cards */}
                        <Grid item xs={12} md={6} lg={3}>
                            <StatsCard>
                                <CardContent>
                                    <IconContainer className="students">
                                        <People sx={{ fontSize: 40 }} />
                                    </IconContainer>
                                    <StatsContent>
                                        <Typography variant="h6" sx={statsLabelStyles}>
                                            Class Students
                                        </Typography>
                                        <Data start={0} end={numberOfStudents} duration={2.5} />
                                    </StatsContent>
                                </CardContent>
                            </StatsCard>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <StatsCard>
                                <CardContent>
                                    <IconContainer className="lessons">
                                        <Subject sx={{ fontSize: 40 }} />
                                    </IconContainer>
                                    <StatsContent>
                                        <Typography variant="h6" sx={statsLabelStyles}>
                                            Total Lessons
                                        </Typography>
                                        <Data start={0} end={numberOfSessions} duration={2.5} />
                                    </StatsContent>
                                </CardContent>
                            </StatsCard>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <StatsCard>
                                <CardContent>
                                    <IconContainer className="subject">
                                        <School sx={{ fontSize: 40 }} />
                                    </IconContainer>
                                    <StatsContent>
                                        <Typography variant="h6" sx={statsLabelStyles}>
                                            Teaching Subject
                                        </Typography>
                                        <SubjectValue>
                                            {currentUser.teachSubject?.subName}
                                        </SubjectValue>
                                    </StatsContent>
                                </CardContent>
                            </StatsCard>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <StatsCard>
                                <CardContent>
                                    <IconContainer className="class">
                                        <Schedule sx={{ fontSize: 40 }} />
                                    </IconContainer>
                                    <StatsContent>
                                        <Typography variant="h6" sx={statsLabelStyles}>
                                            Assigned Class
                                        </Typography>
                                        <ClassValue>
                                            {currentUser.teachSclass?.sclassName}
                                        </ClassValue>
                                    </StatsContent>
                                </CardContent>
                            </StatsCard>
                        </Grid>

                        {/* Notices Section */}
                        <Grid item xs={12}>
                            <NoticeCard>
                                <CardHeader>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        School Notices & Announcements
                                    </Typography>
                                </CardHeader>
                                <NoticeContent>
                                    <SeeNotice />
                                </NoticeContent>
                            </NoticeCard>
                        </Grid>
                    </Grid>
                )}
            </ContentWrapper>
        </StyledContainer>
    )
}

export default TeacherHomePage

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const ContentWrapper = styled(Box)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 48px;
`;

// Card Styles
const StatsCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(25, 118, 210, 0.15);
  }
`;

const SummaryCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
`;

const InfoCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
`;

const NoticeCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
`;

const CardContent = styled(Box)`
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
`;

const CardHeader = styled(Box)`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 20px 20px 0 0;
`;

const SummaryContent = styled(Box)`
  padding: 32px;
`;

const InfoContent = styled(Box)`
  padding: 24px;
`;

const NoticeContent = styled(Box)`
  padding: 0;
`;

const StatsContent = styled(Box)`
  flex: 1;
`;

// Loading State
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

// Icon Containers
const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  
  &.students {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  }
  
  &.lessons {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  }
  
  &.subject {
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  }
  
  &.class {
    background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  }
  
  & .MuiSvgIcon-root {
    color: white;
  }
`;

// Data Components
const Data = styled(CountUp)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
  display: block;
`;

const SubjectValue = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff9800;
  display: block;
`;

const ClassValue = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #9c27b0;
  display: block;
`;

// Summary Components
const SummaryGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const SummaryItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  text-align: center;
`;

const SummaryLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 8px;
`;

const SummaryValue = styled(Typography)`
  font-size: 24px;
  color: #1976d2;
  font-weight: 700;
`;

// Quick Actions
const QuickActions = styled(Box)`
  margin-top: 24px;
`;

const ActionGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ActionItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
    background: white;
  }
`;

const ActionIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  
  &.attendance {
    background: rgba(25, 118, 210, 0.1);
    color: #1976d2;
  }
  
  &.marks {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
`;

const ActionText = styled(Box)`
  flex: 1;
  
  div {
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  small {
    color: #666;
    font-size: 12px;
  }
`;

// Info Components
const InfoItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
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

// Style Objects
const statsLabelStyles = {
  color: '#666',
  fontWeight: 600,
  marginBottom: '8px',
  fontSize: '16px'
};