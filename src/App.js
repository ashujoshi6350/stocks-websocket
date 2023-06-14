import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Underlyings from './pages/UnderlyingsPage';
import Derivatives from './pages/DerivativesPage';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { openSocketConnection, closeSocketConnection } from './actions/action';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const socket = state.socket;

  useEffect(() => {
    return () => {
      dispatch(closeSocketConnection());
    }
  }, [])

  useEffect(() => {
    if (!socket) {
      dispatch(openSocketConnection({
        url: 'wss://prototype.sbulltech.com/api/ws'
      }))
    } else {
      socket.onopen = () => {
        console.log('WebSocket connection established');
        setIsLoading(false);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed. Retrying...');
        dispatch(openSocketConnection({
          url: 'wss://prototype.sbulltech.com/api/ws'
        }))
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }, [socket])

  return (
    <>
    {
      isLoading ? <div className='content__loader'>Loading...</div> : <Router>
        <Routes>
          <Route exact path="/" element={<Underlyings/>} />
          <Route path="/derivatives/:underlyingId" element={<Derivatives/>} />
        </Routes>
      </Router>
    }
    </>
  );
}

export default App;
