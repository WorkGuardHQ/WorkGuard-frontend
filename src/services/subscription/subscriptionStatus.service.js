
// /services/subscription/subscriptionStatus.service.js
import api from '../../helpers/api';

/**
 * Subscription Banner
 * GET /api/subscription-status
 */
export const getSubscriptionBanner = () =>
  api.get('/subscription-status');