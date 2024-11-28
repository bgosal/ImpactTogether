import { FiCalendar, FiMapPin, FiHeart, FiCoffee, FiUsers, FiBook, FiGlobe, FiBox, FiActivity, FiSmile } from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";

const categoryIcons = {
  Animal_Care: <span className="event-category-icon"><FiHeart /></span>,
  Arts: <span className="event-category-icon"><FiSmile /></span>,
  Community: <span className="event-category-icon"><FiUsers /></span>,
  Education: <span className="event-category-icon"><FiBook /></span>,
  Environment: <span className="event-category-icon"><FiGlobe /></span>,
  Food: <span className="event-category-icon"><FiCoffee /></span>,
  Health: <span className="event-category-icon"><FiActivity /></span>,
  Youth: <span className="event-category-icon"><FiBox /></span>,
};


const EventCard = ({ img, title, org, date, category, location, link}) => {
  return (
    <Link href={link} className="event-card-link">
      <div className="event-card">
        <div className="event-card-image-section">
          <Image 
            src={img || "/images/org.png"}
            alt={`${org}'s profile picture`}
            width={80} 
            height={80}
            className="event-card-image"
          />
        </div>
       
        <div className="event-card-content">
          <div className="event-card-name">
            {title.length > 15
              ? `${title.substring(0, 15)}...`
              : title}
          </div>

          <div className="event-card-org-name">
            {org}
          </div>

          <div className="event-card-details-section">
            <div className="event-card-details">
              <FiCalendar className="event-category-icon" /> {new Date(date).toISOString().split('T')[0]}
            </div>
            <div className="event-card-details">
              <FiMapPin className="event-category-icon" /> {location}
            </div>
            <div className="event-card-details">
              {categoryIcons[category]} {category.replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;