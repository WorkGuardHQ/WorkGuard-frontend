

// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { formatDuration } from '../helpers/formatDuration';
// // API Services
// import { checkIn, checkOut } from '../services/attendance.api';
// import { getMyBranches } from '../services/branch.api';
// import webAuthnService from '../services/webauthn.service';
// // Components
// // import useDeviceFingerprint from'../components/attendance/useDeviceFingerprint';

// import Toast from '../components/ui/Toast';

// // Assets
// import logo from '../assets/logolgoin - nav.png';

// // Styles
// import '../style/attendance-modern.css';
// // import'../style/attendance-modern.css'

// function Attendance() {
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [deviceInfo, setDeviceInfo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [biometricsAvailable, setBiometricsAvailable] = useState(false);
//   const [biometricsEnabled, setBiometricsEnabled] = useState(false);
//   const { t } = useTranslation();

//   // Toast state
//   const [toast, setToast] = useState({ 
//     show: false, 
//     message: '', 
//     type: 'success', 

//     onConfirm: null,
//   confirmText: '',
//   cancelText: ''
//   });

//   // Toast helpers
//   // const showToast = (message, type = 'success') => {
//   //   setToast({ show: true, message, type });
//   // };
// const showToast = (
//   message,
//   type = 'success',
//   options = {}
// ) => {
//   setToast({
//     show: true,
//     message,
//     type,
//     ...options
//   });
// };
//  const hideToast = () => {
//   setToast({
//     show: false,
//     message: '',
//     type: 'success',
//     onConfirm: null,
//     confirmText: '',
//     cancelText: ''
//   });
// };
//   // Device fingerprinting
//   const generateDeviceInfo = async () => {
//     try {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       ctx.textBaseline = 'top';
//       ctx.font = '14px Arial';
//       ctx.fillText('Device fingerprint', 2, 2);
      
//       const deviceData = {
//         userAgent: navigator.userAgent,
//         platform: navigator.platform,
//         language: navigator.language,
//         hardwareConcurrency: navigator.hardwareConcurrency || 0,
//         deviceMemory: navigator.deviceMemory || 0,
//         screenResolution: `${screen.width}x${screen.height}`,
//         colorDepth: screen.colorDepth,
//         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//         canvasFingerprint: canvas.toDataURL()
//       };

//       // const deviceId = await generateDeviceId(deviceData);
//       let deviceId = localStorage.getItem('deviceId');

// if (!deviceId) {
//   deviceId = crypto.randomUUID();
//   localStorage.setItem('deviceId', deviceId);
// }

//       const browserFingerprint = await generateBrowserFingerprint(deviceData);

//       return {
//         deviceId,
//         browserFingerprint,
//         userAgent: navigator.userAgent,
//         platform: navigator.platform,
//        // timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('Error generating device info:', error);
//       return null;
//     }
//   };

//   // const generateDeviceId = async (deviceData) => {
//   //   const encoder = new TextEncoder();
//   //   const data = encoder.encode(
//   //     `${deviceData.platform}-${deviceData.hardwareConcurrency}-${deviceData.deviceMemory}-${deviceData.screenResolution}-${deviceData.timeZone}`
//   //   );
//   //   const hashBuffer = await crypto.subtle.digest('SHA-256', data);
//   //   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   //   return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//   // };

//   const generateBrowserFingerprint = async (deviceData) => {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(
//       `${deviceData.userAgent}-${deviceData.language}-${deviceData.canvasFingerprint}-${deviceData.colorDepth}`
//     );
//     const hashBuffer = await crypto.subtle.digest('SHA-256', data);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//   };

//   // Biometrics
//   // const checkBiometricsSupport = async () => {
//   //   if ('PublicKeyCredential' in window && navigator.credentials) {
//   //     try {
//   //       const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
//   //       setBiometricsAvailable(available);
//   //       return available;
//   //     } catch (error) {
//   //       console.error('Error checking biometrics support:', error);
//   //       setBiometricsAvailable(false);
//   //       return false;
//   //     }
//   //   }
//   //   setBiometricsAvailable(false);
//   //   return false;
//   // };

//   const checkBiometricsSupport = async () => {
//   const supported =
//     webAuthnService.isSupported() &&
//     await webAuthnService.isPlatformAuthenticatorAvailable();

//   setBiometricsAvailable(supported);
//   return supported;
// };

//   // const registerBiometrics = async () => {
//   //   if (!biometricsAvailable || !deviceInfo) return false;

//   //   try {
//   //     const credential = await navigator.credentials.create({
//   //       publicKey: {
//   //         challenge: new Uint8Array(32),
//   //         rp: { name: "Attendance and departure registration." },
//   //         user: {
//   //           id: new TextEncoder().encode(deviceInfo.deviceId),
//   //           name: "user",
//   //           displayName: "User"
//   //         },
//   //         pubKeyCredParams: [{ alg: -7, type: "public-key" }],
//   //         authenticatorSelection: {
//   //           authenticatorAttachment: "platform",
//   //           userVerification: "required"
//   //         }
//   //       }
//   //     });

//   //     if (credential) {
//   //       setBiometricsEnabled(true);
//   //       window.biometricsRegistered = true;
//   //       return true;
//   //     }
//   //   } catch (error) {
//   //     console.error('Biometrics registration failed:', error);
//   //   }
//   //   return false;
//   // };
// const registerBiometrics = async () => {
//   if (!deviceInfo) return false;

//   const result = await webAuthnService.register(
//     deviceInfo.deviceId
//   );

//   if (result?.verified) {
//     setBiometricsEnabled(true);
//     return true;
//   }

//   return false;
// };

// const verifyBiometrics = async () => {
//   if (!deviceInfo) return false;

//   const result = await webAuthnService.authenticate(
//     deviceInfo.deviceId
//   );

//   return !!result?.verified;
// };

//   // const verifyBiometrics = async () => {
//   //   if (!biometricsEnabled || !deviceInfo) return false;

//   //   try {
//   //     const credential = await navigator.credentials.get({
//   //       publicKey: {
//   //         challenge: new Uint8Array(32),
//   //         userVerification: "required"
//   //       }
//   //     });

//   //     return !!credential;
//   //   } catch (error) {
//   //     console.error('Biometrics verification failed:', error);
//   //     return false;
//   //   }
//   // };

//   // Initialize
//   useEffect(() => {
//     const initializeDevice = async () => {
//       setLoading(true);
//       try {
//         const info = await generateDeviceInfo();
//         setDeviceInfo(info);

//         const biometricsSupported = await checkBiometricsSupport();

// setBiometricsEnabled(biometricsSupported);

//         // const biometricsSupported = await checkBiometricsSupport();
//         // if (biometricsSupported && window.biometricsRegistered) {
//         //   setBiometricsEnabled(true);
//         // }

//         const res = await getMyBranches();
//         setBranches(res.data.data || []);
//       } catch (err) {
//         console.error('Initialization error:', err);
//         showToast(t('error'), 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeDevice();
//   }, [t]);

//   // Geolocation
//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error(t('geolocationNotSupported')));
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => resolve({ 
//           lat: position.coords.latitude, 
//           lng: position.coords.longitude ,
//           accuracy: position.coords.accuracy 
//         }),
//         (err) => reject(err),
//         { 
//           enableHighAccuracy: true, 
//           timeout: 15000, 
//           maximumAge: 0 
//           // maximumAge: 300000
//         }
//       );
//     });
//   };

//   // Main action handler
//   const performAction = async (action, apiFunction) => {
//     if (!selectedBranch || !deviceInfo) {
//       showToast(t('error'), 'warning');
//       return;
//     }

//     setLoading(true);
// let requestData;
//     try {
//       // Biometric verification
//       // if (biometricsEnabled) {
//       //   const biometricsVerified = await verifyBiometrics();
//       //   if (!biometricsVerified) {
//       //     showToast(t('biometricVerificationFailed'), 'error');
//       //     return;
//       //   }
//       // }

//       // Get location
//       const { lat, lng , accuracy} = await getLocation();
//       // const biometricsVerified = await verifyBiometrics();

//       // Call API
//        requestData = {
//         lat, 
//         lng, 
//          accuracy,
//         branchId: selectedBranch, 
//         deviceInfo ,
//         // biometricVerified: biometricsVerified

//       }

//       const response = await apiFunction(requestData);

//       // ✅ Use backend message
//       let successMessage = response.data.message || t(`${action}Success`);
      
//       // Add late/early minutes if present
//       // if (response.data.lateMinutes && response.data.lateMinutes > 0) {
//       //   successMessage += ` (${t('late')} ${response.data.lateMinutes} ${t('minutes')})`;
//       // }

      
//       // if (response.data.earlyLeaveMinutes && response.data.earlyLeaveMinutes > 0) {
//       //   successMessage += ` (${t('earlyLeave')} ${response.data.earlyLeaveMinutes} ${t('minutes')})`;
//       // }
// if (response.data.lateMinutes > 0) {
//   successMessage += ` (${t('late')} ${formatDuration(response.data.lateMinutes, t)})`;
// }

// if (response.data.earlyLeaveMinutes > 0) {
//   successMessage += ` (${t('earlyLeave')} ${formatDuration(response.data.earlyLeaveMinutes, t)})`;
// }

//       showToast(successMessage, 'success');
//     } catch (err) {
//   console.error(`${action} error:`, err);

//   if (err.response?.data?.code === 'WEBAUTHN_REGISTRATION_REQUIRED') {
//   try {
//     await webAuthnService.register(deviceInfo.deviceId);

//     const retryResponse = await apiFunction(requestData);

//     let successMessage =
//       retryResponse.data.message || t(`${action}Success`);

//     if (retryResponse.data.lateMinutes > 0) {
//       successMessage += ` (${t('late')} ${formatDuration(retryResponse.data.lateMinutes, t)})`;
//     }

//     if (retryResponse.data.earlyLeaveMinutes > 0) {
//       successMessage += ` (${t('earlyLeave')} ${formatDuration(retryResponse.data.earlyLeaveMinutes, t)})`;
//     }

//     setBiometricsEnabled(true);

//     showToast(successMessage, 'success');
//     return;

//   } catch (registerError) {
//     showToast(
//       registerError.response?.data?.message ||
//       t('biometricsEnableFailed'),
//       'error'
//     );
//     return;
//   }
// }

// if (err.response?.data?.code === 'WEBAUTHN_AUTH_REQUIRED') {
//   try {
//     await webAuthnService.authenticate(deviceInfo.deviceId);

//     const retryResponse = await apiFunction(requestData);

//     let successMessage =
//       retryResponse.data.message || t(`${action}Success`);

//     if (retryResponse.data.lateMinutes > 0) {
//       successMessage += ` (${t('late')} ${formatDuration(retryResponse.data.lateMinutes, t)})`;
//     }

//     if (retryResponse.data.earlyLeaveMinutes > 0) {
//       successMessage += ` (${t('earlyLeave')} ${formatDuration(retryResponse.data.earlyLeaveMinutes, t)})`;
//     }

//     showToast(successMessage, 'success');
//     return;

//   } catch (authError) {
//     showToast(
//       authError.response?.data?.message ||
//       t('biometricVerificationFailed'),
//       'error'
//     );
//     return;
//   }
// }
//   if (err.response?.data?.requiresConfirmation) {
//     showToast(
//       `You are currently checked in at "${err.response.data.previousBranch.name}". Continuing will invalidate that attendance and create a new check-in here.`,
//       'warning',
//       {
//         confirmText: 'Continue',
//         cancelText: 'Cancel',

//         onConfirm: async () => {
//           setLoading(true);
//           try {
//             const response = await apiFunction({
//               ...requestData,
//               force: true,
//             });

//             let successMessage =
//               response.data.message || t(`${action}Success`);

//             if (response.data.lateMinutes > 0) {
//               successMessage += ` (${t('late')} ${formatDuration(response.data.lateMinutes, t)})`;
//             }

//             if (response.data.earlyLeaveMinutes > 0) {
//               successMessage += ` (${t('earlyLeave')} ${formatDuration(response.data.earlyLeaveMinutes, t)})`;
//             }

//             hideToast();

// setTimeout(() => {
//   showToast(successMessage, 'success');
// }, 50);

            
//           } catch (err2) {
//             showToast(
//               err2.response?.data?.message || t('error'),
//               'error'
//             );
//           }finally {
//     setLoading(false);
// }
//         }
//       }
//     );

//     return;
//   }

//   let errorMessage = err.response?.data?.message || t('error');

//   if (err.response?.data?.isNewDevice) {
//     errorMessage = t('devicePending');
//   }

//   showToast(errorMessage, 'error');
// }finally {
//   setLoading(false);
// }
//   };

//   // Action handlers
//   const handleCheckIn = () => performAction('checkIn', checkIn);
//   const handleCheckOut = () => performAction('checkOut', checkOut);

//   const handleEnableBiometrics = async () => {
//     const registered = await registerBiometrics();
//     if (registered) {
//       showToast(t('biometricsEnabledSuccess'), 'success');
//     } else {
//       showToast(t('biometricsEnableFailed'), 'error');
//     }
//   };

//   // Loading screen
//   if (loading && !deviceInfo) {
//     return (
//       <div className="attendance-loading-screen">
//         <div className="attendance-loading-content">
//           <div className="attendance-spinner"></div>
//           <p className="attendance-loading-text">{t('loading')}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="attendance-main-container">
//         <div className="attendance-card">
//           {/* Header */}
//           <div className="attendance-card-header">
//             <div className="attendance-logo">
//               <img src={logo} alt="WorkGuard" />
//             </div>
//             <h2 className="attendance-card-title ">{t('attendance.attendance')}</h2>
//           </div>
          
//           {/* Body */}
//           <div className="attendance-card-body">
//             {/* Device Info Badge */}
//             {deviceInfo && (
//               <div className="attendance-device-badge">
//                 <span className="attendance-device-icon">📱</span>
//                 <span className="attendance-device-text">
//                   {t('deviceId')}: {deviceInfo.deviceId.substring(0, 12)}...
//                 </span>
//               </div>

              
//             )}

//             {/* Branch Selection */}
//             <div className="attendance-form-group">
//               <label className="attendance-form-label">
//                 <span>🏢</span>
//                 <span>{t('selectBranch')}</span>
//               </label>
//               <select
//                 className="attendance-form-select"
//                 value={selectedBranch}
//                 onChange={(e) => setSelectedBranch(e.target.value)}
//                 disabled={loading}
//               >
//                 <option value="">{t('selectBranch')}</option>
//                 {branches.map(branch => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Biometrics Section */}
//             {biometricsAvailable && (
//               <div className="attendance-biometrics">
//                 <div className="attendance-biometrics-header">
//                   <label className="attendance-biometrics-label ">
//                     <span>
//                                 <i className="fas fa-fingerprint me-2"></i></span>
//                     <span>{t('biometricsPrompt')}</span>
//                   </label>
//                   {!biometricsEnabled && (
//                     <button
//                       className="attendance-btn-enable"
//                       onClick={handleEnableBiometrics}
//                       disabled={loading}
//                     >
//                       {t('enableBiometrics')}
//                     </button>
//                   )}
//                 </div>
//                 <div className="attendance-checkbox-container">
//                   <input 
//                     type="checkbox" 
//                     className="attendance-checkbox"
//                     checked={biometricsEnabled}
//                     disabled
//                     readOnly
//                   />
//                   <span>
//                     {t(biometricsEnabled ? 'biometricsEnabled' : 'biometricsDisabled')}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="attendance-actions">
//               <button
//                 onClick={handleCheckIn}
//                 className="attendance-btn attendance-btn-success"
//                 disabled={!selectedBranch || !deviceInfo || loading}
//               >
//                 {loading ? (
//                   <>
//                     <div className="attendance-btn-spinner"></div>
//                     <span>{t('loading')}</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="attendance-btn-icon"> <i className="fas fa-sign-in-alt me-2"></i></span>
//                     <span>{t('checkIn')}</span>
//                   </>
//                 )}
//               </button>

//               <button
//                 onClick={handleCheckOut}
//                 className="attendance-btn attendance-btn-danger"
//                 disabled={!selectedBranch || !deviceInfo || loading}
//               >
//                 {loading ? (
//                   <>
//                     <div className="attendance-btn-spinner"></div>
//                     <span>{t('loading')}</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="attendance-btn-icon"> <i className="fas fa-sign-out-alt me-2"></i></span>
//                     <span>{t('checkOut')}</span>
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Footer */}
//             <div className="attendance-card-footer">
//               <div className="attendance-footer-text">
//                 <span>
//                   {/* 🛡️ */}
//                    <i className="fas fa-shield-alt me-1"></i></span>
//                 <span>{t('secureMultiLayerVerification')}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bootstrap Toast Notification */}
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={hideToast}
//         onConfirm={toast.onConfirm}
// confirmText={toast.confirmText}
// cancelText={toast.cancelText}
//       />
//     </>

//   );
  
// }

// export default Attendance;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDuration } from '../helpers/formatDuration';
import { getDeviceInfo } from "../helpers/deviceInfo";
// API Services
import { checkIn, checkOut } from '../services/attendance.api';
import { getMyBranches } from '../services/branch.api';
import webAuthnService from '../services/webauthn.service';

// Components
import Toast from '../components/ui/Toast';

// Assets
import logo from '../assets/logolgoin - nav.png';

// Styles
import '../style/attendance-modern.css';

function Attendance() {
  // ===============================
  // State
  // ===============================
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
    onConfirm: null,
    confirmText: '',
    cancelText: '',
  });

  // ===============================
  // Toast Helpers
  // ===============================
  const showToast = (message, type = 'success', options = {}) => {
    setToast({
      show: true,
      message,
      type,
      ...options,
    });
  };

  const hideToast = () => {
    setToast({
      show: false,
      message: '',
      type: 'success',
      onConfirm: null,
      confirmText: '',
      cancelText: '',
    });
  };

  // ===============================
  // Device Helpers
  // ===============================
  const generateBrowserFingerprint = async (deviceData) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(
      `${deviceData.userAgent}-${deviceData.language}-${deviceData.canvasFingerprint}-${deviceData.colorDepth}`
    );
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const generateDeviceInfo = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);


      const parsedDevice = getDeviceInfo();


      const deviceData = {
        userAgent: navigator.userAgent,
        platform: parsedDevice.fullName,
        // platform: navigator.platform,
        language: navigator.language,
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        deviceMemory: navigator.deviceMemory || 0,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvasFingerprint: canvas.toDataURL(),
      };

      let deviceId = localStorage.getItem('deviceId');

      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('deviceId', deviceId);
      }

      const browserFingerprint = await generateBrowserFingerprint(deviceData);

      return {
        deviceId,
        browserFingerprint,
        userAgent: navigator.userAgent,
         platform: parsedDevice.fullName,
        // platform: navigator.platform,
      };
    } catch (error) {
      console.error('Error generating device info:', error);
      return null;
    }
  };

  // Initialize
  useEffect(() => {
    const initializeDevice = async () => {
      setLoading(true);
      try {
        const info = await generateDeviceInfo();
        setDeviceInfo(info);

        const res = await getMyBranches();
        setBranches(res.data.data || []);
      } catch (err) {
        console.error('Initialization error:', err);
        showToast(t('error'), 'error');
      } finally {
        setLoading(false);
      }
    };

    initializeDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // ===============================
  // Geolocation
  // ===============================
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(t('geolocationNotSupported')));
      }
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }),
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  // ===============================
  // Attendance Actions
  // ===============================

  // Builds the success toast message from a backend response,
  // appending late/early-leave duration info when present.
  const buildSuccessMessage = (response, action) => {
    let successMessage = response.data.message || t(`${action}Success`);

    if (response.data.lateMinutes > 0) {
      successMessage += ` (${t('late')} ${formatDuration(response.data.lateMinutes, t)})`;
    }

    if (response.data.earlyLeaveMinutes > 0) {
      successMessage += ` (${t('earlyLeave')} ${formatDuration(response.data.earlyLeaveMinutes, t)})`;
    }

    return successMessage;
  };

  // WEBAUTHN_REGISTRATION_REQUIRED → register() → retry request
  const handleWebAuthnRegistration = async (requestData, apiFunction, action) => {
    try {
      await webAuthnService.register(deviceInfo.deviceId);

      const retryResponse = await apiFunction(requestData);
      const successMessage = buildSuccessMessage(retryResponse, action);

      showToast(successMessage, 'success');
    } catch (registerError) {
      showToast(
        registerError.response?.data?.message || t('biometricsEnableFailed'),
        'error'
      );
    }
  };

  // WEBAUTHN_AUTH_REQUIRED → authenticate() → retry request
  const handleWebAuthnAuthentication = async (requestData, apiFunction, action) => {
    try {
      await webAuthnService.authenticate(deviceInfo.deviceId);

      const retryResponse = await apiFunction(requestData);
      const successMessage = buildSuccessMessage(retryResponse, action);

      showToast(successMessage, 'success');
    } catch (authError) {
      showToast(
        authError.response?.data?.message || t('biometricVerificationFailed'),
        'error'
      );
    }
  };

  // Re-submits the action with force:true after the user confirms
  // overriding their currently open attendance at another branch.
  const confirmForcedAction = async (requestData, apiFunction, action) => {
    setLoading(true);
    try {
      const response = await apiFunction({ ...requestData, force: true });
      const successMessage = buildSuccessMessage(response, action);

      hideToast();

      setTimeout(() => {
        showToast(successMessage, 'success');
      }, 50);
    } catch (err2) {
      showToast(err2.response?.data?.message || t('error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmationToast = (err, requestData, apiFunction, action) => {
    showToast(
      `You are currently checked in at "${err.response.data.previousBranch.name}". Continuing will invalidate that attendance and create a new check-in here.`,
      'warning',
      {
        confirmText: 'Continue',
        cancelText: 'Cancel',
        onConfirm: () => confirmForcedAction(requestData, apiFunction, action),
      }
    );
  };

  // Routes a failed attendance request to the right recovery flow.
  const handleActionError = async (err, requestData, apiFunction, action) => {
    const errorCode = err.response?.data?.code;

    if (errorCode === 'WEBAUTHN_REGISTRATION_REQUIRED') {
      await handleWebAuthnRegistration(requestData, apiFunction, action);
      return;
    }

    if (errorCode === 'WEBAUTHN_AUTH_REQUIRED') {
      await handleWebAuthnAuthentication(requestData, apiFunction, action);
      return;
    }

    if (err.response?.data?.requiresConfirmation) {
      showConfirmationToast(err, requestData, apiFunction, action);
      return;
    }

    const errorMessage = err.response?.data?.isNewDevice
      ? t('devicePending')
      : err.response?.data?.message || t('error');

    showToast(errorMessage, 'error');
  };

  const performAction = async (action, apiFunction) => {
    if (!selectedBranch || !deviceInfo) {
      showToast(t('error'), 'warning');
      return;
    }

    setLoading(true);
    let requestData;

    try {
      const { lat, lng, accuracy } = await getLocation();

      requestData = {
        lat,
        lng,
        accuracy,
        branchId: selectedBranch,
        deviceInfo,
      };

      const response = await apiFunction(requestData);
      showToast(buildSuccessMessage(response, action), 'success');
    } catch (err) {
      console.error(`${action} error:`, err);
      await handleActionError(err, requestData, apiFunction, action);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = () => performAction('checkIn', checkIn);
  const handleCheckOut = () => performAction('checkOut', checkOut);

  // ===============================
  // UI
  // ===============================

  // Loading screen
  if (loading && !deviceInfo) {
    return (
      <div className="attendance-loading-screen">
        <div className="attendance-loading-content">
          <div className="attendance-spinner"></div>
          <p className="attendance-loading-text">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="attendance-main-container">
        <div className="attendance-card">
          {/* Header */}
          <div className="attendance-card-header">
            <div className="attendance-logo">
              <img src={logo} alt="WorkGuard" />
            </div>
            <h2 className="attendance-card-title ">{t('attendance.attendance')}</h2>
          </div>

          {/* Body */}
          <div className="attendance-card-body">
            {/* Device Info Badge */}
            {deviceInfo && (
              <div className="attendance-device-badge">
                <span className="attendance-device-icon">📱</span>
                <span className="attendance-device-text">
                  {t('deviceId')}: {deviceInfo.deviceId.substring(0, 12)}...
                </span>
              </div>
            )}

            {/* Branch Selection */}
            <div className="attendance-form-group">
              <label className="attendance-form-label">
                <span>🏢</span>
                <span>{t('selectBranch')}</span>
              </label>
              <select
                className="attendance-form-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={loading}
              >
                <option value="">{t('selectBranch')}</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="attendance-actions">
              <button
                onClick={handleCheckIn}
                className="attendance-btn attendance-btn-success"
                disabled={!selectedBranch || !deviceInfo || loading}
              >
                {loading ? (
                  <>
                    <div className="attendance-btn-spinner"></div>
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <span className="attendance-btn-icon">
                      {' '}
                      <i className="fas fa-sign-in-alt me-2"></i>
                    </span>
                    <span>{t('checkIn')}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCheckOut}
                className="attendance-btn attendance-btn-danger"
                disabled={!selectedBranch || !deviceInfo || loading}
              >
                {loading ? (
                  <>
                    <div className="attendance-btn-spinner"></div>
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <span className="attendance-btn-icon">
                      {' '}
                      <i className="fas fa-sign-out-alt me-2"></i>
                    </span>
                    <span>{t('checkOut')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="attendance-card-footer">
              <div className="attendance-footer-text">
                <span>
                  <i className="fas fa-shield-alt me-1"></i>
                </span>
                <span>{t('secureMultiLayerVerification')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Toast Notification */}
      <Toast
        key={`${toast.type}-${toast.onConfirm ? "confirm" : "normal"}`}
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
        onConfirm={toast.onConfirm}
        confirmText={toast.confirmText}
        cancelText={toast.cancelText}
      />
    </>
  );
}

export default Attendance;