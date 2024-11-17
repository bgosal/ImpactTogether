import { FiHeart, FiCoffee, FiUsers, FiBook, FiGlobe, FiBox, FiActivity, FiSmile } from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";

const categoryIcons = {
  Animal_Care: <FiHeart />,
  Arts: <FiSmile />,
  Community: <FiUsers />,
  Education: <FiBook />,
  Environment: <FiGlobe />, 
  Food: <FiCoffee />,
  Health: <FiActivity />,
  Youth: <FiBox />,
};

const Item = ({ title, img, link, category, date, location}) => {
  return (
    <div className="item">
      <Image 
        src={img}
        alt={title}
        width={100} 
        height={100}
        className="item-image"
      />
      <div>
        <div className="item-description">
          <h3>{title}</h3>
          <p>{`Event in ${location} on ${new Date(date).toLocaleDateString()}`}</p>
          <p className="event-category">
            {categoryIcons[category]} {category.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="item-buttons">
          <Link href={link}>
            <button className="item-button">View Details</button>
          </Link>
        </div>
      </div>  
    </div>
  );
};

export default Item;