"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export const NavBar = () => {
  const { data: session } = useSession();

  return (
    <header>
      <nav className="navbar">
        <Link className="nav-button-link" href="/"><div className="website-name">ImpactTogether</div></Link>
        
        <div className="nav-right">
          
          {session ? (
            <>
              
              {session.user.role === "volunteer" && (
                <Link className="nav-button-link" href="/my-applications">
                  <button className="nav-button">My Applications</button>
                </Link>
              )}

              {session.user.role === "organizer" && (
                <Link className="nav-button-link" href="/recruit">
                  <button className="nav-button">Create New Event</button>
                </Link>
              )}

              {session.user.role === "organizer" && (
                <Link className="nav-button-link" href="/event-management">
                  <button className="nav-button">Manage Events</button>
                </Link>
              )}

              
              

             
              {session.user.role === "volunteer" && (
                <Link className="nav-button-link" href="/account-management">
                  <button className="nav-button">My Account</button>
                </Link>
              )}

            
              {session.user.role === "organizer" && (
                <Link className="nav-button-link" href="/organization-management">
                  <button className="nav-button">My Organization</button>
                </Link>
              )}

              <button 
                className="nav-button-sign-out"
                onClick={() => signOut()}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="nav-button-link" href="/login">
                <button className="nav-button">Login</button>
              </Link>

              <Link className="nav-button-link" href="/register">
                <button className="nav-button">Register</button>
              </Link>
            </>
          )}          
        </div>
      </nav>
    </header> 
  );
};
