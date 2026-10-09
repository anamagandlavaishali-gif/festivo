import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Users,
  Search,
  Download,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Ticket,
} from 'lucide-react';

const ManageParticipantsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchParticipants = async () => {
    try {
      const res = await api.get(`/registrations/event/${id}/participants`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load participant roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [id]);

  const handleExportCSV = () => {
    if (!data?.participants || data.participants.length === 0) {
      alert('No participant records to export.');
      return;
    }

    const headers = ['Ticket Code,Participant Name,Email,Department,Student ID,Phone,Registration Date,Status\n'];
    const rows = data.participants.map((p) => {
      const dateStr = new Date(p.registeredAt).toLocaleDateString();
      return `"${p.ticketCode}","${p.participantName}","${p.participantEmail}","${p.department || ''}","${p.collegeId || ''}","${p.phone || ''}","${dateStr}","${p.status}"\n`;
    });

    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Festivo_Attendees_${data.event?.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const participants = data?.participants || [];
  const filtered = participants.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.participantName?.toLowerCase().includes(q) ||
      p.participantEmail?.toLowerCase().includes(q) ||
      p.ticketCode?.toLowerCase().includes(q) ||
      p.collegeId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/events/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Event Page</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Participant Attendance Roster
          </h1>
          <p className="text-xs text-slate-500">
            Event: <strong className="text-slate-800">{data?.event?.title || 'Loading...'}</strong>
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={participants.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Attendee List (.CSV)</span>
        </button>
      </div>

      {/* Metrics Row */}
      {data?.event && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Registrations
            </p>
            <p className="text-3xl font-black text-indigo-600 font-display">
              {data.event.registeredCount || participants.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Seat Limit
            </p>
            <p className="text-3xl font-black text-slate-900 font-display">
              {data.event.maxParticipants}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Remaining Seats
            </p>
            <p className="text-3xl font-black text-emerald-600 font-display">
              {Math.max(0, data.event.maxParticipants - (data.event.registeredCount || participants.length))}
            </p>
          </div>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by participant name, ticket code, or roll no..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-600"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {filtered.length} Attendees Found
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No participant registrations matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Ticket Code</th>
                  <th className="py-3 px-4">Participant Name</th>
                  <th className="py-3 px-4">College Email</th>
                  <th className="py-3 px-4">Student ID / Dept</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-700">
                      {reg.ticketCode}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {reg.participantName}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {reg.participantEmail}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <p className="font-semibold text-slate-800">{reg.collegeId || '—'}</p>
                      <p className="text-[10px] text-slate-400">{reg.department || 'General'}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          reg.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageParticipantsPage;
