import { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Papa from "papaparse";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase/firebase";
import { toast } from "sonner";

interface UploadConfig {
  title: string;
  collectionName: string;
  formatExamples: {
    csv: string;
    json: string;
  };
  requiredFields: string[];
  uniqueField?: string; // Field to check for duplicates (e.g., 'employeeId' or 'serialNo')
}

export const useUploadFile = (config: UploadConfig) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => getAuth().currentUser);
  const [existingItems, setExistingItems] = useState<any[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && config.collectionName) {
        const q = query(
          collection(db, config.collectionName),
          where("userId", "==", firebaseUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => doc.data());
        setExistingItems(items);
      }
    });

    return () => unsubscribe();
  }, [config.collectionName]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const validateData = (
    data: any[]
  ): { valid: boolean; message?: string; duplicates?: { ids: string[] } } => {
    if (!Array.isArray(data) || data.length === 0) {
      return { valid: false, message: "No data found in the file" };
    }

    // Check required fields
    const firstItem = data[0];
    const missingFields = config.requiredFields.filter(
      (field) => !Object.keys(firstItem).includes(field)
    );

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    // Check for duplicates if uniqueField is specified
    if (config.uniqueField) {
      const duplicateIds: string[] = [];
      const idCount = new Map<string, number>();

      // Check for duplicates within the file
      data.forEach((item) => {
        const fieldValue = item[config.uniqueField!];
        if (fieldValue) {
          idCount.set(fieldValue, (idCount.get(fieldValue) || 0) + 1);
        }
      });

      idCount.forEach((count, id) => {
        if (count > 1 && !duplicateIds.includes(id)) {
          duplicateIds.push(id);
        }
      });

      // Check against existing items in the database
      const existingIdSet = new Set(
        existingItems.map((item) => item[config.uniqueField!])
      );
      data.forEach((item) => {
        const fieldValue = item[config.uniqueField!];
        if (
          fieldValue &&
          existingIdSet.has(fieldValue) &&
          !duplicateIds.includes(fieldValue)
        ) {
          duplicateIds.push(fieldValue);
        }
      });

      if (duplicateIds.length > 0) {
        return {
          valid: false,
          message: `Duplicate ${config.uniqueField} found: ${duplicateIds.join(
            ", "
          )}`,
          duplicates: {
            ids: duplicateIds,
          },
        };
      }
    }

    return { valid: true };
  };

  const handleUpload = async (onSuccess: () => void) => {
    if (!file) return;
    setLoading(true);

    if (!user) {
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
          const parseResult = Papa.parse(e.target.result as string, {
            header: true,
            skipEmptyLines: true,
          });
          data = parseResult.data;
        } else {
          data = JSON.parse(e.target.result as string);
        }

        if (!Array.isArray(data)) {
          data = [data];
        }

        const validation = validateData(data);
        if (!validation.valid) {
          toast.error(validation.message || "Invalid data format");
          setLoading(false);
          return;
        }

        const targetCollection = collection(db, config.collectionName);
        const batch = [];

        for (const item of data) {
          if (config.uniqueField) {
            const existing = existingItems.some(
              (existingItem) =>
                existingItem[config.uniqueField!] === item[config.uniqueField!]
            );
            if (existing) continue;
          }

          batch.push({
            ...item,
            userId: user.uid,
            dateAdded: new Date().toISOString(),
            ...(config.collectionName === "assets" && { status: "available" }),
          });
        }

        if (batch.length === 0) {
          toast.error("No valid items to upload (all items were duplicates)");
          setLoading(false);
          return;
        }

        for (const item of batch) {
          await addDoc(targetCollection, item);
        }

        toast.success(
          `Successfully uploaded ${batch.length} ${
            config.collectionName === "employees"
              ? "employees"
              : config.collectionName === "assets"
              ? "assets"
              : "items"
          }`
        );
        setFile(null);
        onSuccess();
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please check your file and try again.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return {
    file,
    loading,
    user,
    handleFileChange,
    handleUpload,
  };
};
