"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";



export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const router = useRouter();
  const [role, setRole] = useState("volunteer"); 
  const password = watch("password");

  const onSubmit = async (data) => {
    
    data.role = role;
  
    if (role === "organizer") {
      delete data.firstname;
      delete data.lastname;
    } else if (role === "volunteer") {
      delete data.organizationName;
    }
  
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (res.ok) {
      router.push("/login");
    }
  };
  

  return (
    <main className="registration-selection">
      <h2>Create an Account</h2> 
      
      <div className="role-selection">
        <div
          className={`role-option ${role === "volunteer" ? "selected" : ""}`}
          onClick={() => setRole("volunteer")}
        >
          Volunteer
        </div>
        <div
          className={`role-option ${role === "organizer" ? "selected" : ""}`}
          onClick={() => setRole("organizer")}
        >
          Organization
        </div>
      </div>

      <div className="form-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>      
          {role === "volunteer" && (
            <>
              <div className="form-group">
                <label htmlFor="first-name">First Name:</label>
                <input
                  {...register("firstname", { required: "First name is required" })}
                  type="text"
                  id="first-name"
                  className="form-input"
                  placeholder="Enter your first name"
                />
                {errors.firstname && <p style={{color: "red"}}>{errors.firstname.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="last-name">Last Name:</label>
                <input
                  {...register("lastname", { required: "Last name is required" })}
                  type="text"
                  id="last-name"
                  className="form-input"
                  placeholder="Enter your last name"
                />
                {errors.lastname && <p style={{color: "red"}}>{errors.lastname.message}</p>}
              </div>
            </>
          )}

          {role === "organizer" && (
            <>
              <div className="form-group">
                <label htmlFor="organization-name">Organization Name:</label>
                <input
                  {...register("organizationName", { required: "Organization name is required" })}
                  type="text"
                  id="organization-name"
                  className="form-input"
                  placeholder="Enter your organization name"
                />
                {errors.organizationName && <p style={{color: "red"}}>{errors.organizationName.message}</p>}
              </div>
            </>
          )}
 
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
            />
            {errors.email && <p style={{color: "red"}}>{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              {...register("password", { 
                required: "Password is required",
                validate: (value) => {
                  if (
                    value.length < 5 ||
                    !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                  ) {
                    return "Password must be at least 5 characters and contain at least one special character";
                  }
                },
              })}
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
            />
            {errors.password && <p style={{color: "red"}}>{errors.password.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type="password"
              id="confirm-password"
              className="form-input"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p style={{color: "red"}}>{errors.confirmPassword.message}</p>}
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
