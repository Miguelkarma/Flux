import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useUploadFile } from "@/hooks/tableHooks/use-upload-hook";

interface UploadConfig {
  title: string;
  collectionName: string;
  formatExamples: {
    csv: string;
  };
  requiredFields: string[];
  uniqueField?: string;
}

interface UploadFileProps {
  onDataAdded: () => void;
  config: UploadConfig;
  buttonLabel?: string;
}

export function UploadFile({
  onDataAdded,
  config,
  buttonLabel = "Upload File",
}: UploadFileProps) {
  const [open, setOpen] = React.useState(false);
  const { file, loading, user, handleFileChange, handleUpload } =
    useUploadFile(config);

  const onUploadSuccess = () => {
    setOpen(false);
    onDataAdded();
  };

  const getDuplicateWarning = () => {
    if (config.collectionName === "employees") {
      return "Duplicate employee IDs will not upload.";
    }
    if (config.collectionName === "assets") {
      return "Duplicate serial numbers will not upload.";
    }
    return config.uniqueField
      ? `Duplicate ${config.uniqueField} values will be skipped.`
      : null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground rounded-lg text-secondary-foreground"
          onClick={() => setOpen(true)}
        >
          <span className="max-sm:hidden">{buttonLabel}</span>
          <Upload className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-primary">{config.title}</DialogTitle>
        <DialogDescription>
          Only CSV files are supported. Files must include all required fields.
          {getDuplicateWarning() && (
            <span className="block mt-1 text-red-500">
              {getDuplicateWarning()}
            </span>
          )}
        </DialogDescription>

        <div className="text-primary text-sm mb-2">
          <span className="font-semibold">Required fields:</span>{" "}
          {config.requiredFields.join(", ")}
        </div>

        <p className="font-semibold text-primary">Format Example:</p>
        <ScrollArea className="rounded-md transition">
          <div className="bg-card p-2 rounded-md text-sm text-primary overflow-auto">
            <p className="font-semibold">CSV Format Example:</p>
            <pre className="whitespace-pre-wrap text-xs">
              {config.formatExamples.csv}
            </pre>
          </div>
          <ScrollBar orientation="horizontal" className="scrollbar" />
        </ScrollArea>

        {!user && (
          <p className="text-red-500">Please log in to upload files.</p>
        )}

        <div className="relative">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={!user}
            className="text-primary"
            aria-label="file"
          />
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-700" />
        </div>

        <Button
          onClick={() => handleUpload(onUploadSuccess)}
          disabled={!file || loading || !user}
          className="w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
