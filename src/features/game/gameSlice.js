import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  userName: '',
  gameSessions: [],
  exitMessage: '',
  gameWinMsg: '',
  isPlayerTurn: false,
  symbol: '',
  isGameStarted: false,
  gameId: '',
};


export const counterSlice = createSlice({
  name: 'game',
  initialState,

  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload
    },
    setGameSessions: (state, action) => {
      if (action.payload?.length === 1) {
        state.gameSessions = [...state.gameSessions, ...action.payload]
      } else {
        state.gameSessions = action.payload
      }
    },

    setPlayerTurn: (state, action) => {
      state.isPlayerTurn = action.payload
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload
    },
    setIsGameStarted: (state, action) => {
      state.isGameStarted = action.payload
    },
    setGameId: (state, action) => {
      state.gameId = action.payload
    },
    setExitMessage: (state, action) => {
      state.exitMessage = action.payload
    },
    setGameWinMsg: (state, action) => {
      state.gameWinMsg = action.payload
    }
  },


});

export const { setUserName, setGameSessions, setPlayerTurn, setSymbol, setIsGameStarted, setGameId, setExitMessage, setGameWinMsg } = counterSlice.actions;


export const selectUser = (state) => state.game.userName;
export const selectGameSessions = (state) => state.game.gameSessions
export const selectIsJoining = state => state.game.isJoining
export const selectIsPlayerTurn = state => state.game.isPlayerTurn
export const selectSymbol = state => state.game.symbol
export const selectIsGameStarted = state => state.game.isGameStarted
export const selectGameId = state => state.game.gameId
export const selectIsRoomFull = state => state.game.isRoomFull
export const selectExitMsg = state => state.game.exitMessage;
export const selectGameWinMsg = state => state.game.gameWinMsg
export default counterSlice.reducer;
