import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ReportPage() {
  const { dayName } = useParams();
  const [chartData, setChartData] = useStaate([]);

  const [selectedExercise, setSelectedExercise] = useState("Squat");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/reports/progressive-overload?exerciseName=${selectedExercise}`,
          {
            headers: {
              Autherization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        }
      } catch (error) {
        console.error("Error fetching report data", error);
      }
    };

    if(selectedExercise){
        fetchChartData();
    }
  }, [selectedExercise]);

  return(
    <div className="p-8 bg-slate-950 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-8">{dayName} Report</h1>
            
            {/* TODO: Add a dropdown/buttons here to change the selectedExercise */}
            
            {/* Render the Recharts graph and pass in the fetched data */}
            <ProgressChart data={chartData} />
        </div>

  )
}
