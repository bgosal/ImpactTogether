import Image from "next/image";
import Link from "next/link";

export default function Events() {
  return (
    <main>
      <div className="event-details-container">
        <section className="event-header">
          <div className="back-button">
            <Link href="/">
              <button className="back-link">← Back</button>
            </Link>
          </div>

          <div className="event-logo">
              <Image
                src="/images/sample_logo.webp" 
                alt="Community Garden Volunteer Program Logo" 
                className="round-logo" 
                width="150" 
                height="150"
              />
          </div>
            
          <div className="event-title-info">
            <h1 className="event-title">Community Garden Volunteer Program</h1>
            <p className="organization-name">GreenThumb Initiative</p>
            <div className="button-group">
              <button className="apply-now-button">
                <i className="fas fa-check"></i> Apply Now
              </button>
              <button className="contact-button">
                <i className="fas fa-envelope"></i> Contact
              </button>        
            </div>
          </div>
        </section>

        <section className="event-info">
          <div className="event-details">
            <h2>Event Overview</h2>
            <div className="event-detail">
              <i className="fas fa-calendar-alt"></i> November 15, 2024
            </div>
            <div className="event-detail">
              <i className="fas fa-clock"></i> 9:00 AM - 3:00 PM
            </div>
            <div className="event-detail">
              <i className="fas fa-map-marker-alt"></i> Central City Park, 123 Main Street, Townsville
            </div>
        
            <h3>Activities Involved</h3>
            <div className="activity-detail">
              <i className="fas fa-seedling"></i> Planting Flowers
            </div>
            <div className="activity-detail">
              <i className="fas fa-spa"></i> Mulching
            </div>
            <div className="activity-detail">
              <i className="fas fa-leaf"></i> Weeding
            </div>
          </div>
        
          <div className="event-description">
            <h2>Description</h2>
            <p>
              Join us for a day of community gardening to help beautify Central City Park. Volunteers will assist with planting flowers, mulching, and maintaining the park's garden beds. This event is open to all ages and is a great way to meet others who share a love for gardening.
            </p>
            <p>
              No prior gardening experience is required—just a willingness to learn and a positive attitude. All tools and materials will be provided on-site.
            </p>
        
            <h3>Requirements</h3>
            <div className="requirement-detail">
              <i className="fas fa-user"></i> Volunteers must be at least 12 years old.
            </div>
            <div className="requirement-detail">
              <i className="fas fa-shoe-prints"></i> Must wear closed-toe shoes and comfortable outdoor clothing.
            </div>
            <div className="requirement-detail">
              <i className="fas fa-water"></i> Bring a water bottle and snacks.
            </div>
          </div>
        </section>
      </div>      
    </main>
  )
}
