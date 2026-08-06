"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RepositoryResponse } from "../types/api";

interface RepoProps {
  /** Fetched server-side. Null when GitHub was unreachable. */
  stats: RepositoryResponse | null;
}

// Shown when stats are unavailable, matching the previous fallback behaviour.
const PLACEHOLDER: RepositoryResponse = {
  recent: 0,
  increase: 0,
  monthly: [65, 59, 80, 81, 56, 55, 40, 48, 52, 69, 75, 88].map((commits) => ({
    label: "",
    year: 0,
    commits,
  })),
  accessed: "",
};

const InprogressRepo: React.FC<RepoProps> = ({ stats }) => {
  const data = stats ?? PLACEHOLDER;

  // The API returns the trailing 12 months in chronological order, so this is
  // a straight mapping — no hand-written month list to fall out of sync.
  const chartData = useMemo(
    () => data.monthly.map((m) => ({ month: m.label, commits: m.commits })),
    [data]
  );

  return (
    <>
      <hr
        className="mb-4 mt-4 w-full"
        style={{ borderTop: "2px solid white" }}
      />
      <div className="flex flex-col sm:flex-row px-6 rounded-lg font-monaspice w-full">
        {/* Stats Column */}
        <div className="w-full sm:w-1/3 pr-4 flex flex-col items-center justify-evenly">
          <div className="flex flex-col items-center">
            <h3 className="text-center text-base text-gray-500">
              Commits this Month
            </h3>
            <div className="text-xl text-blue-600 mb-1">{data.recent}</div>
            <span
              className={`text-xs ${
                data.increase > 0
                  ? "text-green-600"
                  : data.increase < 0
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {data.increase > 0 ? "+" : ""}
              {Math.round(data.increase * 100)}%
            </span>
          </div>
        </div>

        {/* Chart Column */}
        <div className="w-[300px] sm:w-2/3 sm:h-64 sm:ml-0 ml-[-45px] h-52 py-4 flex sm:items-center items-start text-sm">
          <ResponsiveContainer width="95%" height="100%">
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
