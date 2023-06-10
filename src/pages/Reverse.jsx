import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
const Reverse = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '30px',
      }}>
      <Typography variant='h3'>Welcome to Reversi</Typography>
      <Grid container spacing={2}>
        {[
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ].map((item, index) => (
          <Grid xs={3} key={index + 211} className='tictactoegrid'>
            <Card
              sx={{
                borderRadius: '10px',
                border: '1px solid whitesmoke',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'indigo',
                cursor: 'pointer',
                height: '100px',
                boxShadow: '10px 10px 10px rgba(0,0,0,0.21)',
              }}>
              <CardContent>
                <Typography variant='h4'>{item}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width:"100%",
            marginTop:'20px'
          }}>
          <Button variant='contained' color='success'>
            Exit game
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default Reverse;
