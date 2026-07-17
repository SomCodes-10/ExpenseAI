import axios from 'axios';


const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem("token")
    if(token){
      config.headers.Authorization = `Bearer ${token}`
  }
   return config
    },
   ( error) =>{
    return Promise.reject(error)
   }
)

//Response interceptor
apiClient.interceptors.response.use(
  (response) =>{
    return response
  },
  (error) =>{
    if(error.response && error.response.status === 401){
      console.warn("Session expired or invalid token! Auto-logging out..")

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login"
    }
    return Promise.reject(error);
  }
)
export default apiClient;
