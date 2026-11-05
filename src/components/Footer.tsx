import React, { useState } from 'react';
import { Instagram, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { trackEvent } from '../utils/analytics';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const handleLinkClick = (tab: string) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#FAF7F2] border-t border-[#E8DCD0] text-[#59443F] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#E8DCD0]/80">
            {/* Col 1: Brand & Tagline */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl tracking-wider text-[#59443F] font-semibold">
                  NAIL MUSE
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9959B] font-bold">
                  STUDIO
                </span>
              </div>
              <p className="font-serif italic text-lg text-[#C9959B]">
                &ldquo;{SALON_INFO.tagline}&rdquo;
              </p>
              <p className="text-sm text-[#59443F]/80 leading-relaxed max-w-sm">
                Melbourne&apos;s boutique beauty sanctuary specialising in BIAB natural nail care, bespoke hand-painted artistry, and luxury self-care rituals.
              </p>

              {/* Social links */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('gallery_interaction', { type: 'instagram_click' })}
                  className="w-9 h-9 rounded-full bg-[#F5E6E8] flex items-center justify-center text-[#59443F] hover:bg-[#C9959B] hover:text-white transition-colors"
                  aria-label="Instagram @nailmusestudio"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('gallery_interaction', { type: 'tiktok_click' })}
                  className="w-9 h-9 rounded-full bg-[#F5E6E8] flex items-center justify-center text-[#59443F] hover:bg-[#C9959B] hover:text-white transition-colors"
                  aria-label="TikTok @nailmusestudio"
                >
                  {/* Custom clean TikTok SVG */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.34 6.34 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1.05-.13z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold tracking-wide text-[#59443F]">
                Explore
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => handleLinkClick('home')}
                    className="text-[#59443F]/80 hover:text-[#C9959B] transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('services')}
                    className="text-[#59443F]/80 hover:text-[#C9959B] transition-colors"
                  >
                    Services & Pricing Menu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('gallery')}
                    className="text-[#59443F]/80 hover:text-[#C9959B] transition-colors"
                  >
                    Nail Inspo Gallery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('about')}
                    className="text-[#59443F]/80 hover:text-[#C9959B] transition-colors"
                  >
                    About The Studio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('contact')}
                    className="text-[#59443F]/80 hover:text-[#C9959B] transition-colors"
                  >
                    Location & Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('book')}
                    className="text-[#C9959B] font-semibold hover:underline"
                  >
                    Book An Appointment →
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Hours of Operation */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold tracking-wide text-[#59443F] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9959B]" />
                Opening Hours
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-[#59443F]/80">
                {SALON_INFO.hours.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-[#E8DCD0]/50">
                    <span className="font-medium">{item.days}</span>
                    <span className="text-[#59443F]/90 font-mono text-xs">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 4: Studio Location & Contact */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold tracking-wide text-[#59443F] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9959B]" />
                Studio Location
              </h3>
              <div className="space-y-2.5 text-sm text-[#59443F]/80">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C9959B] shrink-0 mt-0.5" />
                  <span>Melbourne, Victoria, 3000, Australia</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C9959B] shrink-0" />
                  <a href={`tel:${SALON_INFO.phone}`} className="hover:text-[#C9959B] transition-colors font-mono">
                    {SALON_INFO.phoneDisplay}
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C9959B] shrink-0" />
                  <a href={`mailto:${SALON_INFO.email}`} className="hover:text-[#C9959B] transition-colors">
                    {SALON_INFO.email}
                  </a>
                </p>
              </div>

              <div className="p-3 bg-[#F5E6E8]/70 rounded-xl border border-[#E8DCD0] text-xs text-[#59443F]/90">
                <div className="flex items-center gap-1.5 font-medium mb-1 text-[#59443F]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9959B]" />
                  Hygiene Standard
                </div>
                Hospital-grade autoclave sterilization for all metal instruments with single-use buffers & files.
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright and Legal */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#59443F]/70">
            <div>
              © {new Date().getFullYear()} Nail Muse Studio. All rights reserved. Crafted with care in Melbourne, Australia.
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-[#59443F] underline underline-offset-4 transition-colors"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-[#59443F] underline underline-offset-4 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy & Terms Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] max-w-lg w-full p-6 sm:p-8 rounded-2xl shadow-xl border border-[#E8DCD0] space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD0]">
              <h3 className="font-serif text-xl font-semibold text-[#59443F]">
                {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#59443F]/60 hover:text-[#59443F] text-sm font-semibold px-2 py-1"
              >
                Close ✕
              </button>
            </div>

            <div className="text-sm text-[#59443F]/80 space-y-3 leading-relaxed">
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    At Nail Muse Studio Melbourne, we respect your privacy and are committed to protecting your personal information.
                  </p>
                  <p>
                    <strong>Information Collection:</strong> Contact details provided through our booking requests and inquiry forms are strictly used to coordinate salon appointments and customer service.
                  </p>
                  <p>
                    <strong>Data Security:</strong> We do not sell or rent customer data to third parties. All booking communications follow strict Australian Privacy Principles (APPs).
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Appointment Deposits & Cancellations:</strong> We require 24 hours notice to reschedule or cancel appointments. Late cancellations may incur a rescheduling fee.
                  </p>
                  <p>
                    <strong>Arrival Time:</strong> Please arrive 5 minutes prior to your allocated booking so we may enjoy a leisurely color and design consultation.
                  </p>
                  <p>
                    <strong>Nail Health:</strong> If you have active nail infections or open wounds, we reserve the right to recommend medical treatment prior to service application.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#59443F] text-white text-xs font-semibold rounded-full hover:bg-[#C9959B] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
