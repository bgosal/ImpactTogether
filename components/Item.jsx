import Image from "next/image";
import Link from "next/link";

export const Item = ({ title, description, img }) => {
  return (
    <div className="item">
      <Image 
        src={img}
        alt=""
        width={100} 
        height={100}
        className="item-image"
      />
      <div>
        <div className="item-description">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="item-buttons">
          <Link href="/events">
            <button className="item-button">Volunteer</button>
          </Link>
        </div>
      </div>  
    </div>
  );
}