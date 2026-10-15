const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: any;
  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('jb_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.headers.get('content-type')?.includes('text/csv')) {
    const text = await response.text();
    return text as unknown as T;
  }

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.message || 'Something went wrong. Please try again.',
      response.status,
      data.errors
    );
  }

  return data.data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: { name: string; email: string; password: string; phone?: string }) =>
    request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProfile: () => request<any>('/auth/profile'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAddresses: () => request<any[]>('/auth/addresses'),
  addAddress: (address: any) =>
    request<any>('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),
  updateAddress: (id: string, address: any) =>
    request<any>(`/auth/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }),
  deleteAddress: (id: string) =>
    request<void>(`/auth/addresses/${id}`, {
      method: 'DELETE',
    }),

  // Menu
  getCategories: (includeInactive = false) =>
    request<any[]>(`/menu/categories${includeInactive ? '?includeInactive=true' : ''}`),
  createCategory: (data: any) =>
    request<any>('/menu/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: any) =>
    request<any>(`/menu/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    request<void>(`/menu/categories/${id}`, {
      method: 'DELETE',
    }),

  getMenuItems: (params?: Record<string, string | boolean | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) searchParams.append(k, String(v));
      });
    }
    const query = searchParams.toString();
    return request<any[]>(`/menu/items${query ? `?${query}` : ''}`);
  },
  getMenuItemById: (id: string) => request<any>(`/menu/items/${id}`),
  createMenuItem: (data: any) =>
    request<any>('/menu/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMenuItem: (id: string, data: any) =>
    request<any>(`/menu/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleMenuItemAvailability: (id: string) =>
    request<any>(`/menu/items/${id}/availability`, {
      method: 'PATCH',
    }),
  deleteMenuItem: (id: string) =>
    request<void>(`/menu/items/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  calculateCart: (payload: { items: any[]; couponCode?: string; orderType?: string }) =>
    request<any>('/orders/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  createOrder: (payload: any) =>
    request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getCustomerOrders: () => request<any[]>('/orders/customer'),
  getOrderById: (id: string) => request<any>(`/orders/${id}`),

  getAdminOrders: (params?: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) searchParams.append(k, String(v));
      });
    }
    const query = searchParams.toString();
    return request<{ totalCount: number; orders: any[] }>(`/orders/admin/list${query ? `?${query}` : ''}`);
  },

  updateOrderStatus: (id: string, status: string, note?: string) =>
    request<any>(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  updatePaymentStatus: (id: string, paymentStatus: string) =>
    request<any>(`/orders/admin/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    }),

  // Payments
  createPaymentOrder: (orderId: string) =>
    request<any>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),

  verifyPayment: (data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    request<any>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Coupons
  validateCoupon: (code: string, subtotalPaise: number) =>
    request<any>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotalPaise }),
    }),
  getPublicCoupons: () => request<any[]>('/coupons/public'),
  getAdminCoupons: () => request<any[]>('/coupons/admin'),
  createCoupon: (data: any) =>
    request<any>('/coupons/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCoupon: (id: string, data: any) =>
    request<any>(`/coupons/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCoupon: (id: string) =>
    request<void>(`/coupons/admin/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getPublicSettings: () => request<any>('/settings/public'),
  getAdminSettings: () => request<any>('/settings/admin'),
  updateSettings: (settings: Record<string, string>) =>
    request<any>('/settings/admin', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Reports
  getOverviewMetrics: () => request<any>('/reports/overview'),
  getSalesReport: (days = 30) => request<any>(`/reports/sales?days=${days}`),
  exportOrdersCSV: (days = 30) => request<string>(`/reports/export-csv?days=${days}`),

  // Customers
  getCustomers: (search?: string) =>
    request<any[]>(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getCustomerById: (id: string) => request<any>(`/customers/${id}`),

  // Favorites
  getFavorites: () => request<any[]>('/favorites'),
  toggleFavorite: (menuItemId: string) =>
    request<{ isFavorite: boolean }>('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ menuItemId }),
    }),

  // Website Images
  getPublicImages: (section?: string) =>
    request<WebsiteImageItem[]>(`/images/public${section ? `?section=${section}` : ''}`),
  getAdminImages: (section?: string) =>
    request<WebsiteImageItem[]>(`/images${section ? `?section=${section}` : ''}`),
  uploadImageFile: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ imageUrl: string; filename: string }>('/images/upload', {
      method: 'POST',
      body: formData,
    });
  },
  createWebsiteImage: (data: Partial<WebsiteImageItem>) =>
    request<WebsiteImageItem>('/images', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateWebsiteImage: (id: string, data: Partial<WebsiteImageItem>) =>
    request<WebsiteImageItem>(`/images/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  setDefaultWebsiteImage: (id: string) =>
    request<WebsiteImageItem>(`/images/${id}/default`, {
      method: 'PUT',
    }),
  reorderWebsiteImages: (items: { id: string; displayOrder: number; isDefault?: boolean }[]) =>
    request<void>('/images/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
  deleteWebsiteImage: (id: string) =>
    request<void>(`/images/${id}`, {
      method: 'DELETE',
    }),
};

export interface WebsiteImageItem {
  id: string;
  section: string;
  title: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder: number;
  isDefault: boolean;
  isEnabled: boolean;
  metadata?: string | null;
  createdAt: string;
  updatedAt: string;
}

