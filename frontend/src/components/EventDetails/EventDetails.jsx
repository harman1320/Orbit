import { useParams, Link } from "react-router-dom";
import events from "../../data/events";
import "./EventDetails.css";

const EventDetails = () => {
  const { slug } = useParams();
  console.log(slug);

  const event = events.find((item) => item.slug === slug);

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event not found</h2>

        <Link to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="event-details-page">

      <div className="container py-5">

        <Link
          to="/dashboard"
          className="event-back-link"
        >
          ← Back to Dashboard
        </Link>

        <article className="event-details-card mt-4">

          <div className="event-details-header">

            <span className="event-details-label">
              ORBIT EVENT
            </span>

            <h1>
              {event.title}
            </h1>

            <p className="event-details-date">
              {event.date}
            </p>

          </div>

          <div className="event-details-content">
            {event.description
              .trim()
              .split("\n\n")
              .map((paragraph, index) => (
                <p key={index}>
                  {paragraph.trim()}
                </p>
              ))}
          </div>

        </article>

      </div>

    </div>
  );
};

export default EventDetails;