import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton, Typography, Card, Container, CircularProgress, Tooltip,
    Button
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        // setShowPopup(true)

        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            })
    }

    const subjectColumns = [
        { id: 'subName', label: 'Subject Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <ButtonContainer>
                <Tooltip title="Delete Subject">
                    <DeleteBtn onClick={() => deleteHandler(row.id, "Subject")}>
                        <DeleteIcon />
                    </DeleteBtn>
                </Tooltip>
                <ViewButton variant="contained"
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                    View Details
                </ViewButton>
            </ButtonContainer>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    return (
        <StyledContainer>
            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    Subject Management
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage all subjects across different classes in your institution
                </Typography>
            </HeaderSection>

            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                        Loading subjects...
                    </Typography>
                </LoadingContainer>
            ) : (
                <ContentSection>
                    {response ? (
                        <EmptyStateCard elevation={4}>
                            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                                No Subjects Found
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                                Start by adding subjects to your classes to organize the curriculum.
                            </Typography>
                            <AddSubjectButton 
                                variant="contained" 
                                onClick={() => navigate("/Admin/subjects/chooseclass")}
                                startIcon={<PostAddIcon />}
                            >
                                Add First Subject
                            </AddSubjectButton>
                        </EmptyStateCard>
                    ) : (
                        <>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                                <TableCard elevation={4}>
                                    <TableHeader>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                            All Subjects ({subjectsList.length})
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            Subjects across all classes in your institution
                                        </Typography>
                                    </TableHeader>
                                    <TableTemplate 
                                        buttonHaver={SubjectsButtonHaver} 
                                        columns={subjectColumns} 
                                        rows={subjectRows} 
                                    />
                                </TableCard>
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </>
                    )}
                </ContentSection>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default ShowSubjects;

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

const ContentSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
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
  min-height: 300px;
`;

const TableCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
`;

const TableHeader = styled(Box)`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
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

const DeleteBtn = styled(IconButton)`
  color: #d32f2f;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(211, 47, 47, 0.1);
    transform: scale(1.1);
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