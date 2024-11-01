"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const router = useRouter();
  
  const onSubmit = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/");
    }
  };

  const password = watch("password");

  return (
    <main className="registration-selection">
      <h2>Create an Account</h2>
      
      <div className="form-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          {/* First name */}
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

          {/* Last name */}
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

          {/* Email */}
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
          
          {/* Password */}
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

          {/* Confirm password */}
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

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">Registering as:</label>
            <select
              {...register("role", { required: "Role is required" })}
              id="role"
              className="form-input"
            >
              <option value="volunteer">Volunteer</option>
              <option value="organizer">Event Organizer</option>
            </select>
            {/* {errors.role && <p style={{color: "red"}}>{errors.role.message}</p>} */}
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
