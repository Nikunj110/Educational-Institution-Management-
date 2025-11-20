import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Typography, Card, Container, CircularProgress, Button } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    // setShowPopup(true)
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
      })
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
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];
    return (
      <ButtonContainer>
        <ViewButton variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}>
          View Details
        </ViewButton>
        <ActionMenu actions={actions} />
        <Tooltip title="Delete Class">
          <DeleteBtn onClick={() => deleteHandler(row.id, "Sclass")}>
            <DeleteIcon />
          </DeleteBtn>
        </Tooltip>
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Subjects">
            <AddButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              Add Content
              <SpeedDialIcon />
            </AddButton>
          </Tooltip>
        </Box>
        <StyledMenu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 4,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action, index) => (
            <StyledMenuItem key={index} onClick={action.action}>
              <ListItemIcon sx={{ color: '#1976d2' }}>
                {action.icon}
              </ListItemIcon>
              {action.name}
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Classes',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <StyledContainer>
      <HeaderSection>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
          Class Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Manage all classes, students, and subjects in your institution
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
        <ContentSection>
          {getresponse ? (
            <EmptyStateCard elevation={4}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                No Classes Found
              </Typography>
              <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                Start by creating your first class to organize students and subjects.
              </Typography>
              <AddClassButton 
                variant="contained" 
                onClick={() => navigate("/Admin/addclass")}
                startIcon={<AddCardIcon />}
              >
                Create First Class
              </AddClassButton>
            </EmptyStateCard>
          ) : (
            <>
              {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                <TableCard elevation={4}>
                  <TableHeader>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      All Classes ({sclassesList.length})
                    </Typography>
                  </TableHeader>
                  <TableTemplate 
                    buttonHaver={SclassButtonHaver} 
                    columns={sclassColumns} 
                    rows={sclassRows} 
                  />
                </TableCard>
              )}
              <SpeedDialTemplate actions={actions} />
            </>
          )}
        </ContentSection>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ShowClasses;

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
  min-height: 300px;
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
  gap: 12px;
`;

const ViewButton = styled(Button)`
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

const AddButton = styled(Button)`
  border: 2px solid #1976d2;
  color: #1976d2;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 6px 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.1);
    border: 2px solid #1565c0;
    transform: translateY(-1px);
  }
`;

const DeleteBtn = styled(IconButton)`
  color: #d32f2f;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(211, 47, 47, 0.1);
    transform: scale(1.1);
  }
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 12px;
    margin-top: 8px;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 8px 16px;
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.08);
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