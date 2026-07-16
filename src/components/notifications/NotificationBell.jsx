//src/coponents/NotificationBell.jsx
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import useNotifications from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
  const { t } = useTranslation("notifications");
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
// console.log("NotificationBell Render");
  return (
    
    <div className="notification-bell" ref={ref}>
      <button
        type="button"
          className="nav-link-icon-btn notification-bell__button"
        // className="notification-bell__button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("notifications")}
      >
        {/* Uses Bootstrap Icons, already available via bootstrap bundle in this project.
            Swap for your own icon set if you don't use bootstrap-icons. */}
      {/* <i className="fas fa-bell" /> */}
      <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
