import Link from "next/link";

export default function Login() {
    return (
      <main className="login-selection">
        <h2>Welcome to ImpactTogether</h2>
        <div className="login-form-container">
          
          <div className="form-fields">
            <form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required className="input-field" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required className="input-field" />
              </div>
              <button type="submit" className="login-button">Login</button>
            </form>
          </div>
          
          <p>New to ImpactTogether? Register below:</p>
          <div className="registration-button">
            <Link href="/register">
              <button className="signup-button">Sign Up</button>
            </Link>
          </div>
        </div>
      </main>
    );
  }
