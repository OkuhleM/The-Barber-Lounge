import React from "react";
import "../Styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">

      <div className="hero-image"></div>

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <div className="hero-eyebrow">
          <span></span>
          JOHANNESBURG'S MODERN BARBERSHOP
        </div>

        <h1>
          CUT WITH
          <br />
          <span>PRECISION.</span>
        </h1>

        <p>
          Sharp cuts. Clean fades. No shortcuts.
          <br />
          Your style, refined.
        </p>

        <div className="hero-actions">
          <a href="#booking" className="hero-primary-btn">
            Book Your Appointment
            <span>↗</span>
          </a>

          <a href="#services" className="hero-secondary-btn">
            Explore Services
          </a>
        </div>

      </div>

      <div className="hero-bottom">

        <div className="hero-location">
          <span>01</span>
          <p>JOHANNESBURG, SOUTH AFRICA</p>
        </div>

        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
        </div>

      </div>

    </section>
  );
}

export default Hero;
