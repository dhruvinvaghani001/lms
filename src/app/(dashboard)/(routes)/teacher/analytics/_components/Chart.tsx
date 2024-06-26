"use client";
import { useTheme } from "next-themes";
import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartData } from "../page";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const { revenue, numberOfStudents } = payload[0].payload;
    return (
      <div className="rounded-lg font-semibold bg-background py-3 px-6 border-2 flex flex-col items-start gap-1">
        <p className="label text-primary font-bold">{`${label}`}</p>
        <p className="intro text-">{`Revenue: $ ${revenue}`}</p>
        <p className="desc text-primary">{`Number of Students : ${numberOfStudents}`}</p>
      </div>
    );
  }

  return null;
};

interface ChartDataProps {
  data: ChartData[];
}

const Chart = ({ data }: ChartDataProps) => {
  const { theme } = useTheme();
  return (
    <>
      <ResponsiveContainer width={`100%`} height={`100%`}>
        <BarChart width={730} height={250} data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={16}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={16}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              return `$ ${value}`;
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            coordinate={{ x: 100, y: 140 }}
          />
          <Bar dataKey="revenue" fill="#136F63" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;
