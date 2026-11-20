import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  Mail,
  Download,
  CalendarCheck,
  Check,
} from 'lucide-react';
import { SERVICES } from '../data/salonData';
import {
  NailShape,
  NailLength,
  ConfirmedBooking,
  ServiceItem,
  SelectedAddOnItem,
} from '../types';
import { trackEvent } from '../utils/analytics';

interface BookingViewProps {
  initialServiceId?: string;
  onNavigateHome: () => void;
  onNavigateGallery: () => void;
}

const MAIN_TREATMENT_IDS = new Set([
  'classic-manicure',
  'gel-manicure',
  'biab-manicure',
  'acrylic-full-set',
  'acrylic-refill',
  'gel-extensions',
  'classic-pedicure',
  'spa-pedicure',
  'gel-pedicure',
]);

const ADD_ON_IDS = new Set([
  'french-addon',
  'simple-nail-art',
  'detailed-nail-art',
  'chrome-finish',
  'nail-repair',
  'product-removal',
  'extension-removal',
]);

const PEDICURE_IDS = new Set(['classic-pedicure', 'spa-pedicure', 'gel-pedicure']);
const REGULAR_POLISH_IDS = new Set(['classic-manicure', 'classic-pedicure']);

const getAddOnCompatibility = (
  addOnId: string,
  mainServiceId: string,
  selectedAddOns: string[]
): { compatible: boolean; reason?: string } => {
  // Mutually exclusive Nail Art tiers
  if (addOnId === 'simple-nail-art' && selectedAddOns.includes('detailed-nail-art')) {
    return {
      compatible: false,
      reason: 'Detailed Nail Art (all 10 nails) is already selected',
    };
  }
  if (addOnId === 'detailed-nail-art' && selectedAddOns.includes('simple-nail-art')) {
    return {
      compatible: false,
      reason: 'Deselect Simple Nail Art to upgrade to Detailed Nail Art',
    };
  }

  // Mutually exclusive Removal types
  if (addOnId === 'product-removal' && selectedAddOns.includes('extension-removal')) {
    return {
      compatible: false,
      reason: 'One removal service per appointment',
    };
  }
  if (addOnId === 'extension-removal' && selectedAddOns.includes('product-removal')) {
    return {
      compatible: false,
      reason: 'One removal service per appointment',
    };
  }

  if (!mainServiceId) {
    return { compatible: true };
  }

  // Chrome finish requires cured gel, BIAB, or extension base
  if (addOnId === 'chrome-finish' && REGULAR_POLISH_IDS.has(mainServiceId)) {
    return {
      compatible: false,
      reason: 'Requires gel, BIAB, or extension base',
    };
  }

  // Full removal is incompatible with Acrylic Refill
  if (
    (addOnId === 'product-removal' || addOnId === 'extension-removal') &&
    mainServiceId === 'acrylic-refill'
  ) {
    return {
      compatible: false,
      reason: 'Not combinable with Acrylic Refill',
    };
  }

  // Artificial hand extension removal cannot be added to a standalone pedicure
  if (addOnId === 'extension-removal' && PEDICURE_IDS.has(mainServiceId)) {
    return {
      compatible: false,
      reason: 'For hand extensions only — select a manicure or extension set',
    };
  }

  return { compatible: true };
};

export const BookingView: React.FC<BookingViewProps> = ({
  initialServiceId,
  onNavigateGallery,
}) => {
  // Step state: 1: Treatment, 2: Date & Time, 3: Preferences, 4: Contact Details, 5: Review, 6: Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  const mainTreatments: ServiceItem[] = SERVICES.filter((s) => MAIN_TREATMENT_IDS.has(s.id));
  const addOnServices: ServiceItem[] = SERVICES.filter((s) => ADD_ON_IDS.has(s.id));

  // Main treatment (single selection, required) & compatible add-ons (multi-select checkboxes)
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (initialServiceId && MAIN_TREATMENT_IDS.has(initialServiceId)) {
      return initialServiceId;
    }
    return '';
  });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(() => {
    if (initialServiceId && ADD_ON_IDS.has(initialServiceId)) {
      return [initialServiceId];
    }
    return [];
  });

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
  const [designNotes, setDesignNotes] = useState<string>('');

  // Contact details
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [reminderOptIn, setReminderOptIn] = useState<boolean>(true);

  // Errors & compatibility feedback
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [compatibilityNote, setCompatibilityNote] = useState<string | null>(null);

  // Confirmation payload
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Sync if initialServiceId changes (e.g., clicking Book Now from Services or Gallery)
  useEffect(() => {
    if (!initialServiceId) return;

    if (MAIN_TREATMENT_IDS.has(initialServiceId)) {
      setSelectedServiceId(initialServiceId);
      setSelectedAddOns((prev) =>
        prev.filter((id) => getAddOnCompatibility(id, initialServiceId, prev).compatible)
      );
      setCompatibilityNote(null);
    } else if (ADD_ON_IDS.has(initialServiceId)) {
      setSelectedAddOns((prev) => {
        if (prev.includes(initialServiceId)) return prev;
        const next = prev.filter((id) => {
          if (initialServiceId === 'simple-nail-art' && id === 'detailed-nail-art') return false;
          if (initialServiceId === 'detailed-nail-art' && id === 'simple-nail-art') return false;
          if (initialServiceId === 'product-removal' && id === 'extension-removal') return false;
          if (initialServiceId === 'extension-removal' && id === 'product-removal') return false;
          return true;
        });
        return [...next, initialServiceId];
      });
    }
  }, [initialServiceId]);

  const selectedMainService = mainTreatments.find((s) => s.id === selectedServiceId) || null;
  const selectedAddOnServices = addOnServices.filter((a) => selectedAddOns.includes(a.id));

  const handleSelectMainTreatment = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const removedNames: string[] = [];

    setSelectedAddOns((prev) =>
      prev.filter((addOnId) => {
        const compat = getAddOnCompatibility(addOnId, serviceId, prev);
        if (!compat.compatible) {
          const svc = addOnServices.find((a) => a.id === addOnId);
          if (svc) removedNames.push(svc.name);
        }
        return compat.compatible;
      })
    );

    if (removedNames.length > 0) {
      setCompatibilityNote(
        `${removedNames.join(', ')} was deselected because it is not compatible with the selected main treatment.`
      );
    } else {
      setCompatibilityNote(null);
    }
  };

  const handleToggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns((prev) => prev.filter((item) => item !== id));
      setCompatibilityNote(null);
      return;
    }

    const compat = getAddOnCompatibility(id, selectedServiceId, selectedAddOns);
    if (!compat.compatible) {
      return;
    }

    setSelectedAddOns((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setCompatibilityNote(null);
  };

  const calculateTotal = () => {
    const basePrice = selectedMainService ? selectedMainService.price : 0;
    const addOnTotal = selectedAddOnServices.reduce((acc, item) => acc + item.price, 0);
    return basePrice + addOnTotal;
  };

  const calculateDuration = () => {
    const baseDuration = selectedMainService ? selectedMainService.durationMinutes : 0;
    const addOnDuration = selectedAddOnServices.reduce(
      (acc, item) => acc + item.durationMinutes,
      0
    );
    return baseDuration + addOnDuration;
  };

  const isStep4FormValid = () => {
    return (
      fullName.trim().length > 0 &&
      phone.trim().length >= 8 &&
      email.trim().includes('@') &&
      email.trim().includes('.')
    );
  };

  const validateStep4 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (phone.trim().length < 8) {
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

  const isCurrentStepComplete = () => {
    switch (currentStep) {
      case 1:
        return Boolean(selectedMainService);
      case 2:
        return Boolean(selectedDate && selectedTimeSlot);
      case 3:
        return Boolean(nailShape && nailLength);
      case 4:
        return isStep4FormValid();
      case 5:
        return Boolean(selectedMainService && selectedDate && selectedTimeSlot && isStep4FormValid());
      default:
        return false;
    }
  };

  const scrollStepToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleSubmitBooking = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMainService || !validateStep4()) return;

    const bookingRef = `NM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const addOnItems: SelectedAddOnItem[] = selectedAddOnServices.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      durationMinutes: item.durationMinutes,
    }));

    const confirmed: ConfirmedBooking = {
      referenceNumber: bookingRef,
      createdAt: new Date().toISOString(),
      serviceId: selectedMainService.id,
      serviceName: selectedMainService.name,
      price: calculateTotal(),
      durationMinutes: calculateDuration(),
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      nailShape,
      nailLength,
      addOns: addOnItems.map((a) => a.id),
      addOnItems,
      designNotes,
      fullName,
      phone,
      email,
      reminderOptIn,
    };

    setConfirmedBooking(confirmed);
    setCurrentStep(6);

    trackEvent('booking_request_submit', {
      serviceId: selectedMainService.id,
      serviceName: selectedMainService.name,
      addOnIds: addOnItems.map((a) => a.id).join(',') || 'none',
      addOnNames: addOnItems.map((a) => a.name).join(', ') || 'none',
      addOnCount: addOnItems.length,
      priceTotal: confirmed.price,
      duration: confirmed.durationMinutes,
      date: confirmed.date,
      time: confirmed.timeSlot,
      reference: bookingRef,
    });

    scrollStepToTop();
  };

  const handleNextStep = () => {
    if (!isCurrentStepComplete()) return;

    if (currentStep === 1 && selectedMainService) {
      setCurrentStep(2);
      scrollStepToTop();
      return;
    }
    if (currentStep === 2 && selectedDate && selectedTimeSlot) {
      setCurrentStep(3);
      scrollStepToTop();
      return;
    }
    if (currentStep === 3 && nailShape && nailLength) {
      setCurrentStep(4);
      scrollStepToTop();
      return;
    }
    if (currentStep === 4 && validateStep4()) {
      setCurrentStep(5);
      scrollStepToTop();
      return;
    }
    if (currentStep === 5) {
      handleSubmitBooking();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1 && currentStep <= 5) {
      setCurrentStep((prev) => prev - 1);
      scrollStepToTop();
    }
  };

  const handleDownloadCalendarDemo = () => {
    if (!confirmedBooking) return;

    const addOnNames = confirmedBooking.addOnItems.map((a) => a.name);
    const serviceHeadline =
      addOnNames.length > 0
        ? `${confirmedBooking.serviceName} + ${addOnNames.join(', ')}`
        : confirmedBooking.serviceName;

    const descriptionLines = [
      `Appointment for ${confirmedBooking.fullName} at Nail Muse Studio (Doncaster, Melbourne).`,
      `Main Treatment: ${confirmedBooking.serviceName}`,
      `Additional Services: ${addOnNames.length > 0 ? addOnNames.join(', ') : 'None'}`,
      `Nail Style: ${confirmedBooking.nailShape} (${confirmedBooking.nailLength})`,
      `Scheduled Time: ${confirmedBooking.date} at ${confirmedBooking.timeSlot}`,
      `Estimated Duration: ~${confirmedBooking.durationMinutes} mins`,
      `Estimated Total: $${confirmedBooking.price} AUD`,
      `Reference: ${confirmedBooking.referenceNumber} (University Project Demo)`,
    ].join('\\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nail Muse Studio Melbourne//Booking//EN
BEGIN:VEVENT
SUMMARY:Nail Muse Studio - ${serviceHeadline}
DESCRIPTION:${descriptionLines}
LOCATION:Doncaster, Melbourne, Victoria, Australia
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NailMuse_Appointment_${confirmedBooking.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const nextButtonLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Next: Date & Time';
      case 2:
        return 'Next: Nail Preferences';
      case 3:
        return 'Next: Client Details';
      case 4:
        return 'Next: Review Summary';
      case 5:
        return 'Submit Booking Request';
      default:
        return 'Next';
    }
  };

  const stepReady = isCurrentStepComplete();

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
          Select your main treatment and any compatible add-ons, choose a convenient time, and
          share your nail preferences.
        </p>
      </div>

      {/* Step Indicator (Steps 1 to 5) */}
      {currentStep <= 5 && (
        <div className="flex items-center justify-between max-w-2xl mx-auto border-b border-[#E8DCD0] pb-4 text-xs font-medium">
          {[
            { num: 1, label: 'Treatments' },
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
                type="button"
                onClick={() => {
                  if (s.num < currentStep) {
                    setCurrentStep(s.num);
                    scrollStepToTop();
                  }
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

      {/* STEP 1: MAIN TREATMENT + COMPATIBLE ADD-ONS */}
      {currentStep === 1 && (
        <div className="space-y-10">
          {/* Part A: Main Treatments (Single Select Required) */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <h2 className="font-serif text-2xl text-[#59443F]">
                  1. Choose Your Main Treatment *
                </h2>
                <p className="text-xs text-[#59443F]/75 mt-1">
                  Select one primary manicure, extension set, or pedicure treatment.
                </p>
              </div>
              <span className="text-xs text-[#59443F]/70 shrink-0">Step 1 of 5</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainTreatments.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleSelectMainTreatment(service.id)}
                    aria-pressed={isSelected}
                    className={`text-left cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-[#59443F] shadow-md ring-2 ring-[#C9959B]'
                        : 'bg-white/80 border-[#E8DCD0] hover:border-[#C9959B] hover:bg-white'
                    }`}
                  >
                    <div className="space-y-2 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg font-medium text-[#59443F]">
                          {service.name}
                        </h3>
                        <span className="font-mono text-base font-semibold text-[#59443F] shrink-0">
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

                    <div className="mt-4 pt-3 border-t border-[#E8DCD0]/60 flex items-center justify-between text-xs w-full">
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part B: Optional Add-Ons & Extras (Multi-Select Checkboxes) */}
          <div className="space-y-4 pt-6 border-t border-[#E8DCD0]">
            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl text-[#59443F]">
                  Optional Add-Ons &amp; Extras
                </h3>
                <span className="text-xs text-[#C9959B] font-medium">
                  Select multiple compatible extras
                </span>
              </div>
              <p className="text-xs text-[#59443F]/75">
                Enhance your main treatment with French tips, nail art, chrome powder, nail repair,
                or safe product removal.
              </p>
            </div>

            {compatibilityNote && (
              <div
                role="status"
                className="flex items-start gap-2 text-xs text-[#59443F] bg-[#F5E6E8]/80 px-4 py-2.5 rounded-xl border border-[#E8DCD0]"
              >
                <AlertCircle className="w-4 h-4 text-[#C9959B] shrink-0 mt-0.5" />
                <span>{compatibilityNote}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {addOnServices.map((addon) => {
                const isChecked = selectedAddOns.includes(addon.id);
                const compat = getAddOnCompatibility(
                  addon.id,
                  selectedServiceId,
                  selectedAddOns
                );
                const isDisabled = !isChecked && !compat.compatible;

                return (
                  <label
                    key={addon.id}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all flex items-start gap-3.5 ${
                      isDisabled
                        ? 'bg-[#FAF7F2]/60 border-[#E8DCD0]/70 opacity-60 cursor-not-allowed'
                        : isChecked
                        ? 'bg-[#FAF7F2] border-[#59443F] shadow-sm ring-1 ring-[#C9959B] cursor-pointer'
                        : 'bg-white border-[#E8DCD0] hover:border-[#C9959B] cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => handleToggleAddOn(addon.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-[#59443F] border-[#59443F] text-white'
                          : isDisabled
                          ? 'bg-[#E8DCD0]/50 border-[#E8DCD0]'
                          : 'bg-white border-[#C9959B]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </span>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-lg font-medium text-[#59443F] leading-snug">
                          {addon.name}
                        </span>
                        <span className="font-mono text-sm font-semibold text-[#59443F] shrink-0">
                          +${addon.price}
                        </span>
                      </div>
                      <div className="text-xs text-[#59443F]/60 font-mono">
                        +{addon.durationMinutes} minutes
                      </div>
                      <p className="text-xs text-[#59443F]/80 leading-relaxed">
                        {addon.description}
                      </p>
                      {isDisabled && compat.reason && (
                        <p className="text-[11px] text-[#9E6B72] font-medium pt-0.5">
                          {compat.reason}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
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
        </div>
      )}

      {/* STEP 3: STYLE PREFERENCES */}
      {currentStep === 3 && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#59443F]">3. Nail Shape &amp; Style Notes</h2>
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
              placeholder="e.g. Glazed pearl finish, bringing a Pinterest photo with pastel swirl art, delicate cuticles..."
              className="w-full p-4 rounded-xl border border-[#E8DCD0] bg-white text-sm focus:outline-none focus:border-[#C9959B] text-[#59443F]"
            />
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
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
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
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
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
        </div>
      )}

      {/* STEP 5: REVIEW & SUBMIT */}
      {currentStep === 5 && selectedMainService && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#59443F]">5. Review Appointment Details</h2>
            <span className="text-xs text-[#59443F]/70">Step 5 of 5</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8DCD0] p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DCD0]">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C9959B] font-bold">
                  Selected Services
                </span>
                <h3 className="font-serif text-2xl text-[#59443F] font-medium">
                  {selectedMainService.name}
                </h3>
                <p className="text-xs text-[#59443F]/70 font-mono">
                  Base treatment: ${selectedMainService.price} ·{' '}
                  {selectedMainService.durationMinutes} mins
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
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

            {/* Selected Add-Ons Breakdown */}
            {selectedAddOnServices.length > 0 && (
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8DCD0]/80 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#59443F]/70 font-semibold block">
                  Additional Services ({selectedAddOnServices.length})
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  {selectedAddOnServices.map((addon) => (
                    <li
                      key={addon.id}
                      className="flex items-center justify-between gap-4 text-[#59443F]/90"
                    >
                      <span>+ {addon.name}</span>
                      <span className="font-mono text-xs text-[#59443F]/75 shrink-0">
                        +${addon.price} · +{addon.durationMinutes} mins
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#59443F]">Schedule</h4>
                <div className="space-y-1 text-[#59443F]/85">
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#C9959B]" />
                    <span>
                      {availableDates.find((d) => d.dateStr === selectedDate)?.fullLabel ||
                        selectedDate}
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
          </div>
        </div>
      )}

      {/* UNIFIED STICKY BOTTOM NAVIGATION & APPOINTMENT SUMMARY BAR (STEPS 1 TO 5) */}
      {currentStep <= 5 && (
        <div className="sticky bottom-3 sm:bottom-4 z-30 pt-2">
          <div className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#E8DCD0] rounded-2xl shadow-lg p-3.5 sm:px-6 sm:py-4 space-y-2.5">
            {currentStep === 5 && (
              <div className="flex items-center justify-center sm:justify-end gap-2 text-xs text-[#59443F]/85 bg-[#F5E6E8]/75 px-3.5 py-2 rounded-xl border border-[#E8DCD0]">
                <AlertCircle className="w-3.5 h-3.5 text-[#C9959B] shrink-0" />
                <span>Demo booking only &mdash; no real appointment will be created.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Live Summary */}
              <div className="flex items-center justify-between sm:justify-start gap-4 min-w-0">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#59443F] truncate">
                    {selectedMainService
                      ? selectedAddOnServices.length > 0
                        ? `${selectedMainService.name} + ${selectedAddOnServices.length} add-on${
                            selectedAddOnServices.length > 1 ? 's' : ''
                          }`
                        : selectedMainService.name
                      : 'Select a main treatment to begin'}
                  </p>
                  <p className="text-[11px] text-[#59443F]/70 font-mono">
                    {currentStep === 4 && !stepReady
                      ? 'Complete name, phone & email to continue'
                      : selectedMainService
                      ? `Total: $${calculateTotal()} AUD · ~${calculateDuration()} mins`
                      : selectedAddOnServices.length > 0
                      ? `${selectedAddOnServices.length} add-on selected ($${calculateTotal()})`
                      : `Step ${currentStep} of 5`}
                  </p>
                </div>
              </div>

              {/* Action Controls (Single Back + Single Next/Submit button to avoid duplicates) */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#59443F] bg-white border border-[#E8DCD0] hover:border-[#C9959B] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <span className="text-[11px] text-[#59443F]/60 sm:hidden">
                    Step {currentStep} of 5
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!stepReady}
                  className={`inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                    stepReady
                      ? 'bg-[#59443F] text-white hover:bg-[#C9959B] shadow-sm hover:shadow-md cursor-pointer'
                      : 'bg-[#E8DCD0] text-[#59443F]/50 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 5 && <CalendarCheck className="w-4 h-4" />}
                  <span>{nextButtonLabel()}</span>
                  {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
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
              Thank you, <span className="font-semibold">{confirmedBooking.fullName}</span>. Your
              selected services and appointment preferences are summarised below.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8DCD0] text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between gap-4 pb-2 border-b border-[#E8DCD0]">
              <span className="text-[#59443F]/70 shrink-0">Main Treatment</span>
              <strong className="text-[#59443F] text-right">{confirmedBooking.serviceName}</strong>
            </div>
            {confirmedBooking.addOnItems.length > 0 && (
              <div className="pb-2 border-b border-[#E8DCD0] space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-[#59443F]/70 shrink-0">Additional Services</span>
                  <strong className="text-[#59443F] text-right">
                    {confirmedBooking.addOnItems.map((a) => a.name).join(', ')}
                  </strong>
                </div>
              </div>
            )}
            <div className="flex justify-between gap-4 pb-2 border-b border-[#E8DCD0]">
              <span className="text-[#59443F]/70 shrink-0">Date &amp; Time</span>
              <strong className="text-[#59443F] text-right">
                {confirmedBooking.date} at {confirmedBooking.timeSlot}
              </strong>
            </div>
            <div className="flex justify-between gap-4 pb-2 border-b border-[#E8DCD0]">
              <span className="text-[#59443F]/70 shrink-0">Nail Style</span>
              <strong className="text-[#59443F] text-right">
                {confirmedBooking.nailShape} · {confirmedBooking.nailLength}
              </strong>
            </div>
            <div className="flex justify-between gap-4 pb-2 border-b border-[#E8DCD0]">
              <span className="text-[#59443F]/70 shrink-0">Total Duration</span>
              <strong className="text-[#59443F] font-mono text-right">
                ~{confirmedBooking.durationMinutes} mins
              </strong>
            </div>
            <div className="flex justify-between font-semibold text-base pt-1">
              <span>Estimated Total (AUD)</span>
              <span className="font-mono">${confirmedBooking.price}</span>
            </div>
          </div>

          {/* Single clear demonstration disclaimer */}
          <div className="text-xs sm:text-sm text-[#59443F]/90 bg-[#F5E6E8]/60 p-4 rounded-xl border border-[#E8DCD0] text-center leading-relaxed">
            This is a university project demonstration. No real appointment has been created, and
            no confirmation email will be sent.
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
