import React, { useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { X } from "lucide-react";
import type { PresentStudent } from "../types/students.types";

const PresentStudentsTabe: React.FC<{ data: PresentStudent[] }> = ({
  data,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [data]);

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[max-content_1fr]">
      <div className="text-xl Nunito-SemiBold">List of Present Students</div>
      <div ref={divRef} className="h-full border overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Course & Year</TableHead>
              <TableHead className="text-center">Time In</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((d, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="text-center">
                    {d.courseAndYear}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(d.date).toLocaleString("en-US", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <X size={18} className="w-6 rounded-[3.5px] bg-red-500" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="p-8 Nunito text-center">
                  No present students.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PresentStudentsTabe;
