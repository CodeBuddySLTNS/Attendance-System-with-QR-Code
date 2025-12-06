import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import config from "../../system.config.json";
import { Button } from "@/components/ui/button";

const origin = config.isProduction
  ? config.prodServer
  : new URL(config.devServer).origin;

export default function TemplateDownloader() {
  const handleDownload = async () => {
    try {
      const data = await fetch(origin + "/templates/BSCS-1.xlsx");

      const blob = await data.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "BSCS-1.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded successfully.");
    } catch (error) {
      if (error) toast.error("Unable to download template.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:text-green-700 hover:outline-green-600"
        >
          <Download size={18} />
          <span>Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Students Excel Template
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="text-center space-y-4">
          <div className="border-dashed border border-gray-300 rounded p-2 space-y-1">
            <code className="block">
              The default template file name is:{" "}
              <span className="bg-gray-200 p-1 rounded">BSCS-1</span>
            </code>

            <code>
              Please rename the file{" "}
              <span className="bg-gray-200 p-1 rounded">(e.g. "BSIT-3")</span>{" "}
              if you&apos;re adding a different group of students.
            </code>
          </div>

          <Button
            className="bg-green-700 hover:bg-green-600"
            onClick={handleDownload}
          >
            <Download size={20} />
            <span>Download Template</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
