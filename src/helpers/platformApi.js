
// import axios from 'axios';

// const platformApi = axios.create({
//   baseURL: `${window.location.origin.replace(':5173', ':5000')}/platform`,


  
//   headers: { 'Content-Type': 'application/json' },
// });

// platformApi.interceptors.request.use((config) => {

//   // 🚀 skip auth للـ activate
//   if (config.url.includes('/tenants/activate')) {
//     return config;
//   }

//   const token = localStorage.getItem('platform_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;

//   return config;
// });

// platformApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('platform_token');
//       window.location.href = '/platform/login';
//     }
//     return Promise.reject(error);
//   }
// );


// export const platformGet    = (url, config = {}) => platformApi.get(url, config);
// export const platformPost   = (url, data)        => platformApi.post(url, data);
// export const platformPut    = (url, data)        => platformApi.put(url, data);
// export const platformPatch  = (url, data)        => platformApi.patch(url, data);
// export const platformDelete = (url)              => platformApi.delete(url);

// export default platformApi;

//src/helpers/platformApi.js
import axios from 'axios';

const platformApi = axios.create({
  baseURL: `${window.location.origin.replace(':5173', ':5000')}/platform`,
  headers: { 'Content-Type': 'application/json' },
});

platformApi.interceptors.request.use((config) => {
  // 🚀 skip auth للـ activate
  if (config.url.includes('/tenants/activate')) {
    return config;
  }

  const token = localStorage.getItem('platform_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// ✅ interceptor واحد بس
platformApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/platform/activate')) {
        localStorage.removeItem('platform_token');
        window.location.href = '/platform/login';
      }
    }
    return Promise.reject(error);
  }
);

export const platformGet    = (url, config = {}) => platformApi.get(url, config);
export const platformPost   = (url, data)        => platformApi.post(url, data);
export const platformPut    = (url, data)        => platformApi.put(url, data);
export const platformPatch  = (url, data)        => platformApi.patch(url, data);
export const platformDelete = (url)              => platformApi.delete(url);

export default platformApi;

