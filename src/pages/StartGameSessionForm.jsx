import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {  setGameSessions, setUserName } from '../features/game/gameSlice';
import { useNavigate } from 'react-router';
import TextFormField from '../components/TextFormField';

const StartGameSessionForm = ({ socket }) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const validationSchema = Yup.object({
    name: Yup.string().required(),
  });
  const handleSubmit = (values) => {
    if (values) {
      dispatch(setUserName(values.name));
      socket.emit('user_connected', values);
      navigator('/create');
    }
  };
  useEffect(() => {
    socket.on('get_all_sessions', (data) => {
      if (data) {
        dispatch(setGameSessions(data));
      }
    });
  }, [dispatch,socket]);
  return (
    <Box
      sx={{
        boxShadow: '10px 10px 10px 10px rgba(0,0,0,0.3)',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
      }}>
      <Typography variant='h4' color='#FF78AD'>
        Welcome to a gaming platform
      </Typography>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {() => (
          <Form>
            <Field
              fullWidth
              label='Full name'
              name='name'
              placeholder='Enter your name..'
              component={TextFormField}
            />
            <Button
              type='submit'
              fullWidth
              sx={{ marginTop: '10px' }}
              variant='contained'>
              Join to create your game session
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default StartGameSessionForm;
