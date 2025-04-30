"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Register() {
  type RegisterForm = {
    name: string;
    email: string;
    password: string;
    age: string;
    height: string;
    weight: string;
  };
  const defaultForm: RegisterForm = {
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
  };
  const [form, setForm] = useState(defaultForm);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
      };

      if (
        payload.name.trim() === "" ||
        payload.email.trim() === "" ||
        payload.password.trim() === ""
      ) {
        return setError("Please fill in all fields properly.");
      }

      if (!payload.email.includes("@") || !payload.email.includes(".")) {
        return setError("Please enter a valid email address.");
      }

      if (payload.password.length < 6) {
        return setError("Password must be at least 6 characters long.");
      }

      await api.post("/auth/register", payload);
      router.push("/login");
    } catch (error: any) {
      setError(error.response?.data?.message);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)]">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>
        {error && <p className="text-red-600 font-medium">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Please enter your name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Please enter your email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          name="age"
          placeholder="Please enter your age"
          value={form.age}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          name="height"
          placeholder="Please enter your height"
          value={form.height}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          name="weight"
          placeholder="Please enter your weight"
          value={form.weight}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
