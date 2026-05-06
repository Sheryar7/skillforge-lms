"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    let newErrors = { email: "", password: "" };
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    console.log("Login Success:", { email, password });

    // ✅ REDIRECT TO HOMEPAGE
    router.push("/");
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Login
        </h1>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Button text="Login" variant="primary" onClick={handleLogin} />

      </div>
    </div>
  );
}