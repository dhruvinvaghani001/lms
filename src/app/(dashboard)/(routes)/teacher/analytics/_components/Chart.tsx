"use client";
import React from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

const Chart = ({ mappedData }) => {
  return (
    <>
      <BarChart width={730} height={250} data={mappedData}>
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
          formatter={(value) => `$ ${value}`}
          coordinate={{ x: 100, y: 140 }}
          wrapperClassName="rounded-lg font-semibold bg-slate-700"
          contentStyle={{ color: "black" }}
        />
        <Bar dataKey="Revenue" fill="#255957" background={{ fill: "none" }} />
      </BarChart>
    </>
  );
};

export default Chart;
