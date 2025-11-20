import React, { useState } from 'react';
import { Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip } from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const { currentRole, currentUser } = useSelector(state => state.user);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (event) => {
        // Prevent the menu from closing immediately
        event.stopPropagation();
    };

    const handleLogoutClick = (event) => {
        handleClose();
        // The Link component will handle navigation
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ 
                            ml: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            }
                        }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <StyledAvatar sx={{ width: 36, height: 36 }}>
                            {currentUser?.name ? String(currentUser.name).charAt(0).toUpperCase() : 'U'}
                        </StyledAvatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <StyledMenu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 4,
                    sx: styles.styledPaper,
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                disableAutoFocusItem
            >
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                        {currentUser?.name ? String(currentUser.name).charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <StyledLink to={`/${currentRole}/profile`} onClick={handleClose}>
                        <MenuText>
                            <div>Profile</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                {currentUser?.name || 'User'}
                            </div>
                        </MenuText>
                    </StyledLink>
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem onClick={handleClose}>
                    <ListItemIcon sx={{ color: '#1976d2' }}>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    <MenuText>Settings</MenuText>
                </MenuItem>
                
                <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon sx={{ color: '#1976d2' }}>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <StyledLink to="/logout" onClick={handleLogoutClick}>
                        <MenuText>Logout</MenuText>
                    </StyledLink>
                </MenuItem>
            </StyledMenu>
        </>
    );
}

export default AccountMenu;

// Styled Components
const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 12px;
    margin-top: 8px;
  }
`;

const StyledAvatar = styled(Avatar)`
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
  
  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

const MenuText = styled.div`
  color: #333;
  font-weight: 500;
  margin-left: 8px;
`;

const styles = {
    styledPaper: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 4px 20px rgba(25, 118, 210, 0.15))',
        mt: 1.5,
        minWidth: 200,
        '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            fontSize: '0.9rem',
            fontWeight: '600',
        },
        '& .MuiMenuItem-root': {
            padding: '8px 16px',
            '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
        },
        '& .MuiListItemIcon-root': {
            minWidth: 36,
        },
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            backgroundColor: 'white',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            boxShadow: '-2px -2px 2px rgba(0,0,0,0.05)',
        },
    }
}