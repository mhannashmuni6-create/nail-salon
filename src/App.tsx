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
import { BlogView } from './views/BlogView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { BLOG_POSTS } from './data/blogData';
import { trackEvent } from './utils/analytics';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [blogSlug, setBlogSlug] = useState<string | undefined>(undefined);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);

  // Sync with browser URL hash for direct links and GitHub Pages subfolder support
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (rawHash === 'blog' || rawHash.startsWith('blog/')) {
        setCurrentTab('blog');
        const slugPart = rawHash.startsWith('blog/') ? rawHash.slice(5) : undefined;
        setBlogSlug(slugPart || undefined);
        return;
      }
      if (['home', 'services', 'book', 'gallery', 'about', 'contact'].includes(rawHash)) {
        setCurrentTab(rawHash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title, meta description, social tags, and track page view on tab change
  useEffect(() => {
    const defaultDescription =
      'Boutique nail and beauty salon in Melbourne, Victoria, Australia specialising in BIAB builder gel, luxury manicures, and bespoke nail art. Your Nails, Your Muse.';
    const activeBlogPost =
      BLOG_POSTS.find((p) => p.slug === blogSlug) || BLOG_POSTS[0];

    const titles: { [key: string]: string } = {
      home: 'Nail Muse Studio – Boutique Nail & Beauty Salon Melbourne',
      services: 'Services & Pricing Menu – Nail Muse Studio Melbourne',
      book: 'Book an Appointment – Nail Muse Studio Melbourne',
      gallery: 'Nail Inspiration Gallery – Nail Muse Studio Melbourne',
      blog: activeBlogPost.seoTitle,
      about: 'About Us – The Beauty Behind Nail Muse Studio Melbourne',
      contact: 'Contact & Location – Nail Muse Studio Melbourne',
    };

    const descriptions: { [key: string]: string } = {
      home: defaultDescription,
      services: defaultDescription,
      book: defaultDescription,
      gallery: defaultDescription,
      blog: activeBlogPost.metaDescription,
      about: defaultDescription,
      contact: defaultDescription,
    };

    const pageTitle = titles[currentTab] || titles.home;
    const pageDescription = descriptions[currentTab] || defaultDescription;

    document.title = pageTitle;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    updateMeta('meta[name="description"]', pageDescription);
    updateMeta('meta[property="og:title"]', pageTitle);
    updateMeta('meta[property="og:description"]', pageDescription);
    updateMeta('meta[name="twitter:title"]', pageTitle);
    updateMeta('meta[name="twitter:description"]', pageDescription);

    trackEvent('page_view', {
      page: currentTab,
      ...(currentTab === 'blog' ? { postSlug: activeBlogPost.slug } : {}),
    });
  }, [currentTab, blogSlug]);

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

        {currentTab === 'blog' && (
          <BlogView initialSlug={blogSlug} onNavigate={handleNavigate} />
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
