import React, { useEffect, useState } from 'react'
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
    ExpandMore,
    ExpandLess 
} from '@mui/icons-material';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Box, 
    Button, 
    Collapse, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography,
    Container,
    Card,
    Grid,
    CircularProgress,
    Chip,
    Stack
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart'
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import styled from 'styled-components';
import { CalendarToday, TrendingUp, EventAvailable } from '@mui/icons-material';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

    // Safe calculation functions to handle potential non-number values
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

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const percentage = safeCalculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: percentage,
            totalClasses: sessions,
            attendedClasses: present,
            absentClasses: sessions - present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return '#4caf50';
        if (percentage >= 80) return '#8bc34a';
        if (percentage >= 70) return '#ff9800';
        if (percentage >= 60) return '#ff5722';
        return '#f44336';
    };

    const renderTableSection = () => {
        return (
            <AttendanceCard>
                <CardHeader>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Attendance Records
                    </Typography>
                    <OverallStats>
                        <TableStatItem>
                            <Typography variant="h6" sx={{ color: '#666', fontWeight: 600 }}>
                                Overall Attendance
                            </Typography>
                            <Typography variant="h4" sx={{ color: getAttendanceColor(overallAttendancePercentage), fontWeight: 700 }}>
                                {overallAttendancePercentage.toFixed(1)}%
                            </Typography>
                        </TableStatItem>
                    </OverallStats>
                </CardHeader>
                <TableContainer>
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
                        {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                            const percentage = safeCalculateSubjectAttendancePercentage(present, sessions);
                            const absentClasses = sessions - present;

                            return (
                                <TableBody key={index}>
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
                                                startIcon={openStates[subId] ? <ExpandLess /> : <ExpandMore />}
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
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="center">Day</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                                                                
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            <DayName>{dayName}</DayName>
                                                                        </StyledTableCell>
                                                                        
                                                                    </StyledTableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </DetailsContainer>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        }
                        )}
                    </Table>
                </TableContainer>
            </AttendanceCard>
        )
    }

    return (
        <StyledContainer>
            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                        Loading attendance records...
                    </Typography>
                </LoadingContainer>
            ) : (
                <ContentWrapper>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                        <>
                            <HeaderSection>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                                    My Attendance
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    Track your attendance performance across all subjects
                                </Typography>
                            </HeaderSection>

                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            
                        </>
                    ) : (
                        <EmptyStateContainer>
                            <EmptyStateCard>
                                <CalendarToday sx={{ fontSize: 64, color: '#ccc', mb: 3 }} />
                                <Typography variant="h5" sx={{ color: '#666', fontWeight: 600, mb: 2 }}>
                                    No Attendance Records
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#999', textAlign: 'center', mb: 3 }}>
                                    Your attendance records will appear here once your teachers start marking attendance.
                                </Typography>
                                <Chip 
                                    label="Attendance not available" 
                                    variant="outlined" 
                                    sx={{ 
                                        borderColor: '#ccc',
                                        color: '#999'
                                    }}
                                />
                            </EmptyStateCard>
                        </EmptyStateContainer>
                    )}
                </ContentWrapper>
            )}
        </StyledContainer>
    )
}

export default ViewStdAttendance;

// add this function somewhere above the `return ( ... )` in the same file
const renderChartSection = () => {
  return (
    <ChartCard>
      <CardHeader>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
          Attendance Overview
        </Typography>
        <OverallStats>
          <TableStatItem>
            <Typography variant="h6" sx={{ color: '#666', fontWeight: 600 }}>
              Overall Attendance
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={overallAttendancePercentage}
                  size={110}
                  thickness={5}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {overallAttendancePercentage.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Present
                </Typography>
                <Typography variant="h6" sx={{ color: getAttendanceColor(overallAttendancePercentage), fontWeight: 700 }}>
                  {overallAttendancePercentage.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Absent {overallAbsentPercentage.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </TableStatItem>
        </OverallStats>
      </CardHeader>

      <ChartContainer>
        <Box sx={{ width: '100%', maxWidth: 900 }}>
          <ChartStats>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Subject-wise Attendance
            </Typography>

            <Grid container spacing={2}>
              {subjectData.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#777' }}>
                    No subject attendance available.
                  </Typography>
                </Grid>
              ) : (
                subjectData.map((s, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1 }}>
                      <Box sx={{ position: 'relative', width: 64, height: 64 }}>
                        <CircularProgress
                          variant="determinate"
                          value={s.attendancePercentage}
                          size={64}
                          thickness={5}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {Math.round(s.attendancePercentage)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {s.subject}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#777' }}>
                          {s.attendedClasses}/{s.totalClasses} classes
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </ChartStats>
        </Box>
      </ChartContainer>
    </ChartCard>
  );
};


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
const AttendanceCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 80px;
  overflow: hidden;
`;

const ChartCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 80px;
  overflow: hidden;
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
`;

const TableContainer = styled(Box)`
  padding: 0;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
`;

const ChartContainer = styled(Box)`
  padding: 32px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
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

// Empty State
const EmptyStateContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const EmptyStateCard = styled(Card)`
  border-radius: 20px;
  padding: 80px 40px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  text-align: center;
  max-width: 500px;
`;

// Navigation
const NavigationPaper = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  min-width: 300px;
  border-radius: 20px 20px 0 0;
  border: 1px solid #e0e0e0;
  border-bottom: none;
`;

// Table Components
const OverallStats = styled(Box)`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const TableStatItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
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

const AttendancePercentage = styled(Typography)`
  font-size: 16px;
  font-weight: 700;
  color: ${props => getAttendanceColor(props.percentage)};
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

const DayName = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const StatusChip = styled(Chip)`
  border-radius: 20px;
  font-weight: 600;
  background: ${props => props.status === 'Present' ? '#e8f5e8' : '#ffebee'};
  color: ${props => props.status === 'Present' ? '#4caf50' : '#f44336'};
  border: 1px solid ${props => props.status === 'Present' ? '#4caf50' : '#f44336'};
`;

// Chart Components
const ChartStats = styled(Box)`
  padding: 24px 32px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
`;

const StatSummary = styled(Box)`
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

// Helper function for attendance color
const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 80) return '#8bc34a';
    if (percentage >= 70) return '#ff9800';
    if (percentage >= 60) return '#ff5722';
    return '#f44336';
};

// Style Objects
const detailButtonStyles = {
    borderColor: '#1976d2',
    color: '#1976d2',
    '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
        borderColor: '#1565c0',
    }
};

const navActionStyles = {
    '&.Mui-selected': {
        color: '#1976d2',
    }
};