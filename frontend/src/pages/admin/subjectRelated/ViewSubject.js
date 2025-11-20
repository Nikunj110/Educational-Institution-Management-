import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper, Card, CircularProgress, Grid, IconButton, Button } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import styled from 'styled-components';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <ViewButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View Student
        </ViewButton>
        <AttendanceButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
        >
          Take Attendance
        </AttendanceButton>
      </ButtonContainer>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <ViewButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View Student
        </ViewButton>
        <MarksButton variant="contained"
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
          Provide Marks
        </MarksButton>
      </ButtonContainer>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <SectionCard elevation={4}>
        {getresponse ? (
          <EmptyState>
            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              No Students Enrolled
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
              Add students to this class to manage their attendance and marks.
            </Typography>
            <AddStudentsButton
              variant="contained"
              onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              startIcon={<PersonAddAlt1Icon />}
            >
              Add Students
            </AddStudentsButton>
          </EmptyState>
        ) : (
          <>
            <SectionHeader>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                Students ({sclassStudents.length})
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Manage student attendance and marks for this subject
              </Typography>
            </SectionHeader>

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <StyledBottomNavigation>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                  sx={bottomNavStyles}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                  sx={bottomNavStyles}
                />
              </BottomNavigation>
            </StyledBottomNavigation>
          </>
        )}
      </SectionCard>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <DetailsCard elevation={4}>
        <SectionHeader>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
            {subjectDetails?.subName || 'Subject Details'}
          </Typography>
        </SectionHeader>

        <DetailsGrid>
          <DetailItem>
            <SubjectIcon sx={{ color: '#1976d2', fontSize: 40, mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
              {subjectDetails?.subName || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Subject Name
            </Typography>
          </DetailItem>

          <DetailItem>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
              {subjectDetails?.subCode || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Subject Code
            </Typography>
          </DetailItem>

          <DetailItem>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
              {subjectDetails?.sessions || '0'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Sessions
            </Typography>
          </DetailItem>

          <DetailItem>
            <PersonIcon sx={{ color: '#1976d2', fontSize: 40, mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
              {numberOfStudents}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Students
            </Typography>
          </DetailItem>
        </DetailsGrid>

        <AdditionalInfo>
          <InfoItem>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
              Class:
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              {subjectDetails?.sclassName?.sclassName || 'N/A'}
            </Typography>
          </InfoItem>

          <InfoItem>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
              Teacher:
            </Typography>
            {subjectDetails?.teacher ? (
              <Typography variant="body1" sx={{ color: '#666' }}>
                {subjectDetails.teacher.name}
              </Typography>
            ) : (
              <AddTeacherButton 
                variant="outlined"
                onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}
              >
                Assign Teacher
              </AddTeacherButton>
            )}
          </InfoItem>
        </AdditionalInfo>
      </DetailsCard>
    );
  }

  return (
    <StyledContainer>
      {subloading ? (
        <LoadingContainer>
          <CircularProgress size={40} sx={{ color: '#1976d2' }} />
          <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
            Loading subject details...
          </Typography>
        </LoadingContainer>
      ) : (
        <>
          <Box sx={{ width: '100%', typography: 'body1' }} >
            <TabContext value={value}>
              <StyledTabContainer>
                <StyledTabList onChange={handleChange}>
                  <StyledTab label="Subject Overview" value="1" />
                  <StyledTab label="Student Management" value="2" />
                </StyledTabList>
              </StyledTabContainer>
              <TabPanelContainer>
                <TabPanel value="1">
                  <SubjectDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <SubjectStudentsSection />
                </TabPanel>
              </TabPanelContainer>
            </TabContext>
          </Box>
        </>
      )}
    </StyledContainer>
  )
}

export default ViewSubject;

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const StyledTabContainer = styled(Box)`
  border-bottom: 1px solid #e0e0e0;
  background: white;
  position: sticky;
  top: 64px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
`;

const StyledTabList = styled(TabList)`
  & .MuiTab-root {
    text-transform: none;
    font-weight: 600;
    color: #666;
    min-height: 60px;
    
    &.Mui-selected {
      color: #1976d2;
    }
  }
  
  & .MuiTabs-indicator {
    background-color: #1976d2;
    height: 3px;
  }
`;

const StyledTab = styled(Tab)`
  font-size: 1rem;
`;

const TabPanelContainer = styled(Box)`
  margin-top: 2rem;
  margin-bottom: 4rem;
`;

const SectionCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 24px;
  position: relative;
  padding-bottom: 80px;
`;

const DetailsCard = styled(Card)`
  border-radius: 20px;
  padding: 40px 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
`;

const SectionHeader = styled(Box)`
  margin-bottom: 24px;
  text-align: center;
`;

const DetailsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin: 32px 0;
`;

const DetailItem = styled(Box)`
  padding: 24px 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1976d2;
    transform: translateY(-2px);
  }
`;

const AdditionalInfo = styled(Box)`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
`;

const InfoItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ViewButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    transform: translateY(-1px);
  }
`;

const AttendanceButton = styled(Button)`
  background: linear-gradient(135deg, #ed6c02 0%, #f57c00 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(237, 108, 2, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #e65100 0%, #ed6c02 100%);
    box-shadow: 0 4px 12px rgba(237, 108, 2, 0.3);
    transform: translateY(-1px);
  }
`;

const MarksButton = styled(Button)`
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
    transform: translateY(-1px);
  }
`;

const AddStudentsButton = styled(Button)`
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

const AddTeacherButton = styled(Button)`
  border: 2px solid #1976d2;
  color: #1976d2;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.1);
    border: 2px solid #1565c0;
    transform: translateY(-1px);
  }
`;

const StyledBottomNavigation = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  border-bottom: none;
`;

const bottomNavStyles = {
  '&.Mui-selected': {
    color: '#1976d2',
  },
};