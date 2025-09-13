const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      console.log(data,"data")
      if (!data.success) {
        throw new Error(data.error ||data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }

  // User CRUD operations
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async verifyUser(id, otp) {
    return this.request(`/users/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ otp }),
    });
  }
}

export const apiService = new ApiService();