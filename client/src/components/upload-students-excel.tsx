import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { coleAPI } from "@/lib/utils";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Upload } from "lucide-react";

type Department = {
  departmentId: number;
  departmentName: string;
  acronym?: string;
};

interface ParsedRow {
  Name?: string;
  Department?: string;
  Year?: string | number;
}

const UploadStudentsExcel: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = (): void => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const dismiss = toast.loading("Processing Excel...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = wb.SheetNames[0];
      const ws = wb.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<ParsedRow>(ws, { defval: "" });

      if (!rows.length) {
        toast.error("The uploaded sheet is empty.");
        return;
      }

      // fetch departments for mapping
      const departments: Department[] = await coleAPI("/departments")({});

      // check if valid department
      const byAcronym = new Map<string, Department>();
      const byName = new Map<string, Department>();
      for (const d of departments) {
        if (d.acronym) byAcronym.set(d.acronym.toLowerCase(), d);
        byName.set(d.departmentName.toLowerCase(), d);
      }

      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      // Validate headers presence (Name, Department, Year)
      const sample = rows[0];
      const hasHeaders =
        Object.prototype.hasOwnProperty.call(sample, "Name") &&
        Object.prototype.hasOwnProperty.call(sample, "Department") &&
        Object.prototype.hasOwnProperty.call(sample, "Year");
      if (!hasHeaders) {
        toast.error(
          'Invalid template. Expected headers: "Name", "Department", "Year".'
        );
        return;
      }

      // Process sequentially to avoid overwhelming API
      for (const [index, row] of rows.entries()) {
        const name = String(row.Name || "").trim();
        const deptText = String(row.Department || "").trim();
        const yearVal = row.Year as number | string;

        if (!name || !deptText || (!yearVal && yearVal !== 0)) {
          failed++;
          errors.push(`Row ${index + 2}: Missing required fields.`);
          continue;
        }

        const year = Number(yearVal);
        if (!Number.isFinite(year) || year < 1) {
          failed++;
          errors.push(`Row ${index + 2}: Invalid year "${yearVal}".`);
          continue;
        }

        // Map department
        const deptLower = deptText.toLowerCase();
        const deptMatch = byAcronym.get(deptLower) || byName.get(deptLower);
        if (!deptMatch) {
          failed++;
          errors.push(
            `Row ${
              index + 2
            }: Unknown department "${deptText}" (match by acronym or name).`
          );
          continue;
        }

        try {
          await coleAPI(
            "/students/add",
            "POST"
          )({
            studentId: null,
            name,
            departmentId: deptMatch.departmentId,
            year,
          });
          success++;
        } catch (err: unknown) {
          failed++;
          const message = err instanceof Error ? err.message : String(err);
          errors.push(`Row ${index + 2}: ${message}`);
        }
      }

      if (success) {
        toast.success(`Imported ${success} student(s).`);
      }
      if (failed) {
        toast.error(`Failed ${failed} row(s). Check template or data.`);
        if (errors.length) {
          console.warn("Import errors:", errors.join("\n"));
        }
      }

      onDone?.();
    } catch (error) {
      toast.error("Failed to process Excel file.");
      console.error(error);
    } finally {
      setUploading(false);
      toast.dismiss(dismiss);

      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        onClick={openPicker}
        variant="secondary"
        size="sm"
        disabled={uploading}
      >
        <Upload className="w-4 h-4 mr-1" />
        Upload Excel
      </Button>
    </div>
  );
};

export default UploadStudentsExcel;
