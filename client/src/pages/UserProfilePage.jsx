import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

const UserProfilePage = () => {
  const { user, updateUserProfile, changeUserPassword } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    collegeId: user?.collegeId || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (message) setMessage('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await updateUserProfile(profileData);
      if (res.success) {
        setMessage('Profile updated successfully!');
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving changes.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await changeUserPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (res.success) {
        setMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {profileData.avatar ? (
            <img
              src={profileData.avatar}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              {user?.name}
            </h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="pt-1 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                {user?.role}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">
                {user?.department || 'General'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex sm:flex-col gap-2">
          <button
            onClick={() => {
              setActiveTab('profile');
              setMessage('');
              setError('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('security');
              setMessage('');
              setError('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security & Password</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Personal & Academic Information
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Student ID / Roll No
                </label>
                <input
                  type="text"
                  name="collegeId"
                  value={profileData.collegeId}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={profileData.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Bio / Interests
              </label>
              <textarea
                name="bio"
                rows={3}
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Share your interests (e.g. AI research, competitive programming, sports)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Change Account Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Password (min 6 chars)
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 outline-none"
                required
                minLength={6}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
