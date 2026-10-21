import React, { useState, useEffect, useCallback } from 'react';
import './SplashScreen.css';

/**
 * SplashScreen Component
 * Premium cinematic opening animation for IMovies.
 * Runs on initial site launch and full page refresh (F5 / Ctrl+R),
 * automatically transitioning into the homepage after 3 seconds.
 *
 * @param {Object} props
 * @param {Function} props.onFinish Callback when animation completes or is skipped.
 * @param {number} [props.duration=2500] Duration before exit fade starts in milliseconds (total 3s with 500ms exit fade).
 */
const SplashScreen = ({ onFinish, duration = 2500 }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleComplete = useCallback(() => {
    setIsExiting(true);
    const exitTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 500); // Matches CSS transition duration (500ms)

    return () => clearTimeout(exitTimer);
  }, [onFinish]);

  const handleSkip = useCallback(() => {
    if (onFinish) onFinish();
  }, [onFinish]);

  // Lock body scrolling while splash screen is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Listen for Escape key to quickly skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Handle automatic timer and reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // If reduced motion is requested, finish quickly
      const reducedTimer = setTimeout(() => {
        handleSkip();
      }, 700);
      return () => clearTimeout(reducedTimer);
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleComplete, handleSkip]);

  return (
    <div
      className={`cinematic-splash ${isExiting ? 'is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="IMovies Cinema Opening"
    >
      {/* Ambient Theater Lighting & Projector Cone */}
      <div className="splash-ambient-lighting" aria-hidden="true" />
      <div className="splash-projector-beam" aria-hidden="true" />

      {/* Floating Cinematic Dust Particles */}
      <div className="splash-dust-container" aria-hidden="true">
        <span className="splash-dust-particle" />
        <span className="splash-dust-particle" />
        <span className="splash-dust-particle" />
        <span className="splash-dust-particle" />
        <span className="splash-dust-particle" />
        <span className="splash-dust-particle" />
        <span className="splash-dust-particle" />
        <span className="splash-dust-particle" />
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className="splash-skip-btn"
        aria-label="Skip cinema opening intro"
      >
        <span>Skip</span>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>›</span>
      </button>

      {/* Central Brand Reveal */}
      <div className="splash-center-content">
        {/* Luminous purple spotlight aura */}
        <div className="splash-spotlight-aura" aria-hidden="true" />

        {/* Typographic IMovies Logo */}
        <div className="splash-logo-wrapper">
          <span className="splash-brand-i">i</span>
          <span className="splash-brand-movies">Movies</span>
          <span className="splash-shimmer-beam" aria-hidden="true" />
        </div>

        {/* Cinema Tagline */}
        <p className="splash-tagline">
          Your Movies. Your Moments.
        </p>
      </div>

      {/* Timeline Progress Bar at bottom */}
      <div className="splash-progress-track" aria-hidden="true">
        <div className="splash-progress-fill" />
      </div>
    </div>
  );
};

export default SplashScreen;
