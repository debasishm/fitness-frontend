"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";

interface WorkoutType {
  _id: string;
  name: string;
  description?: string;
}

export default function EditWorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;

  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [form, setForm] = useState({
    workoutTypeId: "",
    number: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const [typesRes, workoutRes] = await Promise.all([
          api.get("/workout-types"),
          api.get(`/workouts/${workoutId}`),
        ]);

        setWorkoutTypes(typesRes.data);

        const workout = workoutRes.data;
        setForm({
          workoutTypeId: workout.workoutType._id,
          number: workout.number.toString(),
          date: new Date(workout.date).toISOString().split("T")[0],
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to load workout", error);
        router.push("/");
      }
    };

    fetchWorkout();
  }, [workoutId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.workoutTypeId || !form.number.trim()) {
      alert("All fields are required.");
      return;
    }

    try {
      await api.put(`/workouts/${workoutId}`, {
        workoutTypeId: form.workoutTypeId,
        number: parseInt(form.number),
        date: form.date,
      });

      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update workout.");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">Edit Workout</h2>

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
          Update Workout
        </button>
      </form>
    </div>
  );
}
