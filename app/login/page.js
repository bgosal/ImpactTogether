"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react"
import Link from "next/link";

export default function Login() { 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res.ok) {
      router.push("/");
    }
  };  

  return (
    <main className="login-selection">
      <h2>Welcome to ImpactTogether</h2>

      <div className="login-form-container">
        
        <div className="form-fields" onSubmit={handleSubmit(onSubmit)}>
          <form className="login-form">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                defaultValue=""
                {...register("email", { required: "Email is required" })}
                type="email"
                id="email"
                placeholder="Email"
                className="input-field"
              />
              {errors.email && <p style={{color: "red"}}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
              defaultValue=""
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
                placeholder="Password"
                className="input-field" 
              />
              {errors.password && <p style={{color: "red"}}>{errors.password.message}</p>}
            </div>

            <button 
              className="login-button"
            >
              Login
            </button>
          </form>
        </div>
        
        <p>Don't have an account?</p>
        <div className="registration-button">
          <Link href="/register">
            <button className="signup-button">Sign Up</button>
          </Link>
        </div>
      </div>
    </main>
  );
  }
