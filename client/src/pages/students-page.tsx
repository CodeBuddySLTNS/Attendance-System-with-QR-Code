import type { Student } from "@/types/students.types";
import DataTable from "@/components/data-table";
import { studentColumns } from "@/columns/student.columns";
import AddStudent, { type Department } from "@/components/add-student";
import { coleAPI } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import GenerateQrCode from "@/components/generate-qrcode";
import { useEffect, useState } from "react";
import EditStudent from "@/components/edit-student";
import DeleteStudent from "@/components/delete-student";
import BgImageLayer from "@/components/bg-image-layer";
import UploadStudentsExcel from "@/components/upload-students-excel";
import TemplateDownloader from "./template-downloader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OpenState {
  qrCode: { status: boolean; student: Student };
  edit: { status: boolean; student: Student };
  delete: { status: boolean; student: Student };
}

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({ departmentId: 0, year: 0 });
  const [open, setOpen] = useState<OpenState>({
    qrCode: { status: false, student: {} as Student },
    edit: { status: false, student: {} as Student },
    delete: { status: false, student: {} as Student },
  });

  const { data, refetch } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: coleAPI(
      `/students?departmentId=${filter.departmentId}&year=${filter.year}`
    ),
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI("/departments"),
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

  useEffect(() => {
    if (filter) queryClient.invalidateQueries({ queryKey: ["students"] });
  }, [filter, queryClient]);

  return (
    <div className="p-10 pt-8">
      <BgImageLayer />
      <div className="w-full h-full relative z-[1]">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">List of Students</h1>

          <div className="flex gap-2 justify-center">
            <div className="flex gap-1 items-center">
              <p>Department:</p>
              <Select
                defaultValue="all"
                onValueChange={(value) =>
                  setFilter((prev) => ({
                    ...prev,
                    departmentId: value === "all" ? 0 : parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {departments?.map((department) => (
                    <SelectItem
                      key={department.departmentId}
                      value={department.departmentId.toString()}
                    >
                      {department.acronym}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1 items-center">
              <p>Year:</p>
              <Select
                defaultValue="all"
                onValueChange={(value) =>
                  setFilter((prev) => ({
                    ...prev,
                    year: value === "all" ? 0 : parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TemplateDownloader />
            <UploadStudentsExcel onDone={() => refetch()} />
            <AddStudent />
          </div>
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
