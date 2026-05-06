"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function SignupForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignup = () => {
    let newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let hasError = false;

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
      hasError = true;
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    console.log("Signup Success:", form);

    // ✅ REDIRECT TO LOGIN PAGE
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Signup
        </h1>

        <Input
          label="Name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />

        <Button text="Signup" variant="primary" onClick={handleSignup} />

      </div>
    </div>
  );
}