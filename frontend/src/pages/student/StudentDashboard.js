import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    AppBar as MuiAppBar,
    Drawer as MuiDrawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout'
import AccountMenu from '../../components/AccountMenu';
import { styled } from '@mui/material/styles';
import { School } from '@mui/icons-material';

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#ffffff',
    color: '#1976d2',
    boxShadow: '0 2px 20px rgba(25, 118, 210, 0.1)',
    borderBottom: '1px solid #e0e0e0',
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
        borderRight: '1px solid #e0e0e0',
        boxShadow: '4px 0 20px rgba(25, 118, 210, 0.08)',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box sx={{ display: 'flex', background: '#f8fbff', minHeight: '100vh' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute'>
                    <Toolbar sx={{ 
                        pr: '24px',
                        minHeight: '80px !important',
                    }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                borderRadius: '12px',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <School sx={{ 
                                fontSize: 32, 
                                color: '#1976d2', 
                                mr: 2,
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                padding: '8px',
                                borderRadius: '12px'
                            }} />
                            <Typography
                                component="h1"
                                variant="h5"
                                color="inherit"
                                noWrap
                                sx={{ 
                                    flexGrow: 1,
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Student Portal
                            </Typography>
                        </Box>
                        <AccountMenu />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            width: '100%',
                            px: 2,
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#1976d2',
                                    fontWeight: 700,
                                    fontSize: '18px'
                                }}
                            >
                                Main Menu
                            </Typography>
                            <IconButton 
                                onClick={toggleDrawer}
                                sx={{
                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                    }
                                }}
                            >
                                <ChevronLeftIcon sx={{ color: '#1976d2' }} />
                            </IconButton>
                        </Box>
                    </Toolbar>
                    <Divider sx={{ 
                        background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)',
                        height: '1px',
                        mx: 2
                    }} />
                    <List component="nav" sx={{ px: 2, py: 1 }}>
                        <StudentSideBar />
                    </List>
                </Drawer>
                <Box 
                    component="main" 
                    sx={{
                        ...styles.boxStyled,
                        borderTopLeftRadius: open ? '20px' : '0px',
                        borderBottomLeftRadius: open ? '20px' : '0px',
                        marginLeft: open ? '16px' : '0px',
                        marginTop: '16px',
                        marginBottom: '16px',
                        marginRight: '16px',
                        flexGrow: 1,
                        height: `calc(100vh - 32px)`,
                        overflow: 'auto',
                    }}
                >
                    <Toolbar sx={{ minHeight: '80px !important' }} />
                    <Routes>
                        <Route path="/" element={<StudentHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Student/dashboard" element={<StudentHomePage />} />
                        <Route path="/Student/profile" element={<StudentProfile />} />
                        <Route path="/Student/subjects" element={<StudentSubjects />} />
                        <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                        <Route path="/Student/complain" element={<StudentComplain />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

export default StudentDashboard;

const styles = {
    boxStyled: {
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.1)',
        border: '1px solid #e0e0e0',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
        minHeight: '80px !important',
    },
    drawerStyled: {
        display: "flex",
        '& .MuiDrawer-paper': {
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
        }
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
        '& .MuiDrawer-paper': {
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
        }
    },
}