//src/helpers/api.js
import axios from 'axios';

// const api = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api`,

//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
const BASE_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.hostname}:5000/api`
  : `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicApi = axios.create({
  baseURL: BASE_URL,
});
// const api = axios.create({
//   baseURL: `${window.location.origin.replace(':5173', ':5000')}/api`,

//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
}); 

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const isAuthPage =
//       window.location.pathname.includes('/activate') ||
//       window.location.pathname.includes('/reset-password');

//     if (error.response?.status === 401 && !isAuthPage) {
//       localStorage.removeItem('token');
//       window.location.href = '/';
//     }

//     return Promise.reject(error);
//   }
// );


// export const publicApi = axios.create({
//   // baseURL: `${window.location.origin.replace(':5173', ':5000')}/api`,
//   baseURL: `${import.meta.env.VITE_API_URL}/api`,
// });


// export const apiGet = (url) => api.get(url);
export const apiGet = (url, config = {}) => api.get(url, config);

// In api.js
export const apiPost = (url, data) => {
  
  return api.post(url, data); // use api, not axios

};
export const apiPut = (url, data) => api.put(url, data);
export const apiDelete = (url) => api.delete(url);

export const apiPatch = (url, data, config = {}) =>
  api.patch(url, data, config);

export default api;




// import axios from 'axios';

// const api = axios.create({
// baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

// export const apiGet = (url) => api.get(url);
// // In api.js
// export const apiPost = (url, data) => {
//   console.log('Sending to:', url, 'Data:', data);
//   return api.post(url, data); // use api, not axios

// };
// export const apiPut = (url, data) => api.put(url, data);
// export const apiDelete = (url) => api.delete(url);