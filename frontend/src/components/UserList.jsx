"use client";
import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import UserCard from './UserCard';
import Pagination from './Pagination';

export default function UserList({ onEditUser, onVerifyUser, refreshTrigger }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 5
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    search: '',
    verified: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
    
      const cleanFilters = {};
      cleanFilters.page = filters.page;
      cleanFilters.limit = filters.limit;
      
      if (filters.search && filters.search.trim()) {
        cleanFilters.search = filters.search.trim();
      }
      
      if (filters.verified !== '') {
        cleanFilters.verified = filters.verified;
      }
      
      const response = await apiService.getUsers(cleanFilters);
      
      
      setUsers(response.data.users || []);
      
      let paginationData = response.data.pagination || {};
      
      if (response.data.meta) {
        paginationData = response.data.meta;
      } else if (response.data.pageInfo) {
        paginationData = response.data.pageInfo;
      }
      
      setPagination({
        page: paginationData.page || paginationData.currentPage || filters.page,
        pages: paginationData.pages || paginationData.totalPages || Math.ceil((paginationData.total || 0) / filters.limit),
        total: paginationData.total || paginationData.totalCount || 0,
        limit: paginationData.limit || paginationData.pageSize || filters.limit
      });
      
      setError('');
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, refreshTrigger]);

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterVerified = (e) => {
    setFilters(prev => ({ ...prev, verified: e.target.value, page: 1 }));
  };

  const handlePageChange = (page) => {
    console.log('Page change requested:', page);
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiService.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={handleSearch}
              placeholder="Search by name, email, or phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
            <select
              value={filters.verified}
              onChange={handleFilterVerified}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onEdit={onEditUser}
            onDelete={handleDeleteUser}
            onVerify={onVerifyUser}
          />
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}

      {pagination.pages > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}