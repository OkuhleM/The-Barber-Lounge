import "../Styles/Barbers.css";
// import MarcusImage from "../Assets/Marcus.jpeg";
// import DanielImage from "../Assets/Daniel.jpeg";
// import ThaboImage from "../Assets/Thabo.jpeg";
import { barbers } from "../Data/bookingsData";

// const barbers = [
//   {
//     name: "Marcus Williams",
//     role: "MASTER BARBER",
//     specialty: "Fades · Precision Cuts · Beard Design",
//     image: MarcusImage,
//   },
//   {
//     name: "Daniel Murray",
//     role: "SENIOR BARBER",
//     specialty: "Classic Cuts · Styling · Grooming",
//     image: DanielImage,
//   },
//   {
//     name: "Thabo Nkosi",
//     role: "BARBER",
//     specialty: "Fades · Kids Cuts · Beard Trims",
//     image: ThaboImage,
//   },
// ];

function Barbers() {
  return (
    <section className="barbers" id="barbers">
      <div className="barbers-container">

        <div className="barbers-header">
          <div>
            <p className="section-eyebrow">THE TEAM</p>

            <h2>
              MEET THE
              <span>BARBERS.</span>
            </h2>
          </div>

          <p className="barbers-description">
            Skilled hands. Sharp eyes. Individual style.
            Meet the people behind every cut at Holloway.
          </p>
        </div>

        <div className="barbers-grid">
          {barbers.map((barber, index) => (
            <article className="barber-card" key={barber.name}>

              <div className="barber-image">
                <img
                  src={barber.image}
                  alt={`${barber.name}, ${barber.role}`}
                />

                <span className="barber-number">
                  0{index + 1}
                </span>
              </div>

              <div className="barber-info">
                <div>
                  <p className="barber-role">{barber.role}</p>

                  <h3>{barber.name}</h3>

                  <p className="barber-specialty">
                    {barber.specialty}
                  </p>
                </div>

                <a href="#booking" className="barber-book">
                  BOOK WITH ME
                  <span>↗</span>
                </a>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Barbers;