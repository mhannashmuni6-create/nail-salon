import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Send,
  CheckCircle,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { trackEvent } from '../utils/analytics';

export const ContactView: React.FC = () => {
  // Contact form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Appointment Question / Consultation');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your name';
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address';
    if (!message.trim()) errs.message = 'Please enter your message';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitted(true);
    trackEvent('contact_form_submit', {
      subject,
      messageLength: message.length,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#59443F] font-normal">
          Contact Nail Muse Studio
        </h1>
        <p className="text-sm sm:text-base text-[#59443F]/85 leading-relaxed">
          Have an inquiry regarding custom nail art, bridal bookings, or appointments? We would
          love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Contact Info & Opening Hours */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-[#E8DCD0] space-y-6 shadow-sm">
            <h3 className="font-serif text-2xl text-[#59443F] font-medium">Studio Details</h3>

            <div className="space-y-4 text-sm text-[#59443F]/85">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C9959B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#59443F]">Salon Location</strong>
                  <span>{SALON_INFO.location}</span>
                  <p className="text-xs text-[#59443F]/60 mt-0.5">
                    Central Melbourne (Exact studio suite address provided upon booking confirmation)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C9959B] shrink-0" />
                <div>
                  <strong className="block text-[#59443F]">Phone</strong>
                  <a
                    href={`tel:${SALON_INFO.phone}`}
                    className="hover:text-[#C9959B] transition-colors font-mono"
                  >
                    {SALON_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C9959B] shrink-0" />
                <div>
                  <strong className="block text-[#59443F]">Email</strong>
                  <a
                    href={`mailto:${SALON_INFO.email}`}
                    className="hover:text-[#C9959B] transition-colors"
                  >
                    {SALON_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-[#E8DCD0]/70 space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#59443F]/70 font-semibold block">
                Connect on Socials
              </span>
              <div className="flex items-center gap-4 text-sm">
                <a
                  href={SALON_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#59443F] hover:text-[#C9959B] transition-colors font-medium"
                >
                  <Instagram className="w-4 h-4 text-[#C9959B]" />
                  <span>Instagram: {SALON_INFO.instagram}</span>
                </a>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <a
                  href={SALON_INFO.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#59443F] hover:text-[#C9959B] transition-colors font-medium"
                >
                  <svg className="w-4 h-4 fill-current text-[#C9959B]" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.34 6.34 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1.05-.13z" />
                  </svg>
                  <span>TikTok: {SALON_INFO.tiktok}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#E8DCD0] space-y-4">
            <h3 className="font-serif text-xl text-[#59443F] font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9959B]" />
              Opening Hours
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-[#59443F]/80">
              {SALON_INFO.hours.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-[#E8DCD0]/60">
                  <span className="font-medium">{item.days}</span>
                  <span className="font-mono text-xs text-[#59443F]">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DCD0] shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C9959B] font-bold">
                Online Message
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#59443F] font-medium">
                Send Us a Note
              </h3>
            </div>

            {isSubmitted ? (
              <div className="bg-[#FAF7F2] rounded-2xl p-8 text-center space-y-4 border border-[#E8DCD0] animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-[#F5E6E8] flex items-center justify-center mx-auto text-[#C9959B]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-2xl text-[#59443F]">Message Sent Successfully</h4>
                <p className="text-sm text-[#59443F]/80 max-w-md mx-auto">
                  Thank you, <span className="font-semibold">{fullName}</span>. We have received your
                  inquiry and our salon team will respond to <span className="font-mono">{email}</span> within 24 hours.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="text-xs uppercase tracking-wider font-semibold text-[#59443F] hover:text-[#C9959B]"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="contactName" className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
                    Full Name *
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mia Jenkins"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#59443F] focus:outline-none focus:border-[#C9959B] ${
                      errors.fullName ? 'border-red-400' : 'border-[#E8DCD0]'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="contactEmail" className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
                    Email Address *
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mia@example.com.au"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#59443F] focus:outline-none focus:border-[#C9959B] ${
                      errors.email ? 'border-red-400' : 'border-[#E8DCD0]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="contactSubject" className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
                    Subject
                  </label>
                  <select
                    id="contactSubject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DCD0] bg-white text-sm text-[#59443F] focus:outline-none focus:border-[#C9959B]"
                  >
                    <option value="Appointment Question / Consultation">Appointment Question / Consultation</option>
                    <option value="Bespoke Nail Art & Reference Check">Bespoke Nail Art &amp; Reference Check</option>
                    <option value="Bridal or Group Booking">Bridal or Group Booking</option>
                    <option value="General Salon Feedback">General Salon Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contactMessage" className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
                    Message *
                  </label>
                  <textarea
                    id="contactMessage"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need help with or describe your dream nail set..."
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#59443F] focus:outline-none focus:border-[#C9959B] ${
                      errors.message ? 'border-red-400' : 'border-[#E8DCD0]'
                    }`}
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm hover:shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps Integration Placeholder for Melbourne */}
      <div className="bg-white rounded-3xl border border-[#E8DCD0] overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 border-b border-[#E8DCD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#C9959B] font-bold">
              Melbourne Location Map
            </span>
            <h3 className="font-serif text-2xl text-[#59443F] font-medium">
              Finding Nail Muse Studio
            </h3>
            <p className="text-xs sm:text-sm text-[#59443F]/75">
              Conveniently located near central Melbourne tram routes and nearby parking precincts.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#59443F]/80 bg-[#FAF7F2] px-4 py-2 rounded-full border border-[#E8DCD0] shrink-0 self-start sm:self-auto">
            <Navigation className="w-3.5 h-3.5 text-[#C9959B]" />
            <span>Melbourne, Victoria 3000</span>
          </div>
        </div>

        {/* Stylized Map View Placeholder */}
        <div className="relative h-72 sm:h-80 w-full bg-[#E8DCD0]/60 flex items-center justify-center overflow-hidden">
          {/* Subtle geometric map grid illustration */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#59443F" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Interactive Pin Card */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-[#E8DCD0] text-center max-w-sm mx-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F5E6E8] flex items-center justify-center mx-auto text-[#C9959B]">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#59443F]">
                Nail Muse Studio Melbourne
              </h4>
              <p className="text-xs text-[#59443F]/80 mt-1">
                Melbourne, Victoria, Australia
              </p>
              <p className="text-[11px] text-[#C9959B] mt-0.5 font-medium">
                Google Maps Embed Placeholder
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Melbourne+Victoria+Australia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#59443F] hover:text-[#C9959B] underline pt-1"
            >
              Open in Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
