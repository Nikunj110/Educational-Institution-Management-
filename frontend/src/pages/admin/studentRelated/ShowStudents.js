import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, IconButton, Container, Typography, Card, CircularProgress
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { BlackButton, BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

const ShowStudents = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            })
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const studentRows = studentsList && studentsList.length > 0 && studentsList.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            sclassName: student.sclassName.sclassName,
            id: student._id,
        };
    })

    const StudentButtonHaver = ({ row }) => {
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
            navigate("/Admin/students/student/attendance/" + row.id)
        }
        const handleMarks = () => {
            navigate("/Admin/students/student/marks/" + row.id)
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
            <ButtonContainer>
                <StyledIconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon />
                </StyledIconButton>
                <ViewButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}>
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
            </ButtonContainer>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    return (
        <StyledContainer>
            <ContentWrapper>
                <HeaderSection>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        Student Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        View and manage all students in your school
                    </Typography>
                </HeaderSection>

                {loading ? (
                    <LoadingContainer>
                        <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
                            Loading students...
                        </Typography>
                    </LoadingContainer>
                ) : (
                    <>
                        {response ? (
                            <EmptyStateCard>
                                <Typography variant="h5" sx={{ color: '#666', fontWeight: 600 }}>
                                    No Students Found
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#999', mt: 1, mb: 3 }}>
                                    Get started by adding your first student to the system.
                                </Typography>
                                <AddStudentButton
                                    variant="contained"
                                    onClick={() => navigate("/Admin/addstudents")}
                                >
                                    Add Students
                                </AddStudentButton>
                            </EmptyStateCard>
                        ) : (
                            <StyledCard elevation={4}>
                                <CardContent>
                                    {Array.isArray(studentsList) && studentsList.length > 0 ? (
                                        <>
                                            <TableHeader>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                                    All Students ({studentsList.length})
                                                </Typography>
                                            </TableHeader>
                                            <TableTemplate 
                                                buttonHaver={StudentButtonHaver} 
                                                columns={studentColumns} 
                                                rows={studentRows} 
                                            />
                                        </>
                                    ) : (
                                        <EmptyStateCard>
                                            <Typography variant="h5" sx={{ color: '#666', fontWeight: 600 }}>
                                                No Students Available
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#999', mt: 1, mb: 3 }}>
                                                There are no students registered in the system yet.
                                            </Typography>
                                            <AddStudentButton
                                                variant="contained"
                                                onClick={() => navigate("/Admin/addstudents")}
                                            >
                                                Add First Student
                                            </AddStudentButton>
                                        </EmptyStateCard>
                                    )}
                                </CardContent>
                            </StyledCard>
                        )}
                        <SpeedDialTemplate actions={actions} />
                    </>
                )}
            </ContentWrapper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default ShowStudents;

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

const StyledCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
  margin-bottom: 24px;
`;

const CardContent = styled(Box)`
  padding: 0;
`;

const TableHeader = styled(Box)`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
`;

const EmptyStateCard = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  text-align: center;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const StyledIconButton = styled(IconButton)`
  background: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
  padding: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(244, 67, 54, 0.2);
    transform: scale(1.05);
  }
  
  & .MuiSvgIcon-root {
    color: #f44336;
    font-size: 20px;
  }
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

const AddStudentButton = styled(Button)`
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 32px;
  font-size: 16px;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }
`;

const StyledPaper = styled(Paper)`
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

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