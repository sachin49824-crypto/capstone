import React from 'react';
import { ArrowRight, Map, BellRing, Car, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onGoToLogin }) {
  return (
    <div className="landing-wrapper">
      <div className="landing-bg-glow" />
      
      <header className="landing-header">
        <div className="landing-logo">
          <div className="brand-icon-landing">
            <span style={{fontWeight: 800, letterSpacing: '-0.5px'}}>F</span>
          </div>
          <span className="brand-text">FleetPulse</span>
        </div>
        <nav>
          <button onClick={onGoToLogin} className="btn-secondary">Sign In</button>
        </nav>
      </header>

      <main className="landing-main">
        <div className="landing-hero">
          <h1 className="hero-title">
            Next-Gen <span className="text-gradient">Fleet Operations</span> Platform
          </h1>
          <p className="hero-subtitle">
            Monitor vehicles in real-time, dispatch drivers efficiently, and reduce operational costs with intelligent telemetry and predictive maintenance.
          </p>
          <div className="hero-actions">
            <button onClick={onGoToLogin} className="btn-primary hero-btn">
              Get Started <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Map size={24} color="#818cf8" /></div>
            <h3>Live Telemetry</h3>
            <p>Track your entire fleet in real-time with precise GPS mapping and active route monitoring.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BellRing size={24} color="#34d399" /></div>
            <h3>Smart Alerts</h3>
            <p>Instant notifications for speeding, harsh braking, and route deviations to ensure safety.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Car size={24} color="#f472b6" /></div>
            <h3>Vehicle Health</h3>
            <p>Predictive maintenance scheduling and automated fuel logging to minimize downtime.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={24} color="#fbbf24" /></div>
            <h3>Driver Analytics</h3>
            <p>Comprehensive driver performance profiles, licensing tracking, and efficiency scores.</p>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} FleetPulse Enterprise. All rights reserved.</p>
      </footer>
    </div>
  );
}
