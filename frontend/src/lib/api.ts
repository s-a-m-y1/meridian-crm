import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      return accessToken;
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  setAuthToken(token: string) {
    localStorage.setItem("access_token", token);
  }

  clearAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  // Auth
  async register(data: { email: string; name: string; password: string }) {
    const response = await this.client.post("/auth/register", data);
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post("/auth/login", data);
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    return response.data;
  }

  async logout() {
    const refreshToken = localStorage.getItem("refresh_token");
    await this.client.post("/auth/logout", { refreshToken });
    this.clearAuth();
  }

  async forgotPassword(email: string) {
    return this.client.post("/auth/forgot-password", { email });
  }

  async resetPassword(token: string, password: string) {
    return this.client.post("/auth/reset-password", { token, password });
  }

  async me() {
    return this.client.get("/auth/me");
  }

  // Customers
  async getCustomers(params?: Record<string, unknown>) {
    return this.client.get("/customers", { params });
  }

  async getCustomer(id: string) {
    return this.client.get(`/customers/${id}`);
  }

  async createCustomer(data: unknown) {
    return this.client.post("/customers", data);
  }

  async updateCustomer(id: string, data: unknown) {
    return this.client.patch(`/customers/${id}`, data);
  }

  async deleteCustomer(id: string) {
    return this.client.delete(`/customers/${id}`);
  }

  // Leads
  async getLeads(params?: Record<string, unknown>) {
    return this.client.get("/leads", { params });
  }

  async getLead(id: string) {
    return this.client.get(`/leads/${id}`);
  }

  async createLead(data: unknown) {
    return this.client.post("/leads", data);
  }

  async updateLead(id: string, data: unknown) {
    return this.client.patch(`/leads/${id}`, data);
  }

  async deleteLead(id: string) {
    return this.client.delete(`/leads/${id}`);
  }

  // Properties
  async getProperties(params?: Record<string, unknown>) {
    return this.client.get("/properties", { params });
  }

  async getProperty(id: string) {
    return this.client.get(`/properties/${id}`);
  }

  async createProperty(data: unknown) {
    return this.client.post("/properties", data);
  }

  async updateProperty(id: string, data: unknown) {
    return this.client.patch(`/properties/${id}`, data);
  }

  async deleteProperty(id: string) {
    return this.client.delete(`/properties/${id}`);
  }

  // Deals
  async getDeals(params?: Record<string, unknown>) {
    return this.client.get("/deals", { params });
  }

  async getDeal(id: string) {
    return this.client.get(`/deals/${id}`);
  }

  async createDeal(data: unknown) {
    return this.client.post("/deals", data);
  }

  async updateDeal(id: string, data: unknown) {
    return this.client.patch(`/deals/${id}`, data);
  }

  async deleteDeal(id: string) {
    return this.client.delete(`/deals/${id}`);
  }

  // Tasks
  async getTasks(params?: Record<string, unknown>) {
    return this.client.get("/tasks", { params });
  }

  async getTask(id: string) {
    return this.client.get(`/tasks/${id}`);
  }

  async createTask(data: unknown) {
    return this.client.post("/tasks", data);
  }

  async updateTask(id: string, data: unknown) {
    return this.client.patch(`/tasks/${id}`, data);
  }

  async deleteTask(id: string) {
    return this.client.delete(`/tasks/${id}`);
  }

  // Activities
  async getActivities(params?: Record<string, unknown>) {
    return this.client.get("/activities", { params });
  }

  async createActivity(data: unknown) {
    return this.client.post("/activities", data);
  }

  // Notes
  async getNotes(params?: Record<string, unknown>) {
    return this.client.get("/notes", { params });
  }

  async getNote(id: string) {
    return this.client.get(`/notes/${id}`);
  }

  async createNote(data: unknown) {
    return this.client.post("/notes", data);
  }

  async updateNote(id: string, data: unknown) {
    return this.client.patch(`/notes/${id}`, data);
  }

  async deleteNote(id: string) {
    return this.client.delete(`/notes/${id}`);
  }
}

export const api = new ApiClient();