"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import GoalFormModal from "@/app/components/GoalFormModal";

type Goal = {
  _id: string;
  targetValue: number;
  currentValue: number;
  startDate: string;
  endDate: string;
  isAchieved: boolean;
  workoutType?: {
    _id?: string;
    name: string;
  };
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to fetch goals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      setDeleting(id);
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete goal");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditGoal(goal);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditGoal(null);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] w-full px-4">
      <h1 className="text-2xl font-bold mb-6">Your Fitness Goals</h1>

      <button
        onClick={handleAdd}
        className="text-blue-600 underline mb-4 self-end"
      >
        + Add Goal
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : goals.length === 0 ? (
        <p>No goals found.</p>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {goals.map((goal) => {
            const progress = Math.min(
              (goal.currentValue / goal.targetValue) * 100,
              100
            );

            return (
              <div
                key={goal._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Goal: {goal.workoutType?.name || "General"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {goal.currentValue} / {goal.targetValue} —{" "}
                      {goal.isAchieved ? (
                        <span className="text-green-600">Achieved</span>
                      ) : (
                        <span className="text-yellow-600">In Progress</span>
                      )}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="text-sm text-blue-600 underline"
                      onClick={() => handleEdit(goal)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-600 underline"
                      onClick={() => handleDelete(goal._id)}
                      disabled={deleting === goal._id}
                    >
                      {deleting === goal._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      goal.isAchieved ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="text-sm text-gray-500">
                  Duration: {new Date(goal.startDate).toLocaleDateString()} -{" "}
                  {new Date(goal.endDate).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🟦 Modal to Add/Edit Goal */}
      <GoalFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={fetchGoals}
        initialData={
          editGoal
            ? {
                _id: editGoal._id,
                workoutType: { _id: editGoal.workoutType?._id || "" },
                targetValue: editGoal.targetValue,
                startDate: editGoal.startDate,
                endDate: editGoal.endDate,
              }
            : undefined
        }
      />
    </div>
  );
}
