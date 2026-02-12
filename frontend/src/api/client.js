/**
 * API client for the Flask backend.
 * All functions return the Axios response data (JSON).
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

/** Initialise simulation with given parameters */
export async function initSimulation(ticker, period, interval) {
  const res = await api.post('/api/init', { ticker, period, interval });
  return res.data;
}

/** Advance one simulation step */
export async function stepSimulation() {
  const res = await api.post('/api/step');
  return res.data;
}

/** Run N steps in one call */
export async function autoStepSimulation(steps = 10) {
  const res = await api.post('/api/auto-step', { steps });
  return res.data;
}

/** Get current snapshot */
export async function getState() {
  const res = await api.get('/api/state');
  return res.data;
}
