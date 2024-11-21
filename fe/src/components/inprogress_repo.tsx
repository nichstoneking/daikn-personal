import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RepoProps {
  label: string;
  owner: string;
  repo: string;
  link: string;
  info: string;
}

const InprogressRepo: React.FC<RepoProps> = ({ owner, repo }) => {
  // Sample data for the chart
  const [chartData, setChartData] = useState([
    { month: "Jan", commits: 65 },
    { month: "Feb", commits: 59 },
    { month: "Mar", commits: 80 },
    { month: "Apr", commits: 81 },
    { month: "May", commits: 56 },
    { month: "Jun", commits: 55 },
    { month: "Jul", commits: 40 },
    { month: "Aug", commits: 48 },
    { month: "Sep", commits: 52 },
    { month: "Oct", commits: 69 },
    { month: "Nov", commits: 75 },
    { month: "Dec", commits: 88 },
  ]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    recent: 12,
    increase: 1.34,
    monthly: [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0],
    accessed: "2024-11-20",
  });

  useEffect(() => {
    setChartData([
      { month: "Jan", commits: data.monthly[0] },
      { month: "Feb", commits: data.monthly[1] },
      { month: "Apr", commits: data.monthly[3] },
      { month: "Mar", commits: data.monthly[2] },
      { month: "May", commits: data.monthly[4] },
      { month: "Jun", commits: data.monthly[5] },
      { month: "Jul", commits: data.monthly[6] },
      { month: "Sep", commits: data.monthly[8] },
      { month: "Aug", commits: data.monthly[7] },
      { month: "Nov", commits: data.monthly[10] },
      { month: "Dec", commits: data.monthly[11] },
    ]);
  }, [data, chartData]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await fetch("http://localhost:8080/repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: owner,
          repo: repo,
        }),
      });

      const data = await response.json();
      setData(data);
      setLoading(false);
    }
    fetchData();
  }, [owner, repo]);

  return (
    <>
      <hr
        className="mb-4 mt-4 w-full"
        style={{ borderTop: "2px solid white" }}
      />
      {loading ? (
        <div className="h-[256px] w-full flex items-center">
          <span className="loader mx-auto"></span>
        </div>
      ) : (
        <>
          <div className="flex px-6 rounded-lg font-monaspice w-full">
            {/* Stats Column */}
            <div className="w-1/3 pr-4 flex flex-col items-center justify-evenly">
              <div className="flex flex-col items-center">
                <h3 className="text-center text-base text-gray-500">
                  Commits this Month
                </h3>
                <div className="text-xl text-blue-600 mb-1">{data.recent}</div>
                <span className="text-xs text-green-600">
                  {data.increase * 100}%
                </span>
              </div>
            </div>

            {/* Chart Column */}
            <div className="w-2/3 h-64 flex items-center text-sm">
              <ResponsiveContainer width="95%" height="80%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgb(55 65 81)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InprogressRepo;
