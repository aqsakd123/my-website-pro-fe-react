import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
    (config) => {
        return config
    },
    (error) => {
        // RUN AGAIN, DEPENDING ON A VARIABLE STORED IN LOCAL STORAGE
        // Use header.common to stored a "FIREBASE" text to detect whether to shoot JWT.NO_FIREBASE_TOKEN
        return Promise.reject(error)
    }
)

export default axiosInstance;
