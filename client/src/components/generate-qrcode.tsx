import { useRef, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import QRCode from "react-qr-code";
import type { Student } from "@/types/students.types";
import { Button } from "./ui/button";
import { toPng } from "html-to-image";

const GenerateQrCode: FC<{
  isOpen: boolean;
  close: () => void;
  student: Student;
}> = ({ isOpen, close, student }) => {
  const QrCodeRef = useRef<HTMLDivElement>(null);
  const studentData = JSON.stringify({
    userId: student.userId,
    name: student.name,
    courseAndYear: `${student.departmentAcronym} ${student.year}`,
  });

  const handleDownload = async (): Promise<void> => {
    if (!QrCodeRef.current) return;
    try {
      const pngDataUrl = await toPng(QrCodeRef.current);
      const link = document.createElement("a");
      link.download = `${student.name}.png`;
      link.href = pngDataUrl;
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="gap-4">
          <DialogHeader>
            <DialogTitle className="text-center">QR Code Generator</DialogTitle>
            <DialogDescription className="text-center">
              Download your QR code or take a picture.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center items-center gap-4">
            <div ref={QrCodeRef} className="flex flex-col gap-2 p-2 bg-white">
              <QRCode value={studentData} size={200} />
              <h2 className="Nunito-Bold text-2xl text-center">
                {student.name}
              </h2>
            </div>
            <Button className="px-8" onClick={handleDownload}>
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateQrCode;
