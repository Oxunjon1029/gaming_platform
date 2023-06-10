import React, { useEffect, useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectGameSessions,
  selectUser,
  setGameSessions,
  setGameId,
  setIsGameStarted,
  setSymbol,
  setPlayerTurn,
  setGameWinMsg,
  setExitMessage,
  selectExitMsg,
  selectGameWinMsg,
} from '../features/game/gameSlice';
import { toast } from 'react-toastify';

const GameSessionCreateAndLists = ({ socket }) => {
  const [selectValue, setSelectValue] = useState('');
  const [roomRange, setRoomRange] = useState(0);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector(selectUser);
  const gameSessions = useSelector(selectGameSessions);
  const gameWinMsg = useSelector(selectGameWinMsg);
  const exitMessage = useSelector(selectExitMsg);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCreateGameSession = (gameType) => {
    setRoomRange((prev) => prev + 1);
    socket.emit('create_game_session', {
      name: userName,
      gameType,
      roomId:
        gameType === 'TicTacToe'
          ? roomRange > 0
            ? 'tictactoeRoom' + roomRange - 1
            : 'tictactoeRoom' + roomRange
          : roomRange > 0
          ? 'reversiRoom' + roomRange - 1
          : 'reversiRoom' + roomRange,
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
    });
  };
  const handleChange = (value) => {
    setSelectValue(value);
  };
  const handleJoinGame = (id, gameType) => {
    dispatch(setGameId(id));
    if (gameType === 'TicTacToe') {
      if (gameWinMsg) {
        dispatch(setGameWinMsg(''));
      }
      if (exitMessage) {
        dispatch(setExitMessage(''));
      }
      const joined = new Promise((rs, rj) => {
        socket.emit('join_room', { roomId: 'tictactoeRoom' + roomRange });
        socket.on('room_joined', () => rs(true));
        socket.on('room_join_error', ({ error }) => {
          rj(error);
        });
      });

      joined
        .then(() => {
          if (socket) {
            socket.on('start_game', (data) => {
              if (data) {
                dispatch(setIsGameStarted(true));
                dispatch(setSymbol(data?.symbol));
                if (data?.start) dispatch(setPlayerTurn(true));
                else dispatch(setPlayerTurn(false));
              }
            });
          }
          navigator(`/tic-tac-toe/${id}`);
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      const joined = new Promise((rs, rj) => {
        socket.emit('join_room', { roomId: 'reversiRoom' + roomRange });
        socket.on('room_joined', () => rs(true));
        socket.on('room_join_error', ({ error }) => rj(error));
      });
      if (joined) {
        navigator(`/reversi/${id}`);
      } else {
        joined.catch((error) => {
          toast.error(error);
        });
      }
    }
  };

  useEffect(() => {
    socket.on('game_created', (data) => {
      if (data) {
        dispatch(setGameSessions(data));
      }
    });
  }, [socket, dispatch]);

  const filteredGameSessions = [...new Set(gameSessions)];
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        flexDirection: 'column',
        width: '50%',
        gap: '20px',
      }}>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '400px',
        }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Games</InputLabel>
          <Select
            value={selectValue}
            sx={{ border: '1px solid white', backgroundColor: 'white' }}
            label='Games'
            onChange={(e) => handleChange(e.target.value)}>
            {['TicTacToe'].map((game, index) => (
              <MenuItem value={game} key={index}>
                {game}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          fullWidth
          variant='contained'
          onClick={() => handleCreateGameSession(selectValue)}
          disabled={selectValue === ''}
          color='secondary'>
          Create a game session
        </Button>
      </Box>
      {gameSessions && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Game Name</TableCell>
                <TableCell align='center'>Game Room</TableCell>
                <TableCell align='center'>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredGameSessions.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredGameSessions
              ).map((game) => (
                <TableRow key={game._id}>
                  <TableCell align='left'>{game.gameType}</TableCell>
                  <TableCell align='center'>{game.roomId}</TableCell>
                  <TableCell align='right'>
                    <Button
                      variant='contained'
                      onClick={() => handleJoinGame(game._id, game.gameType)}>
                      Join a game
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={filteredGameSessions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default GameSessionCreateAndLists;
