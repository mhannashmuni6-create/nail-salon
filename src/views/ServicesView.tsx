import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, ChevronRight, Info, Check } from 'lucide-react';
import { SERVICES } from '../data/salonData';
import { ServiceCategory } from '../types';
import { trackEvent } from '../utils/analytics';

interface ServicesViewProps {
  onSelectServiceAndBook: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectServiceAndBook }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  const categories: { id: ServiceCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'manicures', label: 'Manicures' },
    { id: 'extensions', label: 'Nail Extensions' },
    { id: 'pedicures', label: 'Pedicures' },
    { id: 'nail-art', label: 'Nail Art & Extras' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory);

  const handleBook = (serviceId: string, serviceName: string) => {
    trackEvent('book_now_click', { source: 'services_page', serviceId, serviceName });
    onSelectServiceAndBook(serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
          Treatment Menu &amp; Rates
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#59443F] font-normal">
          Services &amp; Pricing
        </h1>
        <p className="text-sm sm:text-base text-[#59443F]/85 leading-relaxed">
          Explore our range of professional nail care, apex-sculpted builder gels, and artisanal
          nail design. Every service includes expert cuticle preparation and bespoke consultation.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-[#FAF7F2] rounded-full border border-[#E8DCD0] overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                trackEvent('service_view', { category: cat.id });
              }}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#59443F] text-white shadow-sm'
                  : 'text-[#59443F]/80 hover:text-[#59443F] hover:bg-[#F5E6E8]/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-[#E8DCD0] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#C9959B]/50 transition-all duration-200 group"
          >
            <div className="space-y-4">
              {/* Category indicator + Popular pill */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#C9959B] font-semibold">
                  {service.category.replace('-', ' ')}
                </span>
                {service.isPopular && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F5E6E8] text-[#59443F] border border-[#E8DCD0]">
                    Most Loved
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-2xl font-medium text-[#59443F] group-hover:text-[#C9959B] transition-colors leading-tight">
                  {service.name}
                </h3>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xl sm:text-2xl font-semibold text-[#59443F]">
                    ${service.price}
                  </span>
                  <span className="block text-[10px] text-[#59443F]/60 uppercase tracking-wider">
                    AUD
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5 text-xs text-[#59443F]/70 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#C9959B]" />
                <span>Estimated duration: {service.durationMinutes} minutes</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#59443F]/85 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Action Row */}
            <div className="pt-6 mt-4 border-t border-[#E8DCD0]/60 flex items-center justify-between">
              <button
                onClick={() => handleBook(service.id, service.name)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] transition-all shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Notes & Consultation Box */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DCD0] p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#C9959B] shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs sm:text-sm text-[#59443F]/85 leading-relaxed">
            <h4 className="font-serif text-base sm:text-lg font-medium text-[#59443F]">
              Important Service Notes &amp; Pricing Policies
            </h4>
            <p>
              Prices displayed are starting estimates in AUD and may vary depending on natural nail
              length, structural condition, desired extension shape, intricate custom art
              complexity, and removal requirements.
            </p>
            <p>
              Complimentary consultation: If you are uncertain which service suits your nails or
              have questions regarding BIAB transition from acrylics, feel free to submit an inquiry
              or bring your inspiration photo to your appointment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
