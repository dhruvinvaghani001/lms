import React from "react";
import { DataTable } from "../teacher/courses/_components/CourseTable";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";

type Props = {};

const page = async () => {
  const data = await db.payoutRequest.findMany({});

  return (
    <div className="p-6">
      <DataTable columns={columns} data={data}></DataTable>
    </div>
  );
};

export default page;
