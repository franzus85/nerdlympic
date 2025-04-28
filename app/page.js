"use client";

import { motion } from 'framer-motion';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

// Import the Luckiest Guy Google Font
import { Luckiest_Guy } from 'next/font/google';
import { Toaster, toast } from 'sonner';

const luckiestGuy = Luckiest_Guy({ subsets: ['latin'], weight: '400' });
const TARGET_DATE = 1745949600000; // October 28, 2025 in milliseconds

export default function RegistrationForm() {
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Check localStorage for registration status on component mount
  useEffect(() => {
    const userRegistration = localStorage.getItem('nerdlympic_registration');
    if (userRegistration) {
      const userData = JSON.parse(userRegistration);
      setIsRegistered(true);
      setName(userData.username || '');
    }
  }, []);

  // Set up countdown timer if user is registered
  useEffect(() => {
    if (!isRegistered) return;

    const calculateTimeLeft = () => {
      const difference = TARGET_DATE - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    // Update countdown immediately
    setCountdown(calculateTimeLeft());
    
    // Set up interval to update countdown every second
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isRegistered]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/save-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      const data = await response.json();
      
      // Save registration data to localStorage
      localStorage.setItem('nerdlympic_registration', JSON.stringify({
        username: name,
        timestamp: new Date().toISOString(),
        registered: true
      }));
      
      setIsRegistered(true);
      toast.success(`User: ${name} saved successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred while saving the user.');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <motion.div
        className={`${styles.background} ${luckiestGuy.className}`}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        initial={{ scale: 0.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3 }}
      >
        <motion.div
          className={styles.formContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          {!isRegistered ? (
            <>
              <h1 style={{ fontSize: '2.5rem', paddingBottom: '1rem', color: 'black' }}>Registration</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    border: '2px solid black',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    outline: 'none',
                    backgroundColor: '#f0f0f0',
                    color: 'black',
                    animation: 'cursor-pulse 1s infinite',
                  }}
                  onFocus={(e) => e.target.style.animation = 'none'}
                  onBlur={(e) => e.target.style.animation = 'cursor-pulse 1s infinite'}
                />

                <style jsx>{`
                  @keyframes cursor-pulse {
                    0% {
                      box-shadow: 0 0 0px black;
                    }
                    50% {
                      box-shadow: 0 0 5px black;
                    }
                    100% {
                      box-shadow: 0 0 0px black;
                    }
                  }
                `}</style>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      marginTop: '1rem',
                    }}
                  >
                    Register
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className={styles.countdownContainer} style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.5rem', color: 'black', marginBottom: '2rem' }}>
                Welcome, {name}!
              </h1>
              <h2 style={{ fontSize: '2rem', color: 'black', marginBottom: '1.5rem' }}>
                Countdown to Nerdlympic:
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                  <div 
                    key={unit}
                    style={{ 
                      padding: '1rem', 
                      background: 'rgba(0,0,0,0.8)', 
                      borderRadius: '8px', 
                      color: 'white', 
                      width: '110px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ 
                      fontSize: '2.2rem', 
                      fontWeight: 'bold', 
                      lineHeight: '1.2',
                      width: '100%',
                      textAlign: 'center'
                    }}>
                      {countdown[unit]}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      textTransform: 'capitalize',
                      marginTop: '0.5rem'
                    }}>
                      {unit}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'black' }}>
                Get ready for the event!
              </p>
              <button 
                onClick={() => {
                  localStorage.removeItem('nerdlympic_registration');
                  setIsRegistered(false);
                }}
                style={{
                  marginTop: '1.5rem',
                  backgroundColor: '#555',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Reset Registration
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
