import axios from 'axios';
import { env } from '@/config/env';

const ADMIN_TOKEN_KEY = 'prepjee_admin_access_token';
const ADMIN_PROFILE_KEY = 'prepjee_admin_profile';

export const adminApi = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_PROFILE_KEY);
      if (!window.location.pathname.endsWith('/admin/login')) window.location.href = '/admin/login';
    }
    const apiError = error.response?.data?.error;
    return Promise.reject(new Error(apiError?.message ?? error.message ?? 'Admin request failed'));
  },
);

const dataOf = (response) => response.data.data;

export async function adminLogin(email, password) {
  const result = dataOf(await adminApi.post('/admin/auth/login', { email, password }));
  localStorage.setItem(ADMIN_TOKEN_KEY, result.accessToken);
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(result.admin));
  return result.admin;
}

export function getStoredAdmin() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const profile = localStorage.getItem(ADMIN_PROFILE_KEY);
  if (!token || !profile) return null;
  try {
    return JSON.parse(profile);
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_PROFILE_KEY);
}

export async function listResource(resource, params = {}) {
  return dataOf(await adminApi.get(`/${resource}`, { params }));
}

export async function listAdminResource(resource, params = {}) {
  const response = await adminApi.get(`/admin/${resource}`, { params });
  return { data: response.data.data, meta: response.data.meta };
}

export async function createAdminResource(resource, fields) {
  return dataOf(await adminApi.post(`/admin/${resource}`, fields));
}

export async function updateAdminResource(resource, id, fields) {
  return dataOf(await adminApi.put(`/admin/${resource}/${id}`, fields));
}

export async function deleteAdminResource(resource, id) {
  return dataOf(await adminApi.delete(`/admin/${resource}/${id}`));
}

export async function getDashboardData() {
  const [stats, questions, chapters] = await Promise.all([
    adminApi.get('/admin/dashboard/stats'),
    adminApi.get('/admin/dashboard/questions/most-attempted', { params: { limit: 10 } }),
    adminApi.get('/admin/dashboard/chapters/weak', { params: { limit: 10, minAttempts: 1 } }),
  ]);
  return {
    stats: dataOf(stats),
    questions: dataOf(questions),
    chapters: dataOf(chapters),
  };
}

export async function setQuestionPublished(id, published) {
  return dataOf(await adminApi.post(`/admin/questions/${id}/${published ? 'publish' : 'unpublish'}`));
}

export async function setUserSuspended(id, suspended) {
  return dataOf(await adminApi.post(`/admin/users/${id}/${suspended ? 'suspend' : 'unsuspend'}`));
}

export async function listOptions(questionId) {
  return dataOf(await adminApi.get(`/admin/questions/${questionId}/options`));
}

export async function createOption(questionId, fields) {
  return dataOf(await adminApi.post(`/admin/questions/${questionId}/options`, fields));
}

export async function updateOption(id, fields) {
  return dataOf(await adminApi.put(`/admin/options/${id}`, fields));
}

export async function deleteOption(id) {
  return dataOf(await adminApi.delete(`/admin/options/${id}`));
}

export async function getSolution(questionId) {
  try {
    return dataOf(await adminApi.get(`/admin/questions/${questionId}/solution`));
  } catch (error) {
    if (error.message === 'Solution not found') return null;
    throw error;
  }
}

export async function saveSolution(questionId, fields, exists) {
  const method = exists ? 'put' : 'post';
  return dataOf(await adminApi[method](`/admin/questions/${questionId}/solution`, fields));
}

export async function deleteSolution(questionId) {
  return dataOf(await adminApi.delete(`/admin/questions/${questionId}/solution`));
}
