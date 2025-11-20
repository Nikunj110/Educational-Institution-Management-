import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Checkbox, Container, Typography, Card, CircularProgress
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';
import styled from 'styled-components';

const SeeComplains = () => {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: complain.user.name,
      complaint: complain.complaint,
      date: dateString,
      id: complain._id,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    return (
      <>
        <Checkbox 
          {...label} 
          sx={{
            color: '#1976d2',
            '&.Mui-checked': {
              color: '#1976d2',
            },
          }}
        />
      </>
    );
  };

  return (
    <StyledContainer>
      <ContentWrapper>
        <HeaderSection>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
            Student Complaints
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            View and manage all student complaints and feedback
          </Typography>
        </HeaderSection>

        {loading ? (
          <LoadingContainer>
            <CircularProgress size={40} sx={{ color: '#1976d2' }} />
            <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
              Loading complaints...
            </Typography>
          </LoadingContainer>
        ) : (
          <>
            {response ? (
              <EmptyStateCard>
                <Typography variant="h5" sx={{ color: '#666', fontWeight: 600 }}>
                  No Complaints Found
                </Typography>
                <Typography variant="body1" sx={{ color: '#999', mt: 1 }}>
                  There are no complaints to display at the moment.
                </Typography>
              </EmptyStateCard>
            ) : (
              <StyledCard elevation={4}>
                <CardContent>
                  {Array.isArray(complainsList) && complainsList.length > 0 ? (
                    <TableTemplate 
                      buttonHaver={ComplainButtonHaver} 
                      columns={complainColumns} 
                      rows={complainRows} 
                    />
                  ) : (
                    <EmptyStateCard>
                      <Typography variant="h5" sx={{ color: '#666', fontWeight: 600 }}>
                        No Complaints Available
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#999', mt: 1 }}>
                        No complaints have been submitted yet.
                      </Typography>
                    </EmptyStateCard>
                  )}
                </CardContent>
              </StyledCard>
            )}
          </>
        )}
      </ContentWrapper>
    </StyledContainer>
  );
};

export default SeeComplains;

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
`;

const CardContent = styled(Box)`
  padding: 0;
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