import React from 'react';
import { Sparkles, ShieldCheck, Heart, Droplets, CheckCircle, ArrowRight } from 'lucide-react';
import { Images } from '../assets/images';

interface AboutViewProps {
  onNavigateBooking: () => void;
  onNavigateServices: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateBooking,
  onNavigateServices,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. Header & Brand Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
            Our Story &amp; Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#59443F] font-normal leading-[1.15]">
            The Beauty Behind <br />
            <span className="italic font-light text-[#C9959B]">Nail Muse</span>
          </h1>

          <div className="space-y-4 text-base sm:text-lg text-[#59443F]/85 leading-relaxed">
            <p>
              Nail Muse Studio was created with a simple vision: to make beautiful nails and quality
              self-care experiences accessible to everyone.
            </p>
            <p>
              We believe every client deserves to feel confident, comfortable, and inspired. From
              timeless manicures to statement nail designs, our approach combines creativity,
              attention to detail, and personalised service.
            </p>
            <p className="font-serif text-xl italic text-[#59443F] pt-2">
              &ldquo;At Nail Muse Studio, your nails are our inspiration.&rdquo;
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={onNavigateBooking}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm transition-all"
            >
              Book an Appointment
            </button>
            <button
              onClick={onNavigateServices}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white text-[#59443F] border border-[#E8DCD0] hover:border-[#C9959B] transition-all"
            >
              Explore Our Services
            </button>
          </div>
        </div>

        {/* Studio Interior Photo */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5] bg-[#E8DCD0] border border-[#E8DCD0]">
            <img
              src={Images.salonInterior}
              alt="Inside the welcoming space of Nail Muse Studio Melbourne"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-lg border border-[#E8DCD0] max-w-xs hidden sm:block">
            <p className="font-serif text-lg text-[#59443F] font-medium leading-snug">
              A serene beauty sanctuary
            </p>
            <p className="text-xs text-[#59443F]/75 mt-1">
              Curated for calm conversations, natural nail health, and unhurried artistry.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Core Salon Commitments */}
      <section className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E8DCD0] space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
            Our Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
            Our Salon Commitments
          </h2>
          <p className="text-sm text-[#59443F]/80">
            We hold ourselves to elevated standards in hygiene, client consultation, and product
            integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Commitment 1 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F5E6E8] flex items-center justify-center text-[#59443F]">
              <ShieldCheck className="w-5 h-5 text-[#C9959B]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#59443F]">
              Dedicated Hygiene &amp; Cleanliness
            </h3>
            <p className="text-xs text-[#59443F]/80 leading-relaxed">
              Dedicated tool sanitization and clean workstation practices are strictly maintained.
              Implements undergo standardized disinfectant cleansing and careful preparation before
              each appointment.
            </p>
          </div>

          {/* Commitment 2 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F5E6E8] flex items-center justify-center text-[#59443F]">
              <Heart className="w-5 h-5 text-[#C9959B]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#59443F]">
              Personalised Consultation
            </h3>
            <p className="text-xs text-[#59443F]/80 leading-relaxed">
              We never rush your session. We listen to your daily lifestyle demands, review your
              inspiration photos, and sculpt shapes that naturally complement your fingers.
            </p>
          </div>

          {/* Commitment 3 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F5E6E8] flex items-center justify-center text-[#59443F]">
              <Droplets className="w-5 h-5 text-[#C9959B]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#59443F]">
              Gentle, Quality Treatments
            </h3>
            <p className="text-xs text-[#59443F]/80 leading-relaxed">
              We select high-performance builder gels, quality salon polishes, and hydrating
              cuticle elixirs that support natural nail health over time without aggressive drilling.
            </p>
          </div>

          {/* Commitment 4 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F5E6E8] flex items-center justify-center text-[#59443F]">
              <Sparkles className="w-5 h-5 text-[#C9959B]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#59443F]">
              Welcoming Atmosphere
            </h3>
            <p className="text-xs text-[#59443F]/80 leading-relaxed">
              Step into a warm ivory and soft blush space designed to feel like an aesthetic living
              room. Enjoy calm background playlists, warm herbal tea, and friendly hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Melbourne Nail Culture */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DCD0] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
            Local Aesthetics
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#59443F]">
            Rooted in Melbourne Style
          </h3>
          <p className="text-sm text-[#59443F]/85 leading-relaxed">
            Proposed for the vibrant lifestyle and shopping community of Doncaster, Melbourne,
            Nail Muse Studio brings a refined balance to modern self-care: understated, elegant,
            and distinct.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#E8DCD0]">
          <img
            src={Images.heroManicure}
            alt="Editorial Melbourne nail look"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
