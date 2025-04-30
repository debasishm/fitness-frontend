"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: {
    _id?: string;
    targetValue: number;
    startDate: string;
    endDate: string;
    workoutType?: { _id: string };
  };
};

export default function GoalFormModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const [targetValue, setTargetValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [workoutTypeId, setWorkoutTypeId] = useState("");

  useEffect(() => {
    if (open) {
      setTargetValue(initialData?.targetValue?.toString() || "");
      setStartDate(initialData?.startDate?.slice(0, 10) || "");
      setEndDate(initialData?.endDate?.slice(0, 10) || "");
      setWorkoutTypeId(initialData?.workoutType?._id || "");
      fetchWorkoutTypes();
    }
  }, [open, initialData]);

  const fetchWorkoutTypes = async () => {
    const res = await api.get("/workout-types");
    setWorkoutTypes(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      targetValue: Number(targetValue),
      startDate,
      endDate,
      workoutType: workoutTypeId,
    };

    try {
      if (initialData?._id) {
        await api.put(`/goals/${initialData._id}`, data);
      } else {
        await api.post("/goals", data);
      }
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving goal");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Goal" : "Add Goal"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            required
            className="w-full border border-gray-300 p-2 rounded"
            value={workoutTypeId}
            onChange={(e) => setWorkoutTypeId(e.target.value)}
          >
            <option value="">Select Workout Type</option>
            {workoutTypes.map((type: any) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Target value"
            className="w-full border border-gray-300 p-2 rounded"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            required
          />
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
