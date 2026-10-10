import React, { useState } from 'react';
import { Radio, Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { api } from './services/api';

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = (demoEmail, demoPass) => {
    setIsRegister(false);
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleModeSwitch = (registerMode) => {
    setIsRegister(registerMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegister) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim() || !password) {
        setErrorMsg('Please provide your email address and password.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const data = await api.register(name.trim(), email.trim(), password);
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          onLogin(data.user, data.token);
        }, 600);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Please provide both email address and password.');
        return;
      }

      setLoading(true);
      try {
        const data = await api.login(email, password);
        onLogin(data.user, data.token);
      } catch (err) {
        setErrorMsg(err.message || 'Invalid email or password credentials');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-glow" />

      <div className="login-box">
        <div className="login-brand">
          <div className="brand-icon" style={{ width: 44, height: 44 }}>
            <Radio size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', lineHeight: 1.1 }}>FleetPulse</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Fleet Monitoring Platform</p>
          </div>
        </div>

        {/* Tab switch between Sign In and Create Account */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: 'var(--radius-md, 8px)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <button
            type="button"
            onClick={() => handleModeSwitch(false)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              background: !isRegister ? 'var(--primary, #4f46e5)' : 'transparent',
              color: !isRegister ? '#fff' : 'var(--text-muted, #94a3b8)',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              background: isRegister ? 'var(--primary, #4f46e5)' : 'transparent',
              color: isRegister ? '#fff' : 'var(--text-muted, #94a3b8)',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={15} /> Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} /> Full Name
              </label>
              <input
                required
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              required
              type="email"
              className="form-control"
              placeholder={isRegister ? "name@company.com" : "admin@fleet.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? "new-password" : "current-password"}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={14} /> Confirm Password
              </label>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}

          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md, 8px)',
              color: '#f87171',
              fontSize: '0.825rem'
            }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 'var(--radius-md, 8px)',
              color: '#4ade80',
              fontSize: '0.825rem'
            }}>
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
          >
            {loading ? (
              isRegister ? 'Creating Account...' : 'Authenticating...'
            ) : isRegister ? (
              <>Create Account <ArrowRight size={16} /></>
            ) : (
              <>Sign In to Workspace <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Bottom switch link */}
        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary, #818cf8)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary, #818cf8)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>

        {!isRegister && (
          <div className="demo-credentials-box" style={{ marginTop: '16px' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={14} color="#818cf8" /> Demo Credentials
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                admin@fleet.com / admin123
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              onClick={() => fillDemo('admin@fleet.com', 'admin123')}
            >
              Fill Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}