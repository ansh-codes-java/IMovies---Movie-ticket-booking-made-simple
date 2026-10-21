import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import SplashScreen from './components/common/SplashScreen';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import './styles/global.css';

function App() {
  // Opening animation runs on every full page load / browser refresh (F5, Ctrl+R).
  // It does not re-trigger during in-app page navigation.
  // No sessionStorage, localStorage, or cookies are used to block it on refresh.
  const [showSplash, setShowSplash] = useState(true);

  // Clear any legacy storage key from previous versions
  useEffect(() => {
    try {
      sessionStorage.removeItem('imovies_splash_seen');
      localStorage.removeItem('imovies_splash_seen');
    } catch {
      // Safe fallback if storage access is restricted
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </main>
              <Footer />
            </div>

            <ToastContainer
              position="bottom-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
