import React, { useState, useEffect } from 'react';
import './App.css';
import  Game from './Components/Game'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
const initialBoard = Array(9).fill(null);

const App = () => {
  

  return (
    <div className="app">
      <Navbar/>
      <Game/>
      <Footer/>
    </div>
  );
};

export default App;