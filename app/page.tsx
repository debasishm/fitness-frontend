"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/utils/api";
import Link from "next/link";

type Workout = {
  _id: string;
  workoutType: { _id: string; name: string };
  number: number;
  date: string;
};

const ITEMS_PER_PAGE = 5;

export default function HomePage() {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch workouts when filterDate changes
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const dateParam = filterDate || new Date().toISOString().slice(0, 10);
        const res = await api.get(`/workouts?date=${dateParam}`);
        setAllWorkouts(res.data);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [filterDate]);

  // Workout types for filter dropdown
  const workoutTypes = useMemo(() => {
    const seen = new Set();
    return allWorkouts
      .map((w) => w.workoutType)
      .filter((type) => {
        if (!seen.has(type._id)) {
          seen.add(type._id);
          return true;
        }
        return false;
      });
  }, [allWorkouts]);

  // Filter by workout type (date already filtered from API)
  const filteredWorkouts = allWorkouts.filter((w) => {
    return filterType ? w.workoutType._id === filterType : true;
  });

  const totalPages = Math.ceil(filteredWorkouts.length / ITEMS_PER_PAGE);
  const paginated = filteredWorkouts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setFilterType("");
    setFilterDate(""); // triggers fetch for today
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] w-full px-4">
      <h1 className="text-2xl font-bold mb-4">Today’s Workout</h1>

      <Link href="/workouts/add" className="text-blue-600 underline mb-4">
        + Add Workout
      </Link>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 w-full max-w-3xl">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All Types</option>
          {workoutTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full sm:w-auto"
        />

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : paginated.length === 0 ? (
        <p>No workouts match your filters.</p>
      ) : (
        <div className="w-full max-w-3xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-4 border-b">Workout</th>
                <th className="py-2 px-4 border-b">Count</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((workout) => (
                <tr key={workout._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">
                    {workout.workoutType.name}
                  </td>
                  <td className="py-2 px-4 border-b">{workout.number}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(workout.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      href={`/workouts/${workout._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
