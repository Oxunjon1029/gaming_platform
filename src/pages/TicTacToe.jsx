import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsPlayerTurn,
  selectSymbol,
  setPlayerTurn,
  selectIsGameStarted,
  selectUser,
  selectGameId,
  selectGameSessions,
  setIsGameStarted,
  setExitMessage,
  setGameWinMsg,
  selectGameWinMsg,
  selectExitMsg,
} from '../features/game/gameSlice';
import { checkGameState } from '../utils/game';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
const TicTacToe = ({ socket }) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const isPlayerTurn = useSelector(selectIsPlayerTurn);
  const symbol = useSelector(selectSymbol);
  const isGameStarted = useSelector(selectIsGameStarted);
  const userName = useSelector(selectUser);
  const gameSessions = useSelector(selectGameSessions);
  const gameId = useSelector(selectGameId);
  const exitMessage = useSelector(selectExitMsg);
  const gameWinMsg = useSelector(selectGameWinMsg);
  const gameMatrix = gameSessions.find((game) => game._id === gameId)?.board;
  let defaultMatrix = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  const [matrix, setMatrix] = useState(JSON.parse(JSON.stringify(gameMatrix)));

  const updateMatrix = async (row, column, symbol) => {
    const newMatrix = [...matrix];
    if (
      newMatrix[row][column] === null ||
      newMatrix[row][column] === 'null' ||
      newMatrix[row][column] === ''
    ) {
      newMatrix[row][column] = symbol;
    }
    if (socket) {
      socket.emit('update_game', {
        matrix: newMatrix,
        id: gameId,
        currentPlayer: isPlayerTurn,
        symbol: symbol,
      });

      const [currentPlayerWon, otherPlayerWon] = checkGameState(
        newMatrix,
        symbol
      );
      if (currentPlayerWon && otherPlayerWon) {
        socket.emit('game_win', {
          message: 'The Game is a TIE! Please exit the game  and rejoin!',
          id: gameId,
          matrix: defaultMatrix,
        });
        toast.success('The Game is a TIE! Please exit the game  and rejoin!');
      } else if (currentPlayerWon && !otherPlayerWon) {
        socket.emit('game_win', {
          message: 'You Lost! Please exit the game  and rejoin!',
          id: gameId,
          matrix: defaultMatrix,
        });
        toast.success('You Won! Please exit the game  and rejoin!');
      }

      dispatch(setPlayerTurn(false));
    }
  };

  const exitGame = async () => {
    await socket.emit('exit_game', { gameId: gameId });
    if (gameWinMsg) {
      dispatch(setGameWinMsg(''));
    }
    navigator('/create');
  };

  const onGameUpdate = useCallback(() => {
    if (socket) {
      socket.on('on_game_update', (data) => {
        if (data) {
          setMatrix(data?.board);
          dispatch(setPlayerTurn(true));
        }
      });
    }
  }, [socket, dispatch]);

  const onGameWin = useCallback(() => {
    if (socket) {
      socket.on('on_game_win', (data) => {
        if (data) {
          setMatrix(data?.board);
          dispatch(setPlayerTurn(false));
          dispatch(setGameWinMsg(data?.message));
        }
      });
    }
  }, [socket, dispatch]);

  const onPlayerExiTheGame = useCallback(() => {
    socket.on('player_exit_the_game', (data) => {
      if (data?.board) {
        setMatrix(data?.board);
      }
      dispatch(setIsGameStarted(false));
      dispatch(
        setExitMessage(
          'Your oppenent left the game game, please exit the game and join in the other one to play'
        )
      );
    });
  }, [socket, dispatch]);

  useEffect(() => {
    onGameUpdate();
    onGameWin();
    onPlayerExiTheGame();
  }, [onGameUpdate, onGameWin, onPlayerExiTheGame]);

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
      <Typography variant='h3'>Welcome {userName} to TicTacToe</Typography>
      <Typography variant='h4' color='orange'>
        {exitMessage
          ? `${exitMessage}`
          : gameWinMsg
          ? `${gameWinMsg}`
          : !isGameStarted
          ? 'Waiting for other player to start the game'
          : ''}
      </Typography>

      {
        <Grid container spacing={2}>
          {matrix?.map((row, rowIdx) => (
            <Grid container key={rowIdx + 'row'}>
              {row.map((column, columnIdx) => (
                <Grid
                  item
                  xs={4}
                  key={columnIdx + 'column'}
                  className='tictactoegrid'>
                  <Button
                    disabled={
                      !isGameStarted ||
                      !isPlayerTurn ||
                      column === 'o' ||
                      column === 'x'
                    }
                    onClick={() => updateMatrix(rowIdx, columnIdx, symbol)}
                    sx={{
                      borderRadius: '10px',
                      border: '1px solid whitesmoke',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      height: '100px',
                      boxShadow: '10px 10px 10px rgba(0,0,0,0.21)',
                      width: '100%',
                    }}>
                    <Typography variant='h3' color='#FF78AD'>
                      {column && column !== 'null'
                        ? column === 'x'
                          ? 'x'
                          : 'o'
                        : ''}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          ))}

          {isPlayerTurn && (
            <Typography
              variant='h6'
              sx={{
                textAlign: 'center',
                width: '100%',
              }}>{`${userName}, It's your turn `}</Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              width: '100%',
              marginTop: '20px',
            }}>
            <Button variant='contained' color='success' onClick={exitGame}>
              Exit game
            </Button>
          </Box>
        </Grid>
      }
    </Box>
  );
};

export default TicTacToe;
