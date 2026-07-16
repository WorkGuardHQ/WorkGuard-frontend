//src/coponents/NotificationDropdown.jsx
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useNotifications from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
// import { t } from '../../i18n/notifications.i18n';

export default function NotificationDropdown({ onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation("notifications");
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const latest = notifications.slice(0, 10);

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown__header">
        <span>{t('notifications')}</span>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllAsRead} className="notification-dropdown__mark-all">
            {t('markAllRead')}
          </button>
        )}
      </div>

      <div className="notification-dropdown__list">
        {latest.length === 0 && (
          <div className="notification-dropdown__empty">{t('empty')}</div>
        )}
        {latest.map((n) => (
          <NotificationItem key={n._id} notification={n} onNavigate={onClose} />
        ))}
      </div>

      <button
        type="button"
        className="notification-dropdown__view-all"
        onClick={() => {
          navigate('/notifications');
          onClose?.();
        }}
      >
        {t('viewAll')}
      </button>
    </div>
  );
}
