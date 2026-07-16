//src/coponents/NotificationItem.jsx
import { useNavigate } from 'react-router-dom';
import useNotifications from '../../hooks/useNotifications';
import {
  formatDisplayDate,
  formatDisplayTime,
} from "../../helpers/timezone";
import {
  getTenantTimezone,
} from "../../helpers/tokenHelper";
export default function NotificationItem({ notification, onNavigate }) {


  const navigate = useNavigate();
  const { markAsRead } = useNotifications();

  const tenantTimezone = getTenantTimezone();
  const handleClick = async () => {
    if (!notification.isRead) await markAsRead(notification._id);
    if (notification.link) navigate(notification.link);
    onNavigate?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`notification-item${notification.isRead ? '' : ' notification-item--unread'}`}
    >
      <div className="notification-item__title">{notification.title}</div>
      <div className="notification-item__message">{notification.message}</div>
      {/* <div className="notification-item__time">
        {new Date(notification.createdAt).toLocaleString()}
      </div> */}
      <div className="notification-item__time">
  {formatDisplayDate(
      notification.createdAt,
      tenantTimezone
  )}{" "}
  {formatDisplayTime(
      notification.createdAt,
      tenantTimezone
  )}
</div>
    </button>
  );
}
