"use client";

import { motion } from 'framer-motion';
import styles from './page.module.css';

// Import the Luckiest Guy Google Font
import { Luckiest_Guy } from 'next/font/google';

const luckiestGuy = Luckiest_Guy({ subsets: ['latin'], weight: '400' });

export default function RegistrationForm() {
  return (
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
        <h1 style={{ fontSize: '2.5rem', paddingBottom: '1rem', color: 'black' }}>Registration</h1>
        <form>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            required
            style={{
              border: '2px solid black',
              borderRadius: '4px',
              padding: '0.5rem',
              outline: 'none',
              backgroundColor: '#f0f0f0',
              color: 'black',
              animation: 'cursor-pulse 1s infinite',
            }}
            placeholderStyle={{ color: 'black' }}
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
                marginTop: '1rem', // Added padding to the top
              }}
            >
              Register
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
