import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton, Typography, Card, Container, CircularProgress, Tooltip
} from '@mui/material';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import ClassIcon from '@mui/icons-material/Class';
import styled from 'styled-components';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                    Loading teachers...
                </Typography>
            </LoadingContainer>
        );
    } else if (response) {
        return (
            <StyledContainer>
                <EmptyStateCard elevation={4}>
                    <PersonIcon sx={{ fontSize: 60, color: '#666', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                        No Teachers Found
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999', mb: 3, textAlign: 'center' }}>
                        Start by adding teachers to manage classes and subjects in your institution.
                    </Typography>
                    <AddTeacherButton 
                        variant="contained" 
                        onClick={() => navigate("/Admin/teachers/chooseclass")}
                        startIcon={<PersonAddAlt1Icon />}
                    >
                        Add First Teacher
                    </AddTeacherButton>
                </EmptyStateCard>
            </StyledContainer>
        );
    } else if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        // setShowPopup(true)

        dispatch(deleteUser(deleteID, address)).then(() => {
            dispatch(getAllTeachers(currentUser._id));
        });
    };

    const columns = [
        { id: 'name', label: 'Teacher Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const rows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        };
    });

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    return (
        <StyledContainer>
            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    Teacher Management
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage all teachers and their assigned classes and subjects
                </Typography>
            </HeaderSection>

            <TableCard elevation={4}>
                <TableHeader>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        All Teachers ({teachersList.length})
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Teachers with their assigned classes and subjects
                    </Typography>
                </TableHeader>

                <StyledTableContainer>
                    <StyledTable stickyHeader aria-label="teachers table">
                        <TableHead>
                            <StyledTableRow>
                                {columns.map((column) => (
                                    <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, fontWeight: 600, color: '#1976d2' }}
                                    >
                                        {column.label}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell align="center" style={{ fontWeight: 600, color: '#1976d2' }}>
                                    Actions
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'teachSubject') {
                                                    return (
                                                        <StyledTableCell key={column.id} align={column.align}>
                                                            {value ? (
                                                                <SubjectInfo>
                                                                    <SubjectIcon sx={{ color: '#1976d2', fontSize: 18, mr: 1 }} />
                                                                    {value}
                                                                </SubjectInfo>
                                                            ) : (
                                                                <AddSubjectButton 
                                                                    variant="outlined"
                                                                    onClick={() => {
                                                                        navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)
                                                                    }}
                                                                >
                                                                    Assign Subject
                                                                </AddSubjectButton>
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                }
                                                if (column.id === 'teachSclass') {
                                                    return (
                                                        <StyledTableCell key={column.id} align={column.align}>
                                                            <ClassInfo>
                                                                <ClassIcon sx={{ color: '#1976d2', fontSize: 18, mr: 1 }} />
                                                                {value}
                                                            </ClassInfo>
                                                        </StyledTableCell>
                                                    );
                                                }
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        <TeacherInfo>
                                                            <PersonIcon sx={{ color: '#1976d2', fontSize: 18, mr: 1 }} />
                                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                                        </TeacherInfo>
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell align="center">
                                                <ActionButtons>
                                                    <Tooltip title="Delete Teacher">
                                                        <DeleteBtn onClick={() => deleteHandler(row.id, "Teacher")}>
                                                            <PersonRemoveIcon />
                                                        </DeleteBtn>
                                                    </Tooltip>
                                                    <ViewButton 
                                                        variant="contained"
                                                        onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}>
                                                        View Details
                                                    </ViewButton>
                                                </ActionButtons>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}
                        </TableBody>
                    </StyledTable>
                </StyledTableContainer>
                <StyledTablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableCard>

            <SpeedDialTemplate actions={actions} />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default ShowTeachers;

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
`;

const TableCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 24px;
`;

const TableHeader = styled(Box)`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const StyledTableContainer = styled(TableContainer)`
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #f8fbff;
  margin-bottom: 16px;
`;

const StyledTable = styled(Table)`
  .MuiTableRow-root:hover {
    background-color: rgba(25, 118, 210, 0.04);
  }
`;

const StyledTablePagination = styled(TablePagination)`
  border-top: 1px solid #e0e0e0;
  padding: 16px 0 0 0;
  
  .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows {
    margin-bottom: 0;
  }
`;

const EmptyStateCard = styled(Card)`
  border-radius: 20px;
  padding: 60px 40px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const ActionButtons = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const TeacherInfo = styled(Box)`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
`;

const SubjectInfo = styled(Box)`
  display: flex;
  align-items: center;
  color: #666;
`;

const ClassInfo = styled(Box)`
  display: flex;
  align-items: center;
  color: #666;
`;

const ViewButton = styled(BlueButton)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 16px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    transform: translateY(-1px);
  }
`;

const AddSubjectButton = styled(Button)`
  border: 2px solid #1976d2;
  color: #1976d2;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 4px 12px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.1);
    border: 2px solid #1565c0;
    transform: translateY(-1px);
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

const AddTeacherButton = styled(Button)`
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