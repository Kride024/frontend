import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Occupied", value: 30 },
  { name: "Vacant", value: 23 },
];

const COLORS = ["#2D9CDB", "#E5E5E5"];

export default function OccupancyCard() {
  return (
    <div className="flex items-center gap-6 rounded-xl border bg-white p-4 shadow">
      {/* Pie Chart */}
      <div className="relative w-[167px] h-[166px] flex items-center justify-center">
        <PieChart width={167} height={166}>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute text-lg font-bold">30/53</div>
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-center">
        <p className="text-[20px] font-bold text-black tracking-[-0.154px]">
          30 of 53 beds occupied
        </p>
        <p className="text-[45px] font-extrabold text-black tracking-[-0.154px]">
          56%
        </p>
        <p className="text-[20px] font-normal text-[#2B9943] tracking-[-0.154px]">
          ↑ 5% since last month
        </p>
      </div>
    </div>
  );
}
