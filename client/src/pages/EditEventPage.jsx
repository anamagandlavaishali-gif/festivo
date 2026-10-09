import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Save,
} from 'lucide-react';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    maxParticipants: 100,
    registrationDeadline: '',
    status: 'Upcoming',
    image: '',
    prizes: '',
    requirements: '',
    tags: '',
    featured: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        if (res.data.success) {
          const ev = res.data.event;
          setFormData({
            title: ev.title || '',
            description: ev.description || '',
            category: ev.category || 'Technical',
            date: ev.date || '',
            startTime: ev.startTime || '',
            endTime: ev.endTime || '',
            venue: ev.venue || '',
            maxParticipants: ev.maxParticipants || 100,
            registrationDeadline: ev.registrationDeadline || '',
            status: ev.status || 'Upcoming',
            image: ev.image || '',
            prizes: ev.prizes || '',
            requirements: Array.isArray(ev.requirements) ? ev.requirements.join(', ') : '',
            tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : '',
            featured: Boolean(ev.featured),
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements
          ? formData.requirements.split(',').map((r) => r.trim()).filter(Boolean)
          : [],
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const res = await api.put(`/events/${id}`, payload);
      if (res.data.success) {
        setSuccess('Event changes successfully updated!');
        setTimeout(() => {
          navigate(`/events/${id}`);
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Edit Event Details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update date, venue, capacity limits, status, and guidelines for attendees.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-indigo-600 outline-none"
              >
                <option value="Technical">Technical</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshops">Workshops</option>
                <option value="Fests">Fests</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-indigo-600 outline-none"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Max Capacity *
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Start Time
              </label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                End Time
              </label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Venue Location *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registration Deadline *
              </label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link
              to={`/events/${id}`}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
