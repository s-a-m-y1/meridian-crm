import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Remove empty-string fields from payloads: the backend validates with
// class-validator where "" fails @IsEmail/@IsPhoneNumber instead of being
// treated as "not provided" — this was silently breaking create forms.
function stripEmptyStrings(data: unknown): unknown {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return data;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    if (v === "") continue;
    out[k] = v;
  }
  return out;
}

// Extract a human-readable message from an API error (validation details included).
export function apiErrorMessage(err: unknown, fallback: string): string {
  const server = (err as { response?: { data?: { message?: string; errors?: string[] } } })
    ?.response?.data;
  if (Array.isArray(server?.errors) && server!.errors!.length > 0) {
    return server!.errors!.join(" • ");
  }
  return server?.message || fallback;
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: "/api",
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
        if (config.data && (config.method === "post" || config.method === "patch")) {
          config.data = stripEmptyStrings(config.data);
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
              document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
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
        "/api/auth/refresh",
        { refreshToken },
        { withCredentials: true }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      
      // Also set cookies for middleware — persistent for the WHOLE refresh
      // session (30d): a 24h access-cookie TTL used to boot users to /login
      // after a day although the backend session was still valid.
      document.cookie = `access_token=${accessToken}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=2592000; SameSite=Lax`;
      
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
    document.cookie = `access_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
  }

  clearAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }

  // Auth
  async register(data: { email: string; name: string; password: string }) {
    const response = await this.client.post("/auth/register", data);
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    document.cookie = `access_token=${accessToken}; path=/; max-age=2592000; SameSite=Lax`;
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=2592000; SameSite=Lax; HttpOnly`;
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post("/auth/login", data);
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    document.cookie = `access_token=${accessToken}; path=/; max-age=2592000; SameSite=Lax`;
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=2592000; SameSite=Lax; HttpOnly`;
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

  // Settings / account management
  async updateProfile(data: { name: string }) {
    return this.client.patch("/users/me", data);
  }

  async getCurrentOrganization() {
    return this.client.get("/organizations/current");
  }

  async updateCurrentOrganization(data: { name: string }) {
    return this.client.patch("/organizations/current", data);
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.client.patch("/auth/change-password", data);
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

  async getActivity(id: string) {
    return this.client.get(`/activities/${id}`);
  }

  async createActivity(data: unknown) {
    return this.client.post("/activities", data);
  }

  async deleteActivity(id: string) {
    return this.client.delete(`/activities/${id}`);
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

  // Files
  async getFiles(params?: Record<string, unknown>) {
    return this.client.get("/files", { params });
  }

  async getFile(id: string) {
    return this.client.get(`/files/${id}`);
  }

  async presignUpload(data: unknown) {
    return this.client.post("/files/presign", data);
  }

  async confirmUpload(data: unknown) {
    return this.client.post("/files/confirm", data);
  }

  async deleteFile(id: string) {
    return this.client.delete(`/files/${id}`);
  }

  // Security
  async checkPasswordStrength(password: string) {
    return this.client.post("/security/password/check", { password });
  }

  async getPasswordRequirements() {
    return this.client.get("/security/password/requirements");
  }

  async runSecurityAudit() {
    return this.client.post("/security/audit/scan");
  }

  async getSecurityAuditReport() {
    return this.client.get("/security/audit/report");
  }

  // AI
  async aiChat(data: { message: string; conversationId?: string }) {
    return this.client.post("/ai/chat", data);
  }

  async aiScoreLead(leadId: string) {
    return this.client.post("/ai/features/score_lead", { leadId });
  }

  async aiMatchProperties(leadId: string) {
    return this.client.post("/ai/features/match_properties", { leadId });
  }

  async aiForecastDeal(dealId: string) {
    return this.client.post("/ai/features/forecast_deal", { dealId });
  }

  async aiGenerateFollowUp(leadId: string, channel: 'email' | 'whatsapp' | 'sms' = 'email') {
    return this.client.post("/ai/features/follow_up", { leadId, channel });
  }

  async aiGetBriefing() {
    return this.client.get("/ai/briefing");
  }

  async aiGetAnalytics(query: string) {
    return this.client.post("/ai/analytics", { query });
  }

  async aiGetNeglectedLeads(daysThreshold?: number) {
    return this.client.get("/ai/neglected-leads", { params: { daysThreshold } });
  }

  // Dashboard
  async getDashboardStats() {
    return this.client.get("/dashboard/stats");
  }

  async getRecentLeads(limit?: number) {
    return this.client.get("/dashboard/leads/recent", { params: { limit } });
  }

  async getUpcomingTasks(limit?: number) {
    return this.client.get("/dashboard/tasks/upcoming", { params: { limit } });
  }

  async getRecentActivities(limit?: number) {
    return this.client.get("/dashboard/activities/recent", { params: { limit } });
  }

  async getPipeline() {
    return this.client.get("/dashboard/pipeline");
  }

  async getSalesAnalytics() {
    return this.client.get("/dashboard/analytics/sales");
  }

  async getConversionMetrics(period?: string) {
    return this.client.get("/dashboard/analytics/conversion", { params: { period } });
  }

  async getRevenueAnalytics(period?: string) {
    return this.client.get("/dashboard/analytics/revenue", { params: { period } });
  }

  async getTeamPerformance() {
    return this.client.get("/dashboard/analytics/team-performance");
  }
}

export const api = new ApiClient();
