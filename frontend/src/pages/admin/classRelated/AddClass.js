import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography, Card, Container } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import styled from "styled-components";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, tempDetails } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        sclassName,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id)
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch, tempDetails]);
    
    return (
        <>
            <StyledContainer>
                <ContentWrapper>
                    <HeaderSection>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                            Create New Class
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                            Add a new class to your Educational Institution Management system
                        </Typography>
                    </HeaderSection>

                    <GridContainer>
                        <ImageSection>
                            <ClassroomImage 
                                src={Classroom} 
                                alt="classroom" 
                            />
                        </ImageSection>

                        <FormSection>
                            <FormCard elevation={4}>
                                <CardContent>
                                    <form onSubmit={submitHandler}>
                                        <Stack spacing={3}>
                                            <TextField
                                                label="Class Name"
                                                variant="outlined"
                                                value={sclassName}
                                                onChange={(event) => {
                                                    setSclassName(event.target.value);
                                                }}
                                                required
                                                sx={textFieldStyles}
                                                placeholder="Enter class name (e.g., Grade 10-A)"
                                            />
                                            <ButtonStack spacing={2}>
                                                <BlueButton
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    type="submit"
                                                    disabled={loader}
                                                >
                                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Create Class"}
                                                </BlueButton>
                                                <BackButton 
                                                    variant="outlined" 
                                                    fullWidth
                                                    onClick={() => navigate(-1)}
                                                >
                                                    Go Back
                                                </BackButton>
                                            </ButtonStack>
                                        </Stack>
                                    </form>
                                </CardContent>
                            </FormCard>
                        </FormSection>
                    </GridContainer>
                </ContentWrapper>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddClass

const StyledContainer = styled(Container)`
  padding: 40px 24px;
  background: #f8fbff;
  min-height: 100vh;
  display: flex;
  align-items: center;
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

const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ImageSection = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClassroomImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(25, 118, 210, 0.15);
`;

const FormSection = styled(Box)`
  display: flex;
  justify-content: center;
`;

const FormCard = styled(Card)`
  border-radius: 20px;
  padding: 40px 32px;
  background: white;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 450px;
`;

const CardContent = styled(Box)`
  padding: 0;
`;

const ButtonStack = styled(Stack)`
  margin-top: 24px;
`;

const BackButton = styled(Button)`
  border: 2px solid #e0e0e0;
  color: #666;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 12px 24px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #1976d2;
    color: #1976d2;
    background: rgba(25, 118, 210, 0.04);
    transform: translateY(-2px);
  }
`;

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1976d2',
  },
};