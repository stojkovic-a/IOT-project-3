import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import EventsDetectorPage from './pages/EventsDetectorPage';

function App() {
  return (
    <>
      <Routes>
        <Route>
          <Route index element={<Navigate to="/sensorDetector" replace />} />
          <Route path='/sensorDetector' element={<EventsDetectorPage />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
