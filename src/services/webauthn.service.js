//webauthn.service.js

// Attendance.jsx
//         │
//         ▼
// webauthn.service.js
//         │
//         ▼
// biometric.api.js
//         │
//         ▼
// Backend


// register(deviceId)

// authenticate(deviceId)

// isSupported()

// isPlatformAuthenticatorAvailable()


// src/services/webauthn.service.js

import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';

import {
  getRegistrationOptions,
  verifyRegistration,
  getAuthenticationOptions,
  verifyAuthentication,
} from './biometric.api';

class WebAuthnService {
  /**
   * هل المتصفح بيدعم WebAuthn؟
   */
  isSupported() {
    return browserSupportsWebAuthn();
  }

  /**
   * هل الجهاز فيه Platform Authenticator؟
   * (Face ID / Touch ID / Windows Hello ...)
   */
  async isPlatformAuthenticatorAvailable() {
    try {
      return await platformAuthenticatorIsAvailable();
    } catch {
      return false;
    }
  }

  /**
   * Register current device
   */
  async register(deviceId) {
    if (!deviceId) {
      throw new Error('deviceId is required');
    }

    // 1- Get options from backend
    const { data } = await getRegistrationOptions(deviceId);

    // 2- Browser WebAuthn ceremony
    const registrationResponse =
      await startRegistration({
        optionsJSON: data.options,
      });

    // 3- Verify with backend
    const result = await verifyRegistration({
      deviceId,
      registrationResponse,
    });

    return result.data;
  }

  /**
   * Authenticate current device
   */
  async authenticate(deviceId) {
    if (!deviceId) {
      throw new Error('deviceId is required');
    }

    // 1- Get options
    const { data } = await getAuthenticationOptions(deviceId);

    // 2- Browser WebAuthn ceremony
    const authenticationResponse =
      await startAuthentication({
        optionsJSON: data.options,
      });

    // 3- Verify
    const result = await verifyAuthentication({
      deviceId,
      authenticationResponse,
    });

    return result.data;
  }
}

export default new WebAuthnService();
