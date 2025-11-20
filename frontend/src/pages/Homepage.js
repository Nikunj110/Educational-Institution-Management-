import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button, Typography } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
  return (
    <PageWrap>
      <ContainerStyled maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <HeroImageWrap>
              <img src={Students} alt="students" />
              <DecorativeBlob aria-hidden />
            </HeroImageWrap>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="fade-in">
              <HeaderRow>
                <Brand>
                  <Logo>EM</Logo>
                  <div>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      EduNexus
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Streamline your school's daily workflows
                    </Typography>
                  </div>
                </Brand>
              </HeaderRow>

              <Content>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1.5, color: '#1976d2' }}>
                  Welcome to
                  <br />
                  EduNexus
                  <br />
                  System
                </Typography>

                <Typography variant="body1" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                  Manage classes, students, teachers, attendance and assessments effortlessly.
                  Access records, analyze performance, and communicate with parents — all in one place.
                </Typography>

                <Actions>
                  <Link to="/choose" style={{ width: '100%', textDecoration: 'none' }}>
                    <BlueButton variant="contained" fullWidth size="large">
                      Get Started
                    </BlueButton>
                  </Link>

                  <SignupRow>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Don't have an account?
                    </Typography>
                    <Link to="/Adminregister" style={{ textDecoration: 'none' }}>
                      <SignUpLink>Sign up</SignUpLink>
                    </Link>
                  </SignupRow>
                </Actions>

                <MetaRow>
                  <Badge>Trusted by 200+ schools</Badge>
                  <SmallNote>Free trial • No credit card required</SmallNote>
                </MetaRow>
              </Content>
            </Card>
          </Grid>
        </Grid>
      </ContainerStyled>
    </PageWrap>
  );
};

export default Homepage;

/* ================= Styled Components ================= */

const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%);
  padding: 48px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
`;

const ContainerStyled = styled(Container)`
  position: relative;
  z-index: 1;
  .MuiGrid-root { 
    align-items: center; 
  }
`;

const HeroImageWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 100%;
    max-width: 520px;
    height: auto;
    display: block;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(25, 118, 210, 0.15);
    position: relative;
    z-index: 2;
  }
`;

const DecorativeBlob = styled.div`
  position: absolute;
  right: -40px;
  top: -30px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle at 30% 30%, rgba(25, 118, 210, 0.15), transparent 35%), 
              linear-gradient(180deg, rgba(66, 165, 245, 0.08), transparent);
  border-radius: 50%;
  filter: blur(18px);
  z-index: 1;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 12px 40px rgba(25, 118, 210, 0.08);
  border: 1px solid rgba(25, 118, 210, 0.1);
  height: auto;
  position: relative;
  z-index: 2;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Brand = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Logo = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.3);
  font-size: 1.2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
`;

const SignupRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const Badge = styled.div`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.12), rgba(66, 165, 245, 0.08));
  color: #1976d2;
  border: 1px solid rgba(25, 118, 210, 0.2);
`;

const SmallNote = styled.div`
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
`;

const BlueButton = styled(Button)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: none;
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.25);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
    box-shadow: 0 8px 25px rgba(25, 118, 210, 0.35);
    transform: translateY(-2px);
  }
`;

const SignUpLink = styled.span`
  color: #1976d2;
  font-weight: 700;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #1565c0;
    text-decoration: underline;
  }
`;