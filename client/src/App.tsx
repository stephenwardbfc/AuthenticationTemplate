import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

import Layout from '../components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function App() {
  const { user, loading, getProfile } = useAuthStore();




  useEffect(() => {
    getProfile();
    // Only run on mount
  }, [getProfile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    
      <Router>
        <Routes>
          <Route path="/" element={user ? <Layout><HomePage /></Layout> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!user ? <Layout><LoginPage /></Layout> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <Layout><RegisterPage /></Layout> : <Navigate to="/" replace />} />
        </Routes>
      </Router>

  )
}

export default App
