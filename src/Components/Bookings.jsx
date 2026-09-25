import { useState, useEffect } from "react";
import "../Styles/Bookings.css";
import { services, barbers, timeSlots } from "../Data/bookingsData";
import { supabase } from "../lib/SupabaseClient";

// const services = [
//   {
//     id: "classic-cut",
//     name: "Classic Cut",
//     price: 250,
//     duration: 45,
//   },
//   {
//     id: "skin-fade",
//     name: "Skin Fade",
//     price: 300,
//     duration: 60,
//   },
//   {
//     id: "beard-trim",
//     name: "Beard Trim",
//     price: 150,
//     duration: 30,
//   },
//   {
//     id: "cut-beard",
//     name: "Cut & Beard",
//     price: 380,
//     duration: 75,
//   },
//   {
//     id: "kids-cut",
//     name: "Kids Cut",
//     price: 180,
//     duration: 30,
//   },
//   {
//     id: "full-groom",
//     name: "The Full Groom",
//     price: 500,
//     duration: 90,
//   },
// ];

// const barbers = [
//   {
//     id: "marcus",
//     name: "Marcus Williams",
//     specialty: "Master Barber",
//   },
//   {
//     id: "daniel",
//     name: "Daniel Mokoena",
//     specialty: "Senior Barber",
//   },
//   {
//     id: "thabo",
//     name: "Thabo Nkosi",
//     specialty: "Barber",
//   },
// ];

// const timeSlots = [
//   "09:00",
//   "09:30",
//   "10:00",
//   "10:30",
//   "11:00",
//   "11:30",
//   "12:00",
//   "12:30",
//   "13:00",
//   "13:30",
//   "14:00",
//   "14:30",
//   "15:00",
//   "15:30",
//   "16:00",
//   "16:30",
// ];

function Booking() {
  const [step, setStep] = useState(1);

  const [booking, setBooking] = useState({
    service: "",
    barber: "",
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!booking.barber || !booking.date) {
        setBookedSlots([]);
        return;
      }

      setLoadingSlots(true);
      setBookingError("");

      const { data, error } = await supabase
        .from("appointment_availability")
        .select("barber_id, appointment_date, appointment_time, duration")
        .eq("barber_id", booking.barber)
        .eq("appointment_date", booking.date)
        .eq("status", "confirmed");

      if (error) {
        console.error("Availability error:", error);
        setBookingError("We couldn't load availability. Please try again.");
        setBookedSlots([]);
      } else {
        setBookedSlots(data || []);
      }

      setLoadingSlots(false);
    };

    fetchBookedSlots();
  }, [booking.barber, booking.date]);

  const updateBooking = (field, value) => {
    setBooking((current) => {
      const updated = {
        ...current,
        [field]: value,
      };

      if (field === "barber" || field === "date") {
        updated.time = "";
      }

      return updated;
    });

    setBookingError("");
  };

  const isTimeSlotBooked = (time) => {
    if (!selectedService) return false;

    const requestedStart = new Date(`${booking.date}T${time}:00`);

    const requestedEnd = new Date(
      requestedStart.getTime() + selectedService.duration * 60 * 1000,
    );

    return bookedSlots.some((slot) => {
      const existingStart = new Date(
        `${slot.appointment_date}T${slot.appointment_time}`,
      );

      const existingEnd = new Date(
        existingStart.getTime() + slot.duration * 60 * 1000,
      );

      return requestedStart < existingEnd && requestedEnd > existingStart;
    });
  };

  const selectedService = services.find(
    (service) => service.id === booking.service,
  );

  const selectedBarber = barbers.find((barber) => barber.id === booking.barber);

  const nextStep = () => {
    setStep((current) => current + 1);
  };

  const previousStep = () => {
    setStep((current) => current - 1);
  };

  const canContinue = () => {
    if (step === 1) return booking.service;
    if (step === 2) return booking.barber;
    if (step === 3) return booking.date && booking.time;
    if (step === 4) {
      return (
        booking.firstName && booking.lastName && booking.email && booking.phone
      );
    }

    return true;
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedBarber || !booking.date || !booking.time) {
      return;
    }

    setSubmitting(true);
    setBookingError("");

    const { error } = await supabase.from("appointments").insert({
      service_id: selectedService.id,
      service_name: selectedService.name,
      price: selectedService.price,
      duration: selectedService.duration,

      barber_id: selectedBarber.id,
      barber_name: selectedBarber.name,

      appointment_date: booking.date,
      appointment_time: booking.time,

      customer_first_name: booking.firstName.trim(),
      customer_last_name: booking.lastName.trim(),
      customer_email: booking.email.trim(),
      customer_phone: booking.phone.trim(),

      status: "confirmed",
    });

    if (error) {
      console.error("Booking error:", error);

      if (
        error.message?.includes("overlapping time") ||
        error.message?.includes("unique_barber_appointment")
      ) {
        setBookingError(
          "That time has just been booked. Please choose another time.",
        );

        // Refresh availability
        const { data } = await supabase
          .from("appointment_availability")
          .select("barber_id, appointment_date, appointment_time, duration")
          .eq("barber_id", booking.barber)
          .eq("appointment_date", booking.date)
          .eq("status", "confirmed");

        setBookedSlots(data || []);
      } else {
        setBookingError("We couldn't complete your booking. Please try again.");
      }

      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setStep(5);
  };

  const addToGoogleCalendar = () => {
    if (!booking.date || !booking.time || !selectedService) return;

    const [hours, minutes] = booking.time.split(":").map(Number);

    const start = new Date(`${booking.date}T${booking.time}:00`);

    const end = new Date(
      start.getTime() + selectedService.duration * 60 * 1000,
    );

    const formatGoogleDate = (date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    };

    const startDate = formatGoogleDate(start);
    const endDate = formatGoogleDate(end);

    const title = encodeURIComponent(
      `${selectedService.name} with ${selectedBarber.name}`,
    );

    const details = encodeURIComponent(
      `Holloway Barbers appointment.\n\nService: ${selectedService.name}\nBarber: ${selectedBarber.name}\nCustomer: ${booking.firstName} ${booking.lastName}`,
    );

    const location = encodeURIComponent("Holloway Barbers, Johannesburg");

    const calendarUrl =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${title}` +
      `&dates=${startDate}/${endDate}` +
      `&details=${details}` +
      `&location=${location}`;

    window.open(calendarUrl, "_blank");
  };

  const addToAppleCalendar = () => {
    if (!booking.date || !booking.time || !selectedService) return;

    const [hours, minutes] = booking.time.split(":").map(Number);

    const start = new Date(`${booking.date}T${booking.time}:00`);

    const end = new Date(
      start.getTime() + selectedService.duration * 60 * 1000,
    );

    const formatICSDate = (date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    };

    const startDate = formatICSDate(start);
    const endDate = formatICSDate(end);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Barber Lounge//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@thebarberlounge.co.za`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${selectedService.name} with ${selectedBarber.name}`,
      `DESCRIPTION:The Barber Lounge appointment. Service: ${selectedService.name}. Barber: ${selectedBarber.name}. Customer: ${booking.firstName} ${booking.lastName}.`,
      "LOCATION:The Barber Lounge, Johannesburg",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "holloway-barbers-appointment.ics";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section className="booking" id="booking">
      <div className="booking-container">
        <div className="booking-header">
          <p className="section-eyebrow">BOOK YOUR VISIT</p>

          <h2>
            YOUR NEXT
            <span>LOOK STARTS HERE.</span>
          </h2>

          <p>
            Choose your service, barber and preferred time. We'll take care of
            the rest.
          </p>
        </div>

        <div className="booking-wrapper">
          {/* Progress */}

          <div className="booking-progress">
            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className={`progress-item ${step >= number ? "active" : ""}`}
              >
                <span>{String(number).padStart(2, "0")}</span>

                <small>
                  {number === 1 && "SERVICE"}
                  {number === 2 && "BARBER"}
                  {number === 3 && "DATE & TIME"}
                  {number === 4 && "YOUR DETAILS"}
                </small>
              </div>
            ))}
          </div>

          <div className="booking-form">
            {/* STEP 1 */}

            {step === 1 && (
              <div className="booking-step">
                <div className="step-heading">
                  <span>01</span>

                  <div>
                    <h3>Choose your service</h3>
                    <p>Select the service you'd like to book.</p>
                  </div>
                </div>

                <div className="booking-options">
                  {services.map((service) => (
                    <button
                      type="button"
                      key={service.id}
                      className={`booking-option ${
                        booking.service === service.id ? "selected" : ""
                      }`}
                      onClick={() => updateBooking("service", service.id)}
                    >
                      <div>
                        <strong>{service.name}</strong>
                        <span>{service.duration} MIN</span>
                      </div>

                      <b>R{service.price}</b>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <div className="booking-step">
                <div className="step-heading">
                  <span>02</span>

                  <div>
                    <h3>Choose your barber</h3>
                    <p>Who would you like to see?</p>
                  </div>
                </div>

                <div className="barber-options">
                  {barbers.map((barber) => (
                    <button
                      type="button"
                      key={barber.id}
                      className={`barber-option ${
                        booking.barber === barber.id ? "selected" : ""
                      }`}
                      onClick={() => updateBooking("barber", barber.id)}
                    >
                      <div className="barber-avatar">
                        {barber.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>

                      <div>
                        <strong>{barber.name}</strong>
                        <span>{barber.specialty}</span>
                      </div>

                      <span className="option-check">✓</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <div className="booking-step">
                <div className="step-heading">
                  <span>03</span>

                  <div>
                    <h3>Choose date & time</h3>
                    <p>Select an available appointment.</p>
                  </div>
                </div>

                <div className="date-time-fields">
                  <div className="field">
                    <label htmlFor="date">DATE</label>

                    <input
                      id="date"
                      type="date"
                      value={booking.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(event) =>
                        updateBooking("date", event.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label>AVAILABLE TIMES</label>

                    {/* <div className="time-grid">
                      {timeSlots.map((time) => (
                        <button
                          type="button"
                          key={time}
                          className={booking.time === time ? "selected" : ""}
                          onClick={() => updateBooking("time", time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div> */}

                    {loadingSlots ? (
                      <p className="booking-loading">
                        CHECKING AVAILABILITY...
                      </p>
                    ) : (
                      <div className="time-grid">
                        {timeSlots.map((time) => {
                          const booked = isTimeSlotBooked(time);

                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={booked}
                              onClick={() => updateBooking("time", time)}
                              className={`
            time-slot
            ${booking.time === time ? "selected" : ""}
            ${booked ? "booked" : ""}
          `}
                            >
                              {time}
                              {booked && (
                                <span className="time-status">BOOKED</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}

            {bookingError && (
              <div className="booking-error">{bookingError}</div>
            )}

            {step === 4 && (
              <div className="booking-step">
                <div className="step-heading">
                  <span>04</span>

                  <div>
                    <h3>Your details</h3>
                    <p>Tell us where we can reach you.</p>
                  </div>
                </div>

                <div className="customer-fields">
                  <div className="field">
                    <label htmlFor="firstName">FIRST NAME</label>

                    <input
                      id="firstName"
                      type="text"
                      value={booking.firstName}
                      onChange={(event) =>
                        updateBooking("firstName", event.target.value)
                      }
                      placeholder="First name"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="lastName">LAST NAME</label>

                    <input
                      id="lastName"
                      type="text"
                      value={booking.lastName}
                      onChange={(event) =>
                        updateBooking("lastName", event.target.value)
                      }
                      placeholder="Last name"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="email">EMAIL</label>

                    <input
                      id="email"
                      type="email"
                      value={booking.email}
                      onChange={(event) =>
                        updateBooking("email", event.target.value)
                      }
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="phone">PHONE</label>

                    <input
                      id="phone"
                      type="tel"
                      value={booking.phone}
                      onChange={(event) =>
                        updateBooking("phone", event.target.value)
                      }
                      placeholder="+27 00 000 0000"
                    />
                  </div>
                </div>

                <div className="booking-summary">
                  <div>
                    <span>SERVICE</span>
                    <strong>{selectedService?.name}</strong>
                  </div>

                  <div>
                    <span>BARBER</span>
                    <strong>{selectedBarber?.name}</strong>
                  </div>

                  <div>
                    <span>DATE</span>
                    <strong>{booking.date}</strong>
                  </div>

                  <div>
                    <span>TIME</span>
                    <strong>{booking.time}</strong>
                  </div>

                  <div>
                    <span>TOTAL</span>
                    <strong>R{selectedService?.price}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROLS */}

            <div className="booking-controls">
              {step > 1 && (
                <button
                  type="button"
                  className="back-button"
                  onClick={previousStep}
                >
                  ← BACK
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  className="continue-button"
                  disabled={!canContinue()}
                  onClick={nextStep}
                >
                  CONTINUE →
                </button>
              ) : (
                // <button
                //   type="button"
                //   className="continue-button"
                //   disabled={!canContinue()}
                //   onClick={handleConfirm}
                // >
                //   CONFIRM APPOINTMENT →
                // </button>

                <button
                  type="button"
                  className="booking-button booking-button-primary"
                  onClick={handleConfirm}
                  disabled={submitting}
                >
                  {submitting ? "CONFIRMING..." : "CONFIRM APPOINTMENT"}
                </button>
              )}
            </div>

            {/* STEP 5 — CONFIRMATION */}

            {step === 5 && (
              <div className="booking-confirmation">
                <div className="confirmation-icon">✓</div>

                <p className="confirmation-eyebrow">APPOINTMENT CONFIRMED</p>

                <h3>
                  YOU'RE
                  <span>BOOKED.</span>
                </h3>

                <p className="confirmation-message">
                  Thanks, {booking.firstName}. Your appointment has been
                  reserved. We look forward to seeing you at Holloway.
                </p>

                <div className="confirmation-details">
                  <div>
                    <span>SERVICE</span>
                    <strong>{selectedService?.name}</strong>
                  </div>

                  <div>
                    <span>BARBER</span>
                    <strong>{selectedBarber?.name}</strong>
                  </div>

                  <div>
                    <span>DATE</span>
                    <strong>{booking.date}</strong>
                  </div>

                  <div>
                    <span>TIME</span>
                    <strong>{booking.time}</strong>
                  </div>

                  <div>
                    <span>TOTAL</span>
                    <strong>R{selectedService?.price}</strong>
                  </div>
                </div>

                <div className="calendar-actions">
                  <button type="button" onClick={addToGoogleCalendar}>
                    ADD TO GOOGLE CALENDAR
                  </button>

                  <button type="button" onClick={addToAppleCalendar}>
                    ADD TO APPLE CALENDAR
                  </button>
                </div>

                <a href="#home" className="confirmation-home">
                  ← BACK TO HOME
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Booking;
