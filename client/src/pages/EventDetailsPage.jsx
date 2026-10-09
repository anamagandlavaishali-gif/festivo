import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/events/TicketModal';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Share2,
  Mail,
  Phone,
  Sparkles,
  ArrowLeft,
  Edit,
  UserCheck,
  ShieldAlert,
  Ticket,
} from 'lucide-react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const fetchEventData = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.event);
        setIsRegistered(res.data.isRegistered);
        setRegistrationData(res.data.registrationDetails);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setRegistering(true);
    setActionSuccess('');
    setError('');

    try {
      const res = await api.post('/registrations/register', {
        eventId: id,
        notes,
      });

      if (res.data.success) {
        setIsRegistered(true);
        setRegistrationData(res.data.registration);
        setActionSuccess('Congratulations! You are officially registered.');
        setShowTicket(true);

        // Fire celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore if canvas-confetti is not loaded
        }

        // Refresh event data for latest seat count
        fetchEventData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!registrationData?._id) return;

    if (!window.confirm('Are you sure you want to cancel your registration? Your seat will be given to another student.')) {
      return;
    }

    setCancelling(true);
    setError('');
    setActionSuccess('');

    try {
      const res = await api.put(`/registrations/cancel/${registrationData._id}`);
      if (res.data.success) {
        setIsRegistered(false);
        setRegistrationData(null);
        setActionSuccess('Your registration has been cancelled.');
        fetchEventData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Event Not Found</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    date,
    startTime,
    endTime,
    venue,
    organizerName,
    organizerEmail,
    organizerPhone,
    image,
    maxParticipants,
    registeredCount = 0,
    registrationDeadline,
    status = 'Upcoming',
    prizes,
    requirements = [],
    tags = [],
    organizer,
  } = event;

  const seatsLeft = Math.max(0, maxParticipants - registeredCount);
  const fillPercentage = Math.min(100, Math.round((registeredCount / maxParticipants) * 100));
  const isFull = seatsLeft <= 0;
  const isDeadlinePassed = registrationDeadline && new Date(registrationDeadline) < new Date();

  const isOrganizerOrAdmin =
    user &&
    (user.role === 'admin' ||
      (organizer && (organizer._id === user._id || organizer === user._id)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Action Shortcuts */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        {isOrganizerOrAdmin && (
          <div className="flex items-center gap-2">
            <Link
              to={`/events/edit/${event._id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
            >
              <Edit className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Event</span>
            </Link>
            <Link
              to={`/events/${event._id}/participants`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 border border-indigo-200 transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Participants</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Grid: Left Column Details, Right Column Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Banner Image */}
          <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 w-full shadow-lg border border-slate-200 bg-slate-100">
            <img
              src={image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/90 text-indigo-900 backdrop-blur-md shadow-xs">
                {category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/90 text-white backdrop-blur-md">
                {status}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</p>
                <p className="text-xs font-bold text-slate-800">{date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Timings</p>
                <p className="text-xs font-bold text-slate-800">{startTime} - {endTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Venue</p>
                <p className="text-xs font-bold text-slate-800 truncate">{venue}</p>
              </div>
            </div>
          </div>

          {/* About Event */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              About This Event
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>

            {/* Prizes / Awards */}
            {prizes && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Prizes & Recognitions
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 font-medium">{prizes}</p>
                </div>
              </div>
            )}

            {/* Requirements / Guidelines */}
            {requirements && requirements.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-bold text-slate-800">
                  Participation Guidelines & Requirements:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400">Tags:</span>
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Organizer Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                {organizerName?.charAt(0) || 'O'}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Organized By
                </p>
                <h3 className="text-base font-bold text-slate-900">{organizerName}</h3>
                <p className="text-xs text-slate-500">Official Festivo Event Partner</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              {organizerEmail && (
                <a
                  href={`mailto:${organizerEmail}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Contact</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) - Registration Booking Card */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Registration Status
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                Reserve Your Seat
              </h3>
            </div>

            {/* Capacity & Progress */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Capacity</span>
                <span className="font-bold text-slate-900">
                  {registeredCount} / {maxParticipants}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    fillPercentage >= 90
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  }`}
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span
                  className={`font-bold ${
                    isFull ? 'text-rose-600' : 'text-indigo-600'
                  }`}
                >
                  {isFull ? 'Full (0 Seats)' : `${seatsLeft} Seats Remaining`}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {fillPercentage}% filled
                </span>
              </div>
            </div>

            {/* Registration Deadline Alert */}
            <div className="text-xs text-slate-600 space-y-1">
              <p className="flex items-center justify-between">
                <span className="text-slate-500">Registration Deadline:</span>
                <strong className="text-slate-800">{registrationDeadline}</strong>
              </p>
              {isDeadlinePassed && (
                <p className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Registration deadline has passed.
                </p>
              )}
            </div>

            {/* Messages */}
            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action State: Registered vs Unregistered vs Guest */}
            {isRegistered ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>You're Registered for this Event!</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 font-mono">
                    Ticket: {registrationData?.ticketCode || 'Verified'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTicket(true)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Ticket className="w-4 h-4 text-purple-400" />
                  <span>View & Print Admission Pass</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelRegistration}
                  disabled={cancelling}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-rose-600 hover:bg-rose-50 transition border border-rose-200 cursor-pointer disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                </button>
              </div>
            ) : isFull ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
              >
                Event Capacity Full (Sold Out)
              </button>
            ) : isDeadlinePassed ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
              >
                Registration Closed
              </button>
            ) : !user ? (
              <div className="space-y-2">
                <Link
                  to="/login"
                  state={{ from: { pathname: `/events/${id}` } }}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Sign In to Register</span>
                </Link>
                <p className="text-[11px] text-center text-slate-500">
                  New student?{' '}
                  <Link to="/register" className="text-indigo-600 font-semibold underline">
                    Create an account
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Optional attendee notes */}
                {showNotesInput ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Special requests or team info (optional):
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Dietary preferences or team member names"
                      rows={2}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-600"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNotesInput(true)}
                    className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    + Add attendee notes / special requirements
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {registering ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Confirm Free Registration</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Guaranteed entry with verified Festivo admission pass.
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicket && registrationData && (
        <TicketModal
          registration={{
            ...registrationData,
            event: event,
          }}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
};

export default EventDetailsPage;
