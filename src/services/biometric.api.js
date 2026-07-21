// src/services/biometric.api.js

import { apiPost } from '../helpers/api';

/* ======================================================
   WebAuthn - Registration
====================================================== */

/**
 * Generate registration options
 */
export const getRegistrationOptions = (deviceId) => {
  return apiPost('/biometrics/registration/options', {
    deviceId,
  });
};

/**
 * Verify registration
 */
export const verifyRegistration = ({
  deviceId,
  registrationResponse,
}) => {
  return apiPost('/biometrics/registration/verify', {
    deviceId,
    registrationResponse,
  });
};

/* ======================================================
   WebAuthn - Authentication
====================================================== */

/**
 * Generate authentication options
 */
export const getAuthenticationOptions = (deviceId) => {
  return apiPost('/biometrics/authentication/options', {
    deviceId,
  });
};

/**
 * Verify authentication
 */
export const verifyAuthentication = ({
  deviceId,
  authenticationResponse,
}) => {
  return apiPost('/biometrics/authentication/verify', {
    deviceId,
    authenticationResponse,
  });
};