import React, { useEffect, useMemo, useState } from 'react';

const JULY_DATES = Array.from({ length: 31 }, (_, index) => {
  const date = index + 1;
  const weekdays = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
  return {
    label: weekdays[index % 7],
    date: date.toString(),
    weekday: weekdays[index % 7],
  };
});

const JULY_WEEK_DATES = JULY_DATES.slice(1, 8);

const COURT_NUMBERS = Array.from({ length: 6 }, (_, index) => index + 1);

const buildTimeSlots = () => {
  const result = [];
  for (let minutes = 8 * 60; minutes <= 22 * 60 + 30; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const labelHour = hour % 12 === 0 ? 12 : hour % 12;
    const suffix = hour < 12 ? 'AM' : 'PM';
    result.push({ value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`, label: `${labelHour}:${minute.toString().padStart(2, '0')} ${suffix}` });
  }
  return result;
};

const TIME_SLOTS = buildTimeSlots();

const timeToMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

const isWeekend = (weekday) => weekday === 'Sat' || weekday === 'Sun';

const getBookedSlots = (court, weekday) => {
  const base = {
    1: ['08:00', '11:30', '19:00'],
    2: ['09:00', '13:30', '18:30'],
    3: ['10:30', '14:00', '20:00'],
    4: ['12:00', '16:00', '21:30'],
    5: ['08:30', '15:00', '22:00'],
    6: [],
  };
  const weekendExtras = ['09:30', '17:00', '20:30'];
  const booked = [...(base[court] || [])];
  if (isWeekend(weekday)) {
    booked.push(...weekendExtras);
  }
  return booked;
};

const getSlotPrice = (court, weekday, slot) => {
  if (court === 6) return 20;
  if (isWeekend(weekday)) return 40;
  return timeToMinutes(slot) < 16 * 60 ? 30 : 40;
};

const getRangeSlots = (startSlot, duration) => {
  const start = timeToMinutes(startSlot);
  return TIME_SLOTS.filter((slot) => {
    const slotMinutes = timeToMinutes(slot.value);
    return slotMinutes >= start && slotMinutes < start + duration;
  });
};

const getPriceForRange = (court, weekday, startSlot, duration) => {
  const range = getRangeSlots(startSlot, duration);
  return range.reduce((sum, slot) => sum + getSlotPrice(court, weekday, slot.value), 0);
};

const buildRangeLabel = (slot, duration) => {
  const [hour, minute] = slot.split(':').map(Number);
  const start = hour * 60 + minute;
  const end = start + duration;
  const format = (value) => {
    const h = Math.floor(value / 60);
    const m = value % 60;
    const labelHour = h % 12 === 0 ? 12 : h % 12;
    const suffix = h < 12 || h === 24 ? 'AM' : 'PM';
    return `${labelHour}:${m.toString().padStart(2, '0')} ${suffix}`;
  };
  return `${format(start)} - ${format(end)}`;
};

const findFirstAvailableSlot = (court, weekday, duration) => {
  return TIME_SLOTS.find((slot) => {
    const start = timeToMinutes(slot.value);
    const end = start + duration;
    if (end > 23 * 60) return false;
    const booked = getBookedSlots(court, weekday);
    const slice = TIME_SLOTS.filter((item) => {
      const itemMinutes = timeToMinutes(item.value);
      return itemMinutes >= start && itemMinutes < end;
    }).map((item) => item.value);
    return slice.every((item) => !booked.includes(item));
  })?.value ?? TIME_SLOTS[0].value;
};

export default function BookingPage({ facility, userLabel, onBack }) {
  const [selectedDate, setSelectedDate] = useState(JULY_WEEK_DATES[0]);
  const [selectedCourt, setSelectedCourt] = useState(1);
  const [duration, setDuration] = useState(60);
  const [selectedSlot, setSelectedSlot] = useState(() => findFirstAvailableSlot(1, JULY_WEEK_DATES[0].weekday, 60));
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const bookedSlots = useMemo(() => getBookedSlots(selectedCourt, selectedDate.weekday), [selectedCourt, selectedDate]);
  const selectedSlots = useMemo(() => getRangeSlots(selectedSlot, duration), [selectedSlot, duration]);
  const totalPrice = useMemo(
    () => getPriceForRange(selectedCourt, selectedDate.weekday, selectedSlot, duration),
    [selectedCourt, selectedDate, selectedSlot, duration],
  );
  const selectedRange = useMemo(() => buildRangeLabel(selectedSlot, duration), [selectedSlot, duration]);
  const selectedDurationLabel = `${Math.floor(duration / 60)}h${duration % 60 === 0 ? '' : ' 30m'}`;

  const calendarRows = [];
  for (let i = 0; i < JULY_DATES.length; i += 7) {
    calendarRows.push(JULY_DATES.slice(i, i + 7));
  }

  useEffect(() => {
    const first = findFirstAvailableSlot(selectedCourt, selectedDate.weekday, duration);
    if (first !== selectedSlot) {
      setSelectedSlot(first);
    }
  }, [selectedCourt, selectedDate, duration]);

  const changeDuration = (delta) => {
    setDuration((current) => {
      const next = current + delta;
      if (next < 30) return 30;
      if (next > 450) return 450;
      return next;
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedCourt(1);
  };

  const handleCourtSelect = (court) => {
    setSelectedCourt(court);
  };

  const openCalendar = () => setShowCalendarModal(true);
  const closeCalendar = () => setShowCalendarModal(false);

  const openModal = () => {
    setIsConfirmed(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmBooking = () => {
    setIsConfirmed(true);
  };

  const slotDisabled = (slot) => {
    const selectedRange = getRangeSlots(slot.value, duration);
    if (!selectedRange.length) return true;
    if (selectedRange.some((item) => timeToMinutes(item.value) + 30 > 23 * 60)) return true;
    return selectedRange.some((item) => bookedSlots.includes(item.value));
  };

  const isRangeBlocked = slotDisabled({ value: selectedSlot });

  return (
    <div className="home-page booking-page">
      <div className="home-content">
        <div className="booking-header">
          <button type="button" className="circle-back" onClick={onBack} aria-label="Back to home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="booking-title-block">
            <p className="section-label">Select Slots</p>
            <h1 className="facility-name">{facility?.title ?? 'Court booking'}</h1>
          </div>
          <button type="button" className="calendar-expand" onClick={openCalendar} aria-label="Open full calendar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="4" />
              <path d="M3 10h18" />
              <path d="M10 4v6" />
            </svg>
          </button>
        </div>

        <div className="date-row">
          <div className="date-strip">
            {JULY_WEEK_DATES.map((item) => (
              <button
                key={item.date}
                type="button"
                className={`date-pill ${item.date === selectedDate.date ? 'active' : ''}`}
                onClick={() => handleDateSelect(item)}
              >
                <span className="date-weekday">{item.label}</span>
                <strong>{item.date}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="booking-step-row">
          <div className="booking-step-card">
            <span className="step-label">Court</span>
            <strong>#{selectedCourt}</strong>
            <p>{selectedCourt === 6 ? 'Flat AED 40/hr' : isWeekend(selectedDate.weekday) ? 'Weekend AED 80/hr' : 'Weekday 60/80 AED'}</p>
          </div>
          <div className="booking-step-card">
            <span className="step-label">Duration</span>
            <div className="duration-control">
              <button type="button" onClick={() => changeDuration(-30)} disabled={duration <= 30}>-</button>
              <span>{selectedDurationLabel}</span>
              <button type="button" onClick={() => changeDuration(30)} disabled={duration >= 450}>+</button>
            </div>
          </div>
        </div>

        <div className="slot-overview-card">
          <div>
            <p className="section-label">Time</p>
            <h2>{selectedRange}</h2>
          </div>
          <div className="price-badge">AED {totalPrice}</div>
        </div>

        <div className="time-section">
          <div className="time-section-title">
            <p className="section-label">Available time slots</p>
            <span>{selectedDate.label}, July {selectedDate.date}</span>
          </div>
          <div className="time-slider">
            {TIME_SLOTS.map((slot) => {
              const disabled = slotDisabled(slot);
              return (
                <button
                  key={slot.value}
                  type="button"
                  className={`slot-pill ${slot.value === selectedSlot ? 'active' : ''} ${disabled ? 'booked' : ''}`}
                  onClick={() => !disabled && setSelectedSlot(slot.value)}
                  disabled={disabled}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="court-list-card compact-card">
          <p className="section-label black-label">Choose court</p>
          <div className="court-list">
            {COURT_NUMBERS.map((court) => (
              <button
                key={court}
                type="button"
                className={`court-pill ${court === selectedCourt ? 'selected' : ''} ${court === 6 ? 'special' : ''}`}
                onClick={() => handleCourtSelect(court)}
              >
                <span>Court {court}</span>
                <strong>{court === 6 ? 'AED 40/hr' : 'Flexible pricing'}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="availability-row">
          <div className="status-card available">
            <span>Available</span>
            <strong>Selectable</strong>
          </div>
          <div className="status-card booked">
            <span>Booked</span>
            <strong>Unavailable</strong>
          </div>
        </div>

        <button type="button" className="btn primary-btn confirm-button" onClick={openModal} disabled={isRangeBlocked}>
          Confirm booking
        </button>
        {isRangeBlocked && (
          <p className="booking-warning">Selected slot overlaps a booked time or ends after closing.</p>
        )}
      </div>

      {showCalendarModal && (
        <div className="calendar-overlay">
          <div className="calendar-card">
            <div className="calendar-header">
              <div>
                <p className="section-label">July 2026</p>
                <h2>Choose a date</h2>
              </div>
              <button type="button" className="calendar-close" onClick={closeCalendar} aria-label="Close calendar">
                ×
              </button>
            </div>
            <div className="calendar-grid">
              <div className="calendar-weekday">Wed</div>
              <div className="calendar-weekday">Thu</div>
              <div className="calendar-weekday">Fri</div>
              <div className="calendar-weekday">Sat</div>
              <div className="calendar-weekday">Sun</div>
              <div className="calendar-weekday">Mon</div>
              <div className="calendar-weekday">Tue</div>
              {calendarRows.flat().map((day) => (
                <button
                  key={day.date}
                  type="button"
                  className={`calendar-day ${day.date === selectedDate.date ? 'selected' : ''}`}
                  onClick={() => {
                    handleDateSelect(day);
                    closeCalendar();
                  }}
                >
                  <span>{day.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            {!isConfirmed ? (
              <>
                <div className="modal-header">
                  <div>
                    <p className="section-label">Review booking</p>
                    <h2>Confirm your court slot</h2>
                  </div>
                </div>
                <div className="modal-summary">
                  <div className="summary-item">
                    <span>Facility</span>
                    <strong>{facility?.title}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Date</span>
                    <strong>{selectedDate.label}, July {selectedDate.date}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Court</span>
                    <strong>#{selectedCourt}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Time</span>
                    <strong>{selectedRange}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Duration</span>
                    <strong>{selectedDurationLabel}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Total</span>
                    <strong>AED {totalPrice}</strong>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn secondary-btn modal-btn" onClick={closeModal}>
                    Go back
                  </button>
                  <button type="button" className="btn primary-btn modal-btn" onClick={confirmBooking}>
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <div className="modal-success">
                <div className="tick-circle">✓</div>
                <h2>Booking confirmed</h2>
                <p>Great! Your court is booked for {selectedRange} on July {selectedDate.date}.</p>
                <button type="button" className="btn primary-btn done-btn" onClick={closeModal}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
