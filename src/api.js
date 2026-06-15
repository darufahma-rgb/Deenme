export const getToken = () => sessionStorage.getItem('dm-token');
export const setToken = (t) => sessionStorage.setItem('dm-token', t);
export const clearToken = () => sessionStorage.removeItem('dm-token');

export async function serverFetch(path, options = {}) {
  const token = getToken();
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-session-token': token } : {}),
      ...(options.headers || {}),
    },
  });
}
