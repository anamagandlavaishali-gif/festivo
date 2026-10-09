import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

const presetImages = [
  { label: 'Technical Summit', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cultural / Concert', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports Arena', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI Workshop', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Carnival & Fest', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80' },
];

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: '',
    maxParticipants: 100,
    registrationDeadline: '',
    image: presetImages[0].url,
    prizes: '',
    requirements: '',
    tags: '',
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (error) setError('');
  };

  const handlePresetSelect = (url) => {
    setFormData({ ...formData, image: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.date ||
      !formData.venue ||
      !formData.maxParticipants ||
      !formData.registrationDeadline
    ) {
      setError('Please fill in all required fields marked with an asterisk (*).');
      return;
    }

    setLoading(true);
    setError('');

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

      const res = await api.post('/events', payload);
      if (res.data.success) {
        navigate(`/events/${res.data.event._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/organizer"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-lg space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Event Publisher</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Publish a New Campus Event
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the details below to open student registrations and publish to the Festivo calendar.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI HackSprint 2026 - 36-Hour Hackathon"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-indigo-600 outline-none"
                required
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
                Seat Capacity (Max Participants) *
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

          {/* Date, Start Time, End Time */}
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
                Start Time *
              </label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="09:00 AM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                End Time *
              </label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="05:00 PM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Venue & Registration Deadline */}
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
                placeholder="e.g. Auditorium Hall B & Central Courtyard"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registration Deadline (YYYY-MM-DD) *
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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the schedule, themes, activities, keynote speakers, and expectations..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
              required
            />
          </div>

          {/* Image URL & Preset Thumbnails */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Banner Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
            />
            <p className="text-[11px] text-slate-500">Or choose a curated image preset:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
              {presetImages.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePresetSelect(p.url)}
                  className={`p-1 rounded-xl border transition text-left cursor-pointer overflow-hidden ${
                    formData.image === p.url
                      ? 'border-indigo-600 ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={p.url} alt="" className="w-full h-12 rounded-lg object-cover" />
                  <p className="text-[10px] font-semibold text-slate-700 mt-1 truncate">{p.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prizes & Awards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Prizes & Incentives (Optional)
            </label>
            <input
              type="text"
              name="prizes"
              value={formData.prizes}
              onChange={handleChange}
              placeholder="e.g. 1st: $1,500 Cash, 2nd: $800 Cash, Trophies & Cloud Credits"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
            />
          </div>

          {/* Requirements & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Requirements (Comma separated)
              </label>
              <input
                type="text"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Student ID, Laptop with Git, Team of 2-4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="AI, FullStack, Hackathon, Innovation"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="text-xs font-bold text-slate-800">
              Feature this event prominently on the landing page hero carousel
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link
              to="/dashboard/organizer"
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
