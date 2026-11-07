import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Heart,
  Gem,
  Coffee,
  CheckCircle2,
  ChevronDown,
  Instagram,
  Star,
} from 'lucide-react';
import { Images } from '../assets/images';
import { SERVICES, BRAND_VALUES, TESTIMONIALS, FAQS, GALLERY_ITEMS } from '../data/salonData';
import { trackEvent } from '../utils/analytics';

interface HomeViewProps {
  onNavigate: (tab: string, serviceId?: string) => void;
  onOpenGalleryItem?: (itemId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Featured services requested in brief
  const featuredIds = [
    'classic-manicure',
    'gel-manicure',
    'biab-manicure',
    'gel-extensions',
    'acrylic-full-set',
    'spa-pedicure',
    'detailed-nail-art',
  ];
  const featuredServices = SERVICES.filter((s) => featuredIds.includes(s.id));

  const handleBookClick = (serviceId?: string) => {
    trackEvent('book_now_click', { source: 'home_hero', serviceId });
    onNavigate('book', serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServicesClick = () => {
    trackEvent('service_view', { source: 'home_hero' });
    onNavigate('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGalleryClick = () => {
    trackEvent('gallery_interaction', { source: 'home_gallery_preview' });
    onNavigate('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              {/* Subtle unboxed metadata banner adhering to Zero-Pill discipline */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C9959B] font-semibold">
                <span>Doncaster, Melbourne Studio</span>
                <span aria-hidden="true">·</span>
                <span>BIAB &amp; Nail Artistry</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#59443F] font-normal tracking-tight leading-[1.15] text-balance">
                Your Nails, <br />
                <span className="italic font-light text-[#C9959B]">Your Muse.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#59443F]/85 leading-relaxed max-w-xl">
                Where creativity meets elegance. Discover beautifully crafted nails, personalised
                treatments, and a little moment of luxury at Nail Muse Studio.
              </p>

              {/* Two Prominent Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => handleBookClick()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Calendar className="w-4 h-4" />
                  Book an Appointment
                </button>
                <button
                  onClick={handleServicesClick}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase bg-white text-[#59443F] border border-[#E8DCD0] hover:border-[#C9959B] hover:bg-[#F5E6E8]/40 transition-all duration-200"
                >
                  Explore Our Services
                  <ArrowRight className="w-4 h-4 text-[#C9959B]" />
                </button>
              </div>

              {/* Unboxed Trust Markers */}
              <div className="pt-6 border-t border-[#E8DCD0]/70 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#59443F]/75">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C9959B]" />
                  <span>Professional tool sanitization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#C9959B]" />
                  <span>Quality builder &amp; gel polishes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gem className="w-4 h-4 text-[#C9959B]" />
                  <span>Doncaster, Melbourne</span>
                </div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative soft blush background backdrop */}
                <div className="absolute -inset-4 bg-[#F5E6E8]/80 rounded-3xl transform rotate-1 -z-10" />

                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-[4/5] bg-[#E8DCD0]">
                  <img
                    src={Images.heroManicure}
                    alt="Photorealistic close-up of a female hand with five almond nails featuring glossy nude-pink BIAB gel polish at Nail Muse Studio Melbourne"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle caption tag */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-[#E8DCD0] flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#C9959B] font-semibold">
                        Signature Finish
                      </p>
                      <p className="text-sm font-medium text-[#59443F]">
                        Glossy Nude-Pink BIAB Almonds
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookClick('biab-manicure')}
                      className="text-xs font-semibold text-[#59443F] hover:text-[#C9959B] transition-colors flex items-center gap-1"
                    >
                      Book <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WELCOME SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DCD0] p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Salon Interior image */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[16/10] bg-[#E8DCD0]">
                <img
                  src={Images.salonInterior}
                  alt="Aesthetic interior of Nail Muse Studio Doncaster Melbourne featuring blush walls, arched mirrors, and bouclé seating"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#59443F]/85 text-white text-[11px] uppercase tracking-widest px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                  Doncaster, Melbourne
                </div>
              </div>
            </div>

            {/* Editorial copy */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
                The Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal leading-snug">
                Welcome to Nail Muse Studio
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#59443F]/85 leading-relaxed">
                <p>
                  At Nail Muse Studio, we believe your nails are an extension of your personality.
                  Whether you love timeless elegance, minimalist designs, or bold nail art, our
                  goal is to bring your vision to life.
                </p>
                <p>
                  Enjoy professional nail treatments in a welcoming space designed for beauty,
                  creativity, and self-care. From complimentary herbal teas to bespoke nail shape
                  styling, we invite you to slow down and indulge in a tranquil beauty ritual.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#59443F] hover:text-[#C9959B] transition-colors"
                >
                  Learn more about our studio story
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
              Curated Treatments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
              Featured Services
            </h2>
            <p className="text-sm sm:text-base text-[#59443F]/80">
              High-performance manicures, natural nail reinforcement, and bespoke artistry tailored
              to your style.
            </p>
          </div>
          <button
            onClick={handleServicesClick}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#59443F] hover:text-[#C9959B] pb-1 border-b border-[#59443F]/40 hover:border-[#C9959B] transition-colors whitespace-nowrap self-start md:self-end"
          >
            View Full Service & Price Menu
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-[#E8DCD0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {service.image ? (
                <div className="h-44 overflow-hidden relative bg-[#FAF7F2]">
                  <img
                    src={service.image}
                    alt={`${service.name} at Nail Muse Studio Melbourne`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {service.isPopular && (
                    <span className="absolute top-3 right-3 bg-[#FAF7F2]/90 backdrop-blur-md text-[#59443F] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#E8DCD0]">
                      Popular
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-28 bg-[#F5E6E8]/60 p-5 flex flex-col justify-end">
                  <span className="text-[10px] tracking-widest uppercase text-[#C9959B] font-bold">
                    {service.category}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-medium text-[#59443F] group-hover:text-[#C9959B] transition-colors">
                      {service.name}
                    </h3>
                    <span className="font-mono text-base font-semibold text-[#59443F]">
                      ${service.price}
                    </span>
                  </div>

                  <div className="text-xs text-[#59443F]/70 flex items-center gap-1.5 font-mono">
                    <span>Approx. {service.durationMinutes} mins</span>
                  </div>

                  <p className="text-xs text-[#59443F]/80 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E8DCD0]/60">
                  <button
                    onClick={() => handleBookClick(service.id)}
                    className="text-xs font-bold uppercase tracking-wider text-[#59443F] hover:text-[#C9959B] flex items-center gap-1 transition-colors"
                  >
                    Book Treatment <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleServicesClick}
                    className="text-[11px] text-[#59443F]/60 hover:text-[#59443F] transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Consultation CTA Card */}
          <div className="bg-[#F5E6E8]/70 rounded-2xl border border-[#E8DCD0] p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9959B] font-bold">
                Custom Styling
              </span>
              <h3 className="font-serif text-xl font-medium text-[#59443F]">
                Have a Custom Nail Art Vision?
              </h3>
              <p className="text-xs text-[#59443F]/80 leading-relaxed">
                Bring your dream Pinterest moodboard or Instagram bookmark. Our artists will adapt
                colors and compositions specifically for your hands.
              </p>
            </div>
            <button
              onClick={() => handleBookClick('detailed-nail-art')}
              className="w-full py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] transition-colors text-center"
            >
              Book Inspo Appointment
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-white py-20 border-y border-[#E8DCD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
              The Nail Muse Difference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
              Why Choose Nail Muse Studio
            </h2>
            <p className="text-sm text-[#59443F]/80 leading-relaxed">
              We reimagined the salon experience to combine meticulous craftsmanship, elevated
              hygiene, and genuine hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BRAND_VALUES.map((val, idx) => (
              <div
                key={val.id}
                className="bg-[#FAF7F2] rounded-2xl p-7 border border-[#E8DCD0] space-y-4 flex flex-col justify-between hover:border-[#C9959B]/60 transition-colors"
              >
                <div className="space-y-3">
                  <div className="font-serif text-2xl text-[#C9959B] font-light">
                    0{idx + 1}.
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#59443F]">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#C9959B] font-medium tracking-wide uppercase">
                    {val.subtitle}
                  </p>
                  <p className="text-xs text-[#59443F]/80 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NAIL INSPIRATION GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
              Visual Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
              Nail Inspiration Gallery
            </h2>
            <p className="text-sm text-[#59443F]/80">
              Browse our latest manicures featuring glazed chrome, micro-French lines, BIAB overlays,
              and bespoke hand-painted artwork.
            </p>
          </div>
          <button
            onClick={handleGalleryClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FAF7F2] text-[#59443F] border border-[#E8DCD0] hover:border-[#C9959B] transition-colors self-start md:self-end"
          >
            Explore Full Gallery
            <ArrowRight className="w-3.5 h-3.5 text-[#C9959B]" />
          </button>
        </div>

        {/* 4-Item Gallery Teaser */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={handleGalleryClick}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8DCD0] shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-[#E8DCD0]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#59443F]/80 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {item.categoryLabel}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-serif text-base font-medium text-[#59443F] group-hover:text-[#C9959B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#59443F]/75 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 flex items-center text-xs font-semibold text-[#C9959B] group-hover:translate-x-1 transition-transform">
                  View Look &amp; Details →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INSTAGRAM SOCIAL FEED STRIP */}
      <section className="bg-[#FAF7F2] py-16 border-y border-[#E8DCD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
                Follow Along
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#59443F]">
                @nailmusestudio on Instagram
              </h3>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white text-[#59443F] border border-[#E8DCD0] hover:border-[#C9959B] shadow-sm transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#C9959B]" />
              Follow Our Daily Sets
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E8DCD0] relative group">
              <img
                src={Images.galPinkChrome}
                alt="Instagram set soft pink chrome"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E8DCD0] relative group">
              <img
                src={Images.galNudeBiab}
                alt="Instagram set classic nude BIAB"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E8DCD0] relative group">
              <img
                src={Images.galFrenchTips}
                alt="Instagram set elegant French tips"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E8DCD0] relative group">
              <img
                src={Images.galChocolateBrown}
                alt="Instagram set rich chocolate brown gel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
            Kind Words
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
            Client Experiences
          </h2>
          <p className="text-sm text-[#59443F]/80">
            Read what Melbourne clients say about their appointments and nail transformations at
            Nail Muse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-7 border border-[#E8DCD0] space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#C9959B]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#59443F]/85 italic leading-relaxed">
                  &ldquo;{review.reviewText}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8DCD0]/60 space-y-1">
                <p className="font-serif text-base font-medium text-[#59443F]">
                  {review.clientName}
                </p>
                <div className="flex items-center justify-between text-xs text-[#59443F]/65 font-mono">
                  <span>{review.suburb}, VIC</span>
                  <span>{review.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
            Questions &amp; Policies
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#59443F]/80">
            Everything you need to know about booking, appointments, nail prep, and salon etiquette.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E8DCD0] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <span className="font-serif text-lg font-medium text-[#59443F]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C9959B] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#59443F]/85 leading-relaxed border-t border-[#E8DCD0]/40 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5E6E8] rounded-3xl p-10 sm:p-16 text-center border border-[#E8DCD0] relative overflow-hidden">
          {/* Subtle floral/aesthetic ambient glow */}
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
              Reserve Your Chair
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#59443F] font-normal text-balance">
              Your Next Nail Moment Awaits.
            </h2>
            <p className="text-base sm:text-lg text-[#59443F]/85 leading-relaxed max-w-lg mx-auto">
              A fresh set, a fresh feeling. Find your next favourite look at Nail Muse Studio.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleBookClick()}
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-md hover:shadow-xl transition-all duration-200"
              >
                <Calendar className="w-4 h-4" />
                Book Your Appointment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
