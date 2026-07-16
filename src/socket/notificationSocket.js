//src/socket/notificationSocket.js
import { io } from 'socket.io-client';
import { getToken } from "../helpers/tokenHelper";
// Shared connection on the DEFAULT namespace — the backend no longer uses
// io.of('/notifications'). Every realtime feature (notifications, attendance,
// chat, presence, dashboard...) reuses this single socket connection instead
// of opening a new one per feature, joined into different rooms server-side.
let socket = null;

export function connectNotificationSocket() {
    // console.log("connectNotificationSocket called");

  const token = getToken();
  // const payload = JSON.parse(atob(token.split(".")[1]));
// console.log("SOCKET TOKEN PAYLOAD:", payload);
  if (!token) return null;
  // console.log("socket token =", token);

  if (socket?.connected) return socket;

  // Same origin-swap trick used in helpers/api.js
  const base = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : import.meta.env.VITE_API_URL;

  socket = io(base, {
    
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
  });
  // console.log(socket.id);
socket.on("connect", () => {
  // console.log("✅ Notification socket connected");
    // console.log("CONNECTED", socket.id);

});

socket.on("disconnect", () => {
  // console.log("❌ Notification socket disconnected");
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});
  return socket;
}

export function disconnectNotificationSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getNotificationSocket() {
  return socket;
}
