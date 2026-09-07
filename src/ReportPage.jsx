import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProgressChart from "./ProgressChart";

export default function ReportPage() {
  const { dayName } = useParams(); // dayName is coming from the URL parameter (e.g. /Legs/report)
  const [chartData, setChartData] = useState([]);

  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const exercises = await response.json();
          const uniqueNames = [
            ...new Set(exercises.map((ex) => ex.exerciseName)),
          ];
          setExercisesList(uniqueNames);

          if (uniqueNames.length > 0) {
            setSelectedExercise(uniqueNames[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, [dayName]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/reports/progressive-overload?exerciseName=${selectedExercise}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log("FETCHED CHART DATA:", data);
          setChartData(data);
        }
      } catch (error) {
        console.error("Error fetching report data", error);
      }
    };

    if (selectedExercise) {
      fetchChartData();
    }
  }, [selectedExercise]);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">{dayName} Report</h1>

      <select
        name=""
        id=""
        onChange={(e) => setSelectedExercise(e.target.value)}
        className="bg-slate-800 p-2 rounded mb-6 outline-none text-white"
      >
        {exercisesList.map((exName, index) => (
          <option key={index} value={exName}>
            {exName}
          </option>
        ))}
      </select>

      <ProgressChart data={chartData} />
    </div>
  );
}
