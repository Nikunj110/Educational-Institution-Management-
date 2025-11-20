import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Card, Stack, TextField, CircularProgress } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon, Edit, ArrowBack } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart'
import CustomPieChart from '../../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

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
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 48px;
`;

// Add the missing StyledTab component here
const StyledTab = styled(Tab)`
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
  color: #666;
  padding: 16px 24px;
  
  &.Mui-selected {
    color: #1976d2;
  }
`;

const StyledTabList = styled(TabList)`
  background: #f8fbff;
  border-bottom: 1px solid #e0e0e0;
  
  & .MuiTabs-indicator {
    background-color: #1976d2;
    height: 3px;
  }
`;

const TabPanelContainer = styled(Box)`
  padding: 0;
  min-height: 600px;
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

// Card Styles
const DetailsCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: none;
  border: 1px solid #e0e0e0;
  margin: 24px;
`;

const AttendanceCard = styled(Card)`
  border-radius: 20px;
  padding: 0;
  background: white;
  box-shadow: none;
  border: 1px solid #e0e0e0;
  margin: 24px;
  overflow: hidden;
`;

const MarksCard = styled(Card)`
  border-radius: 20px;
  padding: 0;
  background: white;
  box-shadow: none;
  border: 1px solid #e0e0e0;
  margin: 24px;
  overflow: hidden;
`;

const ChartCard = styled(Card)`
  border-radius: 20px;
  padding: 24px;
  background: white;
  box-shadow: none;
  border: 1px solid #e0e0e0;
  margin: 24px;
`;

const EmptyStateCard = styled(Card)`
  border-radius: 20px;
  padding: 80px 40px;
  background: white;
  box-shadow: none;
  border: 1px solid #e0e0e0;
  margin: 24px;
  text-align: center;
`;

const CardHeader = styled(Box)`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const TableContainer = styled(Box)`
  padding: 24px;
  border-radius: 0 0 20px 20px;
`;

// Info Grid
const InfoGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const InfoItem = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

const InfoLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled(Typography)`
  font-size: 18px;
  color: #333;
  font-weight: 600;
`;

// Action Components
const ActionSection = styled(Box)`
  display: flex;
  gap: 16px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-wrap: wrap;
`;

const ActionButtons = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

// Button Styles
const DetailButton = styled(Button)`
  background: #1976d2;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 12px;
  font-size: 14px;
  
  &:hover {
    background: #1565c0;
  }
`;

const ChangeButton = styled(Button)`
  background: #4caf50;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 12px;
  font-size: 14px;
  
  &:hover {
    background: #45a049;
  }
`;

const DeleteAllButton = styled(Button)`
  background: #f44336;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  
  &:hover {
    background: #d32f2f;
  }
`;

const AddAttendanceButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
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
  
  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    transform: translateY(-2px);
  }
`;

const BackButton = styled(Button)`
  border: 2px solid #e0e0e0;
  color: #666;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 10px 20px;
  
  &:hover {
    border-color: #1976d2;
    color: #1976d2;
    background: rgba(25, 118, 210, 0.04);
  }
`;

const DeleteButton = styled(Button)`
  background: #f44336;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 10px 20px;
  
  &:hover {
    background: #d32f2f;
  }
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

// Additional Styled Components
const DetailsContainer = styled(Box)`
  margin: 16px;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

const SummarySection = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-wrap: wrap;
  gap: 16px;
`;

const OverallAttendance = styled(Box)`
  display: flex;
  align-items: center;
`;

const ChartContainer = styled(Box)`
  margin-top: 32px;
  padding: 24px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

// Status Components
const SubjectName = styled(Typography)`
  font-weight: 600;
  color: #333;
`;

const AttendanceCount = styled(Typography)`
  font-weight: 700;
  color: ${props => props.present > 0 ? '#4caf50' : '#f44336'};
`;

const AttendancePercentage = styled(Typography)`
  font-weight: 700;
  color: ${props => {
    if (props.percentage >= 80) return '#4caf50';
    if (props.percentage >= 60) return '#ff9800';
    return '#f44336';
  }};
`;

const MarksValue = styled(Typography)`
  font-weight: 700;
  color: #1976d2;
  font-size: 18px;
`;

const StatusBadge = styled(Box)`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.status === 'Present' ? '#e8f5e8' : '#ffebee'};
  color: ${props => props.status === 'Present' ? '#4caf50' : '#f44336'};
  border: 1px solid ${props => props.status === 'Present' ? '#4caf50' : '#f44336'};
`;

// Style Objects
const deleteIconStyles = {
  color: '#f44336',
  '&:hover': {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  }
};

const navActionStyles = {
  '&.Mui-selected': {
    color: '#1976d2',
  }
};

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID])

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === ""
        ? { name, rollNum }
        : { name, rollNum, password }

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, studentID, address))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
    }

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <AttendanceCard>
                    <CardHeader>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            Attendance Records
                        </Typography>
                    </CardHeader>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell>Present</StyledTableCell>
                                    <StyledTableCell>Total Sessions</StyledTableCell>
                                    <StyledTableCell>Attendance %</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                return (
                                    <TableBody key={index}>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <SubjectName>{subName}</SubjectName>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <AttendanceCount present={present}>{present}</AttendanceCount>
                                            </StyledTableCell>
                                            <StyledTableCell>{sessions}</StyledTableCell>
                                            <StyledTableCell>
                                                <AttendancePercentage percentage={subjectAttendancePercentage}>
                                                    {subjectAttendancePercentage}%
                                                </AttendancePercentage>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <ActionButtons>
                                                    <DetailButton 
                                                        variant="contained"
                                                        onClick={() => handleOpen(subId)}
                                                        startIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    >
                                                        Details
                                                    </DetailButton>
                                                    <IconButton onClick={() => removeSubAttendance(subId)} sx={deleteIconStyles}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <ChangeButton 
                                                        variant="contained"
                                                        onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}
                                                    >
                                                        Change
                                                    </ChangeButton>
                                                </ActionButtons>
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
                                                                    <StyledTableCell align="right">Status</StyledTableCell>
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
                                                                            <StyledTableCell align="right">
                                                                                <StatusBadge status={data.status}>
                                                                                    {data.status}
                                                                                </StatusBadge>
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
                    <SummarySection>
                        <OverallAttendance>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                            </Typography>
                        </OverallAttendance>
                        <ActionSection>
                            <DeleteAllButton 
                                variant="contained" 
                                startIcon={<DeleteIcon />} 
                                onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
                            >
                                Delete All
                            </DeleteAllButton>
                            <AddAttendanceButton 
                                variant="contained"
                                onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}
                            >
                                Add Attendance
                            </AddAttendanceButton>
                        </ActionSection>
                    </SummarySection>
                </AttendanceCard>
            )
        }
        const renderChartSection = () => {
            return (
                <ChartCard>
                    <CardHeader>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            Attendance Overview
                        </Typography>
                    </CardHeader>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </ChartCard>
            )
        }
        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <NavigationPaper elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table View"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    sx={navActionStyles}
                                />
                                <BottomNavigationAction
                                    label="Chart View"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    sx={navActionStyles}
                                />
                            </BottomNavigation>
                        </NavigationPaper>
                    </>
                    :
                    <EmptyStateCard>
                        <Typography variant="h5" sx={{ color: '#666', fontWeight: 600, mb: 2 }}>
                            No Attendance Records
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#999', mb: 3 }}>
                            Start tracking attendance for this student.
                        </Typography>
                        <AddAttendanceButton 
                            variant="contained"
                            onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}
                        >
                            Add Attendance
                        </AddAttendanceButton>
                    </EmptyStateCard>
                }
            </>
        )
    }

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <MarksCard>
                    <CardHeader>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            Exam Results
                        </Typography>
                    </CardHeader>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell align="center">Marks Obtained</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {subjectMarks.map((result, index) => {
                                    if (!result.subName || !result.marksObtained) {
                                        return null;
                                    }
                                    return (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>
                                                <SubjectName>{result.subName.subName}</SubjectName>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <MarksValue>{result.marksObtained}/100</MarksValue>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ActionSection>
                        <AddMarksButton 
                            variant="contained"
                            onClick={() => navigate("/Admin/students/student/marks/" + studentID)}
                        >
                            Add Marks
                        </AddMarksButton>
                    </ActionSection>
                </MarksCard>
            )
        }
        const renderChartSection = () => {
            return (
                <ChartCard>
                    <CardHeader>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            Performance Overview
                        </Typography>
                    </CardHeader>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </ChartCard>
            )
        }
        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <NavigationPaper elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table View"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    sx={navActionStyles}
                                />
                                <BottomNavigationAction
                                    label="Chart View"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    sx={navActionStyles}
                                />
                            </BottomNavigation>
                        </NavigationPaper>
                    </>
                    :
                    <EmptyStateCard>
                        <Typography variant="h5" sx={{ color: '#666', fontWeight: 600, mb: 2 }}>
                            No Exam Results
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#999', mb: 3 }}>
                            Add exam marks to track student performance.
                        </Typography>
                        <AddMarksButton 
                            variant="contained"
                            onClick={() => navigate("/Admin/students/student/marks/" + studentID)}
                        >
                            Add Marks
                        </AddMarksButton>
                    </EmptyStateCard>
                }
            </>
        )
    }

    const StudentDetailsSection = () => {
        return (
            <DetailsCard>
                <CardHeader>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Student Information
                    </Typography>
                </CardHeader>
                <InfoGrid>
                    <InfoItem>
                        <InfoLabel>Student Name</InfoLabel>
                        <InfoValue>{userDetails.name}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Roll Number</InfoLabel>
                        <InfoValue>{userDetails.rollNum}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Class</InfoLabel>
                        <InfoValue>{sclassName.sclassName}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>School</InfoLabel>
                        <InfoValue>{studentSchool.schoolName}</InfoValue>
                    </InfoItem>
                </InfoGrid>
                
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                    <ChartContainer>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2, textAlign: 'center' }}>
                            Overall Attendance
                        </Typography>
                        <CustomPieChart data={chartData} />
                    </ChartContainer>
                )}

                <ActionSection>
                    <BackButton 
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        startIcon={<ArrowBack />}
                    >
                        Back to Students
                    </BackButton>
                    <DeleteButton 
                        variant="contained"
                        onClick={deleteHandler}
                        startIcon={<DeleteIcon />}
                    >
                        Delete Student
                    </DeleteButton>
                </ActionSection>
            </DetailsCard>
        )
    }

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
                <>
                    <HeaderSection>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                            Student Profile
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                            View and manage student information, attendance, and performance
                        </Typography>
                    </HeaderSection>

                    <ContentWrapper>
                        <TabContext value={value}>
                            <StyledTabList onChange={handleChange}>
                                <StyledTab label="Student Details" value="1" />
                                <StyledTab label="Attendance" value="2" />
                                <StyledTab label="Exam Results" value="3" />
                            </StyledTabList>
                            
                            <TabPanelContainer>
                                <TabPanel value="1">
                                    <StudentDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <StudentAttendanceSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <StudentMarksSection />
                                </TabPanel>
                            </TabPanelContainer>
                        </TabContext>
                    </ContentWrapper>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    )
}

export default ViewStudent