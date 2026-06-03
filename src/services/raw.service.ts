import axios from 'axios';
import { BASE_PATH } from '../clients/base';

export const rawClient = axios.create({
  baseURL: BASE_PATH,
  validateStatus: () => true
});
