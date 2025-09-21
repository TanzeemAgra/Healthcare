import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
      }
    };

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    // Show after 30 seconds if no interaction
    const timer = setTimeout(() => {
      if (!hasShown) {
        setShowPopup(true);
        setHasShown(true);
      }
    }, 30000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [hasShown]);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleClaim = () => {
    // Redirect to pricing with special offer
    const pricingSection = document.querySelector('#pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-4 shadow-lg p-5 mx-3"
            style={{ maxWidth: '500px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={handleClose}
              style={{ background: 'transparent', border: 'none', fontSize: '1.5rem' }}
            >
              <i className="ri-close-line"></i>
            </button>

            {/* Content */}
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <i 
                  className="ri-gift-line display-1"
                  style={{ 
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                ></i>
              </motion.div>

              <h2 className="fw-bold mb-3">Wait! Don't Miss Out!</h2>
              
              <Badge 
                bg="danger" 
                className="px-3 py-2 mb-3 fs-6"
                style={{ borderRadius: '25px' }}
              >
                <i className="ri-time-line me-2"></i>
                Limited Time Offer
              </Badge>

              <h4 className="text-primary fw-bold mb-3">
                Get 30% OFF Your First Month
              </h4>

              <p className="text-muted mb-4">
                Join thousands of healthcare professionals transforming patient care with AI. 
                This exclusive offer expires in 24 hours!
              </p>

              <div className="d-flex flex-column gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="w-100 fw-bold"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '15px'
                    }}
                    onClick={handleClaim}
                  >
                    <i className="ri-gift-line me-2"></i>
                    Claim 30% Discount
                  </Button>
                </motion.div>

                <Button 
                  variant="outline-secondary" 
                  onClick={handleClose}
                  className="fw-medium"
                  style={{ borderRadius: '12px' }}
                >
                  Maybe Later
                </Button>
              </div>

              <small className="text-muted mt-3 d-block">
                * Offer valid for new customers only. Cannot be combined with other offers.
              </small>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
