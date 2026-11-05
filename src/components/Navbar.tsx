import React, { useState } from 'react';
import { Menu, X, Sparkles, Calendar } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services & Pricing' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = () => {
    trackEvent('book_now_click', { source: 'navbar_cta' });
    onNavigate('book');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DCD0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-left group flex items-baseline gap-2 focus:outline-none shrink-0"
          aria-label="Nail Muse Studio Home"
        >
          <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#59443F] font-medium group-hover:text-[#C9959B] transition-colors">
            NAIL MUSE
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9959B] font-semibold hidden sm:inline">
            STUDIO
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean single-line with subtle hover underline) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-[#59443F]/80">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative hover:text-[#59443F] ${
                  isActive ? 'text-[#59443F] font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9959B] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBookNow}
            className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm whitespace-nowrap shrink-0 ${
              currentTab === 'book'
                ? 'bg-[#59443F] text-white ring-2 ring-[#C9959B]'
                : 'bg-[#59443F] text-white hover:bg-[#C9959B] hover:shadow-md'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Now
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#59443F] hover:text-[#C9959B] focus:outline-none rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8DCD0] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#F5E6E8] text-[#59443F] font-semibold'
                    : 'text-[#59443F]/80 hover:bg-[#F5E6E8]/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleBookNow}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold tracking-wider uppercase bg-[#59443F] text-white shadow-sm hover:bg-[#C9959B] transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
