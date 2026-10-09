import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/events/EventCard';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  X,
  Sparkles,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

const categories = [
  'All',
  'Technical',
  'Hackathons',
  'Cultural',
  'Sports',
  'Workshops',
  'Fests',
];

const ExploreEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('date-asc');

  // Update state if URL query param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedSort) params.sort = selectedSort;

      const res = await api.get('/events', { params });
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus, selectedSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedSort('date-asc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Campus Calendar 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Explore Campus Events
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Discover college hackathons, technical conventions, cultural concerts, and sports championships.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input Row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, keywords, tags, or venue..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedCategory(category);
                if (category === 'All') {
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ category });
                }
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Status & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Status Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Sort By:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 outline-none"
              >
                <option value="date-asc">Event Date (Earliest First)</option>
                <option value="date-desc">Event Date (Latest First)</option>
                <option value="popular">Most Popular (Seats Filled)</option>
                <option value="newest">Recently Published</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{events.length}</strong> events
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {selectedStatus !== 'All' && ` (${selectedStatus})`}
        </span>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse p-4 space-y-4">
              <div className="h-44 bg-slate-200 rounded-xl" />
              <div className="h-5 bg-slate-200 rounded-md w-3/4" />
              <div className="h-4 bg-slate-100 rounded-md w-full" />
              <div className="h-10 bg-slate-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            No Events Match Your Filters
          </h3>
          <p className="text-xs text-slate-500">
            We couldn't find any events with the current keyword or category. Try clearing your filters or selecting another category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreEventsPage;
