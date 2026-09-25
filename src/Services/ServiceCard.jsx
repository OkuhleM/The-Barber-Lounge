import "../Styles/ServiceCard.css";

function ServiceCard({ service, index }) {
  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="service-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="service-duration">
          {service.durationLabel}
        </span>
      </div>

      <div className="service-card-content">
        <h3>{service.name}</h3>

        <p>{service.description}</p>
      </div>

      <div className="service-card-bottom">
        <span className="service-price">
          R{service.price}
        </span>

        <a
          href="#booking"
          className="service-book-link"
        >
          BOOK NOW <span>↗</span>
        </a>
      </div>
    </article>
  );
}

export default ServiceCard;