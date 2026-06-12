import axios from 'axios';

export const api = axios.create({
  baseURL: '/infinity/auth',
  withCredentials: true,
});
