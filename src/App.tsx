/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { BookingView } from './views/BookingView';
import { GalleryView } from './views/GalleryView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { trackEvent } from './utils/analytics';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);

  // Sync with browser URL hash for direct links and GitHub Pages subfolder support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
      if (['home', 'services', 'book', 'gallery', 'about', 'contact'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title and track page view on tab change
  useEffect(() => {
    const titles: { [key: string]: string } = {
      home: 'Nail Muse Studio – Boutique Nail & Beauty Salon Melbourne',
      services: 'Services & Pricing Menu – Nail Muse Studio Melbourne',
      book: 'Book an Appointment – Nail Muse Studio Melbourne',
      gallery: 'Nail Inspiration Gallery – Nail Muse Studio Melbourne',
      about: 'About Us – The Beauty Behind Nail Muse Studio Melbourne',
      contact: 'Contact & Location – Nail Muse Studio Melbourne',
    };

    if (titles[currentTab]) {
      document.title = titles[currentTab];
    }

    trackEvent('page_view', { page: currentTab });
  }, [currentTab]);

  const handleNavigate = (tab: string, serviceId?: string) => {
    if (serviceId) {
      setPreSelectedServiceId(serviceId);
    }
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceAndBook = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    handleNavigate('book', serviceId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#59443F]">
      {/* Sticky Top Navigation Bar */}
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenGalleryItem={() => handleNavigate('gallery')}
          />
        )}

        {currentTab === 'services' && (
          <ServicesView onSelectServiceAndBook={handleSelectServiceAndBook} />
        )}

        {currentTab === 'book' && (
          <BookingView
            initialServiceId={preSelectedServiceId}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateGallery={() => handleNavigate('gallery')}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView
            onBookLook={(suggestedServiceId) => {
              if (suggestedServiceId) {
                setPreSelectedServiceId(suggestedServiceId);
              }
              handleNavigate('book', suggestedServiceId);
            }}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onNavigateBooking={() => handleNavigate('book')}
            onNavigateServices={() => handleNavigate('services')}
          />
        )}

        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
