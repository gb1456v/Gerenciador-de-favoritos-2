const BASE_URL = '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Ocorreu um erro na requisição.');
  }
  if (response.status === 204) return {};
  return response.json();
};

const getToken = () => localStorage.getItem('authToken');

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  return handleResponse(response);
};

// AUTH
export const loginUser = (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
export const registerUser = (userInfo) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userInfo) });

// BOOKMARKS
export const getBookmarks = ({ search = '', categoryId = null }) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (categoryId) params.append('categoryId', categoryId);
  return apiFetch(`/bookmarks?${params.toString()}`);
};
export const addBookmark = (bookmark) => apiFetch('/bookmarks', { method: 'POST', body: JSON.stringify(bookmark) });
export const updateBookmark = (id, bookmark) => apiFetch(`/bookmarks/${id}`, { method: 'PUT', body: JSON.stringify(bookmark) });
export const deleteBookmark = (id) => apiFetch(`/bookmarks/${id}`, { method: 'DELETE' });

// CATEGORIES
export const getCategories = () => apiFetch('/categories');
export const addCategory = (category) => apiFetch('/categories', { method: 'POST', body: JSON.stringify(category) });
export const updateCategory = (id, category) => apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(category) });
export const deleteCategory = (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' });
