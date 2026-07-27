export class ApiError extends Error {
  constructor(message, { code = 'UNKNOWN_ERROR', status = 0, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Normalizes both backend `{success:false,error:{code,message,details}}`
// envelopes and raw network/timeout failures into one ApiError shape so every
// caller (React Query hooks, feature services) handles errors the same way.
export function toApiError(error) {
  const backendError = error?.response?.data?.error;
  if (backendError) {
    return new ApiError(backendError.message, {
      code: backendError.code,
      status: error.response.status,
      details: backendError.details,
    });
  }
  if (error?.request) {
    return new ApiError('Network error. Please check your connection and try again.', {
      code: 'NETWORK_ERROR',
    });
  }
  return new ApiError(error?.message || 'Something went wrong.', { code: 'UNKNOWN_ERROR' });
}
