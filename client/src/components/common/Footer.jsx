import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Mail, Phone, MapPin, Heart, Sparkles, Calendar, Shield, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/10 p-3 rounded-2xl inline-block backdrop-blur-xs">
              <Logo size="md" />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Festivo is the premier college event management platform empowering students,
              clubs, and departments to discover, connect, and celebrate campus culture, technology summits, and hackathons.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/50 p-2.5 rounded-xl border border-indigo-900/60 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Full-Stack MERN Architecture with Secure Role-Based Access</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display">
              Explore Festivo
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/events" className="hover:text-indigo-400 transition">
                  All Campus Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technical" className="hover:text-indigo-400 transition">
                  Technical Summits
                </Link>
              </li>
              <li>
                <Link to="/events?category=Hackathons" className="hover:text-indigo-400 transition">
                  Hackathons & Coding
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="hover:text-indigo-400 transition">
                  Cultural & Concerts
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="hover:text-indigo-400 transition">
                  Sports Tournaments
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshops" className="hover:text-indigo-400 transition">
                  Hands-on Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display">
              Portals & Roles
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/dashboard/student" className="hover:text-indigo-400 transition">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/my-registrations" className="hover:text-indigo-400 transition">
                  My Digital Tickets
                </Link>
              </li>
              <li>
                <Link to="/dashboard/organizer" className="hover:text-indigo-400 transition">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="hover:text-indigo-400 transition">
                  Publish An Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard/admin" className="hover:text-indigo-400 transition">
                  Administrative Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display">
              Campus Office
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span>Student Activity Center, Innovation Block, Festivo Campus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:events@festivo.edu" className="hover:text-indigo-400 transition">
                  events@festivo.edu
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (555) FESTIVO-26</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Festivo Event Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for College Festivals
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
