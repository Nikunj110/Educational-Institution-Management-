import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, Card, Container, CircularProgress } from '@mui/material'
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import { PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import styled from 'styled-components';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error)
    }

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID)
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID)
        }
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ]

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    })

    const SclassButtonHaver = ({ row }) => {
        return (
            <>
                <ChooseButton variant="contained"
                    onClick={() => navigateHandler(row.id)}>
                    Select
                </ChooseButton>
            </>
        );
    };

    return (
        <StyledContainer>
            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    {situation === "Teacher" ? "Assign Teacher to Class" : "Add Subject to Class"}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    {situation === "Teacher" 
                        ? "Select a class to assign a teacher" 
                        : "Select a class to add a new subject"}
                </Typography>
            </HeaderSection>

            {loading ? (
                <LoadingContainer>
                    <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                    <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                        Loading classes...
                    </Typography>
                </LoadingContainer>
            ) : (
                <ContentCard elevation={4}>
                    {getresponse ? (
                        <EmptyState>
                            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                                No classes found
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                                You need to create classes first before you can {situation === "Teacher" ? "assign teachers" : "add subjects"}.
                            </Typography>
                            <AddClassButton 
                                variant="contained" 
                                onClick={() => navigate("/Admin/addclass")}
                            >
                                Create New Class
                            </AddClassButton>
                        </EmptyState>
                    ) : (
                        <>
                            <TableHeader>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                    Available Classes
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    Select a class to continue
                                </Typography>
                            </TableHeader>
                            
                            {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                                <TableContainer>
                                    <TableTemplate 
                                        buttonHaver={SclassButtonHaver} 
                                        columns={sclassColumns} 
                                        rows={sclassRows} 
                                    />
                                </TableContainer>
                            )}
                        </>
                    )}
                </ContentCard>
            )}
        </StyledContainer>
    )
}

export default ChooseClass

const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
`;

const ContentCard = styled(Card)`
  border-radius: 20px;
  padding: 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
  padding: 40px 24px;
`;

const TableHeader = styled(Box)`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const TableContainer = styled(Box)`
  flex: 1;
`;

const ChooseButton = styled(Button)`
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

const AddClassButton = styled(Button)`
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