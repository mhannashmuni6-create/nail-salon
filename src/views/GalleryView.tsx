import React, { useState } from 'react';
import { Sparkles, Calendar, X, Eye, ArrowRight, Check } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/salonData';
import { GalleryCategory, GalleryItem } from '../types';
import { trackEvent } from '../utils/analytics';

interface GalleryViewProps {
  onBookLook: (suggestedServiceId?: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onBookLook }) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories: { id: GalleryCategory; label: string }[] = [
    { id: 'all', label: 'All Sets' },
    { id: 'french-tips', label: 'French Tips' },
    { id: 'minimalist', label: 'Minimalist Nails' },
    { id: 'chrome', label: 'Chrome Nails' },
    { id: 'biab', label: 'BIAB Nails' },
    { id: 'acrylic', label: 'Acrylic & Extensions' },
    { id: 'creative', label: 'Creative Nail Art' },
    { id: 'seasonal', label: 'Seasonal Designs' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const handleOpenLightbox = (item: GalleryItem) => {
    trackEvent('gallery_interaction', {
      action: 'view_lightbox',
      itemId: item.id,
      itemTitle: item.title,
    });
    setActiveLightboxItem(item);
  };

  const handleBookFromGallery = (serviceId?: string) => {
    trackEvent('book_now_click', { source: 'gallery_look', serviceId });
    setActiveLightboxItem(null);
    onBookLook(serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
          Visual Inspiration
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#59443F] font-normal">
          Nail Inspiration Gallery
        </h1>
        <p className="text-sm sm:text-base text-[#59443F]/85 leading-relaxed">
          Discover our curated collection of glazed finishes, modern French lines, natural BIAB
          reinforcements, and bespoke nail artistry created in Melbourne.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? GALLERY_ITEMS.length
                : GALLERY_ITEMS.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  trackEvent('gallery_interaction', { action: 'filter_category', category: cat.id });
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#59443F] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#59443F]/80 border border-[#E8DCD0] hover:border-[#C9959B] hover:text-[#59443F]'
                }`}
              >
                {cat.label} <span className="opacity-60 text-[10px] ml-1">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenLightbox(item)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8DCD0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden relative bg-[#FAF7F2]">
              <img
                src={item.image}
                alt={`${item.title} - ${item.categoryLabel} at Nail Muse Studio Melbourne`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#59443F]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-3 bg-white/90 backdrop-blur-md rounded-full text-[#59443F] shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-md text-[#59443F] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#E8DCD0]">
                {item.categoryLabel}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#59443F] group-hover:text-[#C9959B] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#59443F]/80 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E8DCD0]/60 flex items-center justify-between text-xs font-semibold text-[#C9959B]">
                <span>Click to View Full Look</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action at bottom of gallery */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DCD0] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
          Love a Design?
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
          Bring Your Favourite Look to Life
        </h2>
        <p className="text-sm text-[#59443F]/85 max-w-md mx-auto leading-relaxed">
          Book your appointment and simply quote the look title or upload your screenshot during
          consultation.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onBookLook()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4" />
            Book Your Look
          </button>
        </div>
      </div>

      {/* Enlarged Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="bg-[#FAF7F2] max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E8DCD0] grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="md:col-span-7 aspect-[4/3] md:aspect-auto h-full min-h-[300px] bg-[#E8DCD0] relative">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="md:hidden absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Details */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#C9959B] font-bold">
                    {activeLightboxItem.categoryLabel}
                  </span>
                  <button
                    onClick={() => setActiveLightboxItem(null)}
                    className="hidden md:inline-flex p-1 text-[#59443F]/60 hover:text-[#59443F]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#59443F]">
                  {activeLightboxItem.title}
                </h3>

                <p className="text-sm text-[#59443F]/85 leading-relaxed">
                  {activeLightboxItem.description}
                </p>

                {/* Tags */}
                <div className="pt-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#59443F]/60 font-semibold block mb-2">
                    Style Characteristics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeLightboxItem.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#E8DCD0] text-[#59443F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#E8DCD0] space-y-3">
                <button
                  onClick={() => handleBookFromGallery(activeLightboxItem.suggestedServiceId)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] transition-colors shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book This Look
                </button>
                <button
                  onClick={() => setActiveLightboxItem(null)}
                  className="w-full text-center text-xs text-[#59443F]/60 hover:text-[#59443F]"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
