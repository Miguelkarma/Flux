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
  };
  requiredFields: string[];
  uniqueField?: string;
}

export const useUploadFile = (config: UploadConfig) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => getAuth().currentUser);
  const [, setExistingItems] = useState<any[]>([]);

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
      const selectedFile = event.target.files[0];
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        toast.error("Only CSV files are supported");
        setFile(null);
      }
    }
  };

  const checkExistingIds = async (
    idsToCheck: string[]
  ): Promise<Set<string>> => {
    if (!config.uniqueField || !user || idsToCheck.length === 0) {
      return new Set();
    }

    const existingIds = new Set<string>();
    const chunkSize = 10; // Firestore 'in' query limit

    try {
      // Process in chunks of 10
      for (let i = 0; i < idsToCheck.length; i += chunkSize) {
        const chunk = idsToCheck.slice(i, i + chunkSize);
        const q = query(
          collection(db, config.collectionName),
          where("userId", "==", user.uid),
          where(config.uniqueField, "in", chunk)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          existingIds.add(doc.data()[config.uniqueField!]);
        });
      }
    } catch (error) {
      console.error("Error checking existing IDs:", error);
      toast.error("Error checking for existing records");
    }

    return existingIds;
  };

  const validateData = async (
    data: any[]
  ): Promise<{
    valid: boolean;
    message?: string;
    duplicates?: { ids: string[] };
  }> => {
    if (!Array.isArray(data) || data.length === 0) {
      return { valid: false, message: "No data found in the file" };
    }

    // Normalize data by trimming strings
    const normalizedData = data.map((item) => {
      const normalized: any = {};
      for (const key in item) {
        normalized[key] =
          typeof item[key] === "string" ? item[key].trim() : item[key];
      }
      return normalized;
    });

    // Check required fields
    const firstItem = normalizedData[0];
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
      const duplicateInfo = {
        inFile: new Set<string>(),
        inDatabase: new Set<string>(),
      };

      // Check for duplicates within the file
      const fileIds = new Set<string>();
      const uniqueFieldValues: string[] = [];

      for (const item of normalizedData) {
        const fieldValue = item[config.uniqueField];
        if (!fieldValue) continue;

        uniqueFieldValues.push(fieldValue);

        if (fileIds.has(fieldValue)) {
          duplicateInfo.inFile.add(fieldValue);
        } else {
          fileIds.add(fieldValue);
        }
      }

      // Check against existing items in the database
      const existingIds = await checkExistingIds(uniqueFieldValues);
      existingIds.forEach((id) => duplicateInfo.inDatabase.add(id));

      // Prepare error message if duplicates found
      const allDuplicates = [
        ...duplicateInfo.inFile,
        ...duplicateInfo.inDatabase,
      ];

      if (allDuplicates.length > 0) {
        return {
          valid: false,
          message: `Found ${allDuplicates.length} duplicate ${
            config.uniqueField
          }(s).  ${allDuplicates.slice(0, 5).join(", ")}${
            allDuplicates.length > 5 ? "..." : ""
          }`,
          duplicates: {
            ids: allDuplicates,
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

      try {
        const parseResult = Papa.parse(e.target.result as string, {
          header: true,
          skipEmptyLines: true,
        });
        const data = parseResult.data as any[];

        const validation = await validateData(data);
        if (!validation.valid) {
          toast.error(validation.message || "Invalid data format");
          setLoading(false);
          return;
        }

        const targetCollection = collection(db, config.collectionName);
        const batch = [];

        // Get fresh list of existing IDs right before upload
        const idsToUpload = data
          .map((item) => item[config.uniqueField!])
          .filter(Boolean);
        const existingIds = await checkExistingIds(idsToUpload);

        for (const item of data) {
          const uniqueFieldValue = config.uniqueField
            ? item[config.uniqueField]
            : null;

          // Skip if this is a duplicate
          if (uniqueFieldValue && existingIds.has(uniqueFieldValue)) {
            continue;
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

        // Upload in batches of 500 (Firestore limit)
        const BATCH_SIZE = 500;
        for (let i = 0; i < batch.length; i += BATCH_SIZE) {
          const batchChunk = batch.slice(i, i + BATCH_SIZE);
          await Promise.all(
            batchChunk.map((item) => addDoc(targetCollection, item))
          );
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
        toast.error(
          `Upload failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
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
