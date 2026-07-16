//src/pages/Notifications.jsx
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useNotifications from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';
// import { t } from '../i18n/notifications.i18n';

export default function Notifications() {
  const { notifications,  loading, loadMore, reload } = useNotifications();
  const sentinelRef = useRef(null);
const { t } = useTranslation("notifications");
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="container notifications-page">
      <h2>{t('notifications')}</h2>

      <div className="notifications-page__list">
        {notifications.map((n) => (
          <NotificationItem key={n._id} notification={n} />
        ))}
        {notifications.length === 0 && !loading && (
          <p className="notifications-page__empty">{t('empty')}</p>
        )}
      </div>

      <div ref={sentinelRef} />
      {loading && <p>{t('loading')}</p>}
    </div>
  );
}
