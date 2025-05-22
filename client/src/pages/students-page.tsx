import type { Student } from "@/types/students.types";
import DataTable from "@/components/ui/data-table";
import { studentColumns } from "@/columns/student.columns";
import AddStudent from "@/components/add-student";

const data: Student[] = [
  {
    userId: 1,
    studentId: 121233,
    name: "John Doe",
    departmentName: "Bachelor of Science in Information Technology",
    departmentAcronym: "BSIT",
    year: 2,
  },
  {
    userId: 2,
    studentId: 121234,
    name: "Jane Smith",
    departmentName: "Bachelor of Science in Computer Science",
    departmentAcronym: "BSCS",
    year: 3,
  },
  {
    userId: 3,
    studentId: 121235,
    name: "Alice Johnson",
    departmentName: "Bachelor of Science in Information Systems",
    departmentAcronym: "BSIS",
    year: 4,
  },
  {
    userId: 4,
    studentId: 121236,
    name: "Bob Brown",
    departmentName: "Bachelor of Science in Computer Engineering",
    departmentAcronym: "BSCpE",
    year: 1,
  },
  {
    userId: 5,
    studentId: 121237,
    name: "Charlie Davis",
    departmentName:
      "Bachelor of Science in Electronics and Communications Engineering",
    departmentAcronym: "BSECE",
    year: 2,
  },
];

export default function StudentsPage() {
  return (
    <div className="p-8 pt-4">
      <div className="flex justify-between">
        <h1 className="text-2xl Nunito-SemiBold">List of Students</h1>
        <AddStudent />
      </div>
      <DataTable data={data} columns={studentColumns} />
    </div>
  );
}
