import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableContainer, TableHead, Typography, Paper, Card, Container, CircularProgress, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { GreenButton, PurpleButton } from '../../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SubjectIcon from '@mui/icons-material/Subject';
import styled from 'styled-components';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false)

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (situation === "Norm") {
            setClassID(params.id);
            const classID = params.id
            dispatch(getTeacherFreeClassSubjects(classID));
        }
        else if (situation === "Teacher") {
            const { classID, teacherID } = params
            setClassID(classID);
            setTeacherID(teacherID);
            dispatch(getTeacherFreeClassSubjects(classID));
        }
    }, [situation]);

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                    Loading available subjects...
                </Typography>
            </LoadingContainer>
        );
    } else if (response) {
        return (
            <StyledContainer>
                <EmptyStateCard elevation={4}>
                    <SubjectIcon sx={{ fontSize: 60, color: '#666', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                        All Subjects Assigned
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999', mb: 3, textAlign: 'center' }}>
                        All subjects in this class already have teachers assigned.
                        You can add new subjects to assign a teacher.
                    </Typography>
                    <AddSubjectButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                        startIcon={<PostAddIcon />}
                    >
                        Add New Subjects
                    </AddSubjectButton>
                </EmptyStateCard>
            </StyledContainer>
        );
    } else if (error) {
        console.log(error)
    }

    const updateSubjectHandler = (teacherId, teachSubject) => {
        setLoader(true)
        dispatch(updateTeachSubject(teacherId, teachSubject))
        navigate("/Admin/teachers")
    }

    return (
        <StyledContainer>
            <ContentCard elevation={4}>
                <HeaderSection>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        {situation === "Norm" ? "Assign Teacher to Subject" : "Assign Subject to Teacher"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        {situation === "Norm"
                            ? "Choose a subject to assign a new teacher"
                            : "Choose a subject to assign to this teacher"}
                    </Typography>
                </HeaderSection>

                {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                    <TableSection>
                        <TableHeader>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                Available Subjects ({subjectsList.length})
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Subjects without assigned teachers
                            </Typography>
                        </TableHeader>

                        <StyledTableContainer>
                            <StyledTable aria-label="subjects table">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontWeight: 600, color: '#1976d2' }}>#</StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontWeight: 600, color: '#1976d2' }}>Subject Name</StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontWeight: 600, color: '#1976d2' }}>Subject Code</StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontWeight: 600, color: '#1976d2' }}>Actions</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {subjectsList.map((subject, index) => (
                                        <StyledTableRow key={subject._id} hover>
                                            <StyledTableCell component="th" scope="row">
                                                <IndexNumber>{index + 1}</IndexNumber>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <SubjectName>{subject.subName}</SubjectName>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <SubjectCode>{subject.subCode}</SubjectCode>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {situation === "Norm" ?
                                                    <ChooseButton
                                                        variant="contained"
                                                        onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}
                                                        startIcon={<SubjectIcon />}
                                                    >
                                                        Assign Teacher
                                                    </ChooseButton>
                                                    :
                                                    <ChooseButton
                                                        variant="contained"
                                                        disabled={loader}
                                                        onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                                        startIcon={loader ? <CircularProgress size={16} color="inherit" /> : <SubjectIcon />}
                                                    >
                                                        {loader ? 'Assigning...' : 'Assign Subject'}
                                                    </ChooseButton>}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                        </StyledTableContainer>
                    </TableSection>
                )}
            </ContentCard>
        </StyledContainer>
    );
};

export default ChooseSubject;

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 900px;
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

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const TableSection = styled(Box)`
  margin-top: 24px;
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
`;

const StyledTable = styled(Table)`
  .MuiTableRow-root:hover {
    background-color: rgba(25, 118, 210, 0.04);
  }
`;

const IndexNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.9rem;
`;

const SubjectName = styled(Typography)`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const SubjectCode = styled(Typography)`
  color: #666;
  font-family: 'Monospace', monospace;
  font-size: 0.9rem;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
`;

const ChooseButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    box-shadow: none;
    transform: none;
  }
`;

const AddSubjectButton = styled(Button)`
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

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;