import axios from 'axios';
import config from './config.js';

const instance = axios.create({
  baseURL: config.BASE_URL,
});

export default instance;
