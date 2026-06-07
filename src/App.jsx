import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './components/Splash';
import Login from './components/Login';
import Signup from './components/Signup';
import Landing from './components/Landing';
import ForgotPassword from './components/ForgotPassword';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
import Home from './components/Home';
import Focus from './components/Focus';
import Plan from './components/Plan';
import Saathi from './components/Saathi';
import Profile from './components/Profile';
import Rooms from './components/Rooms';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* App Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/saathi" element={<Saathi />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rooms" element={<Rooms />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
