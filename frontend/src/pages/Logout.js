import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled, { keyframes } from 'styled-components';

const Logout = () => {
  const currentUser = useSelector((state) => state.user.currentUser) || { name: 'User' };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      // simulate async action if your logout is async
      await dispatch(authLogout());
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  const initials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <Overlay onClick={handleCancel}>
      <Card 
        role="dialog" 
        aria-labelledby="logout-title" 
        aria-describedby="logout-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <Avatar>{initials(currentUser.name)}</Avatar>
          <UserInfo>
            <UserName id="logout-title">{currentUser.name}</UserName>
            <UserRole>{currentUser.role || 'User'}</UserRole>
          </UserInfo>
        </Header>

        <Message id="logout-desc">Are you sure you want to log out of your account?</Message>

        <ButtonRow>
          <SecondaryButton onClick={handleCancel} disabled={loading} aria-disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Cancel</span>
          </SecondaryButton>

          <PrimaryButton onClick={handleLogout} disabled={loading} aria-disabled={loading}>
            {loading ? <Loader aria-hidden /> : <LogoutIcon />}
            <span>{loading ? 'Logging out...' : 'Log Out'}</span>
          </PrimaryButton>
        </ButtonRow>

        <SubtleText>You'll be redirected to the homepage after logging out.</SubtleText>
      </Card>
    </Overlay>
  );
};

export default Logout;

/* ---------------- Styled Components ---------------- */

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1; 
    backdrop-filter: blur(4px);
  }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(25, 118, 210, 0.4);
  backdrop-filter: blur(4px);
  padding: 24px;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Card = styled.div`
  width: min(440px, 96%);
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(25, 118, 210, 0.2);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${slideUp} 0.3s ease-out;
  border: 1px solid rgba(25, 118, 210, 0.1);
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Avatar = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: #fff;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.3);
`;

const UserName = styled.h2`
  font-size: 20px;
  margin: 0;
  color: #1976d2;
  font-weight: 700;
`;

const UserRole = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  text-transform: capitalize;
`;

const Message = styled.p`
  margin: 20px 0 24px;
  text-align: center;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
  max-width: 360px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
  justify-content: center;
`;

const baseBtn = `
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  ${baseBtn}
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
    background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  ${baseBtn}
  background: transparent;
  color: #666;
  border: 2px solid #e0e0e0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: #1976d2;
    color: #1976d2;
    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SubtleText = styled.small`
  margin-top: 20px;
  color: #999;
  font-size: 12px;
  text-align: center;
`;

const Loader = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: rgba(255,255,255,0.95);
  animation: ${spin} 0.9s linear infinite;
`;

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);