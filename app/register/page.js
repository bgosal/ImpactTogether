import Link from "next/link";

export default function Register() {
    return (
        <main className="registration-selection">
            <h2>Create an Account</h2>
            
            <div className="form-container">
                <form className="register-form" action="/additional-details" method="GET">
                    <div className="form-group">
                        <label htmlFor="first-name">First Name:</label>
                        <input type="text" id="first-name" className="form-input" placeholder="Enter your first name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last-name">Last Name:</label>
                        <input type="text" id="last-name" className="form-input" placeholder="Enter your last name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" className="form-input" placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" className="form-input" placeholder="Enter your password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password:</label>
                        <input type="password" id="confirm-password" className="form-input" placeholder="Confirm your password" required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="role">Registering as:</label>
                        <select id="role" className="form-input" required>
                            <option value="volunteer">Volunteer</option>
                            <option value="organizer">Event Organizer</option>
                        </select>
                    </div>
                    
                    <div className="form-group button-group">
                        <button type="submit" className="signup-button">Sign Up</button>
                    </div>
                    <p className="form-footer-text">
                        Already have an account? <Link href="/login">Login here</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
