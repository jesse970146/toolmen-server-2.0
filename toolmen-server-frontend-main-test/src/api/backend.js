
import axios from 'axios';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export default axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});