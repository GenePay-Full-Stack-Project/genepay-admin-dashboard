import { getEnv } from "./config/env";

const { VITE_API_BASE } = getEnv();


const API_BASE = (VITE_API_BASE || 'http://localhost:8080').replace(/\/$/, '')
// Backend uses context-path /api/v1 (see application.yml). Ensure requests include it.
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1'
const BASE = `${API_BASE}${API_PREFIX}`

async function request(path, { method = 'GET', body = null, token = null } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let json
  try {
    json = await res.json()
  } catch (e) {
    throw new Error('Invalid JSON response from server')
  }

  // ApiResponse wrapper expected: { success, message, data }
  if (!res.ok) {
    const msg = json?.message || json?.error || 'API request failed'
    const err = new Error(msg)
    err.status = res.status
    err.payload = json
    throw err
  }

  // return inner data when available
  return json?.data ?? json
}

export async function loginAdmin(credentials) {
  return request('/admin/login', { method: 'POST', body: credentials })
}

export async function getDashboard(token) {
  return request('/admin/dashboard', { method: 'GET', token })
}

export async function getAllUsers(token) {
  return request('/admin/users', { method: 'GET', token })
}

export async function getAllMerchants(token) {
  return request('/admin/merchants', { method: 'GET', token })
}

export async function getAllTransactions(token) {
  return request('/admin/transactions', { method: 'GET', token })
}

export async function getPlatformBalance(token) {
  return request('/platform/balance', { method: 'GET', token })
}

export async function getUserTransactions(userId, token) {
  return request(`/payments/user/${userId}?page=0&size=1000`, { method: 'GET', token })
}

export async function getMerchantTransactions(merchantId, token) {
  return request(`/payments/merchant/${merchantId}?page=0&size=1000`, { method: 'GET', token })
}

export { API_BASE, API_PREFIX, BASE }

export default {
  API_BASE: API_BASE,
  API_PREFIX: API_PREFIX,
  BASE: BASE,
  loginAdmin,
  getDashboard,
  getAllUsers,
  getAllMerchants,
  getAllTransactions,
  getPlatformBalance,
  getUserTransactions,
  getMerchantTransactions,
}
