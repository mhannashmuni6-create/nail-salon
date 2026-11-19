import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  ChevronRight,
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { BlogPost, BlogTextSegment } from '../types';
import { trackEvent } from '../utils/analytics';

interface BlogViewProps {
  initialSlug?: string;
  onNavigate: (tab: string, serviceId?: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ initialSlug, onNavigate }) => {
  const [activePostSlug, setActivePostSlug] = useState<string>(
    initialSlug && BLOG_POSTS.some((p) => p.slug === initialSlug)
      ? initialSlug
      : BLOG_POSTS[0].slug
  );

  useEffect(() => {
    if (initialSlug && BLOG_POSTS.some((p) => p.slug === initialSlug)) {
      setActivePostSlug(initialSlug);
    }
  }, [initialSlug]);

  const activePost: BlogPost =
    BLOG_POSTS.find((p) => p.slug === activePostSlug) || BLOG_POSTS[0];

  // Inject BlogPosting Schema.org JSON-LD dynamically for rich search snippets
  useEffect(() => {
    const scriptId = 'nailmuse-blogposting-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const featuredImageUrl =
      typeof window !== 'undefined'
        ? new URL(activePost.featuredImage, window.location.href).href
        : activePost.featuredImage;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: activePost.title,
      description: activePost.metaDescription,
      image: [featuredImageUrl],
      datePublished: activePost.publishedDate,
      author: {
        '@type': 'Organization',
        name: 'Nail Muse Studio',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Nail Muse Studio',
      },
      keywords: [activePost.primaryKeyword, ...activePost.supportingKeywords].join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id':
          typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}#/blog/${activePost.slug}`
            : `#/blog/${activePost.slug}`,
      },
    };

    scriptEl.textContent = JSON.stringify(structuredData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [activePost]);

  const handleInternalLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetTab: string,
    serviceId?: string,
    label?: string
  ) => {
    e.preventDefault();
    if (targetTab === 'book') {
      trackEvent('book_now_click', {
        source: 'blog_article_link',
        postId: activePost.id,
        serviceId: serviceId || 'general',
        label: label || 'Book Appointment',
      });
    } else if (targetTab === 'services') {
      trackEvent('service_view', {
        source: 'blog_article_link',
        postId: activePost.id,
        serviceId: serviceId || 'all',
      });
    }
    onNavigate(targetTab, serviceId);
  };

  const renderSegments = (segments: BlogTextSegment[]) =>
    segments.map((seg, idx) => {
      if (seg.type === 'text') {
        return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
      }
      if (seg.type === 'strong') {
        return (
          <strong key={idx} className="font-semibold text-[#59443F]">
            {seg.value}
          </strong>
        );
      }
      return (
        <a
          key={idx}
          href={`#/${seg.targetTab}`}
          onClick={(e) => handleInternalLink(e, seg.targetTab, seg.serviceId, seg.label)}
          className="text-[#9E6B72] font-semibold underline decoration-[#C9959B] underline-offset-4 hover:text-[#59443F] transition-colors"
        >
          {seg.label}
        </a>
      );
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Top Breadcrumb & Journal Header Strip */}
      <div className="max-w-4xl mx-auto space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#59443F]/70"
        >
          <a
            href="#/home"
            onClick={(e) => handleInternalLink(e, 'home')}
            className="hover:text-[#C9959B] transition-colors"
          >
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-[#C9959B]" aria-hidden="true" />
          <span className="text-[#59443F] font-medium">Blog</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#C9959B]" aria-hidden="true" />
          <span className="text-[#C9959B] font-medium truncate">{activePost.category}</span>
        </nav>

        {/* Future-proof multi-article switcher (shown automatically as soon as additional posts are added) */}
        {BLOG_POSTS.length > 1 && (
          <div
            aria-label="Blog Articles"
            className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#E8DCD0]"
          >
            {BLOG_POSTS.map((post) => (
              <button
                key={post.id}
                onClick={() => {
                  setActivePostSlug(post.slug);
                  window.location.hash = `#/blog/${post.slug}`;
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  post.slug === activePost.slug
                    ? 'bg-[#59443F] text-white shadow-sm'
                    : 'bg-white text-[#59443F]/80 border border-[#E8DCD0] hover:border-[#C9959B]'
                }`}
              >
                {post.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main SEO Article Container */}
      <article className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E8DCD0] shadow-sm overflow-hidden">
        {/* Article Hero Header */}
        <header className="p-6 sm:p-10 lg:p-12 pb-6 sm:pb-8 space-y-5 border-b border-[#E8DCD0]/70 bg-[#FAF7F2]/50">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E6E8] text-[#59443F] font-semibold tracking-wider uppercase text-[11px] border border-[#E8DCD0]">
              <BookOpen className="w-3.5 h-3.5 text-[#C9959B]" aria-hidden="true" />
              {activePost.category}
            </span>
            <span className="text-[#59443F]/75 flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#C9959B]" aria-hidden="true" />
              <time dateTime={activePost.publishedDate}>{activePost.publishedDateDisplay}</time>
            </span>
            <span className="text-[#59443F]/40" aria-hidden="true">
              ·
            </span>
            <span className="text-[#59443F]/75 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#C9959B]" aria-hidden="true" />
              {activePost.readTime}
            </span>
          </div>

          {/* Primary SEO H1 */}
          <h1 className="font-serif text-3xl sm:text-5xl text-[#59443F] font-normal leading-[1.15]">
            {activePost.title}
          </h1>

          <p className="text-base sm:text-lg text-[#59443F]/85 leading-relaxed">
            {activePost.excerpt}
          </p>

          {/* Subtle Article Quick-Jump Navigation */}
          <div className="pt-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9959B] font-bold mb-2.5">
              In This Article
            </p>
            <ul className="flex flex-wrap gap-2">
              {activePost.sections.map((sec) => (
                <li key={sec.id}>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(sec.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E8DCD0] text-[#59443F]/85 hover:border-[#C9959B] hover:text-[#59443F] transition-colors"
                  >
                    {sec.heading}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Featured Editorial Photo */}
        <figure className="border-b border-[#E8DCD0]/70 bg-[#FAF7F2]">
          <div className="aspect-[16/9] sm:aspect-[16/8] w-full overflow-hidden bg-[#E8DCD0]">
            <img
              src={activePost.featuredImage}
              alt={activePost.featuredImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {activePost.featuredImageCaption && (
            <figcaption className="px-6 sm:px-10 py-3 text-xs text-[#59443F]/75 italic bg-[#FAF7F2]">
              {activePost.featuredImageCaption}
            </figcaption>
          )}
        </figure>

        {/* Structured Article Body */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-10 sm:space-y-12">
          {activePost.sections.map((section, sectionIdx) => {
            const isFinalCtaSection = sectionIdx === activePost.sections.length - 1;

            return (
              <section
                key={section.id}
                id={section.id}
                className={`scroll-mt-24 space-y-4 ${
                  isFinalCtaSection
                    ? 'bg-[#FAF7F2] rounded-2xl border border-[#E8DCD0] p-6 sm:p-8'
                    : ''
                }`}
              >
                <h2 className="font-serif text-2xl sm:text-3xl text-[#59443F] font-medium leading-snug">
                  {section.heading}
                </h2>

                {section.paragraphs?.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm sm:text-base text-[#59443F]/85 leading-relaxed"
                  >
                    {renderSegments(para)}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-3 pt-1">
                    {section.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 text-sm sm:text-base text-[#59443F]/85 leading-relaxed"
                      >
                        <span
                          className="w-2 h-2 rounded-full bg-[#C9959B] mt-2 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          {bullet.label && (
                            <strong className="font-semibold text-[#59443F]">
                              {bullet.label}:{' '}
                            </strong>
                          )}
                          {renderSegments(bullet.content)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.image && (
                  <figure className="my-6 rounded-2xl overflow-hidden border border-[#E8DCD0] bg-[#FAF7F2]">
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[#E8DCD0]">
                      <img
                        src={section.image.src}
                        alt={section.image.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {section.image.caption && (
                      <figcaption className="px-4 py-2.5 text-xs text-[#59443F]/75 italic">
                        {section.image.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {section.comparisonTable && (
                  <div className="pt-3 space-y-2">
                    <p className="text-[11px] text-[#59443F]/65 sm:hidden">
                      Swipe horizontally to view full comparison &rarr;
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-[#E8DCD0] bg-white">
                      <table className="w-full min-w-[520px] text-left border-collapse text-xs sm:text-sm">
                        <caption className="sr-only">
                          {section.comparisonTable.caption}
                        </caption>
                        <thead>
                          <tr className="bg-[#F5E6E8]/70 text-[#59443F]">
                            <th
                              scope="col"
                              className="py-3 px-4 font-serif text-sm sm:text-base font-semibold border-b border-[#E8DCD0] whitespace-nowrap"
                            >
                              Feature
                            </th>
                            <th
                              scope="col"
                              className="py-3 px-4 font-serif text-sm sm:text-base font-semibold border-b border-[#E8DCD0]"
                            >
                              BIAB / Builder Gel
                            </th>
                            <th
                              scope="col"
                              className="py-3 px-4 font-serif text-sm sm:text-base font-semibold border-b border-[#E8DCD0]"
                            >
                              Classic Gel Manicure
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCD0]/70 bg-white">
                          {section.comparisonTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                              <th
                                scope="row"
                                className="py-3 px-4 font-semibold text-[#59443F] align-top whitespace-nowrap"
                              >
                                {row.feature}
                              </th>
                              <td className="py-3 px-4 text-[#59443F]/85 align-top">{row.biab}</td>
                              <td className="py-3 px-4 text-[#59443F]/85 align-top">
                                {row.gelPolish}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {section.closingParagraphs?.map((para, cpIdx) => (
                  <p
                    key={cpIdx}
                    className="text-sm sm:text-base text-[#59443F]/85 leading-relaxed pt-1"
                  >
                    {renderSegments(para)}
                  </p>
                ))}

                {/* Action buttons & University Demo Clarification in Final CTA Section */}
                {isFinalCtaSection && (
                  <div className="pt-4 space-y-5">
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="#/book"
                        onClick={(e) =>
                          handleInternalLink(
                            e,
                            'book',
                            'biab-manicure',
                            'Try Booking Demonstration'
                          )
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm transition-all"
                      >
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        Try Booking Demo
                      </a>
                      <a
                        href="#/services"
                        onClick={(e) =>
                          handleInternalLink(e, 'services', undefined, 'Explore Services & Pricing')
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-white text-[#59443F] border border-[#E8DCD0] hover:border-[#C9959B] transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C9959B]" aria-hidden="true" />
                        Explore Services &amp; Pricing
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>

                    <div
                      role="note"
                      aria-label="University Project Demonstration Notice"
                      className="flex items-start gap-2.5 p-4 rounded-xl bg-[#F5E6E8]/70 border border-[#E8DCD0] text-xs text-[#59443F]/90 leading-relaxed"
                    >
                      <Info
                        className="w-4 h-4 text-[#C9959B] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <strong className="font-semibold text-[#59443F]">
                          University Project Demonstration:
                        </strong>{' '}
                        Nail Muse Studio is a conceptual salon website developed for a university
                        digital marketing project in Doncaster, Melbourne. The booking workflow on
                        this site is an interactive demonstration only, not a live appointment
                        system—no real bookings are created and no confirmation emails are sent.
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </article>
    </div>
  );
};
