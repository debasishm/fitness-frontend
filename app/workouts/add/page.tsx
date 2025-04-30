"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

interface WorkoutType {
  _id: string;
  name: string;
  description?: string;
}

export default function AddWorkout() {
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [form, setForm] = useState({
    workoutTypeId: "",
    number: "",
    date: new Date().toISOString().split("T")[0],
  });

  const router = useRouter();

  useEffect(() => {
    const fetchWorkoutTypes = async () => {
      try {
        const res = await api.get("/workout-types");
        setWorkoutTypes(res.data);
      } catch (err) {
        console.error("Failed to load workout types", err);
      }
    };

    fetchWorkoutTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.workoutTypeId || !form.number.trim()) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/workouts", {
        ...form,
        number: parseInt(form.number),
      });
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error adding workout");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">Log a Workout</h2>

        <select
          name="workoutTypeId"
          value={form.workoutTypeId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select workout type</option>
          {workoutTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="number"
          placeholder="Steps, reps, etc."
          value={form.number}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Workout
        </button>
      </form>
    </div>
  );
}
