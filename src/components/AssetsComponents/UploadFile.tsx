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

export function UploadFile({ onAssetsAdded }: { onAssetsAdded: () => void }) {
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

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    if (!user) {
      console.error("User is not authenticated");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target?.result) return;

      let data;
      try {
        if (file.name.endsWith(".csv")) {
          data = Papa.parse(e.target.result as string, { header: true }).data;
        } else {
          data = JSON.parse(e.target.result as string);
        }

        const assetsCollection = collection(db, "it-assets");

        for (const asset of data) {
          await addDoc(assetsCollection, {
            ...asset,
            userId: user.uid,
            uploadedAt: new Date().toISOString(),
          });
        }

        toast.success("Upload successful!");
        setOpen(false);
        onAssetsAdded();
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Upload failed. Please try again.");
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
          className="bg-primary-foreground border-0 shadow-popover-foreground rounded-lg text-primary"
          onClick={() => setOpen(true)}
        >
          Upload File <Upload />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className=" text-primary">Bulk Add Assets</DialogTitle>
        <DialogDescription>
          Only CSV and JSON files are supported.
        </DialogDescription>
        <p className="font-semibold text-primary">Format Example:</p>
        <div className="bg-card p-2 rounded-md text-sm  text-primary overflow-auto">
          <p className="font-semibold">CSV Format Example:</p>
          <pre className="whitespace-pre-wrap text-xs ">
            serialNo,assetName,assignedEmployee,email,status,type,
            customType,location,dateAdded
          </pre>
        </div>

        <div className="bg-card p-2 rounded-md text-sm mt-2  text-primary overflow-auto">
          <p className="font-semibold">JSON Format Example:</p>
          <pre className="whitespace-pre-wrap text-xs">
            "serialNo": "12345", "assetName": "Laptop", "assignedEmployee":
            "John Doe", "email": "johndoe@example.com", "status": "In Use",
            "type": "Server", "customType": "Chair", "location": "Office",
            "dateAdded": "2024-03-14"
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
            className=" text-primary"
          />
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-700" />
        </div>

        <Button onClick={handleUpload} disabled={!file || loading || !user}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
