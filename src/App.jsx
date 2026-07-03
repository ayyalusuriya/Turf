import React, { useEffect, useState } from "react";
import WelcomeScreen from './components/WelcomeScreen';
import AuthContainer from './components/AuthContainer';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import ProfilePage from './components/ProfilePage';
import './components/Auth.css';

const facilities = [
  {
    id: 'madinat',
    title: 'Madinat Zayed Mall - Abu Dhabi',
    price: '60-80 AED/hr',
    image: '/alraed_court.jpg',
  },
  {
    id: 'wtc',
    title: 'World Trade Centre - Abu Dhabi',
    price: '100-120 AED/hr',
    image: '/wtc_img.jpg',
  },
];

function App() {
  const [stage, setStage] = useState('welcome');
  const [authMode, setAuthMode] = useState('login');
  const [userLabel, setUserLabel] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {

        setUserLabel(user.firstName);

        setStage("home");

    }

}, []);

  const handleSelectMode = (mode) => {
    setAuthMode(mode);
    setStage('auth');
  };

  const handleAuthSuccess = ({ label }) => {
    setUserLabel(label);
    setStage('home');
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setStage('booking');
  };

  const handleProfile = () => {
    setStage('profile');
  };

 const handleBackToStart = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setStage("welcome");

    setUserLabel("");

    setSelectedFacility(null);

};

  const handleBackHome = () => {
    setStage('home');
    setSelectedFacility(null);
  };

  return (
    <div className="App">
      {stage === 'welcome' && <WelcomeScreen onSelect={handleSelectMode} />}
      {stage === 'auth' && (
        <AuthContainer
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={handleAuthSuccess}
          onBack={handleBackToStart}
        />
      )}
      {stage === 'home' && (
        <HomePage
          userLabel={userLabel}
          facilities={facilities}
          onSelectFacility={handleFacilitySelect}
          onProfile={handleProfile}
          onLogout={handleBackToStart}
        />
      )}
      {stage === 'booking' && (
        <BookingPage facility={selectedFacility} userLabel={userLabel} onBack={handleBackHome} />
      )}
      {stage === 'profile' && <ProfilePage onBack={handleBackHome} />}
    </div>
  );
}

export default App;