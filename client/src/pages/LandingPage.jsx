import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/common/Logo';
import EventCard from '../components/events/EventCard';
import {
  Sparkles,
  Calendar,
  Users,
  Trophy,
  ArrowRight,
  Code,
  Music,
  Activity,
  Cpu,
  Layers,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Compass,
} from 'lucide-react';

const categoryPills = [
  { name: 'Technical', icon: Cpu, desc: 'Summits, Robotics & AI', color: 'from-blue-600 to-cyan-600' },
  { name: 'Hackathons', icon: Code, desc: '36H Sprints & Coding Contests', color: 'from-indigo-600 to-blue-600' },
  { name: 'Cultural', icon: Music, desc: 'Concerts, Dance & Theater', color: 'from-purple-600 to-pink-600' },
  { name: 'Sports', icon: Activity, desc: 'Tournaments & Athletics', color: 'from-amber-500 to-orange-600' },
  { name: 'Workshops', icon: Layers, desc: 'Skill Bootcamps & Certifications', color: 'from-teal-600 to-emerald-600' },
  { name: 'Fests', icon: Flame, desc: 'Grand Carnivals & Food Fiestas', color: 'from-rose-500 to-purple-600' },
];

const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 8,
    totalUsers: 14,
    totalRegistrations: 42,
    upcomingEvents: 8,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const eventsRes = await api.get('/events?featured=true');
        if (eventsRes.data.success && eventsRes.data.events.length > 0) {
          setFeaturedEvents(eventsRes.data.events.slice(0, 3));
        } else {
          // If no featured, grab first 3
          const allRes = await api.get('/events');
          setFeaturedEvents(allRes.data.events.slice(0, 3));
        }

        // Fetch platform statistics
        const statsRes = await api.get('/events');
        const count = statsRes.data.count || 8;
        setStats((prev) => ({
          ...prev,
          totalEvents: count,
          upcomingEvents: count,
        }));
      } catch (err) {
        console.warn('Error fetching landing events:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        {/* Decorative background glow orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-300/30 via-indigo-300/30 to-purple-300/30 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Celebratory badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-200/80 shadow-xs backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Official Campus Event Portal
              </span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0f172a] tracking-tight font-display leading-[1.1]">
              Discover.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Connect.
              </span>{' '}
              Celebrate.
            </h1>

            {/* Short Introduction */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Festivo is the next-generation event management platform connecting students,
              clubs, and organizers. Explore technical hackathons, cultural fests, workshops, and sports tournaments in one seamless hub.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/events"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-indigo-400 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Get Started</span>
              </Link>
            </div>

            {/* Quick Feature Perks */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Instant Digital Passes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Zero Duplicate Booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Live Seat Counter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#1e293b] rounded-3xl p-8 lg:p-12 text-white shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            <div className="pt-4 lg:pt-0 space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                {stats.totalEvents}+
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                Active Events
              </p>
            </div>

            <div className="pt-4 lg:pt-0 space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                1,500+
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                Registered Students
              </p>
            </div>

            <div className="pt-4 lg:pt-0 space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                6
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                Festival Categories
              </p>
            </div>

            <div className="pt-4 lg:pt-0 space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                100%
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                Live Capacity Tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] font-display">
            Explore By Category
          </h2>
          <p className="text-sm text-slate-600">
            From coding marathons to symphony nights, find the experiences that inspire your college journey.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryPills.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/events?category=${cat.name}`}
                className="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-center flex flex-col items-center justify-between"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Don't Miss Out</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] font-display mt-1">
              Featured Flagship Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] font-display">
              How Festivo Works
            </h2>
            <p className="text-sm text-slate-600">
              Four streamlined steps to elevate your campus event experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-base flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                Discover Events
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Browse our real-time calendar by category, status, department, and popularity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-base flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                One-Click Register
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Log in as a student to book your seat instantly before capacity fills or deadlines close.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-base flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                Get Digital Pass
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Receive an official Festivo pass with unique verification barcode and QR code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-base flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                Attend & Celebrate
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Scan your badge at the campus venue, compete for awards, and make unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-14 text-white shadow-xl text-center space-y-6">
          <Logo size="lg" hideTagline={true} />
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display max-w-2xl mx-auto">
            Ready to Experience the Best of Campus Life?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Join thousands of students and club organizers already connecting through Festivo.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-900 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Create Your Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
