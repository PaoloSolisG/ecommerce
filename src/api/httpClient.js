import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://demov7.valeapp.pe/api",
  headers: {
    "x-api-key": "1OQFd2zAopdlkDow2PIutVn0ImD7Dtw9edmT1o7S"
  }
});

// Interceptor para simplificar la respuesta (como un middleware de Laravel)
httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default httpClient;
