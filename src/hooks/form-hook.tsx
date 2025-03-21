import { useState, ChangeEvent, FormEvent } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { toast } from "sonner";

interface UseFormOptions<T> {
  initialValues: T;
  collectionName: string;
  onSuccess: () => void;
  userEmail: string | null;
  validationRules?: {
    required?: (keyof T)[];
    unique?: {
      field: keyof T;
      errorMessage: string;
    }[];
  };
  customValidation?: (
    formData: T
  ) => { isValid: boolean; errorMessage?: string } | true;
  transformBeforeSave?: (formData: T, userId: string) => any;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  collectionName,
  onSuccess,
  userEmail,
  validationRules = {},
  customValidation,
  transformBeforeSave,
}: UseFormOptions<T>) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<T>(initialValues);
  const auth = getAuth();
  const user = auth.currentUser;

  const resetForm = () => {
    setFormData(initialValues);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof T) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name: keyof T) => (selectedDate?: Date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedDate?.toISOString() ?? prev[name],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user || !userEmail) {
      toast.error("You must be logged in to add this item!");
      setIsSubmitting(false);
      return;
    }

    // Check required fields
    if (validationRules.required) {
      for (const field of validationRules.required) {
        if (!formData[field]) {
          toast.error(`${String(field)} is required!`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Custom validation
    if (customValidation) {
      const validation = customValidation(formData);
      if (validation !== true && !validation.isValid) {
        toast.error(validation.errorMessage || "Validation failed");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const collectionRef = collection(db, collectionName);

      // Check unique fields
      if (validationRules.unique && validationRules.unique.length > 0) {
        for (const uniqueField of validationRules.unique) {
          const fieldValue = formData[uniqueField.field];

          if (!fieldValue) continue;

          const uniqueQuery = query(
            collectionRef,
            where(uniqueField.field as string, "==", fieldValue),
            where("userId", "==", user.uid)
          );
          const snapshot = await getDocs(uniqueQuery);

          if (!snapshot.empty) {
            toast.error(uniqueField.errorMessage);
            setIsSubmitting(false);
            return;
          }
        }
      }

      const dataToSave = transformBeforeSave
        ? transformBeforeSave(formData, user.uid)
        : {
            ...formData,
            userId: user.uid,
            createdAt: new Date().toISOString(),
          };

      await addDoc(collectionRef, dataToSave);

      toast.success("Added successfully!");
      onSuccess();
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleSubmit,
    isSubmitting,
    open,
    setOpen,
    resetForm,
  };
}
