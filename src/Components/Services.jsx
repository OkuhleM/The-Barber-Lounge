import ServiceCard from "../Services/ServiceCard";
import { services } from "../Data/bookingsData";
import "../Styles/Services.css";

// const services = [
//   {
//     number: "01",
//     name: "Classic Cut",
//     description:
//       "A clean, tailored haircut finished with precision and attention to detail.",
//     price: "R250",
//     duration: "45 MIN",
//   },
//   {
//     number: "02",
//     name: "Skin Fade",
//     description:
//       "A sharp skin fade blended seamlessly from the skin into your chosen length.",
//     price: "R300",
//     duration: "60 MIN",
//   },
//   {
//     number: "03",
//     name: "Beard Trim",
//     description:
//       "Shape, line-up and refine your beard for a clean, structured finish.",
//     price: "R150",
//     duration: "30 MIN",
//   },
//   {
//     number: "04",
//     name: "Cut & Beard",
//     description:
//       "Our signature combination of a precision haircut and professionally shaped beard.",
//     price: "R380",
//     duration: "75 MIN",
//   },
//   {
//     number: "05",
//     name: "Kids Cut",
//     description:
//       "A fresh, comfortable cut for younger clients aged 12 and under.",
//     price: "R180",
//     duration: "30 MIN",
//   },
//   {
//     number: "06",
//     name: "The Full Groom",
//     description:
//       "The complete experience — haircut, beard treatment, hot towel and finishing detail.",
//     price: "R500",
//     duration: "90 MIN",
//   },
// ];

function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-header">
          <div>
            <p className="section-eyebrow">OUR SERVICES</p>

            <h2>
              BUILT FOR
              <span>YOUR STYLE.</span>
            </h2>
          </div>

          <p>
            From precision cuts to complete grooming, every service is finished
            with attention to detail.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        <div className="services-footer">
          <a href="#booking">BOOK YOUR APPOINTMENT →</a>
        </div>
      </div>
    </section>
  );
}

export default Services;
