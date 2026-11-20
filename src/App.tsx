/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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

const parseRouteFromHash = (hashValue: string): { tab: string; blogSlug?: string } => {
  const rawHash = hashValue.replace(/^#\/?/, '').toLowerCase();
  if (rawHash === 'blog' || rawHash.startsWith('blog/')) {
    const slugPart = rawHash.startsWith('blog/') ? rawHash.slice(5) : undefined;
    return { tab: 'blog', blogSlug: slugPart || undefined };
  }
  if (['home', 'services', 'book', 'gallery', 'about', 'contact'].includes(rawHash)) {
    return { tab: rawHash };
  }
  return { tab: 'home' };
};

export default function App() {
  const initialRoute =
    typeof window !== 'undefined' ? parseRouteFromHash(window.location.hash) : { tab: 'home' };

  const [currentTab, setCurrentTab] = useState<string>(initialRoute.tab);
  const [blogSlug, setBlogSlug] = useState<string | undefined>(initialRoute.blogSlug);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);
  const lastTrackedRouteRef = useRef<string | null>(null);

  // Sync with browser URL hash for direct links and GitHub Pages subfolder support
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseRouteFromHash(window.location.hash);
      setCurrentTab(parsed.tab);
      setBlogSlug(parsed.blogSlug);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reset scroll to top on every route change (including hash navigation and browser Back/Forward)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentTab, blogSlug]);

  // Update document title, meta description, social tags, and dispatch single manual GA4 page_view
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

    const virtualPath =
      currentTab === 'blog' ? `/blog/${activeBlogPost.slug}` : `/${currentTab}`;

    if (lastTrackedRouteRef.current !== virtualPath) {
      lastTrackedRouteRef.current = virtualPath;

      const basePath = window.location.pathname.endsWith('/')
        ? window.location.pathname.slice(0, -1)
        : window.location.pathname;
      const virtualLocation = `${window.location.origin}${basePath}${virtualPath}`;

      trackEvent('page_view', {
        page_title: pageTitle,
        page_location: virtualLocation,
        page_path: virtualPath,
        page: currentTab,
        ...(currentTab === 'blog' ? { post_slug: activeBlogPost.slug } : {}),
      });
    }
  }, [currentTab, blogSlug]);

  const handleNavigate = (tab: string, serviceId?: string) => {
    if (serviceId) {
      setPreSelectedServiceId(serviceId);
    }
    if (tab !== 'blog') {
      setBlogSlug(undefined);
    }
    if (tab === currentTab) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
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
