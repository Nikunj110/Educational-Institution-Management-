import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton, Card, CircularProgress,
    Button
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import styled from 'styled-components';

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        // setShowPopup(true)
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getClassStudents(classID));
                dispatch(resetSubjects())
                dispatch(getSubjectList(classID, "ClassSubjects"))
            })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <ButtonContainer>
                <DeleteBtn onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon />
                </DeleteBtn>
                <ViewButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    View Details
                </ViewButton >
            </ButtonContainer>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(classID, "SubjectsClass")
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <SectionCard elevation={4}>
                {response ?
                    <EmptyState>
                        <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                            No Subjects Added
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                            Start by adding subjects to this class.
                        </Typography>
                        <AddButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                            startIcon={<PostAddIcon />}
                        >
                            Add Subjects
                        </AddButton>
                    </EmptyState>
                    :
                    <>
                        <SectionHeader>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                Subjects ({subjectsList?.length || 0})
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Manage subjects for this class
                            </Typography>
                        </SectionHeader>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                }
            </SectionCard>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <ButtonContainer>
                <DeleteBtn onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon />
                </DeleteBtn>
                <ViewButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </ViewButton>
                <AttendanceButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Attendance
                </AttendanceButton>
            </ButtonContainer>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(classID, "StudentsClass")
        },
    ];

    const ClassStudentsSection = () => {
        return (
            <SectionCard elevation={4}>
                {getresponse ? (
                    <EmptyState>
                        <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                            No Students Enrolled
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                            Start by adding students to this class.
                        </Typography>
                        <AddButton
                            variant="contained"
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            startIcon={<PersonAddAlt1Icon />}
                        >
                            Add Students
                        </AddButton>
                    </EmptyState>
                ) : (
                    <>
                        <SectionHeader>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                Students ({sclassStudents?.length || 0})
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Manage students in this class
                            </Typography>
                        </SectionHeader>

                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </SectionCard>
        )
    }

    const ClassTeachersSection = () => {
        return (
            <SectionCard elevation={4}>
                <SectionHeader>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Teachers
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Teacher management for this class
                    </Typography>
                </SectionHeader>
                <EmptyState>
                    <Typography variant="body1" sx={{ color: '#999' }}>
                        Teacher management features coming soon...
                    </Typography>
                </EmptyState>
            </SectionCard>
        )
    }

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList?.length || 0;
        const numberOfStudents = sclassStudents?.length || 0;

        return (
            <DetailsCard elevation={4}>
                <SectionHeader>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
                        {sclassDetails?.sclassName || 'Class Details'}
                    </Typography>
                </SectionHeader>

                <DetailsGrid>
                    <DetailItem>
                        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                            {numberOfSubjects}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Subjects
                        </Typography>
                    </DetailItem>

                    <DetailItem>
                        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                            {numberOfStudents}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Students
                        </Typography>
                    </DetailItem>
                </DetailsGrid>

                <ActionButtons>
                    {getresponse &&
                        <AddButton
                            variant="contained"
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            startIcon={<PersonAddAlt1Icon />}
                        >
                            Add Students
                        </AddButton>
                    }
                    {response &&
                        <AddButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                            startIcon={<PostAddIcon />}
                        >
                            Add Subjects
                        </AddButton>
                    }
                </ActionButtons>
            </DetailsCard>
        );
    }

    return (
        <StyledContainer>
            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                        Loading class details...
                    </Typography>
                </LoadingContainer>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1' }} >
                        <TabContext value={value}>
                            <StyledTabContainer>
                                <StyledTabList onChange={handleChange}>
                                    <StyledTab label="Class Overview" value="1" />
                                    <StyledTab label="Subjects" value="2" />
                                    <StyledTab label="Students" value="3" />
                                    <StyledTab label="Teachers" value="4" />
                                </StyledTabList>
                            </StyledTabContainer>
                            <TabPanelContainer>
                                <TabPanel value="1">
                                    <ClassDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ClassSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ClassStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <ClassTeachersSection />
                                </TabPanel>
                            </TabPanelContainer>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default ClassDetails;

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
`;

const DetailsCard = styled(Card)`
  border-radius: 20px;
  padding: 40px 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  text-align: center;
`;

const SectionHeader = styled(Box)`
  margin-bottom: 24px;
  text-align: center;
`;

const DetailsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 32px;
  margin: 32px 0;
`;

const DetailItem = styled(Box)`
  padding: 24px 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

const ActionButtons = styled(Box)`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
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

const AddButton = styled(Button)`
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

const DeleteBtn = styled(IconButton)`
  color: #d32f2f;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(211, 47, 47, 0.1);
    transform: scale(1.1);
  }
`;