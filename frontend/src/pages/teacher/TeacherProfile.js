import React from 'react'
import styled from 'styled-components';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Avatar, 
    Container,
    Chip,
    Grid,
    Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import { 
    School, 
    Person, 
    Class, 
    Subject,
    Email,
    Badge,
    Work
} from '@mui/icons-material';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const teachSclass = currentUser.teachSclass
  const teachSubject = currentUser.teachSubject
  const teachSchool = currentUser.school

  return (
    <StyledContainer>
        <ContentWrapper>
            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                    Teacher Profile
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    View your professional information and teaching details
                </Typography>
            </HeaderSection>

            <ProfileGrid>
                {/* Main Profile Card */}
                <ProfileCard elevation={4}>
                    <CardHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <StyledAvatar alt="Teacher Avatar">
                                {String(currentUser.name).charAt(0)}
                            </StyledAvatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                                    {currentUser.name}
                                </Typography>
                                <Chip 
                                    label="Active Teacher" 
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
                                    <Email sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Email Address</InfoLabel>
                                    <InfoValue>{currentUser.email}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <Class sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Assigned Class</InfoLabel>
                                    <InfoValue>{teachSclass.sclassName}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <Subject sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Teaching Subject</InfoLabel>
                                    <InfoValue>{teachSubject.subName}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <School sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>School</InfoLabel>
                                    <InfoValue>{teachSchool.schoolName}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <Badge sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Teacher ID</InfoLabel>
                                    <InfoValue>{currentUser._id.toUpperCase()}</InfoValue>
                                </InfoContent>
                            </InfoItem>

                            <InfoItem>
                                <InfoIconContainer>
                                    <Work sx={{ color: '#1976d2' }} />
                                </InfoIconContainer>
                                <InfoContent>
                                    <InfoLabel>Role</InfoLabel>
                                    <InfoValue>Class Teacher</InfoValue>
                                </InfoContent>
                            </InfoItem>
                        </InfoGrid>
                    </CardContent>
                </ProfileCard>

                {/* Teaching Details Card */}
                <DetailsCard elevation={4}>
                    <CardHeader>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            Teaching Details
                        </Typography>
                    </CardHeader>
                    
                    <CardContent>
                        <TeachingStats>
                            <StatItem>
                                <StatIconContainer className="class">
                                    <Class sx={{ color: 'white' }} />
                                </StatIconContainer>
                                <StatContent>
                                    <StatLabel>Assigned Class</StatLabel>
                                    <StatValue>{teachSclass.sclassName}</StatValue>
                                </StatContent>
                            </StatItem>

                            <StatItem>
                                <StatIconContainer className="subject">
                                    <Subject sx={{ color: 'white' }} />
                                </StatIconContainer>
                                <StatContent>
                                    <StatLabel>Teaching Subject</StatLabel>
                                    <StatValue>{teachSubject.subName}</StatValue>
                                </StatContent>
                            </StatItem>
                        </TeachingStats>

                        
                    </CardContent>
                </DetailsCard>
            </ProfileGrid>
        </ContentWrapper>
    </StyledContainer>
  )
}

export default TeacherProfile

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

const ContentWrapper = styled(Box)`
  width: 100%;
  max-width: 1000px;
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
  overflow: hidden;
`;

const DetailsCard = styled(Card)`
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

const CardContent1 = styled(Box)`
  padding: 32px;
`;

// Avatar
const StyledAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
  font-size: 40px;
  font-weight: 700;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.3);
`;

// Info Grid
const InfoGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
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

// Teaching Stats
const TeachingStats = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
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
  
  &.class {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  }
  
  &.subject {
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
  font-size: 20px;
  color: #333;
  font-weight: 700;
`;

// Quick Info
const QuickInfo = styled(Box)`
  margin-top: 16px;
`;

const InfoList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuickInfoItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fbff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;