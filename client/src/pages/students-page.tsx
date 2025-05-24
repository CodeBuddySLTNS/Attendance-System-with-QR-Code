import type { Student } from "@/types/students.types";
import DataTable from "@/components/data-table";
import { studentColumns } from "@/columns/student.columns";
import AddStudent from "@/components/add-student";
import { coleAPI } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import GenerateQrCode from "@/components/generate-qrcode";
import { useState } from "react";
import EditStudent from "@/components/edit-student";
import DeleteStudent from "@/components/delete-student";
import BgImageLayer from "@/components/bg-image-layer";

interface OpenState {
  qrCode: { status: boolean; student: Student };
  edit: { status: boolean; student: Student };
  delete: { status: boolean; student: Student };
}

export default function StudentsPage() {
  const [open, setOpen] = useState<OpenState>({
    qrCode: { status: false, student: {} as Student },
    edit: { status: false, student: {} as Student },
    delete: { status: false, student: {} as Student },
  });

  const { data } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: coleAPI("/students"),
  });

  const generateQrCode = (student: Student) => {
    setOpen((prev) => ({ ...prev, qrCode: { status: true, student } }));
  };

  const editStudent = (student: Student) => {
    setOpen((prev) => ({ ...prev, edit: { status: true, student } }));
  };

  const deleteStudent = (student: Student) => {
    setOpen((prev) => ({ ...prev, delete: { status: true, student } }));
  };

  return (
    <div className="p-10 pt-8">
      <BgImageLayer />
      <div className="w-full h-full relative z-[1]">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">List of Students</h1>
          <AddStudent />
        </div>

        <DataTable<Student>
          data={data || []}
          columns={studentColumns(generateQrCode, editStudent, deleteStudent)}
        />

        <GenerateQrCode
          isOpen={open.qrCode.status}
          student={open.qrCode.student}
          close={() =>
            setOpen((prev) => ({
              ...prev,
              qrCode: { status: false, student: {} as Student },
            }))
          }
        />

        <EditStudent
          isOpen={open.edit.status}
          student={open.edit.student}
          close={() =>
            setOpen((prev) => ({
              ...prev,
              edit: { status: false, student: {} as Student },
            }))
          }
        />

        <DeleteStudent
          isOpen={open.delete.status}
          student={open.delete.student}
          close={() =>
            setOpen((prev) => ({
              ...prev,
              delete: { status: false, student: {} as Student },
            }))
          }
        />
      </div>
    </div>
  );
}
