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
import { db } from "@/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import Papa from "papaparse";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { FileText, Upload } from "lucide-react";

interface UploadConfig {
  title: string;
  collectionName: string;
  formatExamples: {
    csv: string;
    json: string;
  };
  // Add required fields for validation
  requiredFields: string[];
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
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState(() => getAuth().currentUser);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Validate data has required fields for the collection
  const validateData = (
    data: any[]
  ): { valid: boolean; missingFields?: string[] } => {
    if (!Array.isArray(data) || data.length === 0) {
      return { valid: false };
    }

    // Check first item for required fields
    const firstItem = data[0];
    const missingFields = config.requiredFields.filter(
      (field) => !Object.keys(firstItem).includes(field)
    );

    return {
      valid: missingFields.length === 0,
      missingFields: missingFields.length > 0 ? missingFields : undefined,
    };
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    if (!user) {
      console.error("User is not authenticated");
      toast.error("You must be logged in to upload files");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target?.result) return;

      let data;
      try {
        if (file.name.endsWith(".csv")) {
          // Use Papa.parse for CSV files
          const parseResult = Papa.parse(e.target.result as string, {
            header: true,
          });
          data = parseResult.data;
        } else {
          // Parse JSON files
          data = JSON.parse(e.target.result as string);
        }

        // Check if data is an array
        if (!Array.isArray(data)) {
          data = [data];
        }

        // Validate data has required fields for this collection
        const validation = validateData(data);
        if (!validation.valid) {
          let errorMessage = "Invalid data format for this import type.";
          if (validation.missingFields && validation.missingFields.length > 0) {
            errorMessage += ` Missing required fields: ${validation.missingFields.join(
              ", "
            )}`;
          }
          toast.error(errorMessage);
          setLoading(false);
          return;
        }

        const targetCollection = collection(db, config.collectionName);

        const processedItems = data.map((item) => {
          // Create a new object without the assignedEmployee field
          const { assignedEmployee, ...rest } = item;
          return rest;
        });

        for (const item of processedItems) {
          await addDoc(targetCollection, {
            ...item,
            userId: user.uid,
            dateAdded: new Date().toISOString(),
            assignedEmployee: "",
          });
        }

        let successMessage = "";
        if (config.collectionName === "employees") {
          successMessage = `${processedItems.length} employees uploaded successfully!`;
        } else if (config.collectionName === "it-assets") {
          successMessage = `${processedItems.length} IT assets uploaded successfully!`;
        } else {
          successMessage = `${processedItems.length} items uploaded successfully!`;
        }

        toast.success(successMessage);
        setOpen(false);
        setFile(null);
        onDataAdded();
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(
          "Upload failed. Please check your file format and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
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

      <DialogContent>
        <DialogTitle className="text-primary">{config.title}</DialogTitle>
        <DialogDescription>
          Only CSV and JSON files are supported. Assigned employee data will be
          excluded from uploads. Files must include all required fields for{" "}
          {config.collectionName === "employees" ? "employees" : "IT assets"}.
        </DialogDescription>
        <div className="text-primary text-sm mb-2">
          <span className="font-semibold">Required fields:</span>{" "}
          {config.requiredFields.join(", ")}
        </div>
        <p className="font-semibold text-primary">Format Example:</p>
        <div className="bg-card p-2 rounded-md text-sm text-primary overflow-auto">
          <p className="font-semibold">CSV Format Example:</p>
          <pre className="whitespace-pre-wrap text-xs">
            {config.formatExamples.csv}
          </pre>
        </div>

        <div className="bg-card p-2 rounded-md text-sm mt-2 text-primary overflow-auto">
          <p className="font-semibold">JSON Format Example:</p>
          <pre className="whitespace-pre-wrap text-xs">
            {config.formatExamples.json}
          </pre>
        </div>

        {!user && (
          <p className="text-red-500">Please log in to upload files.</p>
        )}

        <div className="relative">
          <Input
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            disabled={!user}
            className="text-primary"
            aria-label="file"
          />
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-700" />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || loading || !user}
          className="w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
