import * as amplitude from '@amplitude/analytics-browser';
import { env } from '@/config/env';

let initialized = false;

function ensureInitialized() {
  if (initialized || typeof window === 'undefined' || !env.amplitudeKey) return;
  amplitude.init(env.amplitudeKey, {
    defaultTracking: { sessions: true, pageViews: false, formInteractions: false, fileDownloads: false },
  });
  initialized = true;
}

export function track(eventName, properties) {
  ensureInitialized();
  if (!initialized) return;
  amplitude.track(eventName, properties);
}

export function identify(userId, properties = {}) {
  ensureInitialized();
  if (!initialized) return;
  amplitude.setUserId(userId);
  if (Object.keys(properties).length > 0) {
    const identifyEvent = new amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => identifyEvent.set(key, value));
    amplitude.identify(identifyEvent);
  }
}

export function setUserProperties(properties) {
  ensureInitialized();
  if (!initialized) return;
  const identifyEvent = new amplitude.Identify();
  Object.entries(properties).forEach(([key, value]) => identifyEvent.set(key, value));
  amplitude.identify(identifyEvent);
}

export function reset() {
  if (!initialized) return;
  amplitude.reset();
}

export const analytics = { track, identify, setUserProperties, reset };
