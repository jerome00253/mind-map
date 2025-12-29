import axios from 'axios'
import Vue from 'vue'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('mindmap_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Intercepteur pour gérer les erreurs (ex: token expiré)
api.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response && error.response.status === 401) {
    // Token expiré ou invalide
    localStorage.removeItem('mindmap_token')
    localStorage.removeItem('mindmap_user')
    // Rediriger vers login si nécessaire ou émettre un événement
    // window.location.href = '/#/login' // À gérer proprement avec le routeur
  }
  return Promise.reject(error)
})

export default {
  // Auth
  register(data) {
    return api.post('/auth/register', data)
  },
  login(data) {
    return api.post('/auth/login', data)
  },
  getMe() {
    return api.get('/auth/me')
  },

  // Mind Maps
  getMyMaps() {
    return api.get('/mindmaps')
  },
  getMindMap(uuid) {
    return api.get(`/mindmaps/${uuid}`)
  },
  createMindMap(data) {
    return api.post('/mindmaps', data)
  },
  updateMindMap(uuid, data) {
    return api.put(`/mindmaps/${uuid}`, data)
  },
  deleteMindMap(uuid) {
    return api.delete(`/mindmaps/${uuid}`)
  },
  
  // Share
  // Share
  shareMindMap(uuid, isPublic) {
    return api.post(`/mindmaps/${uuid}/share`, { isPublic })
  },
  unshareMindMap(uuid) {
    return api.delete(`/mindmaps/${uuid}/share`)
  },
  getSharedMindMap(token) {
    return api.get(`/share/${token}`)
  },
  // Internal Sharing Permissions
  getMapPermissions(uuid) {
    return api.get(`/mindmaps/${uuid}/permissions`)
  },
  addMapPermission(uuid, username, permission = 'view') {
    return api.post(`/mindmaps/${uuid}/permissions`, { username, permission })
  },
  removeMapPermission(uuid, userId) {
    return api.delete(`/mindmaps/${uuid}/permissions/${userId}`)
  },
  unshareMindMap(uuid) {
    return api.delete(`/mindmaps/${uuid}/share`)
  },
  getSharedMindMap(token) {
    return api.get(`/share/${token}`)
  },

  // Users
  searchUsers(query) {
    return api.get(`/users/search?q=${query}`)
  },
  // Users (Admin)
  getUsers() {
    return api.get('/users')
  },
  createUser(data) {
    return api.post('/users', data)
  },
  updateUser(id, data) {
    return api.put(`/users/${id}`, data)
  },
  deleteUser(id) {
    return api.delete(`/users/${id}`)
  }
}
