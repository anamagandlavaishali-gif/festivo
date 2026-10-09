import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const categoryColorMap = {
  Technical: 'bg-blue-100 text-blue-800 border-blue-200',
  Hackathons: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Cultural: 'bg-purple-100 text-purple-800 border-purple-200',
  Sports: 'bg-amber-100 text-amber-900 border-amber-200',
  Workshops: 'bg-sky-100 text-sky-800 border-sky-200',
  Fests: 'bg-rose-100 text-rose-800 border-rose-200',
};

const EventCard = ({ event, isRegistered = false }) => {
  const {
    _id,
    title,
    description,
    category,
    date,
    startTime,
    endTime,
    venue,
    organizerName,
    image,
    maxParticipants,
    registeredCount = 0,
    registrationDeadline,
    status = 'Upcoming',
  } = event;

  const seatsLeft = Math.max(0, maxParticipants - registeredCount);
  const fillPercentage = Math.min(100, Math.round((registeredCount / maxParticipants) * 100));
  const isFull = seatsLeft <= 0;
  const isDeadlinePassed = registrationDeadline && new Date(registrationDeadline) < new Date();

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
      {/* Event Image Banner with Overlays */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={
            image ||
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs shadow-xs ${
              categoryColorMap[category] || 'bg-indigo-100 text-indigo-800 border-indigo-200'
            }`}
          >
            {category}
          </span>
          {event.featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white shadow-xs flex items-center gap-1 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-yellow-200" />
              Featured
            </span>
          )}
        </div>

        {/* Status Badge Top Right */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs ${
              status === 'Upcoming'
                ? 'bg-blue-600/90 text-white'
                : status === 'Ongoing'
                ? 'bg-purple-600/90 text-white animate-pulse'
                : status === 'Completed'
                ? 'bg-slate-700/90 text-slate-200'
                : 'bg-rose-600/90 text-white'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Date Tag Floating over Image */}
        <div className="absolute bottom-3 left-3 text-white flex items-center gap-2 text-xs font-medium bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formattedDate}</span>
          <span className="text-slate-400">•</span>
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{startTime}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <Link to={`/events/${_id}`}>
            <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 font-display">
              {title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Metadata Row: Venue & Organizer */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="w-3.5 h-3.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                O
              </span>
              <span className="truncate text-slate-600">
                Hosted by: <strong>{organizerName || 'College Council'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Capacity & Progress Bar */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {registeredCount} / {maxParticipants} Registered
              </span>
            </span>
            <span
              className={`font-bold ${
                isFull ? 'text-rose-600' : seatsLeft <= 10 ? 'text-amber-600' : 'text-indigo-600'
              }`}
            >
              {isFull ? 'Sold Out' : `${seatsLeft} Seats Left`}
            </span>
          </div>

          {/* Visual Seat Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                fillPercentage >= 90
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>

          {/* Registration Deadline Alert */}
          {registrationDeadline && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Deadline: {registrationDeadline}</span>
              {isRegistered && (
                <span className="text-indigo-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  Registered
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Link
            to={`/events/${_id}`}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:text-white border border-slate-200 hover:border-transparent flex items-center justify-center gap-2 transition-all duration-200 shadow-2xs group-hover:shadow-indigo-100"
          >
            <span>{isRegistered ? 'View Digital Pass' : 'View Event & Register'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
