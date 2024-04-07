import { AddRounded, CloseRounded } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { createContext, useContext, useEffect, useState } from 'react';
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import InputSection from './inputSection';
import {
    UpdateLogOutTime,
    calculateSessionStatus,
    getStudentDetails,
} from './supabaseClient';
import { useMediaQuery } from 'react-responsive';
import { enqueueSnackbar } from 'notistack';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export default function NewInputPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [studentDetailsList, setStudentDetailsList] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 600px) ' });
    const isMobile500 = useMediaQuery({ query: '(max-width: 500px) ' });

    useEffect(() => {
        if (studentDetailsList == '') {
            fetchStudents();
        }
        if (buttonClicked) {
            fetchStudents();
            setButtonClicked(false);
        }
    }, [buttonClicked]);

    function fetchStudents() {
        getStudentDetails().then((r) => setStudentDetailsList(r));
    }

    async function handleXClick(e) {
        if (e) {
            await UpdateLogOutTime(e);
        }
        setButtonClicked(true);
    }

    return (
        <>
            <GlobalContext.Provider value={setButtonClicked}>
                <AddStudentDrawer
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                />
            </GlobalContext.Provider>
            <Box
                sx={{
                    mt: isMobile ? 7 : 5,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '100vw',
                    height: '80dvh',
                    gap: '25px',
                }}
            >
                <Box
                    sx={{
                        width: '90vw',
                        maxWidth: '700px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 3,
                        ml: 2,
                        margin: '0 auto',
                    }}
                >
                    <Typography
                        sx={{ fontFamily: 'Nunito', fontSize: '1.5rem' }}
                    >
                        Pupils ({studentDetailsList.length})
                    </Typography>
                    {studentDetailsList != null &&
                        studentDetailsList.length < 8 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '0px 10px',
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 0.95 }}
                                    whileTap={{ scale: 0.8 }}
                                >
                                    <Button
                                        variant='outlined'
                                        sx={{
                                            borderRadius: '10px',
                                            borderColor: 'primary.main',
                                            borderWidth: '1.5px',
                                            padding: '8px 20px',
                                            paddingLeft: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0px 5px',

                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                borderWidth: '1.5px',
                                            },
                                        }}
                                        onClick={() => {
                                            setButtonClicked(true);
                                        }}
                                    >
                                        <CachedTwoToneIcon
                                            fontSize='small'
                                            sx={{ color: 'primary.main' }}
                                        />{' '}
                                        <Typography
                                            sx={{
                                                color: 'primary.main',
                                                mt: 0.17,
                                                textTransform: 'none',
                                                fontSize: '0.9rem',

                                                fontFamily: 'Nunito',
                                                fontWeight: '700',
                                            }}
                                        >
                                            Refresh
                                        </Typography>
                                    </Button>
                                </motion.div>{' '}
                                <motion.div
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 0.95 }}
                                    whileTap={{ scale: 0.8 }}
                                >
                                    <Button
                                        variant='outlined'
                                        sx={{
                                            borderRadius: '10px',
                                            padding: '8px 20px',
                                            paddingLeft: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0px 5px',

                                            backgroundColor: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                            },
                                        }}
                                        onClick={() => {
                                            setDrawerOpen(true);
                                        }}
                                    >
                                        <AddRounded
                                            fontSize='small'
                                            sx={{ color: 'secondary.main' }}
                                        />{' '}
                                        <Typography
                                            sx={{
                                                color: 'secondary.main',
                                                mt: 0.17,
                                                textTransform: 'none',
                                                fontSize: '0.9rem',

                                                fontFamily: 'Nunito',
                                                fontWeight: '700',
                                            }}
                                        >
                                            Add Pupil
                                        </Typography>
                                    </Button>
                                </motion.div>
                            </Box>
                        )}
                </Box>
                <Box
                    sx={{
                        width: '95vw',
                        maxWidth: '700px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px 0px',
                    }}
                >
                    {studentDetailsList.length >= 1 ? (
                        studentDetailsList.map((e, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    maxWidth: '700px',
                                }}
                            >
                                <Card
                                    variant='outlined'
                                    sx={{
                                        padding: '13px 30px',
                                        color: 'primary.main',

                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: '0px 15px',
                                        borderRadius: '15px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: '13px',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'primary.main',
                                                fontFamily: 'Nunito',
                                                fontWeight: '700',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            {e.student_name}
                                        </Typography>

                                        <Box
                                            sx={{
                                                backgroundColor:
                                                    'secondary.main',
                                                color: 'primary.main',
                                                fontFamily: 'Nunito',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                padding: '5px 13px',
                                                borderRadius: '30px',
                                            }}
                                        >
                                            {e.student_class}
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: '0px 20px',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'primary.main',
                                                opacity: 0.5,
                                                fontFamily: 'Nunito',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {calculateSessionStatus(
                                                e.sign_in_time
                                            )}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                color: '#d32f2f',
                                            }}
                                        >
                                            <Button
                                                variant='outlined'
                                                sx={{
                                                    borderRadius: '10px',
                                                    borderColor: '#d32f2f',
                                                    backgroundColor:
                                                        '#d32f2f40',
                                                }}
                                                onClick={() =>
                                                    handleXClick(
                                                        e.id
                                                            ? e.id
                                                            : enqueueSnackbar(
                                                                  'No row ID. Please contact your organization.',
                                                                  {
                                                                      variant:
                                                                          'error',
                                                                  }
                                                              )
                                                    )
                                                }
                                            >
                                                <Typography
                                                    sx={{
                                                        color: '#d32f2f',
                                                        textTransform: 'none',
                                                    }}
                                                >
                                                    End Session
                                                </Typography>
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 10,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: 'primary.main',
                                    fontFamily: 'Nunito',
                                    fontWeight: '500',
                                    fontSize: '1.2rem',
                                    opacity: 0.5,
                                }}
                            >
                                No active sessions
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
}

function AddStudentDrawer({ drawerOpen, setDrawerOpen }) {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    return (
        <>
            <Drawer
                anchor='right'
                sx={{
                    padding: '0px 30px',
                }}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{
                        mt: 5,
                        padding: isMobile ? '30px 0px' : '80px 50px',
                        width: '100vw',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            left: isMobile ? '0px' : '105px',
                            padding: isMobile ? '10px' : '20px',
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                setDrawerOpen(false);
                            }}
                        >
                            <CloseRounded
                                fontSize='large'
                                sx={{ color: 'primary.main' }}
                            />
                        </IconButton>
                        {/* <Button
                            onClick={() => {
                                setDrawerOpen(false);
                            }}
                            variant='outlined'
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                borderColor: 'primary.main',
                                borderWidth: '2px',
                            }}
                        >
                            <CloseRounded sx={{ color: 'primary.main' }} />
                            <Typography
                                sx={{
                                    textTransform: 'none',
                                    fontFamily: 'Nunito',
                                    fontWeight: '600',
                                    fontSize: '1.2rem',
                                }}
                            >
                                CLOSE
                            </Typography>
                        </Button> */}
                    </Box>
                    <Typography
                        align='center'
                        sx={{
                            fontFamily: 'Nunito',
                            fontWeight: '600',
                            fontSize: '1.5rem',
                            mb: 7,
                        }}
                    >
                        Add new student
                    </Typography>
                    <InputSection setDrawerOpen={setDrawerOpen} />
                </Box>
            </Drawer>
        </>
    );
}
