import React from 'react'
import styled from 'styled-components';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box, 
    Avatar, 
    Container, 
    Paper,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import { 
    School, 
    Person, 
    Class, 
    Badge,
    Email,
    Phone,
    LocationOn,
    CalendarToday
} from '@mui/icons-material';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName
  const studentSchool = currentUser.school

  return (
    <StyledContainer>
        <ContentWrapper>
            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    Student Profile
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    View and manage your personal information
                </Typography>
            </HeaderSection>

            <ProfileGrid>
                {/* Main Profile Card */}
                <ProfileCard elevation={4}>
                    <CardHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <StyledAvatar alt="Student Avatar">
                                {String(currentUser.name).charAt(0)}
                            </StyledAvatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                                    {currentUser.name}
                                </Typography>
                                <Chip 
                                    label="Active Student" 
                                    color="success" 
                                    variant="filled"
                                    sx={{ 
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                        </Box>
                    </CardHeader>

                    <CardContent>
                        <InfoGrid>
                            <InfoItem>
                                <InfoIconContainer>
                                    <Badge sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Roll Number</InfoLabel>
                                    <InfoValue>{currentUser.rollNum}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <Class sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Class</InfoLabel>
                                    <InfoValue>{sclassName.sclassName}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <School sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>School</InfoLabel>
                                    <InfoValue>{studentSchool.schoolName}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <Person sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Student ID</InfoLabel>
                                    <InfoValue>{currentUser._id.toUpperCase()}</InfoValue>
                                </InfoContent>
                            </InfoItem>
                        </InfoGrid>
                    </CardContent>
                </ProfileCard>

               
            </ProfileGrid>
        </ContentWrapper>
    </StyledContainer>
  )
}

export default StudentProfile

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

const ProfileGrid = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// Card Styles
const ProfileCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  grid-column: 1 / -1;
`;

const InfoCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: fit-content;
`;

const ContactCard = styled(Card)`
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  height: fit-content;
`;

const CardHeader = styled(Box)`
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 20px 20px 0 0;
`;

// const CardContent = styled(Box)`
//   padding: 32px;
// `;

// Avatar
const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.3);
`;

// Info Grid
const InfoGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const InfoItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
  }
`;

const InfoIconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 12px;
`;

const InfoContent = styled(Box)`
  flex: 1;
`;

const InfoLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
`;

const InfoValue = styled(Typography)`
  font-size: 18px;
  color: #333;
  font-weight: 600;
`;

// Stats
const StatsGrid = styled(Box)`
  display: grid;
  gap: 16px;
`;

const StatItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

const StatIconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  
  &.subjects {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  }
  
  &.attendance {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  }
`;

const StatContent = styled(Box)`
  flex: 1;
`;

const StatLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const StatValue = styled(Typography)`
  font-size: 24px;
  color: #333;
  font-weight: 700;
`;

// Quick Actions
const QuickActions = styled(Box)`
  margin-top: 16px;
`;

const ActionChip = styled(Chip)`
  border: 2px solid #1976d2;
  color: #1976d2;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1976d2;
    color: white;
    transform: translateY(-2px);
  }
`;

// Contact Information
const ContactList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
`;

const ContactItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

const ContactIconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 8px;
`;

const ContactContent = styled(Box)`
  flex: 1;
`;

const ContactLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ContactValue = styled(Typography)`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

const EmergencyContact = styled(Box)`
  padding: 20px;
  background: #fff3e0;
  border-radius: 12px;
  border: 1px solid #ffb74d;
`;

const EmergencyItem = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;