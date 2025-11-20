import { Container, Grid, Paper, Box, Typography } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Welcome Header */}
                <WelcomeBox>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                        Welcome to Admin Dashboard
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                        Here's an overview of your institution
                    </Typography>
                </WelcomeBox>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledPaper elevation={4}>
                            <IconWrapper>
                                <img src={Students} alt="Students" />
                            </IconWrapper>
                            <ContentBox>
                                <Title>
                                    Total Students
                                </Title>
                                <Data start={0} end={numberOfStudents} duration={2.5} />
                            </ContentBox>
                            <BottomAccent />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledPaper elevation={4}>
                            <IconWrapper>
                                <img src={Classes} alt="Classes" />
                            </IconWrapper>
                            <ContentBox>
                                <Title>
                                    Total Classes
                                </Title>
                                <Data start={0} end={numberOfClasses} duration={2.5} />
                            </ContentBox>
                            <BottomAccent />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledPaper elevation={4}>
                            <IconWrapper>
                                <img src={Teachers} alt="Teachers" />
                            </IconWrapper>
                            <ContentBox>
                                <Title>
                                    Total Teachers
                                </Title>
                                <Data start={0} end={numberOfTeachers} duration={2.5} />
                            </ContentBox>
                            <BottomAccent />
                        </StyledPaper>
                    </Grid>
                    
                    {/* Notice Section */}
                    <Grid item xs={12} md={12} lg={12}>
                        <NoticePaper elevation={4}>
                            <SeeNotice />
                        </NoticePaper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

// Styled Components
const WelcomeBox = styled(Box)`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
`;

const StyledPaper = styled(Paper)`
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  height: 220px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  background: white;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(25, 118, 210, 0.15);
    border-color: #1976d2;
  }
`;

const NoticePaper = styled(Paper)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 50%;
  padding: 12px;
  
  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-grow: 1;
  justify-content: center;
`;

const Title = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
  margin: 0;
`;

const Data = styled(CountUp)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
  line-height: 1;
`;

const BottomAccent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
  border-radius: 0 0 16px 16px;
`;

export default AdminHomePage;