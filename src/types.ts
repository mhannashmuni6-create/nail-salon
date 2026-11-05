export type ServiceCategory = 'manicures' | 'extensions' | 'pedicures' | 'nail-art';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  description: string;
  isPopular?: boolean;
  image?: string;
}

export type GalleryCategory =
  | 'all'
  | 'french-tips'
  | 'minimalist'
  | 'chrome'
  | 'biab'
  | 'acrylic'
  | 'creative'
  | 'seasonal';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  description: string;
  image: string;
  tags: string[];
  suggestedServiceId?: string;
}

export interface ReviewItem {
  id: string;
  clientName: string;
  suburb: string;
  rating: number;
  service: string;
  reviewText: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type NailShape = 'Almond' | 'Square' | 'Squoval' | 'Oval' | 'Coffin';
export type NailLength = 'Natural / Short' | 'Medium' | 'Long' | 'Extra Long';

export interface BookingFormData {
  serviceId: string;
  serviceName: string;
  price: number;
  durationMinutes: number;
  date: string;
  timeSlot: string;
  nailShape: NailShape;
  nailLength: NailLength;
  addOns: string[];
  designNotes: string;
  fullName: string;
  phone: string;
  email: string;
  reminderOptIn: boolean;
}

export interface ConfirmedBooking extends BookingFormData {
  referenceNumber: string;
  createdAt: string;
}
