// app.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SearchSample from './components/Search-sample';
import SearchApi from './components/Search-api';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchSample/>} />
        <Route path="/searchapi" element={<SearchApi/>} />
      </Routes>
    </Router>
  );
};

export default App;
