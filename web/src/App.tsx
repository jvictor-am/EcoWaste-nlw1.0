import React from 'react';
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Home from './pages/Home';

import Routes from './routes';

function App() {
  return (
    <>
      <Routes />
      <ToastContainer autoClose={5000} />
    </>
  );
}

export default App;
