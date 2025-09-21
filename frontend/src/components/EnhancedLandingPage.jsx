import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LANDING_CONFIG, 
  HERO_CONFIG, 
  FEATURES_CONFIG, 
  PRICING_CONFIG,
  getEnvConfig,
  generateAssetPath,
  getColorByType 
} from '../config/landingPageConfig';
import '../styles/EnhancedLandingPage.css';

// ========================================
// FLOATING PARTICLES COMPONENT
// ========================================
const FloatingParticles = ({ count = 50 }) => {
  const particlesRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 3 + 3,
          delay: Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [count]);

  return (
    <div className="particles-container" ref={particlesRef}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ========================================
// ANIMATED COUNTER COMPONENT
// ========================================
const AnimatedCounter = ({ value, suffix = '', duration = 2000, startAnimation = false }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!startAnimation || isAnimating) return;

    setIsAnimating(true);
    const startValue = 0;
    const endValue = value;
    const increment = endValue / (duration / 16); // 60fps
    let current = startValue;

    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCurrentValue(endValue);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [startAnimation, value, duration, isAnimating]);

  return (
    <span className="stat-value">
      {currentValue.toLocaleString()}{suffix}
    </span>
  );
};

// ========================================
// STATS SECTION COMPONENT
// ========================================
const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-container" ref={statsRef} id="stats-section">
      {HERO_CONFIG.stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card glass-card"
          style={{ animationDelay: stat.animationDelay }}
        >
          <i 
            className={`${stat.icon} stat-icon`}
            style={{ color: getColorByType(stat.color).main }}
          />
          <AnimatedCounter
            value={stat.value}
            suffix={stat.suffix}
            startAnimation={isVisible}
          />
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

// ========================================
// ENHANCED HERO SECTION
// ========================================
const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const { enableParticles } = getEnvConfig();

  const handleCTAClick = (action) => {
    switch (action) {
      case 'trial':
        navigate('/auth/sign-up');
        break;
      case 'demo':
        window.open(LANDING_CONFIG.brand.contactUrl, '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <section className="enhanced-hero">
      {enableParticles && <FloatingParticles count={30} />}
      
      <Container>
        <Row className="align-items-center min-vh-100">
          <Col lg={6} className="hero-content">
            <h1 className="hero-title animate-on-scroll">
              {HERO_CONFIG.title}
            </h1>
            <p className="hero-subtitle animate-on-scroll">
              {HERO_CONFIG.subtitle}
            </p>
            
            <div className="d-flex flex-wrap gap-3 mb-4">
              <Button
                className="btn-enhanced btn-enhanced-primary"
                onClick={() => handleCTAClick(HERO_CONFIG.cta.primary.action)}
              >
                <i className={HERO_CONFIG.cta.primary.icon}></i>
                {HERO_CONFIG.cta.primary.text}
              </Button>
              
              <Button
                variant="outline-light"
                className="btn-enhanced btn-enhanced-secondary"
                onClick={() => handleCTAClick(HERO_CONFIG.cta.secondary.action)}
              >
                <i className={HERO_CONFIG.cta.secondary.icon}></i>
                {HERO_CONFIG.cta.secondary.text}
              </Button>
            </div>
          </Col>
          
          <Col lg={6}>
            <StatsSection />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// ========================================
// ENHANCED FEATURES SECTION
// ========================================
const EnhancedFeaturesSection = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => new Set([...prev, cardIndex]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-5" ref={sectionRef}>
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2 className="text-gradient mb-3">{FEATURES_CONFIG.title}</h2>
            <p className="lead">{FEATURES_CONFIG.subtitle}</p>
          </Col>
        </Row>
        
        <div className="features-grid">
          {FEATURES_CONFIG.features.map((feature, index) => (
            <Card
              key={feature.id}
              className={`feature-card glass-card ${visibleCards.has(index) ? 'visible' : ''}`}
              data-index={index}
            >
              <Card.Body>
                <div className="text-center mb-4">
                  <i 
                    className={`${feature.icon} feature-icon`}
                    style={{ color: getColorByType(feature.color).main }}
                  />
                </div>
                
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
                
                <div className="feature-benefits">
                  {feature.benefits.map((benefit, i) => (
                    <span key={i} className="benefit-tag">
                      {benefit}
                    </span>
                  ))}
                </div>
                
                <Badge 
                  bg="light" 
                  text="dark" 
                  className="mt-3"
                  style={{ 
                    background: getColorByType(feature.color).gradient,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {feature.category}
                </Badge>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

// ========================================
// ENHANCED PRICING SECTION
// ========================================
const EnhancedPricingSection = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (plan) => {
    if (plan.id === 'enterprise') {
      window.open(LANDING_CONFIG.brand.contactUrl, '_blank');
    } else {
      navigate('/auth/sign-up', { state: { selectedPlan: plan.id } });
    }
  };

  return (
    <section className="py-5">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2 className="text-gradient mb-3">{PRICING_CONFIG.title}</h2>
            <p className="lead">{PRICING_CONFIG.subtitle}</p>
          </Col>
        </Row>
        
        <div className="pricing-grid">
          {PRICING_CONFIG.plans.map((plan) => (
            <Card
              key={plan.id}
              className={`pricing-card glass-card ${plan.popular ? 'popular' : ''}`}
            >
              <Card.Body>
                <div className="text-center mb-4">
                  <i 
                    className={`${plan.icon} pricing-icon`}
                    style={{ color: getColorByType(plan.color).main }}
                  />
                </div>
                
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">
                  {plan.currency}{plan.price}
                </div>
                <div className="pricing-period">per {plan.period}</div>
                
                <p className="text-muted mb-4">{plan.description}</p>
                
                <ul className="pricing-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                
                <Button
                  className="btn-enhanced btn-enhanced-primary w-100"
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.cta}
                </Button>
                
                <small className="text-muted d-block mt-2">{plan.limits}</small>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          className="position-fixed btn-enhanced btn-enhanced-primary"
          style={{
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            padding: 0,
          }}
          onClick={scrollToTop}
        >
          <i className="ri-arrow-up-line"></i>
        </Button>
      )}
    </>
  );
};

// ========================================
// MAIN ENHANCED LANDING PAGE COMPONENT
// ========================================
const EnhancedLandingPage = () => {
  useEffect(() => {
    // Initialize scroll animations
    const observeElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      elements.forEach((el) => observer.observe(el));
    };

    observeElements();
    
    // Set page title from config
    document.title = `${LANDING_CONFIG.brand.name} - ${LANDING_CONFIG.brand.tagline}`;
  }, []);

  return (
    <div className="enhanced-landing-page">
      <EnhancedHeroSection />
      <EnhancedFeaturesSection />
      <EnhancedPricingSection />
      <ScrollToTopButton />
    </div>
  );
};

export default EnhancedLandingPage;