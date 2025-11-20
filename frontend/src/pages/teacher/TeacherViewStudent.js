import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { 
    Box, 
    Button, 
    Collapse, 
    Table, 
    TableBody, 
    TableHead, 
    Typography, 
    Container, 
    Card, 
    Grid, 
    Chip,
    CircularProgress,
    Divider
} from '@mui/material';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp,
    Person,
    School,
    Class,
    Badge,
    EventAvailable,
    EmojiEvents,
    ArrowBack
} from '@mui/icons-material';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import styled from 'styled-components';

const TeacherViewStudent = () => {

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

    const address = "Student"
    const studentID = params.id
    const teachSubject = currentUser.teachSubject?.subName
    const teachSubjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    // Safe calculation functions
    const safeCalculateOverallAttendancePercentage = (attendance) => {
        const percentage = calculateOverallAttendancePercentage(attendance);
        return typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
    };

    const safeCalculateSubjectAttendancePercentage = (present, sessions) => {
        const percentage = calculateSubjectAttendancePercentage(present, sessions);
        return typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
    };

    const overallAttendancePercentage = safeCalculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return '#4caf50';
        if (percentage >= 80) return '#8bc34a';
        if (percentage >= 70) return '#ff9800';
        if (percentage >= 60) return '#ff5722';
        return '#f44336';
    };

    return (
        <StyledContainer>
            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                        Loading student details...
                    </Typography>
                </LoadingContainer>
            ) : (
                <ContentWrapper>
                    <HeaderSection>
                        <BackButton 
                            variant="outlined" 
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowBack />}
                        >
                            Back to Class
                        </BackButton>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                            Student Profile
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                            View student details and manage academic records
                        </Typography>
                    </HeaderSection>

                    <Grid container spacing={3}>
                        {/* Student Information Card */}
                        <Grid item xs={12} md={4}>
                            <InfoCard elevation={4}>
                                <CardHeader>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Student Information
                                    </Typography>
                                </CardHeader>
                                <CardContent>
                                    <InfoItem>
                                        <Person sx={{ color: '#1976d2' }} />
                                        <InfoContent>
                                            <InfoLabel>Student Name</InfoLabel>
                                            <InfoValue>{userDetails.name}</InfoValue>
                                        </InfoContent>
                                    </InfoItem>

                                    <InfoItem>
                                        <Badge sx={{ color: '#1976d2' }} />
                                        <InfoContent>
                                            <InfoLabel>Roll Number</InfoLabel>
                                            <InfoValue>{userDetails.rollNum}</InfoValue>
                                        </InfoContent>
                                    </InfoItem>

                                    <InfoItem>
                                        <Class sx={{ color: '#1976d2' }} />
                                        <InfoContent>
                                            <InfoLabel>Class</InfoLabel>
                                            <InfoValue>{sclassName.sclassName}</InfoValue>
                                        </InfoContent>
                                    </InfoItem>

                                    <InfoItem>
                                        <School sx={{ color: '#1976d2' }} />
                                        <InfoContent>
                                            <InfoLabel>School</InfoLabel>
                                            <InfoValue>{studentSchool.schoolName}</InfoValue>
                                        </InfoContent>
                                    </InfoItem>

                                    <Divider sx={{ my: 2 }} />

                                    <InfoItem>
                                        <EventAvailable sx={{ color: '#1976d2' }} />
                                        <InfoContent>
                                            <InfoLabel>Your Subject</InfoLabel>
                                            <InfoValue>{teachSubject}</InfoValue>
                                        </InfoContent>
                                    </InfoItem>
                                </CardContent>
                            </InfoCard>
                        </Grid>

                        {/* Attendance Overview */}
                        <Grid item xs={12} md={8}>
                            <AttendanceCard elevation={4}>
                                <CardHeader>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Attendance Overview - {teachSubject}
                                    </Typography>
                                    <OverallAttendance>
                                        <Typography variant="h6" sx={{ color: '#666', fontWeight: 600 }}>
                                            Overall Attendance
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: getAttendanceColor(overallAttendancePercentage), fontWeight: 700 }}>
                                            {overallAttendancePercentage.toFixed(1)}%
                                        </Typography>
                                    </OverallAttendance>
                                </CardHeader>

                                <CardContent>
                                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                                        <>
                                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                                if (subName === teachSubject) {
                                                    const absentClasses = sessions - present;

                                                    return (
                                                        <TableContainer key={index}>
                                                            <Table>
                                                                <TableHead>
                                                                    <StyledTableRow>
                                                                        <StyledTableCell>Subject</StyledTableCell>
                                                                        <StyledTableCell align="center">Present</StyledTableCell>
                                                                        <StyledTableCell align="center">Absent</StyledTableCell>
                                                                        <StyledTableCell align="center">Total Classes</StyledTableCell>
                                                                        <StyledTableCell align="center">Details</StyledTableCell>
                                                                    </StyledTableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <StyledTableRow>
                                                                        <StyledTableCell>
                                                                            <SubjectInfo>
                                                                                <EventAvailable sx={{ color: '#1976d2', mr: 1 }} />
                                                                                {subName}
                                                                            </SubjectInfo>
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            <PresentCount>{present}</PresentCount>
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            <AbsentCount>{absentClasses}</AbsentCount>
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            <TotalCount>{sessions}</TotalCount>
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            <DetailButton 
                                                                                variant="outlined"
                                                                                onClick={() => handleOpen(subId)}
                                                                                startIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                                                sx={detailButtonStyles}
                                                                            >
                                                                                Details
                                                                            </DetailButton>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                    <StyledTableRow>
                                                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                                                <DetailsContainer>
                                                                                    <Typography variant="h6" gutterBottom component="div" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                                                        Attendance Details - {subName}
                                                                                    </Typography>
                                                                                    <Table size="small">
                                                                                        <TableHead>
                                                                                            <StyledTableRow>
                                                                                                <StyledTableCell>Date</StyledTableCell>
                                                                                            </StyledTableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {allData.map((data, index) => {
                                                                                                const date = new Date(data.date);
                                                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                                                return (
                                                                                                    <StyledTableRow key={index}>
                                                                                                        <StyledTableCell component="th" scope="row">
                                                                                                            {dateString}
                                                                                                        </StyledTableCell>
                                                                                                    </StyledTableRow>
                                                                                                );
                                                                                            })}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </DetailsContainer>
                                                                            </Collapse>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    )
                                                }
                                                return null;
                                            })}

                                            <ActionSection>
                                                <AddAttendanceButton 
                                                    variant="contained"
                                                    onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                                                >
                                                    Update Attendance
                                                </AddAttendanceButton>
                                            </ActionSection>
                                        </>
                                    ) : (
                                        <EmptyState>
                                            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                                                No Attendance Records
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                                                Start tracking attendance for this student in your subject.
                                            </Typography>
                                            <AddAttendanceButton 
                                                variant="contained"
                                                onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                                            >
                                                Add First Attendance
                                            </AddAttendanceButton>
                                        </EmptyState>
                                    )}
                                </CardContent>
                            </AttendanceCard>
                        </Grid>

                        {/* Marks Section */}
                        <Grid item xs={12} md={6}>
                            <MarksCard elevation={4}>
                                <CardHeader>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Exam Results - {teachSubject}
                                    </Typography>
                                </CardHeader>
                                <CardContent>
                                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                                        <>
                                            {subjectMarks.map((result, index) => {
                                                if (result.subName.subName === teachSubject) {
                                                    return (
                                                        <MarksContainer key={index}>
                                                            <Table>
                                                                <TableHead>
                                                                    <StyledTableRow>
                                                                        <StyledTableCell>Subject</StyledTableCell>
                                                                        <StyledTableCell align="center">Marks Obtained</StyledTableCell>
                                                                    </StyledTableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <StyledTableRow>
                                                                        <StyledTableCell>
                                                                            <SubjectInfo>
                                                                                <EmojiEvents sx={{ color: '#1976d2', mr: 1 }} />
                                                                                {result.subName.subName}
                                                                            </SubjectInfo>
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            <MarksValue>{result.marksObtained}/100</MarksValue>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </MarksContainer>
                                                    )
                                                }
                                                return null;
                                            })}
                                            <ActionSection>
                                                <AddMarksButton 
                                                    variant="contained"
                                                    onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                                                >
                                                    Update Marks
                                                </AddMarksButton>
                                            </ActionSection>
                                        </>
                                    ) : (
                                        <EmptyState>
                                            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                                                No Exam Results
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                                                Add exam marks for this student in your subject.
                                            </Typography>
                                            <AddMarksButton 
                                                variant="contained"
                                                onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                                            >
                                                Add First Marks
                                            </AddMarksButton>
                                        </EmptyState>
                                    )}
                                </CardContent>
                            </MarksCard>
                        </Grid>

                        {/* Attendance Chart */}
                        <Grid item xs={12} md={6}>
                            <ChartCard elevation={4}>
                                <CardHeader>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Overall Attendance
                                    </Typography>
                                </CardHeader>
                                <CardContent>
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
                                            <Typography variant="body1" sx={{ color: '#999', textAlign: 'center' }}>
                                                Attendance chart will appear here once attendance is recorded.
                                            </Typography>
                                        </EmptyState>
                                    )}
                                </CardContent>
                            </ChartCard>
                        </Grid>
                    </Grid>
                </ContentWrapper>
            )}
        </StyledContainer>
    )
}

export default TeacherViewStudent;

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

// Card Styles
const InfoCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
`;

const AttendanceCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const MarksCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const ChartCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
`;

const CardHeader = styled(Box)`
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border-radius: 20px 20px 0 0;
`;

const CardContent = styled(Box)`
  padding: 32px;
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

// Info Components
const InfoItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoContent = styled(Box)`
  display: flex;
  flex-direction: column;
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

// Attendance Components
const OverallAttendance = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

const TableContainer = styled(Box)`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  margin-bottom: 24px;
`;

const SubjectInfo = styled(Box)`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
`;

const PresentCount = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: #4caf50;
`;

const AbsentCount = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: #f44336;
`;

const TotalCount = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: #666;
`;

const DetailButton = styled(Button)`
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
`;

const DetailsContainer = styled(Box)`
  margin: 16px;
  padding: 24px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

// Marks Components
const MarksContainer = styled(Box)`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  margin-bottom: 24px;
`;

const MarksValue = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: #1976d2;
`;

// Chart Components
const ChartContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const ChartStats = styled(Box)`
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
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

// Action Components
const ActionSection = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const AddAttendanceButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
    transform: translateY(-2px);
  }
`;

const AddMarksButton = styled(Button)`
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }
`;

// Empty State
const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

// Style Objects
const detailButtonStyles = {
    borderColor: '#1976d2',
    color: '#1976d2',
    '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
        borderColor: '#1565c0',
    }
};