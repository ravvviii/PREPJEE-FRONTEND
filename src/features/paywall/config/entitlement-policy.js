export const ENTITLEMENT_ACCESS = {
  FREE: 'free',
  PREMIUM: 'premium',
  BUCKETED: 'bucketed',
};

export const FEATURES = {
  SUBJECTS: 'subjects',
  CLASSES: 'classes',
  CHAPTERS: 'chapters',
  CHAPTER_OVERVIEW: 'chapter_overview',
  PRACTICE: 'practice',
  QUESTION_EXPLANATION: 'question_explanation',
  PYQ_ACCESS: 'pyq_access',
  BOOKMARKS: 'bookmarks',
  PROGRESS_DASHBOARD: 'progress_dashboard',
  PREMIUM_ACCESS: 'premium_access',
};

// This is the single frontend switchboard for free/premium presentation.
// Backend authorization remains authoritative for protected data and actions.
export const ENTITLEMENT_POLICY = {
  [FEATURES.SUBJECTS]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.CLASSES]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.CHAPTERS]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.CHAPTER_OVERVIEW]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.PRACTICE]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.QUESTION_EXPLANATION]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.PYQ_ACCESS]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.BOOKMARKS]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.PROGRESS_DASHBOARD]: { access: ENTITLEMENT_ACCESS.FREE },
  [FEATURES.PREMIUM_ACCESS]: {
    access: ENTITLEMENT_ACCESS.PREMIUM,
    title: 'Unlock PrepJEE Premium',
    description: 'Practice without limits and get deeper insights into your preparation.',
  },
};

function isBucketIncluded(bucketId, ranges = []) {
  if (!Number.isInteger(bucketId)) return false;
  return ranges.some(([minimum, maximum]) => bucketId >= minimum && bucketId <= maximum);
}

export function hasActiveSubscription(user) {
  if (user?.subscription?.status !== 'active') return false;
  if (!user.subscription.expiresAt) return true;
  return new Date(user.subscription.expiresAt).getTime() > Date.now();
}

export function evaluateEntitlement(feature, user) {
  const policy = ENTITLEMENT_POLICY[feature] ?? { access: ENTITLEMENT_ACCESS.FREE };
  const subscribed = hasActiveSubscription(user);

  if (subscribed || policy.access === ENTITLEMENT_ACCESS.FREE) {
    return { allowed: true, reason: subscribed ? 'active_subscription' : 'free', policy };
  }

  if (policy.access === ENTITLEMENT_ACCESS.BUCKETED) {
    const locked = isBucketIncluded(user?.bucketId, policy.lockedBucketRanges);
    return {
      allowed: !locked,
      reason: locked ? 'bucket_requires_subscription' : 'bucket_has_free_access',
      policy,
    };
  }

  return { allowed: false, reason: 'subscription_required', policy };
}
