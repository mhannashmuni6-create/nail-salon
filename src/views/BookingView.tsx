import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  Mail,
  FileText,
  HeartHandshake,
  Download,
  CalendarCheck,
} from 'lucide-react';
import { SERVICES } from '../data/salonData';
import { NailShape, NailLength, BookingFormData, ConfirmedBooking } from '../types';
import { trackEvent } from '../utils/analytics';

interface BookingViewProps {
  initialServiceId?: string;
  onNavigateHome: () => void;
  onNavigateGallery: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  initialServiceId,
  onNavigateHome,
  onNavigateGallery,
}) => {
  // Step state: 1: Treatment, 2: Date & Time, 3: Preferences, 4: Contact Details, 5: Review, 6: Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || 'biab-manicure'
  );

  // Generate the next 10 available salon business days (Tue-Sun)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let dayOffset = 1; // start tomorrow

    while (count < 10) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday

      // Studio closed on Monday (dayOfWeek === 1)
      if (dayOfWeek !== 1) {
        dates.push({
          dateStr: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-AU', { weekday: 'short' }),
          dayNumber: d.getDate(),
          monthName: d.toLocaleDateString('en-AU', { month: 'short' }),
          fullLabel: d.toLocaleDateString('en-AU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }),
        });
        count++;
      }
      dayOffset++;
    }
    return dates;
  };

  const availableDates = generateAvailableDates();
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.dateStr || '');

  // Time slots
  const timeSlots = [
    { time: '09:30 AM', category: 'Morning', slotsLeft: 2 },
    { time: '11:00 AM', category: 'Morning', slotsLeft: 1 },
    { time: '12:30 PM', category: 'Afternoon', slotsLeft: 3 },
    { time: '02:00 PM', category: 'Afternoon', slotsLeft: 2 },
    { time: '03:30 PM', category: 'Afternoon', slotsLeft: 1 },
    { time: '05:00 PM', category: 'Evening', slotsLeft: 2 },
    { time: '06:15 PM', category: 'Evening', slotsLeft: 1 },
  ];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');

  // Nail preferences
  const [nailShape, setNailShape] = useState<NailShape>('Almond');
  const [nailLength, setNailLength] = useState<NailLength>('Medium');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [designNotes, setDesignNotes] = useState<string>('');

  // Contact details
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [reminderOptIn, setReminderOptIn] = useState<boolean>(true);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Confirmation payload
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Sync if initialServiceId changes
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const addOnOptions = [
    { id: 'chrome', name: 'Glazed Chrome Powder Finish', price: 15, duration: 15 },
    { id: 'french', name: 'Micro-French Smile Lines', price: 15, duration: 15 },
    { id: 'art-accent', name: 'Simple Accent Art (2 nails)', price: 20, duration: 20 },
    { id: 'removal', name: 'Safe Gel/BIAB Removal', price: 30, duration: 30 },
  ];

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const basePrice = selectedService.price;
    const addOnTotal = selectedAddOns.reduce((acc, currId) => {
      const match = addOnOptions.find((a) => a.id === currId);
      return acc + (match ? match.price : 0);
    }, 0);
    return basePrice + addOnTotal;
  };

  const calculateDuration = () => {
    const baseDuration = selectedService.durationMinutes;
    const addOnDuration = selectedAddOns.reduce((acc, currId) => {
      const match = addOnOptions.find((a) => a.id === currId);
      return acc + (match ? match.duration : 0);
    }, 0);
    return baseDuration + addOnDuration;
  };

  const validateStep4 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (phone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number (e.g. 0400 123 456)';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingRef = `NM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const confirmed: ConfirmedBooking = {
      referenceNumber: bookingRef,
      createdAt: new Date().toISOString(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: calculateTotal(),
      durationMinutes: calculateDuration(),
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      nailShape,
      nailLength,
      addOns: selectedAddOns,
      designNotes,
      fullName,
      phone,
      email,
      reminderOptIn,
    };

    setConfirmedBooking(confirmed);
    setCurrentStep(6);

    trackEvent('booking_request_submit', {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      priceTotal: confirmed.price,
      duration: confirmed.durationMinutes,
      date: confirmed.date,
      time: confirmed.timeSlot,
      reference: bookingRef,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadCalendarDemo = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nail Muse Studio Melbourne//Booking//EN
BEGIN:VEVENT
SUMMARY:Nail Muse Studio - ${selectedService.name}
DESCRIPTION:Appointment for ${fullName} (${selectedService.name}) at Nail Muse Studio Melbourne.
LOCATION:Melbourne, Victoria, Australia
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NailMuse_Appointment_${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
          Reserve Your Moment
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#59443F] font-normal">
          Book an Appointment
        </h1>
        <p className="text-sm sm:text-base text-[#59443F]/85 leading-relaxed">
          Select your bespoke treatment, pick a convenient time, and tell us your nail style
          preferences.
        </p>

        {/* University Project Demonstration Notice */}
        <div className="p-3.5 bg-[#F5E6E8]/85 rounded-xl border border-[#E8DCD0] text-xs text-[#59443F]/90 max-w-xl mx-auto flex items-start sm:items-center justify-center gap-2.5 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#C9959B] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>University Project Demonstration:</strong> This booking system is an interactive prototype created for academic assessment. Nail Muse Studio is a conceptual salon; no real appointments are booked, and no payment is processed.
          </span>
        </div>
      </div>

      {/* Step Indicator (Steps 1 to 5) */}
      {currentStep <= 5 && (
        <div className="flex items-center justify-between max-w-2xl mx-auto border-b border-[#E8DCD0] pb-4 text-xs font-medium">
          {[
            { num: 1, label: 'Treatment' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Style Inspo' },
            { num: 4, label: 'Details' },
            { num: 5, label: 'Review' },
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                disabled={s.num > currentStep}
                className={`flex items-center gap-1.5 transition-colors ${
                  isCurrent
                    ? 'text-[#59443F] font-semibold'
                    : isCompleted
                    ? 'text-[#C9959B] hover:text-[#59443F] cursor-pointer'
                    : 'text-[#59443F]/40 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    isCurrent
                      ? 'bg-[#59443F] text-white'
                      : isCompleted
                      ? 'bg-[#C9959B] text-white'
                      : 'bg-[#E8DCD0] text-[#59443F]/70'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* STEP 1: TREATMENT SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#59443F]">1. Select Your Service</h2>
            <span className="text-xs text-[#59443F]/70">Step 1 of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#59443F] shadow-md ring-2 ring-[#C9959B]'
                      : 'bg-white/80 border-[#E8DCD0] hover:border-[#C9959B] hover:bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-medium text-[#59443F]">
                        {service.name}
                      </h3>
                      <span className="font-mono text-base font-semibold text-[#59443F]">
                        ${service.price}
                      </span>
                    </div>
                    <div className="text-xs text-[#59443F]/60 font-mono">
                      {service.durationMinutes} minutes
                    </div>
                    <p className="text-xs text-[#59443F]/80 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8DCD0]/60 flex items-center justify-between text-xs">
                    <span className="text-[#C9959B] font-medium capitalize">
                      {service.category.replace('-', ' ')}
                    </span>
                    <span
                      className={`font-semibold ${
                        isSelected ? 'text-[#59443F]' : 'text-[#59443F]/50'
                      }`}
                    >
                      {isSelected ? '● Selected' : '○ Choose'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm transition-all"
            >
              Continue to Date &amp; Time
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME */}
      {currentStep === 2 && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#59443F]">2. Choose Date &amp; Time</h2>
            <span className="text-xs text-[#59443F]/70">Step 2 of 5</span>
          </div>

          {/* Date Selector Carousel */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
              Select Preferred Date (Melbourne Studio Hours)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#59443F] text-white border-[#59443F] shadow-md ring-2 ring-[#C9959B]'
                        : 'bg-white border-[#E8DCD0] text-[#59443F] hover:border-[#C9959B] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                      {item.dayName}
                    </div>
                    <div className="font-serif text-2xl font-normal py-1">{item.dayNumber}</div>
                    <div className="text-[11px] opacity-75">{item.monthName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Grid */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
              Available Appointment Times
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#FAF7F2] border-[#59443F] shadow-sm ring-2 ring-[#C9959B]'
                        : 'bg-white border-[#E8DCD0] hover:border-[#C9959B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold text-[#59443F]">
                        {slot.time}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#C9959B]" />
                    </div>
                    <div className="text-[11px] text-[#59443F]/70 pt-1">
                      {slot.slotsLeft} chair{slot.slotsLeft > 1 ? 's' : ''} open
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E8DCD0]">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#59443F] hover:text-[#C9959B]"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Treatments
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm transition-all"
            >
              Customise Nail Preferences
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: STYLE PREFERENCES & ADD-ONS */}
      {currentStep === 3 && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#59443F]">
              3. Nail Preferences &amp; Add-Ons
            </h2>
            <span className="text-xs text-[#59443F]/70">Step 3 of 5</span>
          </div>

          {/* Nail Shape Selection */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
              Desired Nail Shape
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(['Almond', 'Square', 'Squoval', 'Oval', 'Coffin'] as NailShape[]).map((shape) => {
                const isSelected = nailShape === shape;
                return (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setNailShape(shape)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#59443F] text-white border-[#59443F] shadow-sm'
                        : 'bg-white border-[#E8DCD0] text-[#59443F] hover:border-[#C9959B]'
                    }`}
                  >
                    {shape}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nail Length Selection */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
              Target Length
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Natural / Short', 'Medium', 'Long', 'Extra Long'] as NailLength[]).map(
                (length) => {
                  const isSelected = nailLength === length;
                  return (
                    <button
                      key={length}
                      type="button"
                      onClick={() => setNailLength(length)}
                      className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-[#59443F] text-white border-[#59443F] shadow-sm'
                          : 'bg-white border-[#E8DCD0] text-[#59443F] hover:border-[#C9959B]'
                      }`}
                    >
                      {length}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold">
              Optional Add-Ons &amp; Finishes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addOnOptions.map((addon) => {
                const isChecked = selectedAddOns.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddOn(addon.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-[#FAF7F2] border-[#59443F] shadow-sm ring-1 ring-[#C9959B]'
                        : 'bg-white border-[#E8DCD0] hover:border-[#C9959B]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-[#59443F]">{addon.name}</div>
                      <div className="text-xs text-[#59443F]/60 font-mono">
                        +{addon.duration} mins
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-semibold text-[#59443F]">
                        +${addon.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspo / Special Request Notes */}
          <div className="space-y-2">
            <label
              htmlFor="designNotes"
              className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold"
            >
              Special Requests or Design Inspo Notes (Optional)
            </label>
            <textarea
              id="designNotes"
              rows={3}
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              placeholder="e.g. Hailey Bieber glazed donut pearl finish, bringing a Pinterest photo with pastel swirl art, delicate cuticles..."
              className="w-full p-4 rounded-xl border border-[#E8DCD0] bg-white text-sm focus:outline-none focus:border-[#C9959B] text-[#59443F]"
            />
          </div>

          {/* Step 3 Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E8DCD0]">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#59443F] hover:text-[#C9959B]"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Date &amp; Time
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm transition-all"
            >
              Enter Client Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONTACT & GUEST DETAILS */}
      {currentStep === 4 && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#59443F]">4. Client Information</h2>
            <span className="text-xs text-[#59443F]/70">Step 4 of 5</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DCD0] p-6 sm:p-8 space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold"
              >
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#C9959B] absolute left-4 top-3.5" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Charlotte Miller"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-sm text-[#59443F] focus:outline-none focus:border-[#C9959B] ${
                    errors.fullName ? 'border-red-400' : 'border-[#E8DCD0]'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold"
              >
                Mobile Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#C9959B] absolute left-4 top-3.5" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0400 123 456"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-sm text-[#59443F] focus:outline-none focus:border-[#C9959B] font-mono ${
                    errors.phone ? 'border-red-400' : 'border-[#E8DCD0]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              <p className="text-[11px] text-[#59443F]/60">
                Used for SMS appointment confirmations and booking reminders.
              </p>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-[#59443F] font-semibold"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C9959B] absolute left-4 top-3.5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. charlotte@example.com.au"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-sm text-[#59443F] focus:outline-none focus:border-[#C9959B] ${
                    errors.email ? 'border-red-400' : 'border-[#E8DCD0]'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Reminder Opt-In Checkbox */}
            <div className="pt-2 flex items-center gap-3">
              <input
                id="reminder"
                type="checkbox"
                checked={reminderOptIn}
                onChange={(e) => setReminderOptIn(e.target.checked)}
                className="w-4 h-4 accent-[#59443F] rounded"
              />
              <label htmlFor="reminder" className="text-xs text-[#59443F]/85 cursor-pointer">
                Send me a calendar invite and SMS reminder 24 hours prior to my session.
              </label>
            </div>
          </div>

          {/* Step 4 Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E8DCD0]">
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#59443F] hover:text-[#C9959B]"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Style
            </button>
            <button
              onClick={() => {
                if (validateStep4()) {
                  setCurrentStep(5);
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm transition-all"
            >
              Review Summary
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & SUBMIT */}
      {currentStep === 5 && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#59443F]">5. Review Appointment Details</h2>
            <span className="text-xs text-[#59443F]/70">Step 5 of 5</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8DCD0] p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DCD0]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9959B] font-bold">
                  Reserved Treatment
                </span>
                <h3 className="font-serif text-2xl text-[#59443F] font-medium">
                  {selectedService.name}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-widest text-[#59443F]/60 block">
                  Estimated Total
                </span>
                <span className="font-mono text-3xl font-semibold text-[#59443F]">
                  ${calculateTotal()}
                </span>
                <span className="text-xs text-[#59443F]/70 block font-mono">
                  ~{calculateDuration()} mins
                </span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#59443F]">Schedule</h4>
                <div className="space-y-1 text-[#59443F]/85">
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#C9959B]" />
                    <span>
                      {
                        availableDates.find((d) => d.dateStr === selectedDate)?.fullLabel ||
                        selectedDate
                      }
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C9959B]" />
                    <span className="font-mono">{selectedTimeSlot}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#59443F]">
                  Nail Preferences
                </h4>
                <div className="space-y-1 text-[#59443F]/85">
                  <p>
                    <strong>Shape:</strong> {nailShape}
                  </p>
                  <p>
                    <strong>Length:</strong> {nailLength}
                  </p>
                  {selectedAddOns.length > 0 && (
                    <p>
                      <strong>Add-Ons:</strong>{' '}
                      {selectedAddOns
                        .map((id) => addOnOptions.find((a) => a.id === id)?.name)
                        .join(', ')}
                    </p>
                  )}
                  {designNotes && (
                    <p className="italic text-xs text-[#59443F]/75">
                      &ldquo;{designNotes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 sm:col-span-2 pt-4 border-t border-[#E8DCD0]/60">
                <h4 className="font-serif text-base font-semibold text-[#59443F]">
                  Client Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-[#59443F]/85">
                  <div>
                    <span className="text-[#59443F]/60 block text-[11px]">Name</span>
                    <strong>{fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[#59443F]/60 block text-[11px]">Phone</span>
                    <strong className="font-mono">{phone}</strong>
                  </div>
                  <div>
                    <span className="text-[#59443F]/60 block text-[11px]">Email</span>
                    <strong>{email}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer reminder */}
            <div className="p-4 bg-[#FAF7F2] rounded-xl text-xs text-[#59443F]/80 leading-relaxed border border-[#E8DCD0]">
              <strong>University Project Demonstration:</strong> Submitting this request demonstrates the prototype appointment staging flow. No real booking is created, no email is sent, and no payment is processed.
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E8DCD0]">
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#59443F] hover:text-[#C9959B]"
            >
              <ChevronLeft className="w-4 h-4" /> Edit Details
            </button>
            <button
              onClick={handleSubmitBooking}
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] shadow-md hover:shadow-lg transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              Submit Booking Request
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CONFIRMATION MESSAGE (DEMONSTRATION COMPLETE) */}
      {currentStep === 6 && confirmedBooking && (
        <div className="bg-white rounded-3xl border border-[#E8DCD0] p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-[#F5E6E8] text-[#59443F] rounded-full mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#C9959B]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9959B] font-bold">
              Demonstration Complete
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#59443F] font-normal">
              Demo Booking Staged!
            </h2>
            <p className="text-sm text-[#59443F]/85 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold">{confirmedBooking.fullName}</span>. Please note that this is a <strong>demonstration only</strong> for a university assessment. <strong>No real appointment has been created</strong>, and <strong>no confirmation email will be sent</strong>.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8DCD0] text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between pb-2 border-b border-[#E8DCD0]">
              <span className="text-[#59443F]/70">Treatment</span>
              <strong className="text-[#59443F]">{confirmedBooking.serviceName}</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DCD0]">
              <span className="text-[#59443F]/70">Date &amp; Time</span>
              <strong className="text-[#59443F]">
                {confirmedBooking.date} at {confirmedBooking.timeSlot}
              </strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8DCD0]">
              <span className="text-[#59443F]/70">Nail Style</span>
              <strong className="text-[#59443F]">
                {confirmedBooking.nailShape} · {confirmedBooking.nailLength}
              </strong>
            </div>
            <div className="flex justify-between font-semibold text-base pt-1">
              <span>Estimated Total (AUD)</span>
              <span className="font-mono">${confirmedBooking.price}</span>
            </div>
          </div>

          {/* Note regarding demonstration status */}
          <div className="text-xs text-[#59443F]/80 bg-[#F5E6E8]/60 p-4 rounded-xl border border-[#E8DCD0] text-left space-y-1.5">
            <p className="font-semibold text-[#59443F]">University Project Demonstration Notice:</p>
            <p>
              This booking summary demonstrates client-side workflow interaction only. No actual booking has been made at any physical salon, no customer records or personal information are stored or transmitted, and no email notifications will be sent.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleDownloadCalendarDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#59443F] text-white hover:bg-[#C9959B] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Calendar (.ics)
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setConfirmedBooking(null);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-white text-[#59443F] border border-[#E8DCD0] hover:border-[#C9959B] transition-colors"
            >
              Book Another Treatment
            </button>
            <button
              onClick={onNavigateGallery}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#C9959B] hover:underline px-4 py-3"
            >
              Explore Gallery →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
