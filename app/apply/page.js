// // Reused css from authentication/event due to similarity
// // Must be logged in to apply
// import Image from "next/image";

// export default function Apply() {
//     return (
//         <main className="login-selection">
//           <h2>Event Application</h2>
//           <div className="login-form-container">
//           <div className="event-logo">
//               <Image
//                 src="/images/sample_logo.webp" 
//                 alt="Community Garden Volunteer Program Logo" 
//                 className="round-logo" 
//                 width="150" 
//                 height="150"
//               />
//           </div>

//           <p className="organization-name">GreenThumb Initiative</p>
//           <h3 className="organization-name">Community Garden Volunteer Program</h3>
          
//           <div className="event-details">
//             <div className="event-detail detail-center">November 15, 2024</div>
//             <div className="event-detail detail-center">9:00 AM - 3:00 PM</div>
//             <div className="event-detail detail-center">Central City Park, 123 Main Street, Townsville</div>
//           </div>

//           <p>Please enter the following information to complete application:</p>

//             <div className="form-fields">
//               <form className="login-form">
//                 <div className="form-group">
//                   <label>Number of Additional Guests:</label>
//                   <input
//                     name="guests"
//                     defaultValue=""
//                     type="number"
//                     className="input-field"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="password">Notes:</label>
//                   <p>Please include any allergy/dietary restrictions, an emergency contact, and any questions for the organizer!</p>
//                   <textarea name="notes" defaultValue="" class="large-input" placeholder="Notes"></textarea>
//                 </div>
    
//                 <button className="login-button" >
//                   Confirm Application
//                 </button>
//               </form>
//             </div>
//           </div>
//         </main>
//       );
//     }
