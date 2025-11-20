import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Paper, Box, IconButton, Typography, Card, Container, CircularProgress, Tooltip,
    Button
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import styled from 'styled-components';

const ShowNotices = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            })
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 200 },
        { id: 'date', label: 'Date', minWidth: 120 },
    ];

    const noticeRows = noticesList && noticesList.length > 0 && noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    const NoticeButtonHaver = ({ row }) => {
        return (
            <ButtonContainer>
                <Tooltip title="Delete Notice">
                    <DeleteBtn onClick={() => deleteHandler(row.id, "Notice")}>
                        <DeleteIcon />
                    </DeleteBtn>
                </Tooltip>
            </ButtonContainer>
        );
    };

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />, name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    return (
        <StyledContainer>
            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    Notice Board
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage all announcements and important notices for your institution
                </Typography>
            </HeaderSection>

            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                        Loading notices...
                    </Typography>
                </LoadingContainer>
            ) : (
                <ContentSection>
                    {response ? (
                        <EmptyStateCard elevation={4}>
                            <AnnouncementIcon sx={{ fontSize: 60, color: '#666', mb: 2 }} />
                            <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                                No Notices Yet
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#999', mb: 3, textAlign: 'center' }}>
                                Start by creating your first notice to share important information with students and staff.
                            </Typography>
                            <AddNoticeButton 
                                variant="contained" 
                                onClick={() => navigate("/Admin/addnotice")}
                                startIcon={<NoteAddIcon />}
                            >
                                Create First Notice
                            </AddNoticeButton>
                        </EmptyStateCard>
                    ) : (
                        <>
                            {Array.isArray(noticesList) && noticesList.length > 0 && (
                                <TableCard elevation={4}>
                                    <TableHeader>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                            All Notices ({noticesList.length})
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            Recent announcements and important updates
                                        </Typography>
                                    </TableHeader>
                                    <TableTemplate 
                                        buttonHaver={NoticeButtonHaver} 
                                        columns={noticeColumns} 
                                        rows={noticeRows} 
                                    />
                                </TableCard>
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </>
                    )}
                </ContentSection>
            )}
        </StyledContainer>
    );
};

export default ShowNotices;

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
  min-height: 400px;
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
`;

const DeleteBtn = styled(IconButton)`
  color: #d32f2f;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(211, 47, 47, 0.1);
    transform: scale(1.1);
  }
`;

const AddNoticeButton = styled(Button)`
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