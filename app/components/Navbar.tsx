"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/goals" className="hover:underline">
          Goals
        </Link>
        <Link href="/workouts/add" className="hover:underline">
          Add Workout
        </Link>
      </div>
      {user && (
        <button
          onClick={logout}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
