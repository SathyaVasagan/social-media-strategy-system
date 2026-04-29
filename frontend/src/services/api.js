import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Attach token
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

// ✅ Handle expired token / auth errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or unauthorized. Logging out...");

      localStorage.removeItem("user");

      // 🔥 Force redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
