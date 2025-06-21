import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  if (config.url?.startsWith("/admin") && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  return config;
});

// User APIs
export const getCourses = () => api.get("/courses/preview");
export const getCourse = (id: string) => api.get(`/courses/${id}`);
export const checkPurchase = (id: string) => api.get(`/courses/${id}/purchase`);
export const purchaseCourse = (id: string) =>
  api.post("/courses/purchase", { courseId: id });
export const getPurchases = () => api.get("/user/purchases");
export const signUp = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => api.post(`${import.meta.env.VITE_API_URL}/api/user/signup`, data);
export const signIn = (data: { email: string; password: string }) =>
  api.post(`${import.meta.env.VITE_API_URL}/api/user/signin`, data);
export const updateProfile = (data: {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}) => api.put("/user/profile", data);

// Admin APIs
export const adminSignUp = (data: { username: string; password: string }) =>
  api.post(`${import.meta.env.VITE_API_URL}/api/admin/signup`, data);
export const adminSignIn = (data: { username: string; password: string }) =>
  api.post(`${import.meta.env.VITE_API_URL}/api/admin/signin`, data);
export const getAdminCourses = () => api.get("/admin/courses");
export const createCourse = (data: {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
  category: string;
  level: string;
  videos: Array<{
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    order: number;
  }>;
}) => api.post("/admin/course", data);
export const updateCourse = (
  id: string,
  data: {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
    category: string;
    level: string;
    videos: Array<{
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
      order: number;
    }>;
  }
) => api.put("/admin/course", { courseId: id, ...data });
export const deleteCourse = (id: string) => api.delete(`/admin/course/${id}`);
