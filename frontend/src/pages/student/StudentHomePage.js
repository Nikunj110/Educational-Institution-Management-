import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Typography, Box, Card, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { School, AssignmentTurnedIn, TrendingUp } from '@mui/icons-material';

const StudentHomePage = () => {
    const dispatch = useDispatch();

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const classID = currentUser.sclassName._id

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
    }, [dispatch, currentUser._id, classID]);

    const numberOfSubjects = subjectsList && subjectsList.length;

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    return (
        <StyledContainer>
            <ContentWrapper>
                <HeaderSection>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        Student Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        Welcome back, {currentUser.name}! Here's your academic overview.
                    </Typography>
                </HeaderSection>

                <Grid container spacing={3}>
                    {/* Stats Cards */}
                    <Grid item xs={12} md={4}>
                        <StatsCard>
                            <CardContent>
                                <IconContainer className="subject">
                                    <School sx={{ fontSize: 40 }} />
                                </IconContainer>
                                <StatsContent>
                                    <Typography variant="h6" sx={statsLabelStyles}>
                                        Total Subjects
                                    </Typography>
                                    <Data start={0} end={numberOfSubjects} duration={2.5} />
                                </StatsContent>
                            </CardContent>
                        </StatsCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StatsCard>
                            <CardContent>
                                <IconContainer className="attendance">
                                    <TrendingUp sx={{ fontSize: 40 }} />
                                </IconContainer>
                                <StatsContent>
                                    <Typography variant="h6" sx={statsLabelStyles}>
                                        Overall Attendance
                                    </Typography>
                                    <AttendanceData>
                                        {!loading && subjectAttendance && subjectAttendance.length > 0 ? (
                                            <CountUp 
                                                start={0} 
                                                end={overallAttendancePercentage} 
                                                duration={2.5} 
                                                decimals={1}
                                                suffix="%"
                                            />
                                        ) : (
                                            <Typography variant="h4" sx={{ color: '#999', fontWeight: 600 }}>
                                                N/A
                                            </Typography>
                                        )}
                                    </AttendanceData>
                                </StatsContent>
                            </CardContent>
                        </StatsCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StatsCard>
                            <CardContent>
                                <IconContainer className="assignments">
                                    <AssignmentTurnedIn sx={{ fontSize: 40 }} />
                                </IconContainer>
                                <StatsContent>
                                    <Typography variant="h6" sx={statsLabelStyles}>
                                        Class Info
                                    </Typography>
                                    <ClassInfo>
                                        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700 }}>
                                            {currentUser.sclassName.sclassName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {currentUser.rollNum}
                                        </Typography>
                                    </ClassInfo>
                                </StatsContent>
                            </CardContent>
                        </StatsCard>
                    </Grid>

                    {/* Attendance Chart */}
                    <Grid item xs={12} md={8}>
                        <ChartCard>
                            <CardHeader>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                    Attendance Overview
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    Your overall attendance performance
                                </Typography>
                            </CardHeader>
                            <ChartContent>
                                {response ? (
                                    <EmptyState>
                                        <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                                            No Attendance Data
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#999' }}>
                                            Attendance records will appear here once available.
                                        </Typography>
                                    </EmptyState>
                                ) : (
                                    <>
                                        {loading ? (
                                            <LoadingState>
                                                <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                                                <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                                                    Loading attendance...
                                                </Typography>
                                            </LoadingState>
                                        ) : (
                                            <>
                                                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                                                    <ChartContainer>
                                                        <CustomPieChart data={chartData} />
                                                        <ChartStats>
                                                            <StatItem>
                                                                <StatDot color="present" />
                                                                <StatText>
                                                                    <span>Present</span>
                                                                    <strong>{overallAttendancePercentage.toFixed(1)}%</strong>
                                                                </StatText>
                                                            </StatItem>
                                                            <StatItem>
                                                                <StatDot color="absent" />
                                                                <StatText>
                                                                    <span>Absent</span>
                                                                    <strong>{overallAbsentPercentage.toFixed(1)}%</strong>
                                                                </StatText>
                                                            </StatItem>
                                                        </ChartStats>
                                                    </ChartContainer>
                                                ) : (
                                                    <EmptyState>
                                                        <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                                                            No Attendance Records
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#999' }}>
                                                            Your attendance hasn't been recorded yet.
                                                        </Typography>
                                                    </EmptyState>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </ChartContent>
                        </ChartCard>
                    </Grid>

                    {/* Quick Info */}
                    <Grid item xs={12} md={4}>
                        <InfoCard>
                            <CardHeader>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                    Quick Stats
                                </Typography>
                            </CardHeader>
                            <InfoContent>
                                <InfoItem>
                                    <InfoLabel>Student Name</InfoLabel>
                                    <InfoValue>{currentUser.name}</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>Roll Number</InfoLabel>
                                    <InfoValue>{currentUser.rollNum}</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>Class</InfoLabel>
                                    <InfoValue>{currentUser.sclassName.sclassName}</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>Subjects Enrolled</InfoLabel>
                                    <InfoValue>{numberOfSubjects}</InfoValue>
                                </InfoItem>
                            </InfoContent>
                        </InfoCard>
                    </Grid>

                    {/* Notices Section */}
                    <Grid item xs={12}>
                        <NoticeCard>
                            <CardHeader>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                    Latest Notices
                                </Typography>
                            </CardHeader>
                            <NoticeContent>
                                <SeeNotice />
                            </NoticeContent>
                        </NoticeCard>
                    </Grid>
                </Grid>
            </ContentWrapper>
        </StyledContainer>
    )
}

export default StudentHomePage

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

const ChartCard = styled(Card)`
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

const ChartContent = styled(Box)`
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
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

const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  
  &.subject {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  }
  
  &.attendance {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  }
  
  &.assignments {
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  }
  
  & .MuiSvgIcon-root {
    color: white;
  }
`;

const ChartContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
`;

const ChartStats = styled(Box)`
  display: flex;
  gap: 32px;
  margin-top: 16px;
`;

const StatItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatDot = styled(Box)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color === 'present' ? '#4caf50' : '#f44336'};
`;

const StatText = styled(Box)`
  display: flex;
  flex-direction: column;
  
  span {
    font-size: 14px;
    color: #666;
  }
  
  strong {
    font-size: 18px;
    color: #333;
    font-weight: 600;
  }
`;

const ClassInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

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

// States
const LoadingState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

// Data Components
const Data = styled(CountUp)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
  display: block;
`;

const AttendanceData = styled(Box)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #4caf50;
`;

// Style Objects
const statsLabelStyles = {
  color: '#666',
  fontWeight: 600,
  marginBottom: '8px',
  fontSize: '16px'
};