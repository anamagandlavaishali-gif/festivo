import React from 'react';
import { X, Calendar, MapPin, Clock, CheckCircle2, QrCode, Printer, Sparkles } from 'lucide-react';
import Logo from '../common/Logo';

const TicketModal = ({ registration, onClose }) => {
  if (!registration) return null;

  const { ticketCode, participantName, participantEmail, department, collegeId, registeredAt, event } = registration;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-black/20 hover:bg-black/30 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-white/95 px-3 py-1 rounded-xl shadow-xs">
              <Logo size="sm" hideTagline={true} />
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-200">
              OFFICIAL DIGITAL ADMISSION PASS
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified & Confirmed
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5">
          {/* Event Details */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              {event?.category || 'Campus Event'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 font-display leading-snug">
              {event?.title || 'Festivo Event'}
            </h3>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-900">Date:</span>
              <span>{event?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-900">Timing:</span>
              <span>
                {event?.startTime} - {event?.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-900">Venue:</span>
              <span>{event?.venue}</span>
            </div>
          </div>

          {/* Attendee Details */}
          <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Participant Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-bold text-slate-900">{participantName}</p>
              </div>
              <div>
                <p className="text-slate-500">Student / ID</p>
                <p className="font-bold text-slate-900">{collegeId || 'FST-STUDENT'}</p>
              </div>
              <div>
                <p className="text-slate-500">Department</p>
                <p className="font-semibold text-slate-900 truncate">{department || 'General'}</p>
              </div>
              <div>
                <p className="text-slate-500">Ticket Code</p>
                <p className="font-mono font-bold text-indigo-700">{ticketCode}</p>
              </div>
            </div>
          </div>

          {/* Simulated QR & Barcode Section */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between bg-slate-50 p-3 rounded-xl border">
            <div className="flex items-center gap-3">
              {/* QR Mockup */}
              <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shadow-xs">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Scan at Entry Gate</p>
                <p className="text-xs font-mono font-bold text-slate-800">{ticketCode}</p>
                <p className="text-[10px] text-slate-500">Valid for 1 Entry</p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
