import React from 'react';
import StartGameSessionForm from './pages/StartGameSessionForm';
import Back from './images/form_back.webp';
import { Routes, Route } from 'react-router-dom';
import GameSessionCreateAndLists from './pages/GameSessionCreateAndLists';
import TicTacToe from './pages/TicTacToe';
import Reverse from './pages/Reverse';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const socket = io(
  'https://railway.app/project/4c13d7e7-4749-44be-bb15-3842359f08c8/service/041af19c-8248-4eeb-ab8a-5f022de4ac3b?id=76cfbe00-dfdc-4f90-93ac-cc4cec00a51b&',
  {
    extraHeaders: {
      'Access-Control-Allow-Origin':
        'https://railway.app/project/4c13d7e7-4749-44be-bb15-3842359f08c8/service/041af19c-8248-4eeb-ab8a-5f022de4ac3b?id=76cfbe00-dfdc-4f90-93ac-cc4cec00a51b&',
    },
  }
);
function App() {
  return (
    <div
      className='App'
      style={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${Back})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <ToastContainer />
      <Routes>
        <Route
          path='/'
          index
          element={<StartGameSessionForm socket={socket} />}
        />
        <Route
          path='/create'
          element={<GameSessionCreateAndLists socket={socket} />}
        />
        <Route
          path='/tic-tac-toe/:id'
          element={<TicTacToe socket={socket} />}
        />
        <Route path='/reversi/:id' element={<Reverse socket={socket} />} />
      </Routes>
    </div>
  );
}

export default App;
