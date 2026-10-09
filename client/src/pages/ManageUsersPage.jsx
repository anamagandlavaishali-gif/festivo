import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  UserX,
} from 'lucide-react';

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, { role: newRole });
      if (res.data.success) {
        setMessage(`User role successfully updated to "${newRole}".`);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleToggleActive = async (userId, currentActive) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, { isActive: !currentActive });
      if (res.data.success) {
        setMessage(`User account ${!currentActive ? 'activated' : 'deactivated'}.`);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change user status.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser?._id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setMessage(`User "${userName}" was deleted.`);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q) ||
      u.collegeId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Console</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Manage Campus Accounts
          </h1>
          <p className="text-xs text-slate-500">
            Control user permissions, reassign roles, toggle access, and review registered student profiles.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200">
          Total Users: <strong className="text-slate-900">{users.length}</strong>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, department, roll no..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-600"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {filtered.length} Users Found
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No user accounts found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-4">College ID & Dept</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] text-indigo-600 font-normal">
                                  (You)
                                </span>
                              )}
                            </p>
                            <span className="text-[10px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <p className="font-semibold text-slate-800">{u.collegeId || '—'}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{u.department || 'General'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={isSelf}
                          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-bold text-slate-700 outline-none focus:border-indigo-600 disabled:opacity-50"
                        >
                          <option value="student">student</option>
                          <option value="organizer">organizer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u._id, u.isActive !== false)}
                          disabled={isSelf}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition cursor-pointer disabled:opacity-50 ${
                            u.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.isActive !== false ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
