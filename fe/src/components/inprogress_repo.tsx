import React, { useEffect, useState, SetStateAction } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchRepoData } from "../utils/api";

interface RepoProps {
  owner: string;
  repo: string;
  setDates: React.Dispatch<SetStateAction<string[]>>;
  dates: string[];
  index: number;
}

const InprogressRepo: React.FC<RepoProps> = ({
  owner,
  repo,
  setDates,
  dates,
  index,
}) => {
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
    recent: "err",
    increase: 0,
    monthly: [65, 59, 80, 81, 56, 55, 40, 48, 52, 69, 75, 88],
    accessed: "",
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await fetchRepoData(owner, repo);
        setData(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log("error fetching data: ", err);
      }
    }
    fetchData();
  }, [owner, repo]);

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
    const newDates = dates.map((c, i) => {
      if (i === index) {
        c = data.accessed;
        return c;
      } else {
        return c;
      }
    });
    setDates(newDates);
  }, [data, setChartData]);

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
          <div className="flex flex-col sm:flex-row px-6 rounded-lg font-monaspice w-full">
            {/* Stats Column */}
            <div className="w-full sm:w-1/3 pr-4 flex flex-col items-center justify-evenly">
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
            <div className="w-[300px] sm:w-2/3 sm:h-64 sm:ml-0 ml-[-45px] h-52 py-4 flex sm:items-center items-start text-sm">
              <ResponsiveContainer width="95%" height="100%">
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
