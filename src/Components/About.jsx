import "../Styles/About.css";
import barberWorking from "../Assets/Coiffure-homme-noir.jpeg";

const stats = [
  {
    number: "05+",
    label: "Years of Craft",
  },
  {
    number: "3",
    label: "Expert Barbers",
  },
  {
    number: "1K+",
    label: "Cuts & Counting",
  },
];

function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">

        <div className="about-image">
          <img
            src={barberWorking}
            alt="Barber working on a client's haircut"
          />

          <div className="about-image-label">
            <span>01</span>
            <p>THE CRAFT</p>
          </div>
        </div>

        <div className="about-content">
          <p className="section-eyebrow">ABOUT HOLLOWAY</p>

          <h2>
            MORE THAN
            <span>A HAIRCUT.</span>
          </h2>

          <p className="about-intro">
            Holloway is a modern barbershop built around precision,
            consistency and personal style.
          </p>

          <p className="about-text">
            From sharp fades to classic cuts and detailed beard work,
            every appointment is about more than simply getting cleaned up.
            We take the time to understand your style and make sure you
            leave looking and feeling your best.
          </p>

          <div className="about-stats">
            {stats.map((stat) => (
              <div className="about-stat" key={stat.label}>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <a href="#booking" className="about-button">
            BOOK YOUR APPOINTMENT
          </a>
        </div>

      </div>
    </section>
  );
}

export default About;