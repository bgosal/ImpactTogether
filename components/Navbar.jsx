import Link from "next/link";

export const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <Link className="nav-button-link" href="/"><div className="website-name">ImpactTogether</div></Link>
        
        <div className="nav-right">
          <Link className="nav-button-link" href="/saved">
            <button className="nav-button">Saved Opportunities</button>
          </Link>

          <Link className="nav-button-link" href="/recruit">
            <button className="nav-button">Recruit Volunteers</button>
          </Link>

          <Link className="nav-button-link" href="/account-management">
            <button className="nav-button">My Account</button>
          </Link>

          <Link className="nav-button-link" href="/login">
            <button className="nav-button">Login</button>
          </Link>

          <Link className="nav-button-link" href="/register">
            <button className="nav-button">Register</button>
          </Link>
        </div>
      </nav>
    </header> 
  )
}