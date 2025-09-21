import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from 'react-bootstrap';

const PromoBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="position-fixed w-100"
        style={{
          top: 0,
          left: 0,
          backgroundImage: `url('/assets/images/healthcare/promo-banner-1600x900.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="container-fluid py-3">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="me-3"
                >
                  <i className="ri-fire-line text-white fs-4"></i>
                </motion.div>
                
                <div className="text-white text-center text-md-start">
                  <strong className="me-2">🎉 Limited Time: 30% OFF Healthcare AI Platform!</strong>
                  <span className="d-none d-md-inline">
                    Transform your practice with AI-powered tools.
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-center">
                <div className="countdown-timer d-flex gap-2 text-white">
                  <div className="time-unit text-center">
                    <div 
                      className="time-value fw-bold bg-white text-danger rounded px-2 py-1"
                      style={{ minWidth: '35px', fontSize: '0.9rem' }}
                    >
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <small className="d-block" style={{ fontSize: '0.7rem' }}>HRS</small>
                  </div>
                  <div className="align-self-center text-white fw-bold">:</div>
                  <div className="time-unit text-center">
                    <div 
                      className="time-value fw-bold bg-white text-danger rounded px-2 py-1"
                      style={{ minWidth: '35px', fontSize: '0.9rem' }}
                    >
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <small className="d-block" style={{ fontSize: '0.7rem' }}>MIN</small>
                  </div>
                  <div className="align-self-center text-white fw-bold">:</div>
                  <div className="time-unit text-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="time-value fw-bold bg-white text-danger rounded px-2 py-1"
                      style={{ minWidth: '35px', fontSize: '0.9rem' }}
                    >
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </motion.div>
                    <small className="d-block" style={{ fontSize: '0.7rem' }}>SEC</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-1">
              <div className="d-flex gap-2 justify-content-center">
                <Button
                  size="sm"
                  variant="light"
                  className="fw-bold px-3"
                  style={{ borderRadius: '20px', fontSize: '0.8rem' }}
                  onClick={() => {
                    const pricingSection = document.querySelector('#pricing-section');
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Claim Now
                </Button>
                
                <button
                  className="btn btn-link text-white p-0"
                  onClick={() => setShowBanner(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBanner;
