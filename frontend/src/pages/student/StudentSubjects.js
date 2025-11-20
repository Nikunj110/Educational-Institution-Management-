import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography,
    Box,
    Card,
    Grid,
    CircularProgress,
    Chip
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart'
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import styled from 'styled-components';
import { School, Subject, EmojiEvents, TrendingUp } from '@mui/icons-material';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails])

    useEffect(() => {
        if (Array.isArray(subjectMarks) && subjectMarks.length === 0) {
            if (currentUser && currentUser.sclassName && currentUser.sclassName._id) {
                dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
            }
        }
    }, [subjectMarks, dispatch, currentUser && currentUser.sclassName && currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const calculateAverageMarks = () => {
        if (!subjectMarks || subjectMarks.length === 0) return 0;
        const total = subjectMarks.reduce((sum, result) => sum + (parseInt(result.marksObtained) || 0), 0);
        return (total / subjectMarks.length).toFixed(1);
    };

    const getGrade = (marks) => {
        if (marks >= 90) return { grade: 'A+', color: '#4caf50' };
        if (marks >= 80) return { grade: 'A', color: '#4caf50' };
        if (marks >= 70) return { grade: 'B+', color: '#8bc34a' };
        if (marks >= 60) return { grade: 'B', color: '#ff9800' };
        if (marks >= 50) return { grade: 'C', color: '#ff9800' };
        if (marks >= 40) return { grade: 'D', color: '#f44336' };
        return { grade: 'F', color: '#f44336' };
    };

    const renderTableSection = () => {
        return (
            <MarksCard>
                <CardHeader>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Subject Marks
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AverageScore>
                            <Typography variant="h6" sx={{ color: '#666', fontWeight: 600 }}>
                                Average Score
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
                                {calculateAverageMarks()}%
                            </Typography>
                        </AverageScore>
                    </Box>
                </CardHeader>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell align="center">Marks Obtained</StyledTableCell>
                                <StyledTableCell align="center">Out of 100</StyledTableCell>
                                <StyledTableCell align="center">Grade</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                const gradeInfo = getGrade(result.marksObtained);
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>
                                            <SubjectInfo>
                                                <Subject sx={{ color: '#1976d2', mr: 1 }} />
                                                {result.subName.subName}
                                            </SubjectInfo>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <MarksValue>{result.marksObtained}</MarksValue>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant="body1" sx={{ color: '#666' }}>
                                                100
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <GradeChip 
                                                label={gradeInfo.grade} 
                                                sx={{ 
                                                    backgroundColor: gradeInfo.color,
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MarksCard>
        );
    };

    const renderChartSection = () => {
        return (
            <ChartCard>
                <CardHeader>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Performance Overview
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Visual representation of your marks across subjects
                    </Typography>
                </CardHeader>
                <ChartContainer>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </ChartContainer>
            </ChartCard>
        );
    };

    const renderClassDetailsSection = () => {
        return (
            <ClassDetailsContainer>
                <HeaderSection>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        Class Information
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        Your current class and enrolled subjects
                    </Typography>
                </HeaderSection>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <ClassInfoCard>
                            <CardHeader>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                    Class Details
                                </Typography>
                            </CardHeader>
                            <CardContent>
                                <ClassInfoItem>
                                    <School sx={{ color: '#1976d2', fontSize: 40 }} />
                                    <ClassInfoContent>
                                        <Typography variant="h6" sx={{ color: '#666', fontWeight: 600 }}>
                                            Current Class
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
                                            {sclassDetails && sclassDetails.sclassName}
                                        </Typography>
                                    </ClassInfoContent>
                                </ClassInfoItem>
                                
                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 3 }}>
                                    Enrolled Subjects
                                </Typography>
                                
                                <SubjectsGrid>
                                    {subjectsList && subjectsList.map((subject, index) => (
                                        <SubjectCard key={index}>
                                            <SubjectIconContainer>
                                                <Subject sx={{ color: '#1976d2' }} />
                                            </SubjectIconContainer>
                                            <SubjectContent>
                                                <SubjectName>{subject.subName}</SubjectName>
                                                <SubjectCode>{subject.subCode}</SubjectCode>
                                            </SubjectContent>
                                        </SubjectCard>
                                    ))}
                                </SubjectsGrid>
                            </CardContent>
                        </ClassInfoCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StatusCard>
                            <CardHeader>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                    Academic Status
                                </Typography>
                            </CardHeader>
                            <CardContent>
                                <StatusItem>
                                    <TrendingUp sx={{ color: '#1976d2' }} />
                                    <StatusContent>
                                        <StatusLabel>Total Subjects</StatusLabel>
                                        <StatusValue>{subjectsList ? subjectsList.length : 0}</StatusValue>
                                    </StatusContent>
                                </StatusItem>
                                
                                <StatusItem>
                                    <EmojiEvents sx={{ color: '#1976d2' }} />
                                    <StatusContent>
                                        <StatusLabel>Marks Available</StatusLabel>
                                        <StatusValue>Soon</StatusValue>
                                    </StatusContent>
                                </StatusItem>

                                <EmptyStateMessage>
                                    <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', mb: 2 }}>
                                        No exam results available yet.
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#999', textAlign: 'center' }}>
                                        Your marks will appear here once your exams are evaluated.
                                    </Typography>
                                </EmptyStateMessage>
                            </CardContent>
                        </StatusCard>
                    </Grid>
                </Grid>
            </ClassDetailsContainer>
        );
    };

    return (
        <StyledContainer>
            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                        Loading subjects...
                    </Typography>
                </LoadingContainer>
            ) : (
                <ContentWrapper>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                        <>
                            <HeaderSection>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                                    Academic Performance
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    View your marks and performance across subjects
                                </Typography>
                            </HeaderSection>

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
                    ) : (
                        renderClassDetailsSection()
                    )}
                </ContentWrapper>
            )}
        </StyledContainer>
    );
};

export default StudentSubjects;

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

const ClassDetailsContainer = styled(Box)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

// Card Styles
const MarksCard = styled(Card)`
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

const ClassInfoCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
`;

const StatusCard = styled(Card)`
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
`;

const CardContent = styled(Box)`
  padding: 32px;
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

// Marks Table Components
const AverageScore = styled(Box)`
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

const MarksValue = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: #1976d2;
`;

const GradeChip = styled(Chip)`
  border-radius: 8px;
  font-weight: 700;
`;

// Class Details Components
const ClassInfoItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: #f8fbff;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
`;

const ClassInfoContent = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Divider = styled(Box)`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
`;

const SubjectsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const SubjectCard = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
  }
`;

const SubjectIconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 8px;
`;

const SubjectContent = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const SubjectName = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const SubjectCode = styled(Typography)`
  font-size: 12px;
  color: #666;
`;

// Status Components
const StatusItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;
`;

const StatusContent = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const StatusLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const StatusValue = styled(Typography)`
  font-size: 24px;
  color: #1976d2;
  font-weight: 700;
`;

const EmptyStateMessage = styled(Box)`
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
  border-radius: 12px;
  border: 1px dashed #e0e0e0;
  margin-top: 24px;
`;

// Style Objects
const navActionStyles = {
  '&.Mui-selected': {
    color: '#1976d2',
  }
};