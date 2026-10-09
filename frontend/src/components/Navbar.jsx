import React from 'react';
import { 
  Search, 
  RefreshCw, 
  Moon, 
  Sun, 
  Menu, 
  ShieldCheck 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  user, 
  searchQuery, 
  setSearchQuery, 
  onRefresh, 
  isRefreshing, 
  theme, 
  setTheme, 
  toggleMobileSidebar 
}) {
  const titles = {
    overview: { title: 'Fleet Overview', subtitle: 'Real-time telemetry and operation summary' },
    map: { title: 'Live Vehicle Map', subtitle: 'GPS positioning and active trip breadcrumbs' },
    vehicles: { title: 'Vehicle Fleet Directory', subtitle: 'Manage fleet assets, specifications, and availability' },
    drivers: { title: 'Driver Management', subtitle: 'Active operators, licenses, and assignments' },
    trips: { title: 'Trip Lifecycle & Dispatch', subtitle: 'Schedule, monitor, and finalize active routes' },
    operations: { title: 'Operations & Maintenance', subtitle: 'Fuel logs, servicing schedules, and cost logs' },
  };

  const current = titles[activeTab] || { title: 'Dashboard', subtitle: 'Fleet Monitoring Command Center' };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button className="icon-btn mobile-toggle" onClick={toggleMobileSidebar} style={{ display: 'none' }}>
          <Menu size={20} />
        </button>
        <div className="navbar-title">
          <h1>{current.title}</h1>
          <p>{current.subtitle}</p>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search vehicles, drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          className="icon-btn" 
          onClick={onRefresh} 
          title="Refresh Data"
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} />
        </button>

        <button 
          className="icon-btn" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="user-profile-badge">
          <div className="avatar-circle">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Administrator'}</span>
            <span className="user-role">
              <ShieldCheck size={11} style={{ display: 'inline', marginRight: 2 }} />
              {user?.role || 'ROLE_ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
