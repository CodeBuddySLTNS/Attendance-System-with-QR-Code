import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { X } from "lucide-react";

interface PresentStudent {
  name: string;
  yearAndSection: string;
  date: Date;
}

const data: PresentStudent[] = [
  {
    name: "John Lloyd Cruz",
    yearAndSection: "BSIT1",
    date: new Date(),
  },
  {
    name: "Juan Tamad",
    yearAndSection: "BSCS 4",
    date: new Date(),
  },
  {
    name: "Juan Pedro",
    yearAndSection: "BSSW 2",
    date: new Date(),
  },
  {
    name: "John Lloyd Cruz",
    yearAndSection: "BSIT1",
    date: new Date(),
  },
  {
    name: "Juan Tamad",
    yearAndSection: "BSCS 4",
    date: new Date(),
  },
  {
    name: "Juan Pedro",
    yearAndSection: "BSSW 2",
    date: new Date(),
  },
  {
    name: "John Lloyd Cruz",
    yearAndSection: "BSIT1",
    date: new Date(),
  },
  {
    name: "Juan Tamad",
    yearAndSection: "BSCS 4",
    date: new Date(),
  },
  {
    name: "Juan Pedro",
    yearAndSection: "BSSW 2",
    date: new Date(),
  },
  {
    name: "John Lloyd Cruz",
    yearAndSection: "BSIT1",
    date: new Date(),
  },
  {
    name: "Juan Tamad",
    yearAndSection: "BSCS 4",
    date: new Date(),
  },
  {
    name: "Juan Pedro",
    yearAndSection: "BSSW 2",
    date: new Date(),
  },
  {
    name: "John Lloyd Cruz",
    yearAndSection: "BSIT1",
    date: new Date(),
  },
  {
    name: "Juan Tamad",
    yearAndSection: "BSCS 4",
    date: new Date(),
  },
  {
    name: "Juan Pedro",
    yearAndSection: "BSSW 2",
    date: new Date(),
  },
  {
    name: "John Lloyd Cruz",
    yearAndSection: "BSIT1",
    date: new Date(),
  },
  {
    name: "Juan Tamad",
    yearAndSection: "BSCS 4",
    date: new Date(),
  },
  {
    name: "Juan Pedro",
    yearAndSection: "BSSW 2",
    date: new Date(),
  },
];

const PresentStudentsTabe: React.FC = () => {
  return (
    <div className="h-full grid grid-cols-1 grid-rows-[max-content_1fr]">
      <div className="text-xl Nunito-SemiBold">List of Present Students</div>
      <div className="h-full border overflow-y-auto">
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
                    {d.yearAndSection}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(d.date).toLocaleString("en-US", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <X size={18} className="w-6 rounded-[3.5px] bg-red-500" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PresentStudentsTabe;
