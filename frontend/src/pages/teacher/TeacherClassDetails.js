import { useEffect } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { 
    Paper, 
    Box, 
    Typography, 
    ButtonGroup, 
    Button, 
    Popper, 
    Grow, 
    ClickAwayListener, 
    MenuList, 
    MenuItem,
    Container,
    Card,
    CircularProgress,
    Chip,
    Stack
} from '@mui/material';
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp, People, School, Assignment } from "@mui/icons-material";
import styled from 'styled-components';

const TeacherClassDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
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
        const options = ['Take Attendance', 'Provide Marks'];

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleClick = () => {
            console.info(`You clicked ${options[selectedIndex]}`);
            if (selectedIndex === 0) {
                handleAttendance();
            } else if (selectedIndex === 1) {
                handleMarks();
            }
        };

        const handleAttendance = () => {
            navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
        }
        const handleMarks = () => {
            navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }

            setOpen(false);
        };
        return (
            <ActionButtons>
                <ViewButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Teacher/class/student/" + row.id)
                    }
                >
                    View
                </ViewButton>
                <React.Fragment>
                    <StyledButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        <Button onClick={handleClick} sx={buttonGroupStyles}>
                            {options[selectedIndex]}
                        </Button>
                        <ActionButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </ActionButton>
                    </StyledButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <StyledPaper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                    sx={menuItemStyles}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </StyledPaper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment>
            </ActionButtons>
        );
    };

    return (
        <StyledContainer>
            <ContentWrapper>
                {loading ? (
                    <LoadingContainer>
                        <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                            Loading class details...
                        </Typography>
                    </LoadingContainer>
                ) : (
                    <>
                        <HeaderSection>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                                Class Management
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#666' }}>
                                Manage students in your class and track their progress
                            </Typography>
                        </HeaderSection>

                        <ClassInfoCard elevation={4}>
                            <CardHeader>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <School sx={{ fontSize: 32, color: '#1976d2' }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                            {currentUser.teachSclass?.sclassName}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#666' }}>
                                            Your Teaching Class
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip 
                                    label={currentUser.teachSubject?.subName} 
                                    color="primary" 
                                    variant="filled"
                                    sx={{ 
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '14px'
                                    }}
                                />
                            </CardHeader>
                        </ClassInfoCard>

                        {getresponse ? (
                            <EmptyStateCard>
                                <People sx={{ fontSize: 64, color: '#ccc', mb: 3 }} />
                                <Typography variant="h5" sx={{ color: '#666', fontWeight: 600, mb: 2 }}>
                                    No Students Found
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#999', textAlign: 'center', mb: 3 }}>
                                    There are no students enrolled in this class yet.
                                </Typography>
                            </EmptyStateCard>
                        ) : (
                            <StudentsCard elevation={4}>
                                <CardHeader>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <People sx={{ fontSize: 28, color: '#1976d2' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                            Students List
                                        </Typography>
                                    </Box>
                                    <StudentCount>
                                        <Typography variant="h6" sx={{ color: '#666', fontWeight: 600 }}>
                                            Total Students
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
                                            {sclassStudents.length}
                                        </Typography>
                                    </StudentCount>
                                </CardHeader>
                                
                                <TableContainer>
                                    {Array.isArray(sclassStudents) && sclassStudents.length > 0 &&
                                        <TableTemplate 
                                            buttonHaver={StudentsButtonHaver} 
                                            columns={studentColumns} 
                                            rows={studentRows} 
                                        />
                                    }
                                </TableContainer>
                            </StudentsCard>
                        )}
                    </>
                )}
            </ContentWrapper>
        </StyledContainer>
    );
};

export default TeacherClassDetails;

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
const ClassInfoCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 32px;
  overflow: hidden;
`;

const StudentsCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const EmptyStateCard = styled(Card)`
  border-radius: 20px;
  padding: 80px 40px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
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

// Action Components
const ActionButtons = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const ViewButton = styled(Button)`
  background: #1976d2;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1565c0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled(Button)`
  background: #333;
  color: white;
  min-width: 32px;
  padding: 0;
  
  &:hover {
    background: #555;
  }
`;

const StyledPaper = styled(Paper)`
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

// Info Components
const StudentCount = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

// Style Objects
const buttonGroupStyles = {
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
  }
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