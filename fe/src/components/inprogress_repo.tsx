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

const InprogressRepo: React.FC<RepoProps> = ({ label, link, owner, repo }) => {
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

  const [data, setData] = useState({
    recent: 0,
    increase: 0,
    monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    views: 0,
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
    }
    fetchData();
  }, [owner, repo]);

  return (
    <>
      <div className="font-monaspice flex justify-between text-sm">
        <div className="text-start">
          <div className="pb-1 text-sm">Repo Name</div>
          <a
            className="text-sm text-blue-600 hover:text-blue-700 active:text-blue-800"
            target="_blank"
            href={link}
          >
            {label}
          </a>
        </div>
        <div className="text-end">
          <div className="pb-1 text-sm">Last Accessed</div>
          <div className="text-sm text-gray-500">Feb,10,2024</div>
        </div>
      </div>
      <hr className="mb-4 mt-4" style={{ borderTop: "2px solid white" }} />
      <div className="flex px-6 rounded-lg font-monaspice">
        {/* Stats Column */}
        <div className="w-1/3 pr-4 flex flex-col items-center justify-evenly">
          <div className="flex flex-col items-center">
            <h3 className="text-md text-gray-500">Commits this Week</h3>
            <div className="text-xl text-blue-600 mb-1">{data.recent}</div>
            <span className="text-xs text-green-600">
              {data.increase * 100}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-md text-gray-500">Repo Views</h3>
            <div className="text-xl text-blue-600 mb-1">{data.views}</div>
          </div>
        </div>

        {/* Chart Column */}
        <div className="w-2/3 h-64 flex items-center text-sm">
          <ResponsiveContainer width="95%" height="80%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "rgb(55 65 81)" }} />
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
  );
};

export default InprogressRepo;
