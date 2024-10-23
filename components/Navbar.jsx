import { IoPersonCircleSharp } from "react-icons/io5";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <Link className="nav-button-link" href="/"><div className="website-name">ImpactTogether</div></Link>
        
        <div className="nav-right">
          <Link className="nav-button-link" href="/test">
            <button className="nav-button">Saved Opportunities</button>
          </Link>

          <Link className="nav-button-link" href="recruit.html">
            <button className="nav-button">Recruit Volunteers</button>
          </Link>

          <Link className="nav-button-link" href="/account_management/account_management.html">
            <button className="nav-button">Account Management</button>
          </Link>

          <Link className="nav-button-link" href="/login/login.html">
            <button className="nav-button">Login</button>
          </Link>

          <IoPersonCircleSharp className=""/>
        </div>
      </nav>
    </header> 
  )
}