import React from "react";
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

const InprogressRepo: React.FC<RepoProps> = ({ label, link }) => {
  // Sample data for the chart
  const chartData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 59 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 81 },
    { month: "May", value: 56 },
    { month: "Jun", value: 55 },
    { month: "Jul", value: 40 },
    { month: "Aug", value: 48 },
    { month: "Sep", value: 52 },
    { month: "Oct", value: 69 },
    { month: "Nov", value: 75 },
    { month: "Dec", value: 88 },
  ];

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
            <div className="text-xl text-blue-600 mb-1">77</div>
            <span className="text-xs text-green-600">12.5%</span>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-md text-gray-500">Repo Views</h3>
            <div className="text-xl text-blue-600 mb-1">193</div>
          </div>
        </div>

        {/* Chart Column */}
        <div className="w-2/3 h-64 flex items-center text-sm">
          <ResponsiveContainer width="95%" height="80%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
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
